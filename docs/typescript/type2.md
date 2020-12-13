# 进阶配置

## 断言

## 接口

- 同名的接口可以写多个，类型会自动合并


```js
  interface Speakable {
    name: string;
    speak():void
  }

  let speakMan: Speakable = {
    name: 'zy',
    speak() {}
  }

  // 任意属性
  interface Person {
    name: string,
    [key:string]:any
  }

  let p: Person = {
    name: 'str',
    age: 10
  }
  
  // 接口的继承
  interface b {
    spear(): void
  }

  interface a extends b {
    eat(): void
  }

  class ChineseMan implements a {
    spear(): void {}
    eat(): void {}
  }

  // 函数类型接口
  interface Dis {
    (arg: number): number
  }
  const add = (arg: number):number => return arg

  // 描述构造函数
  interface Dis {
    new(arg: number): number 用来描述类的，也就是构造函数
  }
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