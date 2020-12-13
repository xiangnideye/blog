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

## loader 模块
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