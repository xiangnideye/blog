# common.js 实现规范
每一个.js文件都是一个模块，会在外层包一个自执行函数，有五个参数，最终把Module.exports返回

- require文件，通过require引入文件
- 解析文件路径，把require传入的文件路径变成绝对路径，并且添加文件后缀。因为传入的如果是相对路径，需要对文件做缓存
- 拿到绝对路径后，创建一个模块，通过文件夹名进行缓存
- 根据文件后缀去做策略加载，同步读取文件
- 然后通过字符串包裹成一个函数，然后执行函数让module.exports作为this
- 最终返回exports对象

```js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function Module(id){
  this.id = id;
  // 默认会返回这个对象
  this.exports = {};
}
// 策略模式
Module._extensions = {
  '.js'(module){
    let script = fs.readFileSync(module.id, 'ufg8');
    let templateFn = `(function(exports, module, reuiqre, __dirname, __filename) {
      ${script}
    })()`;
    // 通过vm创建一个新的执行环境
    fn = vm.runInThisContext(templateFn);
    let exports = thisValue = module.exports;
    let filename = module.id;
    let dirname = path.dirname(filename);
    // 调用了引入的文件，把module.exports赋值
    fn.call(thisValue, exports, module, require, dirname, filename);
  },
  '.json'(module){
    let script = fs.readFileSync(module.id, 'ufg8');
    // 给this.exports 赋值
    module.export = JSON.parse(script);
  }
}
// 解析文件路径，将相对路径变成绝对路径, 并且添加文件后缀
Module._resolveFileName = function (id) {
  let filePath = path.resolve(__dirname, id);
  // 判断文件是否存在。如果存在代表路径带有文件后缀
  let isExists = fs.existsSync(filePath);
  // 如果传入的文件路径带有后缀则直接返回
  if (isExists) return filePath;
  let keys = Object.keys(Module._extensions);
  // 通过循环将文件路径去拼接后缀，如果有文件就返回没有就报错
  for (let i = 0; i< keys.length; i++) {
    let newPath = filePaht + keys[i];
    if (fs.existsSync(newPath)) return newPath
  }
  throw new Error('module not found');
}

Module.prototype.load = function () {
  // 获取文件的后缀名
  let ext = path.extname(this.id);
  // 通过策略模式执行对应的方法
  Module._extensions[ext](this);
}
// node的引入文件方法, 参数是一个文件路径
function require (fileName) {
  fileName = Module._resolveFileName(fileName);
  const module = new Module(fileName);
  module.load();

  // 默认是空对象
  return module.exports 
}
```