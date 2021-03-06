const { readJSONSync, writeFileSync } = require("fs-extra");
const shell = require("shelljs");
const path = require("path");

const rawArgs = process.argv.slice(2);

const command = `vuepress ${rawArgs.join(" ")}`;
try {
  const lernaConfigPath = path.resolve(__dirname, process.env.LERNA_PATH || "../lerna.json");
  const lernaConfig = readJSONSync(lernaConfigPath, { encoding: "utf-8" });
  const version = lernaConfig.version;

  process.env.__ZERO_VERSION__ = version;

  shell.exec(command);
} catch (e) {
  console.log(`execute ${command} failed`);
  process.exit(1);
}
