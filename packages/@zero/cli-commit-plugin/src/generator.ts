import { GeneratorAPI } from "@zero-cli/cli-types-shared/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@zero-cli/cli-types-shared/dist/shared";

export default function(api: GeneratorAPI, options: RootOptions): void {
  api.extendPackage({
    devDependencies: {
      "@commitlint/cli": "^8.3.5",
      "@commitlint/config-conventional": "^8.3.4",
      commitizen: "^4.1.2",
      "cz-conventional-changelog": "^3.2.0",
    },
    config: {
      commitizen: {
        path: "cz-conventional-changelog",
      },
    },
  });

  if (options.type === "lib") {
    api.extendPackage({
      scripts: {
        commit: "lint-staged && git-cz",
      },
      husky: {
        hooks: {
          "pre-commit": "lint-staged",
          "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
        },
      },
    });
  } else {
    api.extendPackage({
      husky: {
        hooks: {
          "pre-commit": "lint-staged",
          "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
          "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true",
        },
      },
    });
  }

  api.render("./template");
}
