# mini-react

## diff算法对比策略

- 对比虚拟DOM前后的变化: 不依赖浏览器环境，这样可以用于别的环境，例如native或者node(SSR)
- 对比虚拟DOM和真实DOM: 效率较高，占用的内存更少

## setState

- 异步更新state，将短时间内的多个setState合并成一个
- 为了解决异步更新导致的问题，增加另一种形式的setState：接受一个函数作为参数，在函数中可以得到前一个状态并返回下一个状态

## 参考

[从零开始实现React](https://github.com/hujiulong/blog)
[mini-react](https://github.com/JinJieTan/mini-react/tree/hooks)
