---
title: "JavaScript 新提案：optional chaining（可选链）"
description: "ECMA 新语法，?.() 是什么"
author: protogenesis
---

## Optional chaining

> 这是一项新的提案，老旧浏览器可能需要 polyfills。

Optional chaining `?.`（可选链，以下简称 OC）是一种以安全的方式去访问嵌套的对象属性，即使某个属性根本就不存在。

### 起因：

一个在 JavaScript 中很常见的问题就是：假如用户信息中，地址是可填可不填的，那我们就无法安全地访问地址的某一个属性：

```javascript
let user = {}; // 用户可能没有填地址

alert(user.address.street); // 报错
```

或者下面这种情况，在 WEB 开发中，我们可能需要去获取一个 DOM 元素，但是这个 DOM 元素可能不存在：

```javascript
// 当 querySelector(...) 的结果为 null 的时候，程序会报错
let html = document.querySelector('.my-element').innerHTML;
```

在 OC `?.` 出现之前，我们一般通过逻辑与操作来解决：

```javascript
let user = {}; // 没有地址的用户

alert( user && user.address && user.address.street ); // undefined (不会报错)
```

使用逻辑与操作符可以确保表达式的所有部分都能够正确执行，但是写法却比较笨重。

### Optional chaining（可选链）

OC `?.` 能够使代码变得简便，当位于其前的值为 `undefined` 或者是 `null` 时，会立即阻止代码的执行，并且返回 `undefined`。

通过 OC，我们可以安全地访问用户的地址：

```javascript
let user = {}; // 一个没有地址的用户

alert( user?.address?.street ); // undefined (不会报错)
```

即使 `user` 对象不存在，使用 OC 访问它的地址属性也不会报错：

```javascript
let user = null;

alert( user?.address ); // undefined
alert( user?.address.street ); // undefined
```

需要注意的是，OC 仅允许它前面相邻的部分为可选项，不包括进一步的值。

在上面的代码中，`user?.` 仅允许 `user` 这个对象为 `null` 或 `undefined` 。
另一方面，如果 `user` 这个对象真的存在，那么 `user.address` 这个属性必须存在，否则访问 `user?.address.street` 则会在第二个点这报错。

> **不要过度使用 OC**
> 我们应该仅在希望某个值可能不存在的情况下才使用 `?.`
> 例如，根据我们的代码逻辑，`user` 对象必须存在，但是 `address` 属性是可选的，所以 `user.address?.street` 才是更好的选择。
> 所以，由于其他原因导致的 `user` 对象为 `undefined` 的情况才能被快速发现。否则，bug 将会变得比较难找

> 位于 `?.` 前的变量必须被显示声明
> 如果 `user` 这个变量根本没有被声明，那么 `user?.anything` 将会触发一个错误：
>
> ```javascript
> // ReferenceError: user is not defined
> user?.address;
> ```
>
> 此处必须有变量声明语句 `let/const/var`， OC 对未声明的变量无效

### 短路

在上文提到，在OC `?.` 的前部分的值为 `null` 或 `undefined` 的时候，会立即停止执行。
所以，如果在其后面如果有函数的调用，或者其他操作，都不会执行。

```javascript
let user = null;
let x = 0;
user?.sayHi(x++); // 什么都不会做
alert(x);   // 0，值没有自增
```

### 其他用法：?.()，?.[]

OC 不是一个操作符，而是一个特别的语法糖，所以可以和函数调用和中括号共用。

例如，`?.()`可以用于执行一个可能不存在的函数。

下面的代码中，一些用户拥有 `admin` 方法，一些用户没有：

```javascript
let user1 = {
    admin() {
        alert("I am admin");
    }
};

let user2 = {};

user1.admin?.(); // I am admin
user2.admin?.();
```

我们首先用点语法去获取 `admin` 方法，因为 user 对象肯定存在，所以我们可以安全地去访问；
然后使用 `?.()` 检查其左侧，如果 admin 这个方法存在，就执行（例如 user1），否则就停止执行，但是不报错（例如 user2）。

`?.`语法同样可以在当我们需要通过中括号去访问属性时使用，使用它可以安全的访问一个或许还不存在的对象的属性：

```javascript
let user1 = {
    firstName: "John"
};

let user2 = null; // 假如现在不能授权这个用户

let key = "firstName";

alert( user1?.[key] ); // John
alert( user2?.[key] ); // undefined

alert( user1?.[key]?.something?.not?.existing ) // undefined
```

`?.` 同样可以与 `delete`操作符共用

```
delete user?.name; // 删除用户名，如果用户存在的话
```

> 使用 `?.` 可以进行删除和读取操作，但是**不能**进行赋值操作
> 在赋值运算符的左侧，`?.` 无效
>
> ```javascript
> // 下面的代码是假设现在需要在用户存在的情况下，重新赋值 name 属性
> user?.name = "John"; // 报错
> // 等同于 undefined = "John" 
> ```

### 总结

OC `?.` 有三种形式：

1. `obj?.prop` - 如果 `obj` 存在的话，返回 `obj.prop` 的值，否则返回 `undefined`；
2. `obj?.[prop]` - 如果 `obj` 存在的话返回 `obj[prop]` 的值，否则返回 `undefined`；
3. `obj?.method()` - 如果 `obj` 存在的话则调用 `obj.method()` 方法，否则返回 `undefined`。

这几种形式都非常的直观并且易于使用。`?.` 检查左侧的值是否为 `null` 或 `undefine`，如果不是的话则继续执行。

通过链式的 `?.` 可以安全地访问嵌套的对象。

我们应该仅在当左侧的值可能不存在的情况下才使用 `?.`，这样在发生错误的时候才能更加容易找到问题。

> 参考链接：
> [https://javascript.info/optio...](https://javascript.info/optional-chaining)
> [https://developer.mozilla.org...](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
> [https://tc39.es/ecma262/#prod...](https://tc39.es/ecma262/#prod-OptionalExpression)

（完）