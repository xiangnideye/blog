# devServer 开发基础配置
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
