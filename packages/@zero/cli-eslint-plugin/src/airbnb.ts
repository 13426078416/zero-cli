import { GeneratorAPI } from "@zero-cli/cli-types-shared/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@zero-cli/cli-types-shared/dist/shared";

import { SimpleMapPolyfill } from "@zero-cli/cli-utils-shared";

export function eslintConfigAirbnb(api: GeneratorAPI, options: Required<RootOptions>): void {
  const sourceDir = options.type === "lib" ? "components" : "src";

  const eslintParser = "@typescript-eslint/parser";

  const lintFileSuffix = "{ts,tsx}";

  const parserOptions = new SimpleMapPolyfill<
    string,
    string | number | Record<string, unknown> | Array<string | Record<string, unknown>>
  >([
    ["ecmaVersion", 2018],
    ["sourceType", "module"],
    [
      "ecmaFeatures",
      {
        jsx: true,
      },
    ],
  ]);

  const eslintRules = new SimpleMapPolyfill<
    string,
    string | Array<string | Record<string, unknown>>
  >([
    ["quotes", ["error", "double"]],
    ["semi", ["error", "always"]],
    ["react/display-name", ["warn"]],
    ["react/prop-types", ["error"]],
    ["space-before-function-paren", ["error", "never"]],
    ["comma-dangle", ["error", "always-multiline"]],
    ["max-len", ["error", { code: 100, ignoreUrls: true, ignoreComments: true }]],
    ["arrow-body-style", "off"],
    ["object-curly-newline", "off"],
    ["indent", "off"],
    ["camelcase", "off"],
    ["operator-linebreak", "off"],
    ["import/prefer-default-export", "off"],
    ["import/no-unresolved", "off"],
    ["import/no-cycle", "off"],
    ["jsx-a11y/no-noninteractive-element-interactions", "off"],
    ["jsx-a11y/click-events-have-key-events", "off"],
  ]);

  const eslintEnv = new SimpleMapPolyfill<string, boolean>([
    ["browser", true],
    ["es2017", true],
  ]);

  const eslintSettings = new SimpleMapPolyfill<
    string,
    string | Array<string | Record<string, unknown>>
  >([
    [
      "react",
      [
        {
          createClass: "createReactClass",
          pragma: "React",
          version: "detect",
          flowVersion: "0.53",
        },
      ],
    ],
    ["propWrapperFunctions", ["forbidExtraProps", { property: "freeze", object: "Object" }]],
    ["linkComponents", ["Hyperlink", { name: "Link", linkAttribute: "to" }]],
  ]);

  const eslintExtends = ["airbnb"];

  api.extendPackage({
    devDependencies: {
      eslint: "^7.24.0",
      "eslint-webpack-plugin": "^2.5.4",
      "eslint-config-prettier": "^8.2.0",
      "eslint-plugin-react": "^7.23.2",
      "eslint-plugin-react-hooks": "^4.2.0",
      "eslint-plugin-import": "^2.22.1",
      "eslint-config-airbnb": "^18.2.1",
      "eslint-plugin-jsx-a11y": "^6.4.1",
      "@typescript-eslint/parser": "^4.22.0",
      "@typescript-eslint/eslint-plugin": "^4.22.0",
    },
  });

  api.extendPackage({
    scripts: {
      eslint: `eslint --config .eslintrc --ext .tsx,.ts ${sourceDir}/`,
      "eslint:fix": `eslint --fix --config .eslintrc --ext .tsx,.ts ${sourceDir}/`,
      "format:ts": `prettier --write '${sourceDir}/**/*.{ts,tsx}'`,
      "format:check:ts": `prettier --check '${sourceDir}/**/*.{ts,tsx}'`,
    },
  });

  eslintExtends.push(
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:import/typescript",
    "prettier",
  );

  parserOptions.set("project", ["./tsconfig.json"]);

  eslintSettings.set("import/extensions", [".ts", ".tsx"]);

  eslintRules.set("react/prop-types", "off");
  eslintRules.set("@typescript-eslint/explicit-function-return-type", "off");
  eslintRules.set("@typescript-eslint/no-explicit-unknown", "warn");
  eslintRules.set("@typescript-eslint/camelcase", "off");
  eslintRules.set("react/state-in-constructor", "warn");
  eslintRules.set("react/jsx-filename-extension", ["error", { extensions: [".ts", ".tsx"] }]);
  eslintRules.set("import/extensions", "off");

  if (options.unitTest) {
    eslintEnv.set("jest", true);
    eslintRules.set("import/no-extraneous-dependencies", [
      "error",
      { devDependencies: [`**/*.test.${lintFileSuffix}`, `**/*.spec.${lintFileSuffix}`] },
    ]);
  }

  api.render("./template/other", {
    eslintExtends: JSON.stringify(eslintExtends),
    parserOptions: JSON.stringify(parserOptions.toPlainObject()),
    eslintParser: JSON.stringify(eslintParser),
    eslintRules: JSON.stringify(eslintRules.toPlainObject()),
    settings: JSON.stringify(eslintSettings.toPlainObject()),
    eslintEnv: JSON.stringify(eslintEnv.toPlainObject()),
  });
}
