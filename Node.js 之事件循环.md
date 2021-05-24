### Node.js 之事件循环

#### Node.js 中的事件循环和浏览器中的事件循环的区别？

首先，Node.js 是基于谷歌的 V8 引擎，V8 引擎同时也是 Chrome 浏览器的 JS 引擎。

于是就大概可以猜出来 Node.js 和浏览器中的事件循环大致是一样的；浏览器中的事件循环请参考我的拙文 [事件循环：微任务与宏任务](./事件循环：微任务与宏任务.md)

不同的地方在于 Node.js 中添加了一个特别的 API：```process.nextTick()```。

##### process.nextTick()

> [官方文档解释：](https://nodejs.dev/learn/understanding-process-nexttick)
>
> 当传递一个函数给 process.nextTick() 时，该函数会在当前操作执行完毕以后、在下一次事件循环开始执行以前执行。

也就是说，```process.nextTick()``` 中的函数会在当前这一轮的事件循环执行完毕后执行，试比较与浏览器的事件循环：

**浏览器**：

1. 解析 ```<script> ```  标签，开始执行代码
2. 从上往下依次执行
3. 执行完毕，执行微任务队列（```promise```，```queueMicrotask```）
4. 微任务队列执行完毕
5. 执行下一个宏任务（setTimeout， setInterval，event）
6. 执行完毕，回到第三步

**Node.js**:

1. 从上往下执行当前 js 文件代码
2. 执行完毕，执行微任务队列
3. 执行完毕，执行 process.nextTick() 队列，先进先出
4. 执行完毕，执行下一个宏任务
5. 执行完毕，回到第二步

**以下代码:**

```javascript
console.log('execution');  

process.nextTick(() => {
  console.log("haha");  
})

new Promise(resolve => {
  console.log("execute promise."); 
  resolve();
}).then(res => {
  console.log('promise resolved'); 
  process.nextTick(() => {
    console.log("promise nextTick"); 
  })
  setTimeout(() => {
    console.log("second setTimeout"); 
  }, 0);
  console.log('promise after nextTick');
});

console.log('123'); 

setTimeout(() => {
  console.log("setTimeout"); 
  process.nextTick(() => {
    console.log("setTimeout nextTick"); 
  })
  console.log("setTimeout after nextTick"); 
}, 0);


process.nextTick(() => {
  console.log('nextTick'); 
})

```

上面👆代码执行顺序为：

```javascript
console.log('execution');  // 1

process.nextTick(() => {
  console.log("haha");  // 6
})

new Promise(resolve => {
  console.log("execute promise."); // 2
  resolve();
}).then(res => {
  console.log('promise resolved'); // 4
  process.nextTick(() => {
    console.log("promise nextTick"); // 8
  })
  setTimeout(() => {
    console.log("second setTimeout"); // 12
  }, 0);
  console.log('promise after nextTick'); // 5
});

console.log('123'); // 3

setTimeout(() => {
  console.log("setTimeout"); // 9
  process.nextTick(() => {
    console.log("setTimeout nextTick"); // 11
  })
  console.log("setTimeout after nextTick"); // 10
}, 0);


process.nextTick(() => {
  console.log('nextTick'); // 7
})

```

也就是说，Node.js 中新增加了一个 API，能够在当前代码执行完毕以后，在下一个宏任务开始执行之前执行。

##### setTimeout 和 setImmediate

```setImmediate()``` 是 Node.js 中的一个计时器，它的作用和 setTimeout 类似；

大多数情况下，```setImmediate``` 和 ```setTimeout(fn, 0)``` 的作用是一样的，但是这两个计时器并没有严格的执行顺序，而是取决于各种因素；但是它俩肯定是在 ```process.nextTick()``` 执行完毕以后才执行的。

参考：

> https://nodejs.dev/learn/the-nodejs-event-loop