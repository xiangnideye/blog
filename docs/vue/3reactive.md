# 响应式

## reactive、shallowReactive、 readonly、 shawllowReadonly

```js
  // 对象每一层都代理
  let state = reactive({name: 'name', age: 'age'});
  // 只代理第一层对象
  let state = shallowReactive({name: 'name', age: 'age'});
  // 只读，无法修改，对象每一层都代理，每一层都不能修改
  let state = readonly({name: 'name', age: 'age'});
  // 只读，只代理第一层对象，如果是修改非第一层的对象 是可以的
  let state = shallowReactive({name: 'name', age: 'age'});
```

> reactive / createReactive

```js
  const reactiveMap = new WeakMap();
  const readonlyMap = new WeakMap();
  
  function reactive(target) {
    // 创建公共的方法 
    return createReactive(target, false, mutableHandlers)
  };
  /*
    target 目标对象
    isReadonly  是否只读
    baseHandlers 对应的方法
  */
  function createReactive(target, isReadonly, baseHandlers) {
    // proxy 只能代理对象 所以需要判断target是否是对象
    if (isObjecr(target)) { 
      return target 
    };

    // 如果某个对象已经被代理过，就不需要再次代理。 
    const proxyMap = isReadonly? readonlyMap: reactiveMap;
    // 创建新的代理之前看一下之前的map映射中是否存在
    const existProxy = proxyMap.get(target);
    if (existProxy) {
      return existProxy
    }

    // 创建一个proxy对象
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy
  }
```

> mutableHandlers

```js
  function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
    }
  };
  function createSetter(isReadonly = false, shallow = false) {
    return function set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
    }
  };

  const get = createGetter();
  const set = createSetter();
  const mutableHandlers = {
    get,
    set
  };
  function createReactive(target, isReadonly, mutableHandlers);
```


