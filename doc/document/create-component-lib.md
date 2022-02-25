# 创建一个 Component Library

```shell
zero init <project_name>
```

或者使用 `npx @zero-cli/cli init <project_name>` 免安装的方式来创建项目

::: tip 🙋 可以使用淘宝源来稍微加快创建项目的速度
`zero init <project_name> -r https://registry.npm.taobao.org` :::

### `zero init` 命令

在终端运行 `zero init <project_name>` 命令后，选择 **React Component Library** ：

![image-20210526150744092](https://i.loli.net/2021/05/26/nXGPruFVIq3Le2A.png)

选择创建 React Component Library 类型的项目后，同样将会以一个默认的预设创建项目，默认的预设如下：

- [ESLint](https://eslint.org/) 配置方案
  ：<a-radio checked value='leapfe'>[leap](https://www.npmjs.com/package/eslint-config-leapfe)</a-radio><a-radio value='airbnb'>[airbnb](https://www.npmjs.com/package/eslint-config-airbnb)</a-radio><a-radio value='standard'>[standard](https://www.npmjs.com/package/eslint-config-standard)</a-radio></a-radio-group>
- 使用 <a-checkbox checked>[Stylelint](https://stylelint.io/)</a-checkbox>
- 使用 <a-checkbox checked>[commitizen](https://github.com/commitizen/cz-cli) +
  [commitlint](https://commitlint.js.org/#/) 提交代码</a-checkbox>

可以加上 `-m` 或 `--manual` 参数，即 `zero init <project_name> -m` 来手动的选择决定项目将会有哪些特
性。

手动选择的特性将包括：

- [ESLint](https://eslint.org/) 配置方案
  <a-radio value='leapfe'>[leap](https://www.npmjs.com/package/eslint-config-leapfe)</a-radio><a-radio value='airbnb'>[airbnb](https://www.npmjs.com/package/eslint-config-airbnb)</a-radio><a-radio value='standard'>[standard](https://www.npmjs.com/package/eslint-config-standard)</a-radio></a-radio-group>
- 是否使用 <a-checkbox>[Stylelint](https://stylelint.io/)</a-checkbox>
- 是否使用 <a-checkbox>[commitizen](https://github.com/commitizen/cz-cli) +
  [commitlint](https://commitlint.js.org/#/) 提交代码</a-checkbox>

`zero init` 命令将提供一些可选选项，可以运行下面的命令来获取这些选项

```shell
zero init --help
```

```shell
用法：zero init [options] <project_name>

选项：
-m, --manual 跳过默认的 preset，手动选择项目需要的特性
-r, --registry <url> 在安装依赖时使用指定的 npm registry
-s, --skipGit 跳过 git 初始化
-f, --force 覆写目标目录可能存在的配置
-g, --git [message] 强制 git 初始化，并带初始的 commit message
-h, --help 输出使用帮助信息
-i, --info 输出一些环境信息，比如系统，CPU，Node 版本，NPM 版本
```

### `cli-lib-service` 命令

项目创建完成后，<mark>@zero-cli/cli-lib-service</mark> 会提供 `zero-lib-service` 命令。

可以在 npm scripts 中以 `zero-lib-service` 或者从终端中以 `./node_modules/.bin/zero-lib-service` 访
问这个命令。

同时在 _package.json_ 文件的 `scripts` 字段会添加以下几个脚本：

```json
{
  "scripts": {
    "serve": "docz dev",
    "build": "zero-lib-service build",
    "release:next": "zero-lib-service publish prerelease --tag next --run-scripts 'test eslint build' --allow-any-branch",
    "release": "zero-lib-service publish --tag latest --run-scripts 'test eslint build' --branch main"
  }
}
```

可以通过 npm 来执行这些 `scripts`:

```shell
npm run serve
```

### zero-cli-service build

```json
用法：zero-cli-service build
```

该脚本命令会构建出支持 ESModule、CommonJS 和 UMD 模块系统的产物代码。

其中 ESModule 模块代码输出到 _es_ 目录，CommonJS 模块代码输出到 _lib_ 目录，UMD 模块代码输出到到
_dist_ 目录。

### zero-cli-service publish

```json
用法：zero-cli-service publish [options]

选项：

  -V, --version            指定版本号
  --tag <tag>              指定 dist-tag, 默认 'latest'
  --allow-any-branch       允许发布任何分支, 默认 'false'
  --branch <branch>        指定允许发布的分支
  --run-scripts <scripts>  指定发布前要运行的脚本命令, 例如 --run-scripts 'test build'
  --clean                  删除 node_modules 并重新安装, 默认 false'
```

该命令将会把构建后的产物发布到指定的仓库（默认 https://registry.npmjs.org/）。
