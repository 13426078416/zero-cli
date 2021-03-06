import { QuestionMap } from "inquirer";
import {
  RootOptions as rootOptions,
  RawPlugin as rawPlugin,
  Preset as preset,
  ESLinterConfig as esLinterConfig,
  BasePkgFields as basePkgFields,
} from "@zero-cli/cli-types-shared/dist/shared";

import { GeneratorAPI } from "./lib/generator/generatorAPI";

export type CliOptions = Partial<{
  /**
   * @description specified npm registry when installing dependencies (only for npm)
   */
  registry: string;

  /**
   * @description Skip git initialization, invalid when specified `git` option
   */
  skipGit: boolean;

  /**
   * @description Force git initialization with initial commit message
   */
  git: string;

  /**
   * @description value will be TRUE when specified init git commit message
   */
  forceGit: boolean;

  /**
   * @description if specified project name are same as dir name on disk, it will override target dir when this option be TRUE
   */
  force: boolean;

  /**
   * @description will install local plugins while create project for test or debug
   */
  localPlugin: boolean;

  /**
   * @description Manual select features while create project
   */
  manual?: boolean;
}>;

export type SUPPORTED_PACKAGE_MANAGER = "npm";

export type PACKAGE_MANAGER_CONFIG = {
  [K in SUPPORTED_PACKAGE_MANAGER]: {
    install: string[];
    add: string[];
    remove: string[];
    upgrade: string[];
  };
};

export type CONFIG_FILE_TYPE = "js" | "json" | "yaml" | "lines";

export type ESLinterConfig = esLinterConfig;

export type RootOptions = rootOptions;

export type RawPlugin = rawPlugin;

export type Preset = preset;

type ALL_PLUGINS = RawPlugin;

export type PLUGIN_ID = keyof ALL_PLUGINS;

export interface ApplyFn {
  (api: GeneratorAPI, rootOptions: RootOptions): void;
}

export type ResolvedPlugin = {
  id: PLUGIN_ID;
  apply: ApplyFn;
  options: ALL_PLUGINS[PLUGIN_ID] & Record<string, unknown>;
};

// TYPE REVIEW
export type FinalAnswers = {
  eslint: ESLinterConfig;
  stylelint: boolean;
  router: boolean;
  store: boolean;
  unitTest: boolean;
  fetch: boolean;
  commit: boolean;
};

export type CreateLibFinalAnswers = {
  commit: boolean;
  eslint: ESLinterConfig;
  stylelint: boolean;
};

export type PromptCompleteCallback<T> = (answer: T, options: Preset) => void;

export type InquirerQuestionType = keyof QuestionMap;

export type BasePkgFields = basePkgFields;
