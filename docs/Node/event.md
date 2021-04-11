# Evnet模块
内置模块
**发布订阅主要解决了什么问题？ 代码解耦**
```js
const EventEmitter = require('event');
on 订阅
emit 发布

function EventEmitter() {
    this._events = {}
}
```

## 订阅
```js
EventEmitter.prototype.on = function (eventName, callback) {
  if (this._evnets[eventName]) {
    // 如果有了就直接push进去
    this._evnets[eventName].push(callback)
  } else {
    // 第一次对象中肯定没有，所以等于一个数组
    this._evnets[eventName] = [callback]
  }
}
```

## 发布
```js
EventEmitter.prototype.emit = function (eventName, ...args) {
  this._event[eventName].forEach(fn => {
    fn(...args)
  })
}
```

## 取消订阅
```js
EventEmitter.prototype.off = function (eventName, callback) {
 if (this._event && this._event[eventName]) {
   this._event[eventName] = this._event[eventName].filter(fn => fn !== callback && fn.l !== callback)
 }
}
```

## 绑定一次
只触发一次，第一次会触发，第二次就不会在触发执行了

```js
EventEmitter.prototype.once = function (eventName, callback) {
  const one = () => {
    callback();
    this.off(eventName, one)
  }
  one.l = callback;
  this.on(eventName, one);
}
```

## newListener
每次绑定（订阅）都会触发此函数
```js
EventEmitter.prototype.on = function (eventName, callback) {
  if (eventName !== 'newListener') {
    this.emit(eventName, eventName)
  }
  if (this._evnets[eventName]) {
    // 如果有了就直接push进去
    this._evnets[eventName].push(callback)
  } else {
    // 第一次对象中肯定没有，所以等于一个数组
    this._evnets[eventName] = [callback]
  }
}
```
