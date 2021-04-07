# 基础
 
## 原始类型
### 布尔类型
```js
  let bol: boolean = true;
```
### 字符串类型
```js
  let str: string = 'str';
```
### 数字类型
```js
  let num: number = 123;
```
### 空值 void
- void代表没有任何类型
- 只能接收null和undefined
- 场景：函数没有返回值
- void 和 never的区别
  - void可以被赋值为null或undefined，never不能包含任何类型
  - 返回类型的为void的函数可以执行，但是never无法正常执行，因为never是永远不

```js
  function greeting(): viod {
    return undefined | ''  // 没有返回值 或者undefined
  }
```
### null和undefined
- 是其他所有类型的子类型
```js
  // 不会报错
  let x: number;
  x = 1;
  x = undefined;
  x = null;

  let y: number | undefined | null;
  y = 1; 
  y = undefined;
  y = null;
```
### Symbol类型

- 需要在tsconfig.json中配置 'lib': ["ESNext"] ESNext:代表最新版

```js
  let symbolA = Symbol('key');
  let symbolB = Symbol('key');
  console.log(symbolA === symbolB)  // false
```
### BigInt类型

```js
  const max = Number.MAX_SAFE_INTEGER;
  console.log(max + 1 === max + 2) // true;

  BigInt只能和BigInt相加 
  const maxB = BigInt(Number.MAX_SAFE_INTEGER)
  console.log(max + BigInt(1) === max + BigInt(2)) // false;
```

## 任意类型
- 如果变量定义为any类型，相当于和JS一样，不会进行类型检查
- 如果是any类型，在赋值的过程中可以任意改变类型
- 声明一个变量为任意类型之后，对它的任何操作，返回的内容的类型都是任意值

```js
  let arr:any = 1; // 可以代表任意类型
  arr = 'str'
  arr = []
```

## 类型推论
- 如果没有明确指定类型，那么ts会依照类型推论的规则推断出一个类型
- （如果是原始类型会推断，如果是复杂类型好像就是any类型）

## 联合类型
- 表示取值可以为多种类型的一种
- 联合类型的变量被赋值的时候，会根据类型推论的规则推断出一个类型

```
  let state = number | string | boolean;
  代表了state可以是number类型或者string类型或者boolean类型的任意一种
```

## 对象类型-接口
- 使用interface来定义接口
- 变量类型如果是定义好了的接口类型，则多一个属性或者少一些属性是不允许的，赋值的时候变量的形状必须和接口的形状保持一致
- 接口可以继承另一个接口

```
  interface Person {
    name: string;
    age: number;
  }

  let tom: Person = {
      name: 'Tom',
      age: 25
  };
  // 任意属性
  interface Person {
    name: string,
    [key:string]: any
  }
  interface a extends b {
    eat(): void
  }
```
定义了一个接口Person，然后声明了一个对象tom，它的类型是Person，这样我们就约束了tom的形状必须和接口的一致

### 可选属性
- 如果希望不要完全匹配一个形状，可以采用可选属性
- 可选属性通过?来表示，代表可有可无
- 但是不能增加接口没定义的属性

```
  interface Person {
    name: string;
    age?: number;
  }

  let tom: Person = {
      name: 'Tom'
  };
```

### 任意属性
- 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集

```
  interface Person {
    name: string;
    age?: number;
    [propName: string]: string
  }

  let tom: Person = {
      name: 'Tom',
      status: 'happy'
  };
```

### 只读属性
- 只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候

```
  interface Person {
    readonly name: string;
  }

  let tom: Person {};
  tom.name = 'xxx';
  // 报错 不允许 因为id是只读属性
```

## 数组类型
- 可以采用类型+[]来表示，这样表示数组中每一项都是数字
- 可以采用泛型传入
- 可以用接口表示数组

```js
  let arr: number[] = [1, 2, 3];
  let arr: Array<number> = [1, 2, 3];
  interface IArray {
    [index: number]: number
  }
```

## 函数类型
- 在JS中，函数有两种定义方式，函数表达式和函数声明
- 一个函数有输入和输出，要在TS中对其进行约束，需要把输入和输出都考虑到

### 函数声明
```js
  // 定义好入参和返回值，输入多余或者少输入都是不被允许的
  function hello(name: string): void {}
```

### 函数表达式
- 需要对函数的左边和右边都进行类型定义

```js
  // 1
  type GetName = (firstName:string, lastName: string) => string;
  let getName: GetName = function (firstName: string, lastName: string): string {
    return firstname + lastName
  }

  // 2
  let getName: (firstName:string, lastName: string) => string = function (firstName: string, lastName: string): string {
    return firstname + lastName
  }
```

### 接口来定义函数形状
-采用函数表达式|接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。

```js
 interface IFun {
   (name: string): string
 }

 let fun: IFun = function (name: string): string {
   return name
 }
```

### 函数重载
- 重载允许一个函数接受不同的数量或类型的参数时，做出不同的处理
- 如果没有重载，返回值则是string | number，并不是单一类型

```js
  function reverse(x: number): number;
  function reverse(x: string): string;
  function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return number
    } else if (typeof x === 'string') {
        return string
    }
  }
```

## 类型断言
- 当TypeScript不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型中共有的属性或方法

```js
  let name:string | number;
  console.log((name as number).toFixed(2)); // 断言name是number
  // 双重断言
  (name as any as boolean)
  name!.toString(); 非空断言！代表了不为空
  name?.toString(); name && name.toString(); 并且的意思
```

## 声明文件

declare var 声明全局变量
declare function 声明全局方法
declare class 声明全局类
declare enum 声明全局枚举类型
declare namespace 声明（含有子属性的）全局对象
interface 和 type 声明全局类型

```js
  declare var jQuery: (selector: string) => any;
```

## 内置类型

- HTMLElement 是TypeScript内置的类型
```js
  let element:HTMLElement = document.getelementById('root');
```


