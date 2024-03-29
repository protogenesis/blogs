---
title: "Nodejs 之事件循环"
description: "深入理解事件循环，微任务，timer queue，I/O queue，I/O polling，check queue，close queue，nextTick"
author: protogenesis
---

### Node.js 之事件循环与任务队列

#### Node.js 中的事件队列分为以下几种：

|  队列名称   |          举例           |
| :---------: | :---------------------: |
| timer queue | setInterval, setTimeout |
|  I/O queue  |  readFile, createFile   |
| check queue |      setImmediate       |
| close queue |       close event       |

#### Node.js 中微任务队列除了有 `Promise`, 还有 `process.nextTick`

微任务队列分为两种类型：nextTick 队列和 promise 队列

#### Node.js 中的事件循环机制的执行流程是：

如图：

![事件循环机制](./images/nodeJSEventLoop.png)

流程：

1. 执行当前 JS 文件
2. 执行 timer queue
3. 执行微任务队列
   1. 执行 nextTick 队列
   2. 执行 promise 队列 
   3. 检查微任务队列是否执行完毕
   4. 没有执行完毕则继续重复执行微任务队列
   5. 执行完毕
4. 执行 I/O queue
5. 执行微任务队列
   1. 执行 nextTick 队列
   2. 执行 promise 队列 
   3. 检查微任务队列是否执行完毕
   4. 没有执行完毕则继续重复执行微任务队列
   5. 执行完毕
6. 执行 check queue
7. 执行微任务队列
   1. 执行 nextTick 队列
   2. 执行 promise 队列 
   3. 检查微任务队列是否执行完毕
   4. 没有执行完毕则继续重复执行微任务队列
   5. 执行完毕
8. 执行 close queue
9. 执行微任务队列
   1. 执行 nextTick 队列
   2. 执行 promise 队列 
   3. 检查微任务队列是否执行完毕
   4. 没有执行完毕则继续重复执行微任务队列
   5. 执行完毕

#### 代码解释:

##### 没有包含在任何处理函数中的代码最先执行：

```js
 console.log("console.log 1");
 process.nextTick(() => console.log("this is process.nextTick 1"));
 console.log("console.log 2");

/*
console.log 1
console.log 2
this is process.nextTick 1
*/
```

##### 所有的 nextTick 队列都会在 promise 队列前执行

```js
process.nextTick(() => console.log("this is process.nextTick 1"));
process.nextTick(() => {
  console.log("this is process.nextTick 2");
  process.nextTick(() => console.log("this is the inner next tick inside next tick"));
});
process.nextTick(() => console.log("this is process.nextTick 3"))

Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
Promise.resolve().then(() => {
  console.log("this is Promise.resolve 2");
  process.nextTick(() => console.log("this is the inner next tick inside Promise then block")); // promise 队列执行完毕，会检查当前是否还有其他微任务等待执行，nextTick 队列中新加了一个任务，于是继续执行
});
Promise.resolve().then(() => console.log("this is Promise.resolve 3"));

/*
this is process.nextTick 1
this is process.nextTick 2
this is process.nextTick 3
this is the inner next tick inside next tick
this is Promise.resolve 1
this is Promise.resolve 2
this is Promise.resolve 3
this is the inner next tick inside Promise then block
*/
```

##### 当前文件 JS 执行完毕后会执行微任务队列，微任务队列会在其他 queue 之前执行，例如 timer queue 

```js
setTimeout(() => console.log("this is setTimeout 1"), 0)
setTimeout(() => console.log("this is setTimeout 2"), 0)
setTimeout(() => console.log("this is setTimeout 3"), 0)

process.nextTick(() => console.log("this is process.nextTick 1"))
process.nextTick(() => {
  console.log("this is process.nextTick 2")
  process.nextTick(() =>
    console.log("this is the inner next tick inside next tick")
  )
})
process.nextTick(() => console.log("this is process.nextTick 3"))

Promise.resolve().then(() => console.log("this is Promise.resolve 1"))
Promise.resolve().then(() => {
  console.log("this is Promise.resolve 2")
  process.nextTick(() =>
    console.log("this is the inner next tick inside Promise then block")
  )
})
Promise.resolve().then(() => console.log("this is Promise.resolve 3"))

/*
this is process.nextTick 1
this is process.nextTick 2
this is process.nextTick 3
this is the inner next tick inside next tick
this is Promise.resolve 1
this is Promise.resolve 2
this is Promise.resolve 3
this is the inner next tick inside Promise then block
this is setTimeout 1
this is setTimeout 2
this is setTimeout 3
*/
```

#### 微任务队列会在 timer queue 队列执行的间隙执行

```js
setTimeout(() => console.log("this is setTimeout 1"), 0);
setTimeout(() => {
  console.log("this is setTimeout 2");
  process.nextTick(
    console.log.bind(console, "this is the inner next tick inside setTimeout")
  );
}, 0);
setTimeout(() => console.log("this is setTimeout 3"), 0);

process.nextTick(() => console.log("this is process.nextTick 1"));
process.nextTick(() => {
  console.log("this is process.nextTick 2");
  process.nextTick(
    console.log.bind(console, "this is the inner next tick inside next tick")
  );
});
process.nextTick(() => console.log("this is process.nextTick 3"));

Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
Promise.resolve().then(() => {
  console.log("this is Promise.resolve 2");
  process.nextTick(
    console.log.bind(
      console,
      "this is the inner next tick inside Promise then block"
    )
  );
});
Promise.resolve().then(() => console.log("this is Promise.resolve 3"));

/*
this is process.nextTick 1
this is process.nextTick 2
this is process.nextTick 3
this is the inner next tick inside next tick
this is Promise.resolve 1
this is Promise.resolve 2
this is Promise.resolve 3
this is the inner next tick inside Promise then block
this is setTimeout 1
this is setTimeout 2
this is the inner next tick inside setTimeout
this is setTimeout 3
*/
```

##### timer queue 按照先进先出（First in first out）的顺序执行

```js
setTimeout(() => console.log("this is setTimeout 1"), 1000);
setTimeout(() => console.log("this is setTimeout 2"), 500);
setTimeout(() => console.log("this is setTimeout 3"), 0);


/*
this is setTimeout 3
this is setTimeout 2
this is setTimeout 1
*/
```

##### 微任务队列在 I/O queue 队列前执行

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));


/*
this is process.nextTick 1
this is Promise.resolve 1
this is readFile 1
*/
```

##### 零秒延迟的 timer 执行顺序无法保证

```js
const fs = require("fs");

setTimeout(() => console.log("this is setTimeout 1"), 0);

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});

/*
this is setTimeout 1
this is readFile 1

或者 

this is readFile 1
this is setTimeout 1

输出结果取决于当前设备配置，如果当前文件 JS 代码执行完毕以后，setTimeout 的 0 秒延迟还有没到的话，此时 timer queue 队列为空，于是执行 I/O 队列。
*/
```

##### I/O 队列执行顺序在微任务队列和 timer 函数之后执行

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);
// for 循环执行完毕以后，setTimeout 的 0 秒延迟已经达到，所以 timer queue 中会存在对应函数
for (let i = 0; i < 1000000000; i++) {}

/*
this is process.nextTick 1
this is Promise.resolve 1
this is setTimeout 1
this is readFile 1
*/
```

##### I/O 事件进在 I/O Polling 完毕之后才会被添加到 queue 中

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);
// I/O polling 之后，会执行 check queue
// I/O polling 之后，I/O queue 中才会有对应的函数，该函数需要等到下一次迭代才会执行，在当前代码中，则会在 check queue 之后才执行
setImmediate(() => console.log("this is setImmediate 1")); 

for (let i = 0; i < 2000000000; i++) {}

/*
this is process.nextTick 1
this is Promise.resolve 1
this is setTimeout 1
this is setImmediate 1
this is readFile 1
*/
```

##### check queue 最后执行

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
  setImmediate(() => console.log("this is inner setImmediate inside readFile"));
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);

for (let i = 0; i < 2000000000; i++) {}

/*
this is process.nextTick 1
this is Promise.resolve 1
this is setTimeout 1
this is readFile 1
this is inner setImmediate inside readFile
*/
```

##### 微任务队列在 I/O callback 执行完毕以后、check callback 执行之前执行

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
  setImmediate(() => console.log("this is inner setImmediate inside readFile"));
  process.nextTick(() => console.log("this is inner process.nextTick inside readFile"));
  Promise.resolve().then(() => console.log("this is inner Promise.resolve inside readFile"));
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);

for (let i = 0; i < 2000000000; i++) {}

/*
this is process.nextTick 1
this is Promise.resolve 1
this is setTimeout 1
this is readFile 1
this is inner process.nextTick inside readFile
this is inner Promise.resolve inside readFile
this is inner setImmediate inside readFile
*/
```

##### 微任务队列在  check queue 执行中间执行

```js
setImmediate(() => console.log("this is setImmediate 1"));
setImmediate(() => {
  console.log("this is setImmediate 2");
  process.nextTick(() => console.log("this is process.nextTick 1"));
  Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
});
setImmediate(() => console.log("this is setImmediate 3"));

/*
this is setImmediate 1
this is setImmediate 2
this is process.nextTick 1
this is Promise.resolve 1
this is setImmediate 3
*/
```

##### setTimeout 和 setImmediate 的执行顺序无法保证

```js
setTimeout(() => console.log("this is setTimeout 1"), 0);
setImmediate(() => console.log("this is setImmediate 1"));

// 如果需要保证的话，可以通过 for 循环解决
// for (let i = 0; i < 1000000000; i++) {}

/*
this is setTimeout 1
this is setImmediate 1

或者 

this is setImmediate 1
this is setTimeout 1
*/
```

##### Close callbacks 会在其他 queue callbacks 执行完毕后才执行

```js
const fs = require("fs");

const readableStream = fs.createReadStream(__filename);
readableStream.close();

readableStream.on("close", () => {
  console.log("this is from readableStream close event callback");
});
setImmediate(() => console.log("this is setImmediate 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
process.nextTick(() => console.log("this is process.nextTick 1"));

/*
this is process.nextTick 1
this is Promise.resolve 1
this is setTimeout 1 // * 这两个无法保证顺序
this is setImmediate 1 // * 这两个无法保证顺序
this is from readableStream close event callback
*/
```

#### I/O Polling

I/O Polling 指的是读写操作的查询，在使用 readFile 或者 writeFile 等读取操作时，读取是异步的，读取完毕以后 I/O polling 会收到完毕的信号，然后将对应的回调函数添加到 I/O queue 中，相反的，在收到信号之前，不会添加到 I/O queue 中。I/O polling 是在 I/O queue callbacks 和微任务队列执行完毕以后，在 check queue 开始执行之前执行。

#### setTimeout 和 setImmediate

setTimeout 函数 0 秒延迟和 setImmediate 之间的执行顺序无法被保证，取决当当前设备的配置情况。

#### Module Type

需要注意的是，当前代码都是在 ```type: commonjs``` 模式下执行的，如果是在 ES Module 模式下的话，执行顺序会发生改变，因为在 ES Module 下，JS 文件的执行环境发生了变化，每一个 JS 文件都是一个单独的模块，会被包裹到一个 async 函数下面执行

例如：

```js
 console.log("console.log 1");
 process.nextTick(() => console.log("this is process.nextTick 1"));
 console.log("console.log 2");

// 会变成：
async function run() {
	console.log("console.log 1");
	process.nextTick(() => console.log("this is process.nextTick 1"));
	console.log("console.log 2");
}
```

> https://stackoverflow.com/a/76378403

##### Reference:

> https://github.com/gopinav/Nodejs-Tutorials/blob/master/node-fundamentals/event-loop.js
