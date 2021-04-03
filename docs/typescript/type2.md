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


## 别名

```js
type Direction = 'up' | 'down' | 'left';
let dir:Direction;
dir = 'up';
```

## 类

- 静态属性
- 私有的实例属性 
- 共享的原型属性  

- public 公共的
- perotected 受保护的 只有父类本身和子类能访问到
- private 只能自己访问

## 装饰器

- 装饰就是扩展属性和方法
- 需要在tsconfig中开启
- 为了装饰类本身，给类扩展方法或属性

```js
function modifier(target:any)...

@modifier
class Person ...
```

## 接口

- 描述对象的形状，根据接口提供一些新的类为别人使用
- interface Ixxx 首字母大写
- 可以描述属性，方法，类
- 可以被实现，被继承

```js
interface IFunllname {
  firstName: string,
  lastName: string
}

const fullName = (obj:IFullname):IFullname => {
  retrun obj
}
```