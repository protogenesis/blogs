---
title: "ECMA 2022 array find from last"
description: "ECMA 新语法，Array.findLastIndex"
author: protogenesis
---

这是一个新提案，在 ECMA 2022（第十三版本） 中已经实施，目前大多数浏览器都已经支持。

##### 为什么有这个提案？

在一个数组中查找一个元素是一种非常常见的编程模式。

这个提案还有一个重要的原因：更具语义化，使操作能够更直观的展示。

这个提案对于一些对性能敏感的操作来说是有一定作用的，比如在 React render function 中。

---

ECMAScript 当前支持两种方法寻找数组中的某个元素的索引：

1. Array.prototype.indexOf

2. Array.prototype.lastIndexOf

还有 Array.prototype.find 方法用来寻找数组中的某个元素，Array.prototype.findIndex 方法寻找某个满足条件的元素的索引。

然而，JS 没有**从数组的最后往前开始查找**的方法。

```[...[]].reverse().find()``` 是一种变通的方案，但是会存在两个问题：

1. 不必要的修改（通过反转）
2. 不必要的复制（为了防止修改原数组，通过 ... 扩展运算符）

对于 ```.findIndex()```，在调用完毕后还需要再通过额外的判断来计算当前的索引是否有效（没有找到会返回 -1）。

因此会存在第三个问题：

3. 复杂的索引计算

所以我们需要一些更加直观和有效的方法：Array.prototype.findLast 和 Array.prototype.findLastIndex。

---

```Array.prototype.findLast``` 和 ```Array.prototype.findLastIndex``` 两者与 ```Array.prototype.find``` 和 ```Array.prototype.findIndex``` 用法一致，但是它们是从后面往前面开始遍历。

例子：

```javascript
const array = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];

array.find(n => n.value % 2 === 1); // { value: 1 }
array.findIndex(n => n.value % 2 === 1); // 0

// ======== 在提案之前 =========== 

// find
[...array].reverse().find(n => n.value % 2 === 1); // { value: 3 }

// findIndex
array.length - 1 - [...array].reverse().findIndex(n => n.value % 2 === 1); // 2
array.length - 1 - [...array].reverse().findIndex(n => n.value === 42); // 应该是 -1，但是返回为 4

// ======== 新提案 =========== 
// find
array.findLast(n => n.value % 2 === 1); // { value: 3 }

// findIndex
array.findLastIndex(n => n.value % 2 === 1); // 2
array.findLastIndex(n => n.value === 42); // -1
```

Polifill

[core-js](https://github.com/zloirock/core-js): [ECMAScript proposal section](https://github.com/zloirock/core-js#array-find-from-last)

es-shims: [array.prototype.findlast](https://www.npmjs.com/package/array.prototype.findlast) / [array.prototype.findLastIndex](https://www.npmjs.com/package/array.prototype.findlastindex)

原文：

> https://github.com/tc39/proposal-array-find-from-last