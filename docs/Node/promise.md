# Promise, async/await之间的区别

## 什么是Promise

- Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。

1. Promise有三种状态: pending(进行中), resolved(成功), rejected(失败);
2. 每个promise都需要一个then方法，传入两个参数，一个是成功的回调，一个是失败的回调;
3. 当promise内抛出异常也会走失败状态;
4. 调用then方法会返回一个全新的promise

```
class Promise {
  constructor(execut) {
    // 初始状态是pending 状态
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;

    // 当调用resolve的时候判断如果当前状态是pending状态就改成成功状态
    let resolve = function() { 
      if(this.status === 'pending') {
        this.status = 'resolve';
        this.value = val;
      }
    };

    // 当调用reject的时候判断如果当前状态是pending状态就改成失败状态
    let reject = function() {
      if(this.status === 'pending') {
        this.status = 'reject';
        this.reason = val;
      }
    }

    try {
      execut(resolve, reject);
    } catch(e) {
      reject(e);
    }
  }
}
```

```js
then(onFullfilled, onRejected) {
  let promise2 = new Promise((resolve, reject) => {
    if (this.status === 'resolve') {
      try {
        let x = onFullfilled(this.value);
        resolve(x);
      } catch (e) {
        reject(e)
      }
    }
    if (this.status === 'reject') ...
    if (this.status === 'pending')...
  })
}
```

### then
接收两个回调函数作为参数；
返回一个新的promise对象

### catch

- catch就是then方法，没有resolve的then，只有一个失败方法

### promise.all
多个promise的实例被包装成一个新的promise实例；
promise.all接收一个数组作为参数；
如果数组里面的状态都成功了，那么promise.all会返回成功的状态；
如果数组里面有一个失败了，那么promise.all就会返回第一个失败的返回值；

```js
Promise.all = function (args) {
  return new Promise ((resolve, reject) => {
    let arr = [];
    let index = 0;
    
    if (index++ == args.length) {
      resolve(arr)
    }
    args.forEach(item => {
      if (type item.then === 'function') {
        item.resolve().then(data => {})
      } else {
        arr[index] = item
      }
    })
  })
}
```

### promise.race

### promise.finally 
不管Promise对象的状态如何，都会执行；


## Generator

- Generator函数执行会返回一个迭代器，迭代器有一个next方法；
- next();会执行，遇到yield会停止。next执行会返回一个对象，里面有{value, done}
- next()传值会把结果传递给上一次的yield的返回值
- 配合yield可以有中断功能，碰到yield就停止

## 什么是async/await
**async 函数是什么？一句话，它就是 Generator 函数的语法糖。**

```js
function * read(path) {
  let path1 = yield fs.readFile(path);
  let path2 = yield fs.readFile(path1);
  return path2
};

function co(it) {
  return new Promise((resolve, reject) => {
    function next(val) {
      let { value, done } = it.next();
      if (done) {
        resolve(value);
      } else {
        next(value);
      }
    }
    next();
  });
};

// let it = read('xxx.xxx'); read('xxx.xxx')函数执行返回一个迭代器
co(read('xxx.xxx'))
```

async函数返回的是一个promise对象，但是必须等到内部所有的await命令后面所有的promise执行完成才会发生状态的改变；除非遇到return语句或者抛出错误；