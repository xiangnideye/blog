# 进阶配置

## 类型别名
- 用来给一个类型起一个新的名字，一般用于联合类型

```js
  type TName = number | string
  let name: TName = 123
```
## 泛型

```js
//  基本用法
  function createList<T>(num: T):T {
    return num
  }
  createList<number>(10)
  <number>会传递给<T>, T相当于是一个变量，接收函数执行的时候传递过来的值，然后函数整体都可以使用这个T
```

### 元组类型

- 元组类型，数量和类型已知的数组
```js
  let arr:[string, number] = ['str', 'number'];
  位置和类型固定
```

### 枚举类型

```js
  // 普通枚举
  enum Gender {
    GIRL,
    BOY
  }
  console.log(Gender[BOY], Gender[0]) // 1, GIRL
  console.log(Gender[GIRL], Gender[1]) // 0, BOY

  // 常量枚举
  const Colors {
    RED,
    YELLOW,
    Blue
  }
  // 不可改变
  console.log(Colors.RED, Colors.YELLOW, Colors.Blue) // 0, 1, 2

  枚举会生成一个对象，常量枚举只有值
```


### never类型

- 代表不会出现的值
- 1. 作为不会返回的函数的返回值

```js
  function err (message:str):never {
    throw new Error('error');
    console.log('err') // 永远也不会执行的代码
  }

  while(true){}
  console.log('start') // 永远也不会执行的代码 
```