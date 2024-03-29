---
title: "数字分隔符（Numeric separators）"
description: "ECMA Script，ES 新语法，JavaScript"
author: protogenesis
---

通常一长串数字我们很难一眼就知道它是多大，通过数字分隔符连接一串数字，可以使数字变得更具有可读性。

```javascript
1000000000 //  你能一眼看出这是一百亿吗？
```

这种情况下我们可以通过使用数字分隔符 ```_``` 来使它变得更具可读性。

```javascript
1_000_000_000_000 // 同样是一百亿
```

```javascript
var fee = 123_00;  // 12300
var fee = 12_300;  // 12300
```

```javascript
let budget = 1_000_000_000_000;  // 一万亿
```

小数点同样适用：

```javascript
0.000_001; // 一百万分之一，等于 0.000001
1e10_000; // 十万，等于 100000 
```

分隔符不适用于以下情况：

```javascript
100_ // syntax error
0.01_ // syntax error
```

该提案已经通过了 TC39 的 stage 4，目前主流浏览器都已支持数字分隔符。

参考：

> https://github.com/tc39/proposal-numeric-separator