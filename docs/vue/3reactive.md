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
      const res = Reflect.get(target, key, receiver);
      if (!isReadonly) {         // 如果不是只读属性，就需要收集依赖，等数据变化之后更新对应的视图
        track(target, 'get' key);     // 依赖收集  （具体函数在下面effect中写）
      }
    }
  };
  function createSetter(isReadonly = false, shallow = false) {
    return function set(target, key, value, receiver) {
      const oldValue = target[key];
      let hadkey = isArray(target) && isIntergetKey(key)? Number(key) < target.length: hasOwn(target, key);

      const res = Reflect.set(target, key, value, receiver)
      const trigger = function (target, type, key, newVal, oldVal) {
        const depsMap = targetMap.get(target);
        if (!depsMap) return

        const add = (effectsAdd) => {
          if (effectsAdd) {
            effectsAdd.forEach(effect => effects.add(effect))
          }
        }

        const effects = new Set();
        if (key === 'length' && isArray(targey)) {
          depsMap.forEach((dep, key) => {
            if(key === 'length' || key > newValue) {
              add(dep)
            }
          })
        } else {
          // 对象
          if (key !== undefined) {    // 这里是修改
            add(depsMap.get(key))
          }
        }
        effects.forEach(effect => effect())

      }
      if (!hadKey) {    // 新增
        trigger(target, 'add', key, value)
      } else if (hasChanged(oldValue, value)) {   // 修改
        trigger(target, 'set', key, value, oldValue)
      }
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

## effect

类似于watcher, 当时在effect中取值的时候将数据存起来，当存储的数据发生变化的时候就再次执行这个effect函数

1. effect 中所有的属性都会收集effect
2. 当这个属性值发生变化的时候，都会从新执行effect

```js
  function effect (fn, options = {}) {
    const effect = createReactiveEffect(fn, options);
    effect();
    return effect
  }

  let uid = 0;
  let activeEffect;
  const effectStack = [];   // 模拟栈保证effect取值正确
  function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
      if (!effectStack.includes(effect)) {    // 保证effect没有加入到栈中。避免重复一直执行
        try {
          effectStack.push(effect)
          activeEffect = effect;
          return fn();
        } finally {
          effectStack.pop();
          activeEffect = effectStack[effectStack.length - 1];
        }
      }
    }
    effect.uid = uid++;         // 唯一标识
    effect._isEffect = true;    // 用户表示这个是响应式effect
    effect.raw = fn;            // 保留原函数
    effect.options = options;   // 保留原选项
    return effect
  }
  const targetMap = new WeakMap();

  function track(target, type, key) {
    if (activeEffect === undefined) {   // 如果没有在effect中使用的属性就不需要收集
      return 
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      target.set(target, (depsMap = new Map))
    }
    let dep = depMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set))
    };
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect)
    }
  }
```

## ref

可以让普通值变成响应式，本质就是通过Object.defineprototype来代理，因为proxy不能代理普通值

```js
class RefImpl () {
  public _value;
  public _v_isRef = true;
  constrcuter(public rawValue) {
    this._value = rawValue
  }
  get value() {
    trach(this, 'get', 'value')
    return this._value
  }
  set value(newValue) {
    if (newValue !== this.rawValue) {
      this._value = newValue;
      this.rawValue = newValue;
      tigger(this, 'set', 'value', newValue)
    }
  }
}

function ref (value) {
  return new RefImpl(value)
}
```