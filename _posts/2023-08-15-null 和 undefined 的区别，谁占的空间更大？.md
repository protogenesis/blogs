---
title: "null 和 undefined 的区别，谁占的空间更大？"
not_excerpt: "深入理解 null 与 undefined 的内存占用"
author: protogenesis
---

在 JavaScript 中，```null``` 和 ```undefined``` 都表示值的缺失，但它们在使用上有不同的含义和细微的差异。

### 1. 语义：

- **undefined**:
  - 已声明但尚未分配值的变量为 `undefined` 。
  - 如果尝试访问对象上不存在的属性，结果为 `undefined` 。
  - 如果你不提供函数参数的值，默认值就是 `undefined` 。
  - 在 JS 中，它代表更“原始”的缺失形式，它暗示某些东西甚至还没有初始化。
- **null**:
  - 表示”无值“或“空”的明确赋值。
  - 开发者通常使用 `null` 来表示对任何对象值的有意缺失。
  - 它不是像 `undefined` 那样的默认值，必须明确设置它。

### 2. 类型：

- `typeof undefined` 返回 `"undefined"`。
- `typeof null` 返回 `"object"`。(在 JavaScript 中，作者就是这么设计的，借鉴了 C 语言)

### 3. 相等性：

- `null` 与 `undefined` 宽松相等 (`==`)，与其他任何值都不宽松相等。 `null == undefined` 是 `true`。
- 但是，`null` 与 `undefined` 严格不相等 (`===`)。 `null === undefined` 是 `false`。

### 4. 内存影响：

在大多数应用程序中，这通常可以忽略。但为了深入了解一些具体内容：

- JavaScript 引擎如 V8（用于 Chrome 和 Node.js ）采用各种优化，因此实际的内存表示基于上下文和使用情况而变化。
- 在许多实现中，`null` 和 `undefined` 都被视为单例值，这意味着每次引用它们时都不会分配新内存。相反，它们只是引用保存该特殊值的同一内存位置。
- 如果我们在数组或对象中存储这些值达到数百万时，那么开销更多是关于数据结构（数组或对象），而不是值本身。在实践中，充满 `null` 值的数组与充满 `undefined` 值的数组之间没有明显的内存差异。

值得注意的是，在几乎所有情况下，`null` 和 `undefined` 的语义和含义应该比内存影响更重要。在代码中正确使用这些值来传达意图比两者之间的任何微小内存差异更为关键。



References:

> https://262.ecma-international.org/5.1/#sec-4.3.9
>
> https://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html
>
> https://www.scaler.com/topics/javascript/null-and-undefined-in-javascript/