# 常见问题

## 如何处理CSS 0.5px边框
采用transform的scale让元素整体缩小一倍
```
  .box {
    position: relative;
  }
  .box::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    transform: scale(.5);
    transform-origin: left top;
    box-sizing: border-box;
    border: 1px solid black;
  }
```

## CSS优先级
什么是CSS优先级？优先级就是分配给指定的CSS声明的一个权重，它由匹配的选择器中的每一种选择器类型的数值决定。  
CSS优先级： 行内样式 > 内联样式 > 外链样式 
```
1. <div style=""></div>
2. <style></style>
3. link
```
**选择器优先级： !important > #id > 类选择器 || 属性选择器 || 伪类选择器 > 元素选择器**  

>标签：1   
类名 || 属性 || 伪类： 10  
id选择器： 100  
行内样式: 1000  
!important: 10000  

## 过渡 transtion

## 变形 transform