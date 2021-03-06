import { GeneratorAPI } from "@zero-cli/cli-types-shared/dist/cli/lib/generator/generatorAPI";

export default function(api: GeneratorAPI): void {
  api.extendPackage({
    dependencies: {
      axios: "^0.19.2",
      "@luban-hooks/use-request": "^1.3.0",
    },
  });

  api.render("./template");
}
