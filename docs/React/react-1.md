## react

### JSX语法
```
1. ReactDOM.render(<h1>第一种写法</h1>, document.getElementById('root'));
2. ReactDOM.render(
    React.createElement('h1', null, '第二种写法'), 
    document.getElementById('root')
  );
```
1. React.createElement()返回值 产生一个虚拟DOM；也是react元素；也是普通的JS对象；
2. ReactDOM.render()会把虚拟DOM转换成真实DOM；并且挂载到页面上；


### 函数式组件
```
  function Hello() {
    return (
      <h1>hello</h1>
    )
  }
  ReactDOM.render(<Hello />, root)
```
