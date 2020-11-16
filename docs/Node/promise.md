# Promise, async/await之间的区别

## 什么是Promise
- Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。

Promise有三种状态：pending(进行中)、resolved(成功)、rejected(失败)
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

### then
接收两个回调函数作为参数；
返回一个新的promise对象

### promise.all
多个promise的实例被包装成一个新的promise实例；
promise.all接收一个数组作为参数；
如果数组里面的状态都成功了，那么promise.all会返回成功的状态；
如果数组里面有一个失败了，那么promise.all就会返回第一个失败的返回值；

### promise.race

### promise.finally 
不管Promise对象的状态如何，都会执行；


## 什么是async/await
**async 函数是什么？一句话，它就是 Generator 函数的语法糖。**

async函数返回的是一个promise对象，但是必须等到内部所有的await命令后面所有的promise执行完成才会发生状态的改变；除非遇到return语句或者抛出错误；