import { GeneratorAPI } from "@zero-cli/cli-types-shared/dist/cli/lib/generator/generatorAPI";
import { RootOptions } from "@zero-cli/cli-types-shared/dist/shared";

export default function(api: GeneratorAPI, _options: Required<RootOptions>): void {
  api.extendPackage({
    files: ["dist", "lib", "es"],
    sideEffects: ["dist/*", "es/**/style/*", "lib/**/style/*", "*.less"],
    main: "lib/index.js",
    module: "es/index.js",
    unpkg: `dist/${_options.projectName}.min.js`,
    typings: "es/index.d.ts",
    scripts: {
      serve: "docz dev",
      "doc:build": "docz build",
      eslint: "eslint --ext .tsx,.ts src/",
      compile: "tsc --noEmit",
      build: "zero-lib-service build",
      test: "jest",
      "release:next":
        "zero-lib-service publish prerelease --tag next --run-scripts 'test eslint build' --allow-any-branch",
      release:
        "zero-lib-service publish --tag latest --run-scripts 'test eslint build' --branch main",
    },
    dependencies: {
      classnames: "^2.2.6",
    },
    devDependencies: {
      "@types/classnames": "^2.2.11",
      docz: "^2.3.1",
      "gatsby-plugin-less": "^4.5.0",
      prettier: "^1.19.1",
      react: "^16.14.0",
      "react-dom": "^16.14.0",
    },
    peerDependencies: {
      react: ">=16.0.0",
      "react-dom": ">=16.0.0",
    },
    optionalDependencies: {
      react: ">=16.0.0 <=16.14.0",
      "react-dom": ">=16.0.0 <=16.14.0",
    },
    publishConfig: {
      access: "public",
      registry: "https://registry.npmjs.org/",
    },
  });

  api.render("./template", {
    projectName: _options.projectName,
  });
}
