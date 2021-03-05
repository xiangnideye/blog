# Vue核心源码浅析

## $options

- 通过this.$options可以获取用户传入的所有属性
- 在vue初始化new的时候在实例上绑定了一个$options; 可以用来获取用户设置的data, watch, computed等；

```js
  const vm = new Vue({
    data() {
      return {}
    },
    watch: {},
    computed: {}
  });

  Vue.prototype._init = function (options) {
    const vm = this;
    this.$options = options;
  }
```

## 对象数据拦截/双向绑定

> 在Vue2中，对象是通过Object.defineProperty进行对数据的拦截

- 初始化数据 也就是获取用户定义的data
- 判断data是函数还是对象
  1. 如果是函数，则执行data获取返回值，如果是对象，则直接用
  2. 给实例上赋值一个_data，因为这样可以通过this._data来拿到劫持后的数据
  3. 通过Objcet.defineProperty来对this._data进行一层代理, 因为我们平时是直接this.name获取数据，并不是通过this._data.name来获取的数据
- 对data对象进行观测
  1. 判断对象里面是否还有对象，如果还有对象，则进行递归观测
  2. 判断如果给data里的值设置了一个新的对象，则对新的对象进行递归观测

```js
  // 初始化数据
  function initData(vm) {
    // 获取用户传入data
    let data = vm.$options.data; 
    // 拿到data对象，并且给实例添加_data
    data = vm._data = typeof data == 'function'? data.call(vm): data; 

    // 自定义的proxy函数，对_data进行代理
    for(let key in data) {
      proxy(vm, '_data', data[key]);
    }

    // 观测数据
    observe(data) 
  }

  // _data 数据代理
  function proxy(vm, key, value) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[key][value]; // => vm._data.name
      },
      set(newVal) {
        vm[key][value] = newVal;
      }
    })
  }

  // 对数据进行观测
  function observe(data) {
    // 只对对象进行操作
    if (typeof data !== 'object' || data == null) return 

    // 通过类来实现对数据的观测。 类方便扩展，会产生实例
    return new Observer(data);
  }

  // 观测数据，区分对象和数组
  class Observer {
    constructor(value) {
      // 如果是对象，需要对value属性从新定义
      this.walk(value);
    }
    walk(data) {
      // 拿到对象中的所有key，然后用defineProperty定义成响应式
      Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key])
      })
    }
  }

  // 通过defineProperty定义成响应式
  function defineReactive(data, key, value) {
    // 如果value还是对象的情况，则递归观测是否对象里面还存在对象
    observe(value);

    Object.defineProperty(data, key, {
      get() {
        return value
      },
      set(newVal) {
        if (newVal === value) return
        // 如果用户对原有值赋值了一个新的对象，也需要对新设置的对象里面所有的属性进行拦截
        observe(newVal);
        value = newVal
      }
    }) 
  }
```

## 数组数据拦截/双向绑定

> 在Vue2中，数组不通过Object.defineProperty来定义

- 数组不通过Object.defineProperty来定义
  1. 因为数组里面可能有很多数据，如果给每一项从新定义，十分浪费性能
  2. 如果是通过length改变数据是没有监听的
- 从写了数组的7个方法
  1. 为什么是7个方法，因为只有这7个方法可以改变原数组，也就是原数据发生了变化，才会更新视图
- 如果数组里面有对象类型，也需要监听
  1. 监听的是数组里原有的对象，如果是新增的对象通过push等方法加入的不在这处理
  2. 如果是添加对象或者属性，则判断方法是否为push,unshift,splice三个方法，然后通过Observer类的observeArray方法来监听新增的属性是不是对象
  3. 但是observeArray是在类中，为了获取observeArray方法，所以给value属性加了一个_ob_属性，值为this，这里的this是Observer类；当value调用push方法的时候，this是value，所以能拿到observeArray这个函数
  4. 在观测的时候会判断要观测的属性是否有_ob_属性，如果有，就代表被观测过了，就不需要再次观测了


```js
class Observer {
  constructor(value) {

    // 给value自定义一个属性ob等于当前类
    Object.defineProperty(value, '_ob_', {
      value: this,
      enumerable: false, // 不可被枚举。就是不能被循环出来
      configurable: false // 不能删除此属性
    });

    // value 可能是对象，也可能是数组
    if (Array.isArray(value)) {
      // 当value是数组的时候，把数组的原型链指向我们自己写的原型
      value.__proto__ = arrayMethods;
      // 监听数组里面的每一项，如果有对象类型的，也需要监听，但是指的是数组原有的对象
      this.observeArray(value);
    } else {
      // 是对象，通过Object.defineProperty来定义
      this.walk(value)
    }
    observeArray(value) {
      for (let i = 0; i< value.length; i++) {
        observe(value[i]);
      }
    }
  }
}

// 对数据进行观测
function observe(data) {
  // 只对对象进行操作
  if (typeof data !== 'object' || data == null) return 

  // 如果data有_ob_有属性，就代表观测过了，就不再观测了，节约性能
  if (data._ob_) return 

  // 通过类来实现对数据的观测。 类方便扩展，会产生实例
  return new Observer(data);
}

// 不能直接修改数组原有方法,所以创建一个新的对象可以通过__proto__找到数组原型
let oldArrayProtoMethods = Array.prototype;
let arrayMethods = Object.create(Array.prototype);
let methods = ['push', 'shift', 'pop', 'unshift', 'sort', 'reverse', 'splice'];

methods.forEach(method => {
  // 利用切片编程（AOP），重写了数组的7个方法
  arrayMethods[method] = function(...args) {
    let result = oldArrayProtoMethods[method].call(this, ...args);
    // 用户传入的参数也有可能是对象格式的，所以也需要进行检测。
    let inserted;
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2)
    };

    // 如果inserted有值，就调用observeArray这个方法
    if (inserted) {
      // 这里的this就是外面的value，value身上有一个自定义属性_ob_,值是Observe类
      this._ob_.observeArray(inserted);
    }

    // 返回数组原有方法执行后的返回值
    return result 
  }
})
```

## 模板编译

- 需要获取模板生成一个render方法
  1. 先获取真实的DOM结构，并且判断用户是否写了render方法或者template模板，如果都没有则取el的outerHTML；因为outerHTML会包含外层结构
  2. 根据模板通过正则来匹配标签。匹配开始标签，匹配属性，样式，文本，和结束标签
  3. 匹配到标签之后，把原有的模板字符串删除相应匹配标签的长度，当结束之后就能获取到所有的开始标签，结束标签，文本标签
  4. 根据得到的标签来创建AST语法树
- 通过获取的AST语法树来生成render函数中的return返回值
  1. _c是创建元素，_s表示字符串， _v表示文本
  2. 通过with语法，指定当前实例为render函数中的作用域，这样获取变量的的时候会去实例上获取
  3. 通过new Function把生成的code代码字符串编译成函数执行，得到render函数
- 获取render方法的返回值，就是虚拟DOM
- 根据虚拟DOM生成真实DOM

### 1. 初始化AST语法树

```js
// 初始化函数
function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    // 判断用户是否定义了$el属性。如果有就挂载到这个DOM节点上
    if (vm.$options.$el) {
      vm.$mount(vm.$options.$el);
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    // 先获取真实DOM节点，因为$el: '#app'
    vm.$options.el = el = document.querySelect(el);
    // 判断用户是否自己写了render方法
    if(!options.render) {
      let template = options.template;
      // 判断是否写了template属性和DOM节点是否存在
      if (!template && el) {
        template = el.outerHTML;
      }
      // 编译模板生成render函数
      const render = compileToFunctions(template);
      options.render = render;
    }
  }
}

// 创建AST语法树
function createASTElement(tag, attrs) ...

// 解析模板
parseHTML(html) {
  // 生成一个根节点
  let root; 
  // TODO root会在这里赋值
  root = ;
  return root
}

// 编译模板生成rende函数
function compileToFunctions(template) {
  // 生成AST语法树
  const ast = parseHTML(template);
  // 根据AST语法树生成render函数
  let code = generate(ast);
}
```

### 2. 根据AST语法树生成render函数

- JSON.stringifg是用来生成字符串的。

```js
// 匹配{{}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 编译模板生成rende函数
function compileToFunctions(template) {
  // 生成AST语法树
  const ast = parseHTML(template);
  // 根据AST语法树生成render返回值的字符串
  let code = generate(ast);
  // render函数中的{{name}}需要用with指定作用域vue实例上获取
  let render = `with(this){return ${code}}`;
  // 通过new Function把字符串转成render函数
  let fn = new Function(render);
  return fn
}

// 生成元素
function generate(el) {
  let chilren = genChildren(el);
  // _c 创建元素
  let code = `_c('${el.tag}', ${
    el.attrs.length? genProps(el.attrs): 'undefined'
  } ${
    children? (',' + children): ''
  })`;

  return code
}

// 生成孩子
function genChildren() {
  const chilren = el.children;
  if(chilren) {
    return children.map(child => gen(child).join(','));
  }
}

// 生成元素或者文本
function gen(node) {
  // type == 1代表是元素。
  if(node.type == 1) {
    return generate(node)
  }else {
    let text = node.text;
    // 如果是{{}}文本
    if(defaultTagRE.test(text)) {
      let tokens = [];
      let match;
      while(match = defaultTagRE.exec(text)) ...
      return `_v(${tokens.join('+')})`;
    }else {
      // 普通文本
      return `_v(${JSON.stringify(text)})`;
    }   
  }
} 

// 生成属性
function genProps(attrs) {
  let str = '';
  for (let i = 0; i<attrs.length; i++) {
    let attr = attrs[i];
    // 处理如果属性是style
    if(attr.name == 'style') {
      let obj = {};
      // style="color: red; xxx: xxx;"
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value; 
      })
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.vlaue)},`;
  }
  return `${str.slice(0, -1)}`
}

```

### 3. 生成虚拟DOM

```js
// 组件挂载， vm是实例，el是要挂载的真实DOM结构
function mountComponent(vm, el) {
  let updateComponent = () => {
    // vm._render() 获取虚拟节点 vm._update() 用来更新
    vm._update(vm._render());
  };
  updateComponent();
};

Vue.prototype._render = function () {
  const vm = this;
  let render = vm.$options.render;
  let code = render.call(vm); // 调用render方法获取虚拟节点
  return code;
};

// 创建元素虚拟节点
Vue.prototype._c = function(...args) {
  return createElement(...args)
}

// 创建文本虚拟节点
Vue.prototype._v = function(text) {
  return createTextVnode(text)
}

// 转成字符串
Vue.prototype._s = function(val) {
  return val == null? '': (typeof val == 'object')? JSON.stringify(val):val;
}

// 创建元素虚拟节点
function createElement(tag, data = {}, ...children) {
  return vnode(tag, data, data.key, children, undefined)
}
// 创建文本虚拟节点
function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text )
}
function vnode(tag, data, key, children, text) {
  return { tag, data, key, children, text }
}
```

### 4. 虚拟DOM转成真实DOM

- 判断是不是初次渲染
  1. 如果是初次渲染，就用oldVnode获取当前的真实节点和父节点
  2. 根据虚拟DOM生成真实DOM
  3. 把新的真实DOM插入到老的真实DOM的下一个，然后把老的真实DOM删除
- 不是初次渲染就需要进行DOM Diff

```js
Vue.prototype._update = function (vnode) {
  const vm = this;
  // 首次渲染需要用虚拟节点来更新真实DOM元素
  vm.$el = patch(vm.$options.el, vnode); 
}

// 渲染DOM
function patch(oldVnode, vnode) {
  // 判断是不是为真，true就是初次渲染
  const isRealElement = oldVnode.nodeType;
  if(isRealElement) {
    const oldEle = oldVnode;
    const parentEle = oldEle.parentNode;
    // 拿到新的真实DOM结构之后插入到之前节点的下一个，然后把之前的节点删除
    let el = createEle(vnode);
    parentEle.insertBefore(el, oldEle.nextSibling);
    parentEle.removeChild(oldEle);
    return el
  }else {
    // diff算法
  }
}

// 根据虚拟DOM生成真实DOM结构
function createEle(vnode) {
  let {tag, children, key, data, text } = vnode;
  if(tag == 'string') {
    // 给虚拟DOM上增加一个el属性，值是对应的真实DOM
    vnode.el = document.createElement(tag);
    children.forEach(child => {
      vnode.el.appendChild(createEle(child));
    })
  }else {
    // 如果是文本节点
    vnode.el = document.createTextNode(text);
  }
  return vnode.el
}
```


## 依赖收集

- 什么是依赖收集
  1. 当用户更改了data中的数据，希望页面可以自动更新修改的数据
  2. 当属性取值的时候，需要记住渲染watcher，当set改变值的时候，去执行记住的渲染watcher
  3. 如何记住当前watcher呢，创建一个全局变量上Dep，放到Dep上面
- vue是通过watcher来进行渲染的。叫渲染watcher，每一个组件都有一个watcher
  1. watcher有4个参数；1.当前实例；2.执行的函数；3.执行完成后的回调方法；4.代表是渲染watcher
  2. watcher有一个get方法，默认执行
  3. 有一个update方法，在set的时候，会让Dep通知记录的wathcer执行update方法

### 对象的依赖收集

```js
function mountComponent(vm, el) {
  let updateComponent = () => {
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, () => {}, true)
};

class Watcher {
  constructor (vm, exprOrFn, cb, options) {
    // 函数执行的时候会调用对象的取值方法，走到了defineReaction中
    this.getter = exprOrFn;
    this.get();
    this.deps = [];
  }
  // 这个方法中会对属性进行取值
  get() {
    // this指的当前watcher
    pushTarget(this);
    // 取值操作的时候 拿到Dep.target,因为这个时候Dep.target已经赋值了
    this.getter();
    // 取值之后，Dep.target重新置为null
    popTarget();
  }
  // 更新当前页面
  update() {
    this.get();
  }
  addDep(dep) {
    // 应该有去重操作！如果多个属性对应的是相同watcher，只记录一个。这里就不做记录了！
    this.deps.push(dep);
    // dep记录watcher
    dep.addSub(this);
  }
}

class Dep {
  constructor() {
    // 属性需要记住watcher
    this.subs = [];
  }
  depend () {
    // watcher记住dep,this是Dep; Dep.target存的是watcher
    Dep.target.addDep(this)
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(wathcer => wathcer.update())
  }
}
// 全局变量用来 记住对应的watcher
Dep.target = null;

function pushTarget(watcher) {
  Dep.target = watcher;
}
function popTarget() {
  Dep.target = null;
}

// 取值的时候
function defineReactive(data, key, value) {
  // 每次都会给属性创建一个dep
  let dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      if(Dep.target) {
        dep.depend();
      }
      return value
    },
    set(newVal) {
      if (newVal === value) return
      observe(newVal);
      value = newVal;
      // 取值的时候通知wathcer刚更新
      dep.notify();
    }
  }) 
}
```

### 数组的依赖收集

- value可能是对象也可能是数组
- 在Observer中new Dep是给数组或者对象增加Dep
- 在defineReactive中new Dep是给属性增加的Dep

```js
class Observer {
  constructor(value) {
    // 给对象或者数组加一个属性是dep，但是只有数组去用
    this.dep = new Dep();
  }
}
function defineReactive(data, key, value) {
  // childOb就是Observer类的实例，上面已经定义了一个dep属性
  let childOb = observe(value);
  Object.defineProperty(data, key, {
    get() {
      if(childOb){
        // 如果childOb有值，就让它收集对应的watcher。childOb可能是对象，也可能是数组，这里暂时把它当做数组
        childOb.dep.depend();
        if(Array.isArray(value)) {
          dependArray(value)
        }
      }
    }
  })
}
// 数组的数据拦截中, 当数组更新的时候，去通知dep更新watcher
this._ob_.dep.notifly();
// 如果数组里面还是数组，则需要让里面的数组收集外层数组的依赖，这样修改里层的数组也可以更新
function dependArray(value) {
  value.forEach(item => {
    item._ob_ && item._ob_.dep.depend();
    if(Array.isArray(item)) {
      dependArray(item)
    }
  })
}
```

## 批处理/$nextTick

- nextTick里面有兼容性
  1. promise
  2. mutationObserver
  3. setImmdiate
  4. setTimeout

```js
class Wathcer {
  // 当修改数据是，更新视图需要触发
  update() {
    queueWatcher(this)
  }
  run() {
    // 执行vm._update(vm._render());
    this.get();
  }
}

let callbacks = [];
let waiting = false;
let has = {}, queue = [];

// 异步执行调用同时去重
function queueWatcher(watcher) {
  let id = wathcer.id;
  if(has[id] == null) {
    queue.push(wathcer);
    has[id] = true;
    nextTick(flushSchedularQueue)
  }
}

// 调度函数，用来清空队列
function flushSchedularQueue() {
  queue.forEach(item => {
    item.run()
  });
  has = {};
  queue = [];
}

function flushcallbacks() {
  callbacks.forEach(item => {
    item()
  });
  has = {};
  callbacks = [];
  waiting = false;
}

// 异步执行
function nextTick(cb) {
  callbacks.push(cb);
  // 批处理，多次调用nextTick只执行一次promise.resolve.then
  if (!waiting) {
    waiting = true;
    Promise.resolve().then(flushcallbacks)
  }
}
```

## 生命周期/组件的合并策略

- 混入用来给全局Vue增加自定义方法或者属性
- 合并策略
  1. 父亲有值，儿子有值，就用儿子的
  2. 父亲有值，儿子没有，就用父亲的

### 生命周期的合并 

```js
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'create',
  'beforeMount',
  'mounted'
  ...
];
const strats = {};
// 生命周期的合并策略
function mergeHook(parentVal, childVal) {
  if(childVal) {
    if(parentVal) {
      return parentVal.push(childVal)
    }else {
      // 如果是第一次，父亲是空，就用数组包上返回，下次父亲就是数组了
      return [childVal]
    }
  }else {
    // 如果儿子没值 就用父亲的
    return parentVal
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
});

// Vue全局API
function initGlobalAPI (Vue) {
  Vue.options = {};
  // 静态方法
  Vue.mixin = function(mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  } 
}

// 合并方法
function mergeOptions (parent, child) {
  const options = {};
  for (let key in parent) {
    mergeField(key);
  }
  for (let key in child) {
    if(!parent.hanOwnProperty(key)) {
      mergeField(key)
    }
  }
  const isObj = (obj) => typeof obj == 'object';

  function mergeField(key) {
    if(strats[key]) {
      return options[key]= strats[key](parent[key],child[key])
    }
    // 如果都是对象
    if(isObj(parent[key]) && isObj(child[key])) {
      options[key] = {...parent[key], ...child[key]};
    }else {
      // 如果儿子有值
      if (child[key]) {
        options[key] = child[key];
      } else {
        options[key] = parent[key];
      }
    }
  }
}
```
 
### 组件的合并

- Vue.component 是通过对象创建一个类，通过这个类创建一个组件去使用
  1. components是内部属性，合并的时候会先找内部的，在合并外部的组件

```js

// 永远指向Vue
Vue.options._base = Vue;
Vue.options.components = {};
Vue.component = function (id, definition) {
  definition.name = definition.name || id;
  definition = this.options._base.extend(definition);
  this.options.components[id] = definition;
}

Vue.extend = function(options) {
  const Super = this; //这里的this指的是Vue
  const Sub = function VueComponent(options) {
    this._init(options);
  };
  Sub.prototype = Object.create(Super.prototype);
  Sub.component = Super.component;
  Sub.options = mergeOptions(Super.options, options )
  return Sub
}

// 组件的合并策略，把父级作为原型链，让组件先找自己的。如果没有在通过原型链向上查找
strats.componets = function (parent, child) {
  const res = Object.create(parent);
  if(child) {
    for(let key in child) {
      res[key] = child[key]
    }
  }
  return res
}
```

## 组件的渲染

- 虚拟DOM生成真实DOM是根据Tag来生成的。但是自定义的组件标签名不是标准的内置标签名
  1. 所以需要判断如果是组件的话，根据里面的内容来生成标签
  2. 调用Vue.extend方法，生成子类的构造函数

```js
// 先判断哪些是正常的内置标签
function makeUp(str){
  const map = {};
  str.split(',').forEach(item => map[item] = true);
  return (tag) => map[tag] || false
}
const isReservedTag = makeUp('a,p,div,li,ul, ...');

function createElement(vm, tag, data = {}, ...children) {
  if(!isReservedTag(tag)) {
    // 返回值有可能是对象，也有可能是函数
    const ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, data.key, children, Ctor)
  }else {...}
}

function createElement(vm, tag, data, key, children, Ctor) {
  if(typeof Ctor == 'object') {
    Ctor = vm.$options._base.extend(Ctor);
  }
  data.hook = {
    init(vnode) {
      let child = vnode.componentInstance = new vnode.componentOptions.Ctor({});
      child.$mount();
    };
  };
  return vnode(vm, `vue-componetn-${tag}`, data, key, undefined, undefined, {Ctor})
}
function createComponent(vnode) {
  let i = vnode.data;
  if ((i = i.hook) && (i = i.init)) {
    // 调用组件的初始化方法
    i(vnode);
  }
}
function createElm(vnode) {
  if(tag == 'string') {
    // 如果返回true,就代表是组件，就将组件渲染后的真实元素返回
    if(createComponent(vnode)) {
      return vnode.componentInstance.$el;
    }
  }
}
```

## DOM Diff

- DOM都是平级比对。一层一层比对
- 两个虚拟节点进行比对
  1. 先比较标签，如果标签不一样，就把老的标签换成新标签(真实DOM的操作)
  2. 标签相同，文本不同，替换文本
  3. 比较属性 
- 对儿子进行比较
  1. 老的有儿子，新的也有儿子。进行比较
  2. 老的有，新的无，删除老的
  3. 老的没有，新的有，在老节点上增加新的儿子

```js
// 先比较标签，如果标签不一样，就把老的标签换成新标签  el上是真实DOM
if(oldVnode.tag !== vnode.tag) {
  return oldVnode.el.parentNode.repleaceChild(createElm(vnode), oldVnode.el);
}
// 标签相同，文本不同，替换文本
if(!oldVnode.tag){
  if(oldVnode.text !== vnode.text) {
    return oldVnode.el.textContent = vnode.text;
  }
}
// 
let oldChildren = oldVnode.children || [];
let newChildren = vnode.childrem || [];
let el = vnode.el = oldVnode.el;
// 比较属性
updateProperties(vnode, oldVnode);

if(oldChildren.length > 0 && newChildren.length > 0) {
  updateChildren(el, oldChildren, newChildren)
}else if(oldChildren.length > 0) {
  el.innerHTML = '';
}else if(newChildren.length > 0) {
  newChildren.forEach(child => el.appendChild(createElm(child)));
}

function updateProperties(vnode, oldProps = {}) {
  // 老的有属性 新的没有 把老的删除
  for(let key in oldProp) {
    if(!newProps[key]) {
      el.removeAttribute(key)
    }
  }
  // 新的有，老的没有，直接覆盖
  ...
}
```

### diff中的优化策略

- diff比较主要采用双指针的策略
  1. 先是采用了头头，尾尾，头尾，尾头四种方式进行同级比较
  2. 头头，尾尾是指针往后移动；头尾和尾头是把元素向前或者向后插入
  3. 乱序是针对老虚拟DOM有一个映射表。存着节点的KEY和对应的索引，然后拿新节点去映射表里查找，如果没有就创建新的在老的开始的指针，如果有就把老的节点移动，之前的位置放一个null
- 为什么要有key
  1. 因为key是存在一个比较的过程，如果标签一样，key一样，就会认为比较的两个节点是相同的节点，而不是找到真正的两个相同的节点
  2. 如果里面的子节点或者文本不同就会创建新的文本或者子节点。而不是移动复用

```js
function isSameVnode(oldV, newV) {
  return (oldV.tag == newV.tag) && (oldV.key == newV.key)
}
function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let oldEndIndex = oldChildren.length - 1;
  let oldStartVnode = oldChildren[0];
  let oldEndVnode = oldChildren[oldEndIndex];
  let newStartIndex = 0;
  let newEndIndex = newChildren.length - 1;
  let newStartVnode = newChildren[0];
  let newEndVnode = newChildren[newEndIndex];

  let map = markIndexByKey(oldChildren);
  function markIndexByKey(oldChildren) {
    let map = {};
    oldChildren.forEach((item, index) => {
      map[item.key] = index
    })
  }

  whild(oldStartIndex <= oldEndIndex && newEndIndex <= newEndIndex) {
    if(!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    }else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    }else if(isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    }else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode);
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    }else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    }else {
      let moveIndex = map[newStartVnode.key];
      // 如果没有找到 创建新的节点插入到老节点的第一个的前面
      if(moveIndex != undefined) {
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      }else {
        let moveVnode = oldChildren[moveIndex];
        oldChildren[moveIndex] = null;
        patch(moveVnode, newStartVnode);
        parent.insertBefore(moveVnode.el, oldStartVnode.el);
      }
      newStartVnode = newChildren[++newStateIndex];
    }
  }
  if(newStartIndex <= newEndIndex) {
    for(let i = newStartIndex; i<= newEndIndex; i++) {
      let nextEle = newChildren[newEndIndex + 1] == null? null: newChildren[newEndIndex + 1].el;
      parent.insertBefore(createElm(newChildren[i]))
    })
  }
  if(oldStartIndex <= oldEndIndex) {
    for(let i = oldStartIndexl i<= oldEndIndex; i++) {
      let child = oldChildren[i];
      if(child != undefined) {
        parent.removeChild(child.el)
      }
    }
  }

}
```


