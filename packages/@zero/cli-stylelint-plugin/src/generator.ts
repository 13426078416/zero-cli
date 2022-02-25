import { GeneratorAPI } from "@zero-cli/cli-types-shared/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@zero-cli/cli-types-shared/dist/shared";

import { SimpleMapPolyfill } from "@zero-cli/cli-utils-shared";

export default function(api: GeneratorAPI, options: Required<RootOptions>): void {
  const sourceDir = options.type === "lib" ? "components" : "src";

  const processors: (string | (string | Record<string, unknown>)[])[] = [];
  const extendsConfig: (string | (string | Record<string, unknown>)[])[] = [
    "stylelint-config-standard",
    "stylelint-config-prettier",
  ];
  const stylelintRules = new SimpleMapPolyfill<
    string,
    string | Array<string | Record<string, unknown> | boolean | null>
  >([
    ["comment-empty-line-before", ["always"]],

    [
      "rule-empty-line-before",
      [
        "always",
        {
          ignore: ["after-comment", "first-nested"],
        },
      ],
    ],
    ["font-family-no-missing-generic-family-keyword", [null]],
    ["no-descending-specificity", [null]],
  ]);

  const lintScript = `stylelint ${sourceDir}/**/*.{css,less}`;

  stylelintRules.set("selector-pseudo-class-no-unknown", [
    true,
    {
      ignorePseudoClasses: ["export", "import", "global", "local", "external"],
    },
  ]);

  api.extendPackage({
    scripts: {
      "format:style": `prettier --write '${sourceDir}/**/*.{css,less}'`,
      "format:check:style": `prettier --check '${sourceDir}/**/*.{css,less}'`,
    },
  });

  const lintStyleFileSuffix = `${sourceDir}/**/*.{css,less}`;

  api.extendPackage({
    devDependencies: {
      stylelint: "^13.5.0",
      "stylelint-config-standard": "^20.0.0",
      "stylelint-config-prettier": "^8.0.1",
    },
    scripts: {
      stylelint: lintScript,
    },
  });

  if (api.isGitRepository()) {
    api.extendPackage({
      "lint-staged": {
        [lintStyleFileSuffix]: ["npm run stylelint", "npm run format:check:style"],
      },
    });
  }

  api.render("./template", {
    processors: JSON.stringify(processors),
    extendsConfig: JSON.stringify(extendsConfig),
    rules: JSON.stringify(stylelintRules.toPlainObject()),
  });
}
