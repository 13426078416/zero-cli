# 环境变量和模式

可以在项目根目录中添加以下文件来为项目指定环境变量：

```shell
.env               # 在所有的环境中被载入
.env.local         # 在所有的环境中被载入，但是会被 git 忽略
.env.[mode]        # 在指定的模式下被载入
.env.[mode].local  # 在指定的模式下载入，但是会被 git 忽略
```

一个 dotenv 文件中只可包含环境变量的键值对，例如:

```
FOO=bar
APP_SERVER=https://server.cn
```

被载入的环境变量会对 <mark>@zero-cli/cli-servic-plugin</mark> 以及其插件、依赖可用。

::: tip 环境加载属性

为一个特定模式准备的环境文件 (例如 _.env.production_) 将会比一般的环境文件 (例如 _.env_) 拥有更高的
优先级。

此外，Luban 启动时已经存在的环境变量拥有最高优先级，并不会被 _.env_ 文件覆写。 :::

::: tip 🙋 对于 dotenv 文件的优先级如下：_.env.[mode].local > .env.[mode] > env.local > .env_ :::

## 模式

一个 CLI 创建的项目通常有两种模式：

- `development` 模式被用于 `cli-servic-plugin serve`
- `production` 模式被用于 `cli-servic-plugin build`

模式(mode) 不同于 `process.env.NODE_ENV` ，一个模式下可以包含多个环境变量。可以为 _.env_ 文件添加模
式后缀来指定特定模式下的环境变量，比如在项目根目录下创建 _.env.development_ 文件，这个文件就会在
development 模式被载入。

然后可以通过 mode 参数来使用特定模式下的环境变量:

```shell
cli-servic-plugin serve --mode development
```

::: tip 🙋 `cli-servic-plugin server` 会将 `process.env.NODE_ENV` 设置为 `development`,
`cli-servic-plugin build` 会将 `process.env.NODE_ENV` 设置为 `production`, 建议不要将
`process.env.NODE_ENV` 设置为其他值，因为其他库也可能使用了这个值来区分环境。 :::

**示例：mock 模式**

假设项目根目录下存在一个 _.env_ 文件:

```
APP_SERVER=https://server.cn
```

和 _.env.mock_ 文件

```
MOCK=true
APP_SERVER=https://mock.server.cn
```

1. 运行 `cli-servic-plugin build` 将会加载可能存在的 _.env_, _.env.production_,
   _.env.production.local_ 文件，然后根据这些文件中的环境变量来构建可用于生产环境应用。
2. 运行 `cli-servic-plugin build --mode=mock` 将会加载可能存在的 _.env.mock_, _.env.mock.local_ 文件
   ，然后根据这些环境变量来构建可用于生产环境的应用。

这两种情况下，由于运行的是 build 命令，所以都是构建用于生产环境的应用，但是在 mock 模式下
，`process.env.APP_SERVER` 将会被覆写为另外一个值。

**同时，只有以 `/^APP_/` 开头的变量才会被
[webpack.DefinePlugin](https://webpack.js.org/plugins/define-plugin/#root) 注入客户端侧的代码中**，
可以在项目代码中这样使用环境变量：

```javascript
// 注意 APP_SERVER 对应的值将会变成 "https://example.mock.com"
console.log(process.env.APP_SERVER);
```

除了以 `/^APP_/` 开头的环境变量外，还有一些特殊的环境变量也可以在应用中访问到：

- `NODE_ENV` 将会是 `development` 、 `production` 中的一个。
- `BASE_URL` 取 `zero.config.ts` 配置中的 `publicPath` 选项，即应用部署时的基础路径。

## 只在本地有效的变量

有的时候可能有一些不应该提交到代码仓库中的变量，尤其是多人协作开发同一项目时。这种情况下应该使用一个
_.env.local_ 文件取而代之。本地环境文件默认会被忽略，且出现在 _.gitignore_ 文件中。

_.local_ 也可以加在指定模式的环境文件上，比如 _.env.development.local_ 将会在 development 模式下被载
入，且被 git 忽略。
