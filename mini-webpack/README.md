## tapable

**同步**:

| 名称 | 解释 |
| --- | --- |
| SyncHook | 同步执行，无需返回值 |
| SyncBailHook | 同步执行，无需返回值，返回undefined终止 |
| SyncWaterfallHook | 同步执行，上一个处理函数的返回值是下一个的输入，返回undefined终止 |
| SyncLoopHook | 同步执行， 订阅的处理函数有一个的返回值不是undefined就一直循环它 |

**异步**

| 名称 | 解释 |
| --- | --- |
| AsyncSeriesHook | 异步执行，无需返回值 |
| AsyncParallelHook | |
| AsyncSeriesBailHook | 异步执行，无需返回值，返回undefined终止 |
| AsyncSeriesWaterfallHook | 异步执行，上一个处理函数的返回值是下一个的输入，返回undefined终止 |

## 参考

[AST（抽象语法树）](https://www.jianshu.com/p/019d449a9282)
