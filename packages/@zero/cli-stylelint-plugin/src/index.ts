import StylelintPlugin from "stylelint-webpack-plugin";
import { join } from "path";

import {
  ConfigPluginInstance,
  ConfigPluginApplyCallbackArgs,
} from "@zero-cli/cli-types-shared/dist/cli-service/definitions";

export default class Stylelint implements ConfigPluginInstance {
  apply(args: ConfigPluginApplyCallbackArgs) {
    const { api } = args;

    api.chainWebpack("client", (webpackConfig) => {
      webpackConfig.plugin("style-lint-plugin").use(StylelintPlugin, [
        {
          files: ["**/*.css", "**/*.less"],
          emitErrors: true,
          context: api.resolve("src"),
          configFile: join(api.getContext(), ".stylelintrc"),
        },
      ]);
    });
  }
}
