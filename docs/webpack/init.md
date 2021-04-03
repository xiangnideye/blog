# webpack 基础配置（使用）
- webpack.config.js 包含了wepack基础的配置和模块

## entry 入口
- 指的是webpack应该使用哪个模块作为打包的开始。进入入口起点之后，webpack会找出那些模块和库是入口的起点所依赖的
- 默认是./src/index.js 但是可以在entry中指定一个或多个入口

```
  module.expory = {
    entry: "./src/index.js"
  }
```

## output 出口(输出)
- output属性告诉webpack在哪里输出它所创建的bundle，以及如何命名这些文件
- 主要输出的文件是./dist/main.js 

```
  const path = require('path');
  // __dirname是当前文件所在的目录
  module.expory = {
    output: {
      path: path.resolve(__dirname, 'dist'), // 输出文件夹的绝对路径
      filename: 'bundle.js'  // 输出的文件名称
    }
  }
```

## module 模块
- webpack只能理解JavaScipt和JSON文件
- loader能让webpack能够去处理其他类型的文件，并将它们转为有效模块
- loader本质上是转换器，把任意类型的模块转换成JS模块  

**预设是插件的集合，预设包含了很多的插件。**

```js
  module.export = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: { //选项，也是预设
                "@babel/preset-env", //可以转换JS语法，把高级转换成低级
                "@bebel/preset-react" //可以处理react语法
              },
              plugins: [ // 插件
                ["@babel/plugin-proposal-decorators", {legacy: true}] // 支持类的装饰器
                ["@babel/plugin-proposal-class-properties ", {loose: true}] // 支持类的装饰器
              ]
            }
          ]
        }
      ]
    }
  }
```

## mode 模式
- 用来指定当前的运行模式 开发环境 development，生产环境 production，不指定环境

```js
  module.export = {
    mode: 'development'
  }
```
- 命令行参数
  1. --mode 用来设置模块内部process.env.NODE_ENV
  2. --env 用来设置webpack.config.js配置文件的函数参数
  3. corss-env 用来设置node环境的process.evn.NODE_ENV
  4. webpack.DefinePlugin 用来设置全局的变量

```js
{
  "npm run build": "webpack --mode development/production"
  // 执行之后在webpack.config.js中拿不到process.env.NODE_ENV,但是可以在别的模块中拿到

  "npm run build": "webpack --env development/production"
  // 执行后可以在webpack.config.js中拿到，但是需要把module.exports = (env) => {}的返回值变成一个函数来获取形参中的值 

  new webpack.DefinePlugin({
    'test': JSON.stringify('test')
  })
  // 可以在index.js模块中 打印test就可以获取变量值，一定要加JSON.stringify如果不加会变成变量

  "npm run build": "cross NODE_EVN development/production webpack"
  // 只能设置node环境下的变量NODE_ENV
}
```

## plugins 插件
- 用来执行范围更广的任务，包括打包优化，资源管理，注入环境变量等

```js
  module.export = {
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'name'
      }),
      new webpack.DefinePlugin({
        DEVELOPMENT: '',
        VERSION: '1',
        EXPRESSION: '1+2'
      })
    ]
  }
```

## 环境变量配置

- 环境变量分为两种，一种是在内部模块使用的变量，一种是在node环境下使用的变量（也就是在webpack.config.js）里面的变量
- webpack执行的时候，mode默认值是production，它内部模块可以读到
  - 也可以通过在package.json中通过--mode来设置mode的值
  - 可以通过--env传参的方法来给webpack配置文件中导出的函数作为参数传递


## CSS浏览器兼容

- 查看css对各个浏览器版本的网站： [caniuse](https://www.caniuse.com/)
- postcss-loader

## CSS JS HTML 压缩

## px自动转换rem

- px2rem-loader
- lib-flexible
- px2rem

## devServer 开发基础配置
- 用来配置一些开发环境的基础配置

[官方链接：devServer](https://www.webpackjs.com/configuration/dev-server/#devserver)

```js
package.json: npm run start 启动的区别 
  webpack4: "start": "webpack-dev-serve"  
  webpack5: "start": "webpack serve"
```

```js
  module.export = {
    devServer: {
      contentBase: resolve(__dirname, 'dist'), // 静态根目录
      compress: true, //是否启动压缩
      port: 8000, // 监听的端口号
      open: true //是否自动打开浏览器  
    },
  }
```

## source-map

- 是为了解决开发代码与实际代码不一致时帮助我们debug到原始代码的技术
- webpack可以自动给我source-map文件，map文件是一种对应编译文件和源文件的方法

**关键词**
1. source-mapx - 4
  - 产生.map文件(包含行，列信息)
2. eval - 3
  - 把代码通过eval包裹起来
3. cheap - 1
  - 不包含列信息，没有源文件映射。只有编译过后的代码
4. module - 2
  - 包含loader的source-map。可以找到源文件。可以找到源文件的信息
5. inline
  - 内嵌到打包后的文件里面
6. hidden-source-map
  - 隐藏，生产环境使用。可以生产map文件。但是不显示

> devtool: 
inline-source-map /
cheap-source-map /
cheap-module-source-map /
eval-source-map /
source-map /

## 第三方插件引入

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


## Babel
- Babel是一个编译javascript的平台，可以把ES6，ES7，react等高级语法进行转移成ES5

### babel一些安装包
- @babel/core         编译的核心包
- @babel/cli          能够从终端（命令行）使用的工具
- @babel/preset-env   预设，也就是插件的集合
- @babel/polyfill     垫片/腻子，用来模拟ES2015+的环境，方便使用一些内置的静态方法

**我们使用 @babel/cli 从终端运行 Babel，利用 @babel/polyfill 来模拟所有新的 JavaScript 功能，而 env preset 只对我们所使用的并且目标浏览器中缺失的功能进行代码转换和加载 polyfill。**
