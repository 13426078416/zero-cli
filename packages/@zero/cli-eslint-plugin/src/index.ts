import {
  ConfigPluginApplyCallbackArgs,
  ConfigPluginInstance,
} from "@zero-cli/cli-types-shared/dist/cli-service/definitions";
import EslintWebpackPlugin from "eslint-webpack-plugin";


export default class Eslint implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;
    api.chainAllWebpack((config) => {
      config
        .plugin("eslint")
        .use(EslintWebpackPlugin, [
          {
            context: api.getContext(),
            extensions: ["ts", "tsx"],
            exclude: "node_modules",
          },
        ])
        .end();
    });
  }
}
