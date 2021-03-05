# Vue 常见问题

## watch

- 监听的值如果是对象的话，无法获取到老状态
- watch有多种写法
  1. 对象的形式
  2. 数组的形式
  3. 字符串
  4. 函数
- watch就是从新new Wathcer
  - 判断watch里面写的是字符串还是数组，然后根据数组还是字符串做兼容处理
  - 在new Watcher的时候判断是不是函数，是函数就执行，不是函数包一层函数去实例上获取监听的值
  - 默认执行之后获取到老值，然后当值更新的时候获取新值
  - 执行用户传递的callback，把新值和老值返回

```js
  // 写法
  watch: {
    // 函数
    name (newVal, oldVal) {},
    // 对象
    name: {
      handler() {},
      sync: true
    },
    // 字符串，就会取methods里的方法
    name: 'methodName',
    // 数组
    name: [{handler: 'methodName'}, {handler: 'methodName'}]
  }
```

```js
  // 原理
  // 初始化watch，判断用户传递的watch的写法
  fucntion initwatch(vm, watch) {
    for(let key in watch) {
      const handler = watch[key];
      if (Array.isArray(handler)) {
        for (let i = 0; i< handler.length; i++) {
          createWacher(vm, key ,handler[i]);
        }
      } else {
        createWacher(vm, key ,handler)
      }
    }
  }
  // 创建watch 
  function createWacher(vm, key ,handler, options) {
    if (typeof handler == 'object') {
      options = handler
      hanler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler]
    }
    return vm.$watch(key, handler, options)
  }
  // 给实例定义$watch方法
  Vue.prototype.$watch = function(key, handler, options) {
    // 代表是用户自定义的watcher
    options.user = true
    new Watcher(this, key, handler, options)
  }
  class Watcher {
    constructor(vm, exprOrFn, callback, options) {
      ...
      if(typeof exprOrFn == 'function') {
        this.getter = exprOrFn;
      }else {
        this.getter = function () {
          // 去实例上取值，有可能去methods上取值，有可能去data里面
          retrun vm[exprOrFn]
        }
      }
      // 获取老值
      this.value = this.get();
    }
    // 执行
    get() {
      pushTarget();
      let value = this.getter.call(this.vm);
      popTarget();
      return value
    }
    // 更新调用run
    run() {
      let oldValue = this.value;
      let newValue = this.get();
      this.value = newValue;
      // 如果当前是用户watcher就执行用户callback 传递新值和老值
      if (this.options.user) {
        this.callback.call(this.vm, newValue, oldValue);
      }
    }
  }
```

## computed

- 什么是计算属性，当一个属性依赖另一个属性的变化而变化的时候
- computed的特点
  1. watch在内部会默认对变量取值，computed不会
  2. computed依赖的值不变就不会更新
  3. computed变量可以用于模板的渲染
- 内部也是通过watcher实现

```js
function initComputed(vm, computed) {
  // 在实例上定义一个对象来存放计算属性
  const watchers = vm._computedWatchers = {};
  for(let key in computed) {
    const userDef = computed[key];
    // 获取get函数,处理写法兼容性
    const getter = typeof userDef === 'function'? userDef: userDef.get;

    watchers[key] = new Watcher(vm, getter, ()=>{}, {lazy: true});
    // 因为计算属性可以直接通过vm取值，所以需要把computed定义到实例上
    defineComputed(vm, key, userDef)
  }
}
// Watcher类
class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    ...
    this.lazy = options.lazy;
    this.dirty = this.lazy;
    // 如果lazy为真，就代表是computed，就默认不取值
    this.value = this.lazy? undefined: this.get();
  }
  // 属性更新会执行这个方法，将dirty变为true
  update() {
    // 如果是计算属性，当属性变化更新就把dirty从新变成true
    if (this.lazy) {
      this.dirty = true;
    }
  }
  // 执行计算属性的取值方法
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
}
// 默认定义了一个属性描述器
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: () => {}
}
// 
function defineComputed(vm. key, userDef) {
  // 处理写法兼容性,判断是函数还是对象
  if(typeof userDef == 'function') {
    // createComputedGetter 处理缓存
    sharedPropertyDefinition.get = createComputedGetter(key);
  }else {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = userDef.set;
  }
  Object.defineProperty(vm, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function () {
    let watcher = this._computedWatchers[key];
    // 用来做缓存的
    if (watcher.dirty) {
      // 执行Watcher类的获取值的方法
      wathcer.evaluate();
      return watcher.value;
    }
  }
}
```

## vue组件间的传值方式以及区别

- props/$emit
  - 父组件向子组件传递数据通过props，子组件传递数据给父组件用$emit触发事件
- $parent/$children
  - 可以在当前组件中获取父组件和子组件的实例
- $attrs/$listeners
  - 跨组件传递
- provide/inject
  - 父组件provide提供变量，这样子组件可以通过inject来注入变量
- $refs
  - 获取当前实例
- event bus
  - 跨组件
- vuex