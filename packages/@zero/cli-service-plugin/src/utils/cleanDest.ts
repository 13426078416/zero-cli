import fs from "fs-extra";
import path from "path";
import { error, info } from "@zero-cli/cli-utils-shared";

export async function cleanDest(context: string, outputDir: string) {
  info(`clean dest files...`);

  const _path = path.resolve(context, outputDir);

  try {
    if (fs.pathExistsSync(_path)) {
      await fs.remove(_path);
    }
  } catch (e) {
    error("Try clean dest files failed", e);
  }
}
