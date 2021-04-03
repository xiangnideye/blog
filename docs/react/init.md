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

## creatElement

```js
// React
function createElement(type, config, children) {
  let props = {...config};
  // 如果arguments.length > 3 代表有多个儿子，children就是一个数组
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2);
  }
  props.children = children;
  return {
    type,
    props
  }
}
```

## render 

- 把createElement方法得到的虚拟DOM变成真实DOM
- 把虚拟DOM上的属性同步更新到真实DOM上
- 把虚拟DOM的儿子们变成真实DOM挂载到自己身上
- 把自己挂载到容器上 通过appendChild

```js
// 渲染
function render (vdom, container) {
  let dom = createDOM(vdom);
  container.appendChild(dom);
}
// 创建真实DOM
function createDOM (vdom) {
  // 如果vdom是文本或者是数字的话就创建一个文本节点返回
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom);
  }
  let {type, props} = vdom;
  let dom = document.createElement(type);
  updateProps(dom, props);
  if (typeof props.children === 'string' || typeof props.children === 'number') {
    dom.textContent = props.children;
  } else if (typeof props.children === 'object' && props.children.type) {
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {
    props.children.forEach(item => {
      render(item, dom);
    })
  }
  return dom
}

function updateProps (dom, newProps) {
  for (let key in newProps) {
    if (key == 'children') continue
    if (key === 'style') ...
    dom[key] = newProps[key];
  }
}

```

## 组件

- 我们可以很直观的将一个复杂的页面分割成若干个独立组件,每个组件包含自己的逻辑和样式 再将这些独立组件组合完成一个复杂的页面。 这样既减少了逻辑复杂度，又实现了代码的重用
  - 可组合：一个组件可以和其他的组件一起使用或者可以直接嵌套在另一个组件内部
  - 可重用：每个组件都是具有独立功能的，它可以被使用在多个场景中
  - 可维护：每个小的组件仅仅包含自身的逻辑，更容易被理解和维护
- 组件的首字母必须大写，因为react是通过首字母是否大写来区分是原生还是自定义组件
- 组件要先定义，在使用
- 组件要返回并且只能有一个react根元素

### 内部如何区分类组件还是函数组件

- 因为类组件需要继承React.Component。在React.Component中定义一个静态属性 static isReactComponent = true
- 在判断标签类型的时候 typeof type == 'function'的时候在去判断isReactComponent是否存在，来区分是函数组件还是类组件


### 函数式组件

```js
  function Element(props) {
    return <h1>hello {props.name}</h1>
  }

  React.render(<Element name='world'/>, document.getElementById('root))
```

- 函数组件的渲染过程
  - Element 是一个虚拟DOM，type是一个函数
  - type执行，传入props, 得到返回值还是一个虚拟DOM
  - 把最后得到的虚拟DOM传给render函数，得到真实DOM插入到页面中去

### 类组件

- 类组件内部必须要有一个render方法

```js
  class Welcome extends React.Component {
    render(){
      return <h1>Hello, {this.props.name}</h1>;
    }
  }

ReactDOM.render(<Welcome name="zhufeng"/>, document.getElementById('root));
```

- 类组件的渲染过程
  - 先创建类组件的实例
  - 调用实例的render方法得到一个react元素
  - 调用React.render方法得到真实DOM并插入到页面中去

## Ref

- Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素
- 可以使用 ref 去存储 DOM 节点的引用
- 当 ref 属性用于 HTML 元素时，构造函数中使用 React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性

```js
  const ref = React.createRef();
```


