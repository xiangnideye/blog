# 内置类型

## extends
> 包含类型
```
  type School<T> = T extends {name: string}? 'name': 'noname'
  T 如果属于key，就走1，否则就走2，类似于JS的三元
```


## exclude
> 排除类型

```
  type MyExclude = Exclude<string | number | boolean, number>
  => type MyExclude = string | boolean

  实现原理：
  type Exclude<T, K> = T extends K? never: T
```

## Extract
> 抽离类型

```
  type MyExtract = Extract<string | numner | boolean, string>
  => type MyExtract = string

  实现原理：
  type Extract<T, K> = K extends T? K: T
``` 

## NonNullable
> 排除null

```
  type MyNonNullable = <string | null>
  => type MyNonNullable = null

  实现原理:
  type NonNullable<T> = T extends null | undefined? never: T
```



## infer
> 推断

## ReturnType
> 获取函数返回值类型

```
  function getSchool() {
    retrun {name:'aa'}
  }
  type MyReturnType = ReturnType<typeof getSchool>
  => {name:'aa'}

  实现原理：
  type ReturnType<T extends (...ars: any[])=>any> = T extneds (...ars: any[])=> infer R? R: any

```

## Parameters
> 推断函数参数类型

```
  function getSchool(a: 1, b: 2) { }
  type MyParameters = Parameters<typeof getSchool>
  => {name:'aa'}

  实现原理：
  type Parameters<T extends (...ars: any[])=>any> = T extneds (...ars: infer P) => any? P: any
```