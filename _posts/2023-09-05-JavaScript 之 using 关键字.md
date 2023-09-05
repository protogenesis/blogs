---
title: "JavaScript 之 using 关键字"
not_excerpt: ""
author: protogenesis
---

在 ES2022 中新增了一个提案，它叫 ECMAScript 显式资源管理（ECMAScript Explicit Resource Management），目前是 stage 3 阶段。这个提案的主要内容是新增了一个 `using` 关键字，`using` 关键字的作用是用来定义变量，并且在变量的生命周期中自动释放掉当前变量引用的资源（内存，I/O 等）。例如我们在 Node.js 中会通过 `fs` 来读写文件，使用 using 方法可以在读写完毕后释放对文件的引用。



## 提案主要解决的问题

使用 ```using``` 关键字来使用资源，它会在使用完毕以后（根据 API 的具体场景）自动对资源进行释放。

- 各种不一致的资源管理方式：

  - ECMAScript 的迭代：`iterator.return()`
  - WHATWG stream 的读取: `reader.releaseLock()`
  - NodeJS 文件处理: `handle.close()`
  - Emscripten C++ 处理对象（WebAssembly）: `Module._free(ptr) obj.delete() Module.destroy(obj)`

- 作用域问题

  - ```js
    const handle = ...;
    try {
      ... // ok to use `handle`
    }
    finally {
      handle.close();
    }
        
    handle.doSomething() // handle 已经被 close，但是依旧可以访问到
    ```

- 对多个资源进行管理：

  ```js
  const a = ...;
  const b = ...;
  try {
    ...
  }
  finally {
    a.close(); // 如果 a.close() 依赖于 b.close()，则会有问题
    b.close(); // 如果 a.close() 报错， b.close() 将不执行
  }
  ```



例如在 ECMAScript 的构造器函数中，一般通过 `return` 方法来释放对当前资源的使用：

同步构造器：

```js
function acquireFileHandle() {
  const handle = {
    release() {
      console.log("File handle released");
    }
  };
    
  console.log("File handle acquired");
  return handle;
}

function* g() {
  const handle = acquireFileHandle(); // critical resource
    
  try {
    // ... (perform operations using the file handle)
    yield "Step 1";
    yield "Step 2";
    yield "Step 3";
  } finally {
    handle.release(); // cleanup
  }
}

const obj = g();
try {
  const r = obj.next();
  // ...
}
finally {
  obj.return(); // 执行 g 函数中的 finally 代码
}
```

异步构造器：

```js
function acquireFileHandle() {
  const handle = {
    release() {
      console.log("File handle released");
    }
  };
    
  console.log("File handle acquired");
  return handle;
}

async function * g() {
  const handle = acquireStream(); // critical resource
  try {
    ...
  }
  finally {
    await stream.close(); // cleanup
  }
}
    
const obj = g();
try {
  const r = await obj.next();
  // ...
}
finally {
  await obj.return(); // 执行 g 函数中的 finally 代码
}
```

现在通过 using 关键字，可以简化调用步骤：

```js
// 同步释放
function * g() {
  using handle = acquireFileHandle(); // 块级作用域的资源引用
} // 函数执行完毕后自动释放

{
  using obj = g(); // 块级作用域声明
  const r = obj.next();
} // 执行 g 函数中的 finally 代码
```

```js
// 异步释放
async function * g() {
  using stream = acquireStream(); // 块级作用域的资源引用
  ...
} // 函数执行完毕后自动释放

{
  await using obj = g(); // 块级作用域声明
  const r = await obj.next();
} // 执行 g 函数中的 finally 代码
```



## 声明方式

### `using` 同步释放块级作用域资源 

```js
const getResource = () => {
    return {
      [Symbol.dispose]: () => {
        // dispose
      }
    }
}

using x = getResource()
```

### ```await using```  异步释放块级作用域资源

```js
const getResource = () => {
    return {
      [Symbol.asyncDispose]: async () => {
        // asyncDispose
      }
    }
}

await using x = getResource()
```

###  ```using``` 声明可以出现在以下上下文中：

- JS 模块文件的顶级作用域

- 块级作用域

- 异步函数 （```await using```）

- ```for of``` 和 ```for await of```

  - ```js
    for (await using x of y) ...
    
    for await (await using x of y) ...
    ```

    当 ```await using``` 用在 ```for of``` 的异步上下文中时，可以显示的绑定每一个迭代的值为异步释放，但是 ```for await of``` 这种方式不会把一个同步的 using 转换成异步，因为 ```for of ``` 中的 ```await``` 和 ```await using``` 是两种不同的声明方式，```for await``` 指的是异步迭代，```await using``` 指的是异步释放，例如：

    ```js
    
    // 同步迭代，同步释放（每一次迭代完毕即释放）
    for (using x of y) ; // 在 using 之前没有 await
    
    // 同步迭代，异步释放
    for (await using x of y) ;
    
    // 异步迭代，同步释放
    for await (using x of y) ; 
    
    // 异步迭代，异步释放
    for await (await using x of y) ; 
    ```

    在 ```for of``` 中，使用 ```await``` 进行迭代，即使迭代的值只能被同步迭代，但同样是有效的，这是一种 fallback，例如：

    ```js
    const iter = { [Symbol.iterator]() { return [].values(); } };
    const asyncIter = { [Symbol.asyncIterator]() { return [].values(); } };
    
    for (const x of iter) ; // 有效: `iter` 有 @@iterator 属性
    for (const x of asyncIter) ; // 报错: `asyncIter` 没有 @@iterator 属性
    
    for await (const x of iter) ; // 有效: `iter` 有 @@iterator 属性 (fallback)
    for await (const x of asyncIter) ; // 有效: `asyncIter` 有 @@asyncIterator 属性
    ```

    ```using``` 关键字的表现和 ```iterator``` 一样：

    ```js
    const res = { [Symbol.dispose]() {} };
    const asyncRes = { [Symbol.asyncDispose]() {} };
    
    using x = res; // 有效: `res` 有 @@dispose 属性
    using x = asyncRes; // 报错: `asyncRes` 没有 @@dispose 属性
    
    await using x = res; // 有效: `res` has @@dispose (fallback)
    await using x = asyncres; // 报错: `asyncRes` 有 @@asyncDispose 属性
    ```

    根据 ```await``` 的存在与否，会存在以下各种情况：

    ```js
    const res = { [Symbol.dispose]() {} };
    const asyncRes = { [Symbol.asyncDispose]() {} };
    const iter = { [Symbol.iterator]() { return [res, asyncRes].values(); } };
    const asyncIter = { [Symbol.asyncIterator]() { return [res, asyncRes].values(); } };
    
    for (using x of iter) ;
    // 同步迭代，同步释放
    // - `iter` has @@iterator: ok
    // - `res` has @@dispose: ok
    // - `asyncRes` does not have @@dispose: *error*
    
    for (using x of asyncIter) ;
    // 同步迭代，同步释放
    // - `asyncIter` does not have @@iterator: *error*
    
    for (await using x of iter) ;
    // 同步迭代, 异步释放
    // - `iter` has @@iterator: ok
    // - `res` has @@dispose (fallback): ok
    // - `asyncRes` has @@asyncDispose: ok
    
    for (await using x of asyncIter) ;
    // 同步迭代，异步释放
    // - `asyncIter` does not have @@iterator: error
    
    for await (using x of iter) ;
    // 异步迭代，同步释放
    // - `iter` has @@iterator (fallback): ok
    // - `res` has @@dispose: ok
    // - `asyncRes` does not have @@dispose: error
    
    for await (using x of asyncIter) ;
    // 异步迭代，同步释放
    // - `asyncIter` has @@asyncIterator: ok
    // - `res` has @@dispose: ok
    // - `asyncRes` does not have @@dispose: error
    
    for await (await using x of iter) ;
    // 异步迭代，异步释放
    // - `iter` has @@iterator (fallback): ok
    // - `res` has @@dispose (fallback): ok
    // - `asyncRes` does has @@asyncDispose: ok
    
    for await (await using x of asyncIter) ;
    // 异步迭代，异步释放
    // - `asyncIter` has @@asyncIterator: ok
    // - `res` has @@dispose (fallback): ok
    // - `asyncRes` does has @@asyncDispose: ok
    ```

    表格形式：

    | 语法                             | Iteration                      | Disposal                     |
    | -------------------------------- | ------------------------------ | ---------------------------- |
    | `for (using x of y)`             | `@@iterator`                   | `@@dispose`                  |
    | `for (await using x of y)`       | `@@iterator`                   | `@@asyncDispose`/`@@dispose` |
    | `for await (using x of y)`       | `@@asyncIterator`/`@@iterator` | `@@dispose`                  |
    | `for await (await using x of y)` | `@@asyncIterator`/`@@iterator` | `@@asyncDispose`/`@@dispose` |

    > ```using``` 和 ```await using``` 不能在 `for in` 中使用，会报错。

### 和 const/let 定义变量的区别

const/let 可以用于对变量进行解构赋值，但是 using 不可以：

```js
using res = getResource(); // 有效
using x = f(), y = g(); // 有效

using x; // 语法错误
using { x, y } = getResource(); // 语法错误
using [ x, y ] = getResource(); // 语法错误
```

可以通过下面这种方式：

```js
// (a) 如果 res 是可以被释放的，可以用解构赋值获取 x 和 y
using res = getResource();
const { x, y } = res;

// (b) 如果 res 不能被释放，但是 x，y 可以被释放的情况：
const { x, y } = getResource();
using _x = x, _y = y;
```

### 允许的值类型

```js
using x = {}; // 报错，对象不是可被释放的（没有 [Symbol.dispose] 或 [Symbol.asyncDispose]）

using x = { [Symbol.dispose]() {} }; // ok
using x = null; // ok
using x = undefined; // ok
```

## ```await using``` 与异步函数

使用 ```await using``` 会创建一个新的微任务。当主线程遇到使用 ```await using``` 的异步函数、块级作用域或模块时，位于它后面的代码将开辟一个新的微任务，例如：

```js
async function f() {
  {
    a();
  } // 退出块级作用域
  b(); // b 和 a 处于同一个微任务中
}


async function f2() {
  {
    await using x = ...;
    a();
  } // 退出块级作用域
  b(); // b 处于一个新的微任务中
}
```

```js
async function f() {
    {
        if (true) break;
        await using res = getResource();
    }
    b(); // b 处于同一个微任务中，因为块级作用域中的 await using 没有执行
}

async function g() {
    {
        await using res = null;
    }
    b() // b 处于一个新的微任务中
}
```

## 与 `using` 有关的原生 API

当 ```using``` 提案获得通过以后，由浏览器和 Node.js 等环境提供的 API 调用将变得更简单

示例：

### WHATWG Streams API

```js
{
  using reader = stream.getReader();
  const { value, done } = reader.read();
} // 'reader' 被释放
```

### NodeJS FileHandle

```js
{
  using f1 = await fs.promises.open(s1, constants.O_RDONLY),
        f2 = await fs.promises.open(s2, constants.O_WRONLY);
  const buffer = Buffer.alloc(4092);
  const { bytesRead } = await f1.read(buffer);
  await f2.write(buffer, 0, bytesRead);
} // 'f2' 被释放，然后 'f1' 被释放
```

## API

### global

这个提案添加了两个全局的用于管理多个资源释放的容器对象：

- `DisposableStack` — 一个基于栈的释放资源的容器
- `AsyncDisposableStack` — 一个基于栈的异步释放资源的容器

它们都具有以下属性和方法：

- `disposed`：当前资源栈是否已释放
- `dispose()` ： `[Symbol.dispose]()` 的别名
- `use(value)`：往栈中添加一个资源，对 `null` 和 `undefined` 无效
- `adopt(value, onDispose)`：添加一个不可释放的资源和一个释放函数到当前的资源栈
- `defer(onDispose)`：添加一个释放函数到当前资源栈
- `move()`：把当前资源栈的资源移动到一个新的资源栈`DisposableStack` 中
- `[Symbol.dispose]()`：释放资源函数
- `[Symbol.toStringTag]`：内部属性



可以通过这些方法实现复杂的资源释放逻辑：

#### 通过 `use` 添加多个资源，同时释放

```js
const stack = new DisposableStack();
const resource1 = stack.use(getResource1());
const resource2 = stack.use(getResource2());
const resource3 = stack.use(getResource3());

stack[Symbol.dispose](); // 同时对三个资源进行释放，释放顺序：3，2，1
```

如果 `resource1`，`resource2`，`resource3` 在进行资源释放的时候都报错了，则会抛出一个错误：

```
SuppressedError {
    error: exception_from_resource3_disposal,,
    suppressed: SuppressedError {
        error: exception_from_resource2_disposal,
        suppressed: exception_from_resource1_disposal
    }
}
```

#### 通过 `defer` 添加自定义处理函数

```js
function f() {
  using stack = new DisposableStack();
  console.log("enter");
  stack.defer(() => console.log("exit"));
  ...
}
```

### Symbol

这个提案会在 ```Symbol``` 构造函数上新增两个属性：dispose 和 asyncDispose

| 名称定义         | [[Description]]         | 值                                                    |
| ---------------- | ----------------------- | ----------------------------------------------------- |
| *@@dispose*      | *"Symbol.dispose"*      | 一个内部只读函数，在 ```using``` 释放资源时执行       |
| *@@asyncDispose* | *"Symbol.asyncDispose"* | 一个内部只读函数，在 ```await using``` 释放资源时执行 |

### `SuppressedError` 

这个提案定义了一个新的 ```SuppressedError``` 类，它是 ```Error``` 的子类，当释放资源出错，一个 ```SuppressedError ```将会被抛出。

例如：

```ts
try {
    using c = { [Symbol.dispose]() { throw new Error("c"); } };
    using b = { [Symbol.dispose]() { throw new Error("b"); } };
    throw new Error("a");
}
catch (e) {
    e; // ?
}
```

`e` 将是一个 `SuppressedError`，避免因为因为任意一个 dispose 报错导致无法获取到其他 dispose 的错误信息：

```ts
SuppressedError {
    error: Error("c"),
    suppressed: SuppressedError {
        error: Error("b"),
        suppressed: Error("a")
    }
}
```

### ```dispose``` 和 ```asyncDispose``` 方法

一个对象如果定义了 ```@@dispose``` 类型，它将是一个同步函数，没有返回值：

```typescript
interface Disposable {
  /**
   * 释放对象的资源
   */
  [Symbol.dispose](): void;
}
```

一个对象如果定义了 ```@@asyncDispose``` 类型，它将是一个异步函数，需要返回一个 Promsie：

```typescript
interface AsyncDisposable {
  /**
   * Disposes of resources within this object.
   */
  [Symbol.asyncDispose](): Promise<void>;
}
```

## 底层转换

### `using` 

`using` 声明将会转换成：

```js
// source:
{
    using res = getResource();
    res.work();
}

// generated:
var __addDisposableResource = ...; // helper
var __disposeResources = ...; // helper

const env_1 = { stack: [], error: void 0, hasError: false };
try {
    const res = __addDisposableResource(env_1, getResource(), false);
    res.work();
}
catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
}
finally {
    __disposeResources(env_1);
}
```

`env_1` 变量中保存着每一次通过 `using` 添加的资源的栈，和每一次有可能抛出的错误信息。

### ```await using```

`await using` 声明将会转换成：

```js
// source:
async function f() {
    await using res = getResource();
    res.work();
}

// generated:
var __addDisposableResource = ...; // helper
var __disposeResources = ...; // helper

async function f() {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
        const res = __addDisposableResource(env_1, getResource(), true); // <- indicates an 'await using'
        res.work();
    }
    catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
    }
    finally {
        const result_1 = __disposeResources(env_1);
        if (result_1) {
            await result_1;
        }
    }
}
```

通过判断 `result_1` ，并且进行 `await`，它的返回值将是一个 Promise。



References：

>https://github.com/tc39/proposal-explicit-resource-management
>
>https://github.com/microsoft/TypeScript/pull/54505