# 属性和状态

- 属性是外部传入的，props。不能改变，类组件和函数组件都有属性
- 状态是内部产生的，可以改，只有类组件存在
- 唯一能给状态赋值的地方就是构造函数，但只是初始值，如果想修改需要通过setState来修改
- 每当调用setState的时候，都会引起组件的刷新，从新调用一次render方法，得到虚拟DOM，进行DOM Diff
- state的更新可能是异步的
  - 在生命周期或事件处理函数中是批量更新的
  - 在其他地方如定时器中是同步更新的

```js
  class Compon extends React.Component {
    constructor(props) {
      super(props);
      this.props = props;
      this.state = {name: 'hello'}
    }
    change = () => {
      this.setState({name: 'hello world'})
    }
  }
```

## 事件

- 在react中事件处理采用小驼峰，onClick这种方式来定义
- 注意this问题
  - 采用箭头函数的写法 handerClick = () => {}
  - 或者在render中写一个匿名函数
  - bind
  - 如果函数需要传递参数，只能采用匿名函数 onClick = {() => this.handleClick(3)}