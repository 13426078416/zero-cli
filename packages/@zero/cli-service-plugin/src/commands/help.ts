import chalk from "chalk";

import {
  builtinServiceCommandName,
  CommandList,
  CommandPluginInstance,
  CommandPluginApplyCallbackArgs,
} from "../definitions";

export function isObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function getPadLength(obj: Record<string, unknown>): number {
  let longest = 10;
  for (const name in obj) {
    if (name.length + 1 > longest) {
      longest = name.length + 1;
    }
  }

  return longest;
}

function logMainHelp(commands: Partial<CommandList>): void {
  console.log(`\n  Usage: zero-cli-service <command> [options]\n` + `\n  Commands:\n`);

  const padLength = getPadLength(commands);

  for (const name in commands) {
    if (name !== "help") {
      const opts = commands[name].opts || {};
      console.log(`    ${chalk.blue(name.padEnd(padLength))}${opts.description || ""}`);
    }
  }

  console.log(
    `\n  run ${chalk.green(`zero-cli-service help [command]`)} for usage of a specific command.\n`,
  );
}

function logHelpForCommand(
  name: builtinServiceCommandName,
  command?: CommandList[builtinServiceCommandName],
): void {
  if (!command) {
    console.log(chalk.red(`\n  command "${name}" unregistered.`));
  } else if (isObject(command.opts)) {
    const opts = command.opts || {};

    if (opts.usage) {
      console.log(`\n  Usage: ${opts.usage}`);
    }

    if (isObject(opts.options)) {
      console.log(`\n  Options:\n`);
      const padLength = getPadLength(opts.options);
      for (const [flags, description] of Object.entries(opts.options)) {
        console.log(`    ${chalk.blue(flags.padEnd(padLength))}${description}`);
      }
    }

    if (typeof opts.details === "string") {
      console.log();
      console.log(
        opts.details
          .split("\n")
          .map((line: string) => `  ${line}`)
          .join("\n"),
      );
    }

    console.log();
  }
}

export default class Help implements CommandPluginInstance<{}> {
  apply(params: CommandPluginApplyCallbackArgs<{}>) {
    const { api, args } = params;

    api.registerCommand("help", () => {
      const commandName = args._[0] as builtinServiceCommandName;

      const commands = api.getRegisteredCommands();

      if (!commandName) {
        logMainHelp(commands);
      } else {
        logHelpForCommand(commandName, commands[commandName]);
      }
    });
  }
}
