import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import validateProjectName from "validate-npm-package-name";
import { clearConsole, Spinner } from "@zero-cli/cli-utils-shared";
import updateNotifier from "update-notifier";
import boxen from "boxen";
import pupa from "pupa";

import { CliOptions } from "../definitions";

import { Creator } from "./webAppCreator";
import { PromptModuleAPI } from "./webAppCreator/promptModuleAPI";
import { LibPromptModuleAPI } from "./libCreator/promptModuleAPI";

import { defaultPromptModule, libDefaultPromptModule } from "./../constants";
import { getPackageJson } from "../utils/getPackageJson";
import { LibCreator } from "./libCreator";

function getPromptModules(): Array<(api: PromptModuleAPI) => void> {
  return defaultPromptModule.map(
    (file) => require(`./webAppCreator/promptModules/${file}`).default,
  );
}

function getCreateLibPromptModules(): Array<(api: LibPromptModuleAPI) => void> {
  return libDefaultPromptModule.map(
    (file) => require(`./libCreator/promptModules/${file}`).default,
  );
}

function updateNotify(): void {
  const pkg = getPackageJson(path.join(__dirname, "../../"));
  const notifier = updateNotifier({
    pkg: {
      name: pkg.name,
      version: pkg.version,
    },

    // 1 week
    updateCheckInterval: 1000 * 60 * 60 * 24 * 7,
  });

  if (notifier.update) {
    const template =
      "Update available " +
      chalk.dim("{currentVersion}") +
      chalk.reset(" → ") +
      chalk.green("{latestVersion}") +
      " \nRun " +
      chalk.cyan("{updateCommand}") +
      " to update";

    const message =
      "\n" +
      boxen(
        pupa(template, {
          packageName: pkg.name,
          currentVersion: notifier.update.current,
          latestVersion: notifier.update.latest,
          updateCommand: "npm install @zero-cli/cli@latest -g",
        }),
        {
          padding: 1,
          margin: 1,
          align: "center",
          borderColor: "yellow",
        },
      );

    console.error(message);
  }
}

async function create(projectName: string, options: CliOptions): Promise<void> {
  const cwd = process.cwd();
  const inCurrent = projectName === ".";
  const name = inCurrent ? path.relative("../", cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || ".");

  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`));
    result.errors &&
      result.errors.forEach((err) => {
        console.error(chalk.red.dim("Error: " + err));
      });
    result.warnings &&
      result.warnings.forEach((warn) => {
        console.error(chalk.red.dim("Warning: " + warn));
      });
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      clearConsole();
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: "ok",
            type: "confirm",
            message: `Generate project in current directory?`,
          },
        ]);
        if (!ok) {
          return;
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: "action",
            type: "list",
            message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
            choices: [
              { name: "Overwrite", value: "overwrite" },
              { name: "Merge", value: "merge" },
              { name: "Cancel", value: false },
            ],
          },
        ]);
        if (!action) {
          return;
        } else if (action === "overwrite") {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
          await fs.remove(targetDir);
          console.log();
        }
      }
    }
  }

  const { projectType } = await inquirer.prompt<{ projectType: "lib" | "webApp" }>([
    {
      name: "projectType",
      type: "list",
      message: "Pick you will creating project type",
      choices: [
        { name: "React Web App", value: "webApp" },
        { name: "React Component Library", value: "lib" },
      ],
    },
  ]);

  if (projectType === "webApp") {
    const creator = new Creator(name, targetDir, options, getPromptModules());
    await creator.create();
  }

  if (projectType === "lib") {
    const creator = new LibCreator(name, targetDir, options, getCreateLibPromptModules());
    await creator.create();
  }
}

export function init(projectName: string, options: CliOptions): Promise<void> {
  updateNotify();

  return create(projectName, options).catch((error) => {
    const spinner = new Spinner();
    spinner.stopSpinner(false);
    console.log(chalk.red(error));
  });
}
