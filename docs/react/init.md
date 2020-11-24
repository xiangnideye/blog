# 基础

## 什么是JSX

- 是一种JS和HTML混合的语法，将组件的结构、数据、样式等聚合在一起定义组件
- JSX是语法糖，最终会通过babel的转译成createElement语法
- JSX更像JS，里面的很多写法更多是JS写法
- Vue更像HTML，因为Vue用的是模板编译
- React.createElement('h1', null, children') 
  - 第一个参数是标签类型
  - 第二个参数是属性对象
  - 第三个及以后都是儿子们，子元素可以是字符串，也可以是react元素

- React.createElement()返回值 产生一个虚拟DOM、也是react元素；也是普通的JS对象
- react元素是react应用的最小单位
- JSX元素是不可变的，当创建之后就无法改变，如果需要改变就需要调用render方法
- react 可能是一个字符串，也可能是一个函数，也可能是一个类

### JSX表达式
```js
  let element = '<h1>hello</h1>'
  React.render(element, document.getElementById('root'))
```

## JSX执行顺序

- 写代码的时候，编写JSX语法
- webpack编译的时候把JSX转译成createElement();
- 在浏览器中执行的时候，把createElement()执行，得到虚拟DOM，也就是react元素；描述了想在页面上看到的样式
- 通过React.render()把虚拟DOM转化成真实的DOM结构，插入到页面上

## 什么是React.render 

- ReactDOM.render()负责渲染，会把虚拟DOM转换成真实DOM，并且挂载到页面上

```js
1. ReactDOM.render(<h1>第一种写法</h1>, document.getElementById('root'));
2. ReactDOM.render(
    React.createElement('h1', null, '第二种写法'), 
    document.getElementById('root')
  );
```

