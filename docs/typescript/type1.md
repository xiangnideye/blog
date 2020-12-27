# 基本类型
 
## 布尔类型

```js
  let bol:boolean = true;
```

## 字符串类型

```js
  let str:string = 'str';
```

## 数字类型

```js
  let num:number = 123;
```

## 数组类型

```js
  let arr:Array<number> = [1, 2, 3];
  let arr:number[] = [1, 2, 3];
```

## 元组类型

- 元组类型，数量和类型已知的数组
```js
  let arr:[string, number] = ['str', 'number'];
  位置和类型固定
```

## 枚举类型

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

## any类型

- 如果变量定义为any类型，相当于和JS一样，不会进行类型检查

```js
  let arr:any = 1; // 可以代表任意类型
```

## null和undefined

- 是其他类型的子类型

```js
  let x:number;
  x = 1;
  x = undefined;
  x = null;

  let y: number | undefined | null;
  y = 1; 
  y = undefined;
  y = null;
```

## 内置类型

- HTMLElement 是TypeScript内置的类型
```js
  let element:HTMLElement = document.getelementById('root');
```

## never类型

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

## void

- void代表没有任何类型
- 只能接收null和undefined
- 场景：函数没有返回值
- void 和 never的区别
  - void可以被赋值为null或undefined，never不能包含任何类型
  - 返回类型的为void的函数可以执行，但是never无法正常执行，因为never是永远不

```js
  function greeting():viod {
    return undefined | ''  // 没有返回值 或者undefined
  }
```

## Symbol类型

- 需要在tsconfig.json中配置 'lib': ["ESNext"] ESNext:代表最新版

```js
  let symbolA = Symbol('key');
  let symbolB = Symbol('key');
  console.log(symbolA === symbolB)  // false
```

## BigInt类型

```js
  const max = Number.MAX_SAFE_INTEGER;
  console.log(max + 1 === max + 2) // true;

  BigInt只能和BigInt相加 
  const maxB = BigInt(Number.MAX_SAFE_INTEGER)
  console.log(max + BigInt(1) === max + BigInt(2)) // false;
```

## 联合类型

```js
  let name: string | number = 1;
```

## 类型断言

```js
  let name:string | number;
  console.log((name as number).toFixed(2)); // 断言成number
  双重断言
  (name as any as boolean)
  name!.toString(); 非空断言！代表了不为空
  name?.toString(); name && name.toString(); 并且的意思
```

## 字面量类型和类型字面量

## 函数

```js
  // 函数声明
  function hello(name:string):void {
    
  }
  // 函数表达式
  type GetName = (firstName:string, lastName: string) => string;
  let getName:GetName = function (firstName:string, lastName: string):string {
    return firstname + lastName
  }
  // 可选参数
  function pring(name:string, age?:number):void {

  }
  // 默认参数
  function pring(name:string, age:number = 2):void {

  }
```

