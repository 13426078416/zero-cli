/* eslint-disable @typescript-eslint/no-explicit-any */
import Config = require("webpack-chain");
import { highlight } from "cli-highlight";
import chalk from "chalk";
import webpack from "webpack";

import {
  InspectCliArgs,
  WebpackConfiguration,
  CommandPluginInstance,
  CommandPluginApplyCallbackArgs,
  WebpackConfigName,
} from "../definitions";

type InspectResult = WebpackConfiguration | webpack.Plugin | webpack.RuleSetRule | string[];

const accessWebpackConfigName: Array<WebpackConfigName> = ["client", "server"];

export default class Inspect implements CommandPluginInstance<InspectCliArgs> {
  apply(params: CommandPluginApplyCallbackArgs<InspectCliArgs>) {
    const { api, args } = params;

    api.registerCommand(
      "inspect",
      {
        description: "inspect internal webpack config",
        usage: "zero-cli-service inspect [options] [...paths]",
        options: {
          "--mode": "specify env mode (default: development)",
          "--name": "specify webpack config side name (default: client)",
          "--config": "specify config file",
          "--rule <ruleName>": "inspect a specific module rule",
          "--plugin <pluginName>": "inspect a specific plugin",
          "--rules": "list all module rule names",
          "--plugins": "list all plugin names",
          "--verbose": "show full function definitions in output",
        },
      },
      () => {
        let name: WebpackConfigName = "client";
        if (args.name && accessWebpackConfigName.includes(args.name)) {
          name = args.name;
        }

        const webpackConfig = api.resolveWebpackConfig(name);

        if (!webpackConfig) {
          throw new Error(`${name} side webpack config unable resolved; command [inspect]`);
        }

        // paths is webpack config key, eg. entry, plugins and module
        const { _: paths } = args;

        let res: InspectResult = webpackConfig;

        let hasUnnamedRule: boolean = false;

        if (args.rule) {
          res = webpackConfig.module
            ? webpackConfig.module.rules.find((r) => (r as any).__ruleNames[0] === args.rule) || {}
            : {};
        }

        if (args.plugin) {
          res = webpackConfig.plugins
            ? webpackConfig.plugins.find(
                (p) => ((p as any).__pluginName || p.constructor.name) === args.plugin,
              ) || {}
            : {};
        }

        if (args.rules) {
          // string[]
          res = webpackConfig.module
            ? webpackConfig.module.rules.map((r) => {
                const name = (r as any).__ruleNames
                  ? (r as any).__ruleNames[0]
                  : "Nameless Rule (*)";

                hasUnnamedRule = hasUnnamedRule || !(r as any).__ruleNames;

                return name;
              })
            : [];
        }

        if (args.plugins) {
          // string[]
          res = webpackConfig.plugins
            ? webpackConfig.plugins.map((p) => (p as any).__pluginName || p.constructor.name)
            : [];
        }

        if (paths.length > 1) {
          res = {};
          paths.forEach((path: string) => {
            res[path] = webpackConfig[path];
          });
        }

        if (paths.length === 1) {
          res = webpackConfig[paths[0]];
        }

        // class `Config` override `Function.toString`
        // see https://github.com/neutrinojs/webpack-chain/blob/master/src/Config.js#L47
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const output = Config.toString(res, { verbose: args.verbose });
        console.log(highlight(output, { language: "js" }));

        // Log explanation for Nameless Rules
        if (hasUnnamedRule) {
          console.log(`--- ${chalk.green("Footnotes")} ---`);
          console.log(`*: ${chalk.green("Nameless Rules")} were added through the ${chalk.green(
            "configureWebpack()",
          )} API (possibly by a plugin) instead of ${chalk.green("chainWebpack()")} (recommended).
      You can run ${chalk.green(
        "zero-cli-service inspect",
      )} without any arguments to inspect the full config and read these rules' config.`);
        }
      },
    );
  }
}
