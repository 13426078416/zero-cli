import { info } from "@zero-cli/cli-utils-shared";
import path from "path";
import fs from "fs-extra";
import webpack = require("webpack");

function buildDeployFile(outputDir: string) {
  return new Promise<void>((resolve, reject) => {
    const entry = path.join(outputDir, "/server.js");
    webpack(
      {
        mode: "development",
        entry,
        target: "node",
        devtool: "source-map",
        output: {
          path: outputDir,
          filename: "server.js",
          libraryTarget: "commonjs2",
          sourceMapFilename: "server.map.json",
        },
        optimization: {
          splitChunks: false,
        },
      },
      (err) => {
        if (err) {
          console.log(err);
          reject();
          return;
        }

        resolve();
      },
    );
  });
}

export async function buildServerSideDeployFIle(outputDir: string) {
  info("Building server side deploy file...");

  const template = fs.readFileSync(outputDir + "/server.ejs", { encoding: "utf-8" });

  fs.writeFileSync(
    outputDir + "/server_template.js",
    `module.exports = ${JSON.stringify(template)}`,
    {
      encoding: "utf-8",
    },
  );
  fs.copyFileSync(path.resolve(__dirname, "../utils/server.js"), outputDir + "/server.js");
  fs.copyFileSync(path.resolve(__dirname, "../utils/server.d.ts"), outputDir + "/server.d.ts");

  await buildDeployFile(outputDir);

  fs.removeSync(outputDir + "/server_template.js");
  fs.removeSync(outputDir + "/server-bundle.js");
  fs.removeSync(outputDir + "/server.ejs");
}
