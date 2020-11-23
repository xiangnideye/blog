# 常用loader

- 一些常用的loader以及用法和作用  

**loader是从右向左，从下到上加载执行**

## css 相关

- css-loader 用来处理import url等css
- style-loader 用来把CSS通过style插入到header中
- less-loader 处理less 预处理器
- sass-loader 处理sass 预处理器


```
  module.export = {
    module = {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'scss-loader']
        }
      ]
    }
  }
```


## 图片文件相关
- file-loader 处理require或import等加载图片
- url-loader 是对file-loader的增强，可以指定当文件小于多少之后 采用Base64的形式插入
- html-loader  处理在HTML中引入的图片并且src中是相对路径

```
  module.export = {
    module = {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: { //选项
                name: '[hash: 10].[ext]', // 从命名
                esModule: false // 不包装成es6模块
              }
            },
            {
              loader: 'url-loader',
              options: { //选项
                name: '[hash: 10].[ext]', // 从命名
                esModule: false // 不包装成es6模块,
                limit: 32*1024 当文件小于32*1024 转成base64
              }
            }
          ]
        },
        {
          test: /\.html$/,
          use: ['html-loader]
        }
      ]
    }
  }
```


## ES6/ES7/JSX 相关
- babel-loader 作用是调用babel-core
- babel/core babel的核心包 本身是一个过程管理功能，把源代码转成抽象语法树，进行遍历和生成，但是它也不知道怎么转换， babel/preset-env知道怎么转换
- babel/preset-env 为每一个环节的预设
- babel/preset-react react插件的babel预设
- babel/polyfill

```js
  module.export = {
    module = {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                ["@babel/preset-env", {// 可以配置参数，会传递到preset-env中
                  useBuiltIns: 'usage // 按需加载polyfill
                }], //可以转换JS语法，把高级转换成低级
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

## 代码校验

- eslint 核心包
- eslint-loader 转换器

```js
  module.export = {
    module = {
      rules: [
        {
          test: /\.jsx?$/,
          use: "eslint-loader",
          enforce: "pre", //强制指定顺序 先进行代码校验，在去编译
          options: {fix: true}, //自动修复
          exclude: /node_modules/, //排除校验
          include: resolve(__dirname, src) // 只检查src里面的目录
        }
      ]
    }
  }
```