---
title: "函数柯里化（Currying）"
description: "高阶函数，HOC，前端进阶，currying function"
author: protogenesis
---

柯里化是函数的一种高级实现。它不仅在 JavaScript 中用到，其他语言同样也有柯里化函数（Curring）。

柯里化是函数的一种转换，它把一个函数 ```fn(a, b, c)``` 转换成 ```fn(a)(b)(c)```这样的调用形式。

柯里化不会调用一个函数，而是转换一个函数。

让我们通过示例来理解柯里化函数是什么：

我们创建一个柯里化函数 ```curry(f)``` ，它将把一个接收两个参数的函数 ```f``` 进行柯里化，也就是说，```curry(f)``` 把 ```f(a,b)```这个函数转换成 ```f(a)(b)``` 这种形式。

```js
function curry(f) { // curry(f) 进行柯里化转换
  return function(a) {
    return function(b) {
      return f(a, b);
    };
  };
}

// 使用
function sum(a, b) {
  return a + b;
}

let curriedSum = curry(sum);

alert( curriedSum(1)(2) ); // 3
```

如上代码，实现方式很直观：

- ```curry()``` 的返回值是一个匿名函数：```function(a)```；
- 当调用 ```curriedSum(1)``` 时，它的参数 ```1``` 被保存在了上下文环境中，并且返回了另一个匿名函数 ```function(b)```；
- 然后这个匿名函数 ```function(b)``` 被调用，传入参数 ```2```,最后把这两个参数传入并执行最开始的 ```sum``` 函数。
- 

柯里化的更高级一点的实现方式，例如 lodash 的 [```_.curry```](https://lodash.com/docs#curry)，返回一个可以被正常调用或柯里化方式调用的匿名函数。

```js
function sum(a, b) {
  return a + b;
}

let curriedSum = _.curry(sum); // using _.curry from lodash library

alert( curriedSum(1, 2) ); // 3, 正常调用
alert( curriedSum(1)(2) ); // 3, 柯里化方式调用
```

### 柯里化函数？用来做什么？

我们通过现实中存在的需求来理解柯里化函数有什么用。

例如，有一个打印函数 ```log(date, importance, message)```,它将参数格式化并且输出消息。在真实项目中，可能需要将信息保存到服务器，这里我们通过 ```alert``` 模拟：

```js
function log(date, importance, message) {
  alert(`[${date.getHours()}:${date.getMinutes()}] [${importance}] ${message}`);
}
```

对上述函数进行柯里化：

```js
var log = _.curry(log);
```

现在 ```log``` 具备柯里化功能了：

```js
log(new Date(), "DEBUG", "some debug"); // log(a, b, c)

log(new Date())("DEBUG")("some debug"); // log(a)(b)(c)
```

现在我们可以很方便地调用这个函数来打印当前时间的 log 信息了：

```js
// logNow 通过传入第一个参数来固定当前时间，后续调用 logNow 时，时间都是固定的
let logNow = log(new Date());

// 使用
logNow("INFO", "message"); // [HH:mm] INFO message
```

继续实现这个函数：

```js
// 现在 debugNow 这个函数已经应用了第一个参数和第二个参数，调用 debugNow 即可打印特定时间的调试信息
let debugNow = logNow("DEBUG");

debugNow("message"); // [HH:mm] DEBUG message
```

现在：

1. 我们在柯里化之后依然具有之前的功能：```log``` 仍然可以正常调用
2. 我们可以轻松地创建一个函数来打印某一特定时间特定类型的日志

### 高级柯里化函数实现方式

我们可以实现一个「多参数」（multi-argument）的高级柯里化函数来实现上述功能：

```js
function curry(func) {

  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };

}
```

使用实例：

```javascript
function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

alert( curriedSum(1, 2, 3) ); // 6, 仍然可以正常调用
alert( curriedSum(1)(2,3) ); // 6, 柯里化第一个参数
alert( curriedSum(1)(2)(3) ); // 6, 柯里化函数
```

新的 ```Curry``` 函数看起来可能有点复杂，但其实很容易理解：

```Curry(func)``` 函数返回一个 ```curried``` 函数：

```js
// func 就是要柯里化的函数
function curried(...args) {
  if (args.length >= func.length) { // (1)
    return func.apply(this, args);
  } else {
    return function(...args2) { // (2)
      return curried.apply(this, args.concat(args2));
    }
  }
};
```

当我们执行这个函数时，它有两个 ```if``` 语句分支：

1. 如果传入参数 ```args``` 的长度大于或等于 ```func``` 函数的参数的长度（```func.length```），那就直接将 ```args``` 传递给 ```func``` 来执行
2. 否则的话，获取一部分：先不执行 ```func``` 函数，而是返回一个匿名函数，这个匿名函数将接收到的新 ```args2``` 参数和以前的参数拼接起来，然后再次调用 ```curried``` 函数

如果我们再次调用的话，要么获取一个 “新的一部分”  的参数（如果参数的长度和 ```func.length``` 不一致的话），要么直接得到结果。

> **柯里化函数的参数长度是固定的**
>
> 柯里化需要函数参数的个数是固定的
>
> 一个函数如果使用 ```rest``` 参数，例如 ```f(...args)```,不能被柯里化 

> **不仅是柯里化**
>
> 根据柯里化定义，一个函数 ```sum(a, b, c)``` 应该被转换成 ```sum(a)(b)(c)``` 这种方式。
>
> 但是 JavaScript 中大多数的实现方式既实现了原始的调用方式，又可以通过柯里化的方式调用

### 总结

柯里化就是把一个函数 ```f(a, b, c)``` 转换成 ```f(a)(b)(c)``` 这种函数的实现。

柯里化函数让我们可以方便地先传入一部分参数，后面再根据情况来决定函数的其他参数是什么，就像上文提到的打印函数。



> Reference
>
> https://javascript.info/currying-partials