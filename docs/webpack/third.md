# 第三方插件引入

- 1. 直接引入 每个文件都需要单独import 或者require 引入
- 2. 插件引入 所以文件都可以用，但是window上没有
- 3. expose-loader 可以把模块放到window上 
- 4. html-webpack-externals-plugin 按需加载 文件中require第三方插件后，webpack会根据引入的第三方 动态插入链接

```js
  module.export = {
    module: {
      rules: [
        {
          test: require.resolve('lodash'),
          loader: 'expose-loader',
          options: {
            exposes: {
              globalName: '_',
              override: true
            }
          }
        }
      ]
    },
    plugins: [
      // 插件引入
      new webpack.ProvidePlugin({
        _: 'lodash',
        $: 'jquery'
      }),
      new HtmlWebpackExternalsPlugin({
        module: 'lodash',
        entry: 'cdn',
        global: '_'
      })
    ]
  }

```