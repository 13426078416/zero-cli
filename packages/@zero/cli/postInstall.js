const chalk = require(`chalk`);

function showSuccessMessage() {
  console.log(chalk.green(`Success!\n`));
  console.log(
    chalk.cyan(`Thank you to use Luban! Please visit `) +
      chalk.underline(`https://zero.fun`) +
      chalk.cyan(` for more information.\n`),
  );
}

try {
  // check if it's a global installation of @zero-cli/cli
  const npmArgs = JSON.parse(process.env[`npm_config_argv`]);
  if (npmArgs.cooked && npmArgs.cooked.includes(`--global`)) {
    showSuccessMessage();
  }
} catch (e) {}
