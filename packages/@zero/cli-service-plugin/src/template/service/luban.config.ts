import { createProjectConfig } from "@zero-cli/cli-service-plugin";

export default createProjectConfig({
  publicPath: process.env.APP_PUBLIC_PATH,
});
