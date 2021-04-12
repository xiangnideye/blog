# EventLoop 事件环
- 事件触发线程
- 有两个队列，一个宏任务队列，一个微任务队列
- 执行顺序是先执行script脚本
    1. 然后清空所有微任务队列
    2. 浏览器渲染
    3. 取出一个宏任务执行，然后重复循环此流程

## 宏任务
- 宿主环境提供的
- 代码从上往下执行，script标签是一个宏任务
- 宏任务会一个一个执行，也就是取出一个宏任务执行，如果产生微任务就清空微任务，如果没有微任务则在从宏任务队列中取出下一个宏任务执行
- ajax, setTimeout, event


## 微任务
- 语言本身提供的
- 微任务每次执行是清空所有微任务队列
- Promise.then, MutationObserve
- 如果微任务执行过程中，产生了微任务则把产生的微任务添加到当前队列最后面，然后清空微任务队列
- 如果遇到await 可以当做把await下面的代码放到 Promise.then中执行。await 后面的代码会立即执行

## 经典列子
```js
    document.body.style.background = 'red';
    console.log(1);
    Promise.resolve().then(() => {
        console.log(2);
        document.body.style.background = 'yellow';
    });
    console.log(3);
    // 输出结果：132，页面始终是黄色。因为页面渲染在清空微任务队列之后执行
```

```js
    1、
    <button>点击</button>
    button.addEventListener('click',()=>{
        console.log('listener1');
        Promise.resolve().then(()=>console.log('micro task1'))
    })
    button.addEventListener('click',()=>{
        console.log('listener2');
        Promise.resolve().then(()=>console.log('micro task2'))
    })
    //  输出结果：1122, 因为事件属于宏任务，宏任务是一个一个执行，所以执行一个宏任务就会清空微任务
    2、
    button.click();
    //  输出结果：1212, 因为这样不属于点击事件了，会把两个方法同时执行，就会先走同步代码，然后再去清空微任务队列
```

```js
    Promise.resolve().then(() => { 
        console.log('Promise1')
        setTimeout(() => {
            console.log('setTimeout2')
        }, 0);
    })
    setTimeout(() => {
        console.log('setTimeout1');
        Promise.resolve().then(() => {
            console.log('Promise2')
        })
    }, 0);
    //  输出结果：1122, 
    // 宏任务队列 [1.setTimeout1, 2.setTimeout2]
    // 微任务队列 [1.Promise1, 2.Promise2]
```

```js
    console.log(1);
    async function async () {
        console.log(2);
        await console.log(3);
        console.log(4)
    }
    setTimeout(() => {
        console.log(5);
    }, 0);
    const promise = new Promise((resolve, reject) => {
        console.log(6);
        resolve(7)
    })
    promise.then(res => {
        console.log(res)
    })
    async (); 
    console.log(8);
    // 输出结果： 1 6 2 3 8 7 4 5
    
```