# 组件

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


## 函数式组件

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

## 类组件

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