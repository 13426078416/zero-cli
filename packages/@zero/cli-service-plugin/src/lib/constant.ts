import { BasePkgFields, builtinServiceCommandName, RootOptions } from "../definitions";

export const defaultPackageFields: BasePkgFields = {
  name: "",
  version: "",
};

export const builtInCommandPluginsRelativePath = "../commands/*";

export const builtInConfigPluginsRelativePath = "../config/*";

export const builtinServiceCommandNameList = new Set<builtinServiceCommandName>([
  "build",
  "inspect",
  "serve",
  "help",
]);

export const defaultRootOptions: Required<RootOptions> = {
  projectName: "",
  eslint: "standard",
  stylelint: true,
  unitTest: true,
  fetch: true,
  commit: true,
  type: "web",
  plugins: {
    "@zero-cli/cli-service-plugin": {
      projectName: "",
    },
    "@zero-cli/cli-babel-plugin": {},
    "@zero-cli/cli-eslint-plugin": {},
    "@zero-cli/cli-stylelint-plugin": {},
    "@zero-cli/cli-unit-test-plugin": {},
    "@zero-cli/cli-commit-plugin": {},
  },
};
