---
title: "正则表达式模式与符号 patterns and flags"
not_excerpt: "正则表达式基础，入门"
author: protogenesis
---

### 表达式（patterns）

声明正则表达式有两种方式：

1. 通过斜杠的方式声明 

```js
let regexp = /regexp/gmi;
```

2. 通过 new 语法声明

```js
let regexp = new RegExp("pattern", "flags");
```



上面两种方式创建的正则表达式效果都是一样的，它们都是内置 ```RexExp``` 的实例化。	

这两种方式的主要区别是：使用斜杠的方式不允许插入表达式（例如模板字符串 ```{...}```）。

斜杠的方式比较常用，因为通常在写一个正则表达式时，就已经知道它的匹配规则了；但是如果需要动态创建一个正则表达式，则可以使用 ```new```的方式，例如：

```js
let tag = prompt("输入你想查找的标签", "h2");

let regexp = new RegExp(`<${tag}>`);  // 如果查找的是 h2，则表达式为 /<h2>/
```



### 符号（Flags）

正则表达式中的符号会影响匹配的结果。

在 JavaScript 中，一共有 6 个符号：

```i```，忽略大小写

```g```，全局搜索，而不是只匹配一个

```m```，多行模式

```s```，使 ```.``` 不仅可以匹配任意字符，还可以匹配到换行符 ```\n```

```u```, 启用完整的 unicode 匹配。

```y```, “粘性”模式，查找字符中某个特定的位置。



### 查找

字符串类型集成了正则表达式的方法。

**str.match**

```str.match(regexp)``` 有三种模式：

1.  如果正则表达式有 ```g``` 符号，该方法返回一个数组，每个匹配到的字符都是数组的成员。

   ```js
   let str = "We will, we will rock you";
   
   alert( str.match(/we/gi) ); // We,we 
   ```

   注意：大写的 We 和小写的 we 都匹配到，因为 ```i``` 符号会忽略大小写

   

2.  如果正则表达式没有 ```g``` 符号，该方法也会返回一个数组，数组中索引为 0 的项为匹配的字符，数组中还包含其他一些相关的属性。

   ```js
   let str = "We will, we will rock you";
   
   let result = str.match(/we/i); // 没有 g 符号
   
   alert( result[0] ); // We (大写的 We)
   alert( result.length ); // 1
   
   // 相关属性：
   alert( result.index ); // 0 (匹配到的字符在字符串中的下标)
   alert( result.input ); // We will, we will rock you (变量 str 的值)
   ```

   数组中可能会包含其他索引，如果正则表达式中有括号（Capturing groups）的话。

   

3.  在没有匹配到字符的情况下，会返回 ```null```（不管有没有 ```g```符号）

   ```js
   let matched = "JavaScript".match(/HTML/);
   
   alert(matched); // null
   ```



**替换（str.replace）**

```str.replace(regexp, replacement)``` 方法用来替换某个字符，如果有 ```g``` 符号的话，所有匹配到的结果都会被替换，否则只替换第一个。

例如：

```js
// 没有 g 符号
alert( "We will, we will".replace(/we/i, "I") ); // I will, we will

// 有 g 符号
alert( "We will, we will".replace(/we/ig, "I") ); // I will, I will
```

第二个参数是要替换的字符，可以和特殊的符号一起使用：

- ```$&```，插入整个匹配到的字符

  ```js
  let str = '123';
  
  alert( str.replace(/\d+/, "$&4") ); // 1234
  ```

- $`， 插入匹配到的字符左边的字符
	
  ```js
  let str = "ab123";
  
  alert( str.replace(/\d+/, "$`") ); // abab
  ```
  
-  ```$'```,插入匹配到的字符右边的字符

  ```js
  let str = "123ab";
  
  alert( str.replace(/\d+/, "$'") ); // abab
  ```

-  ```$n```,如果 n 是一个 1-2 位数的数字，它会查找正则表达式中与该数字相对应的括号内的内容

  ```js
  let str = "12345abc6";
  
  // $1 即正则表达式中第一个括号中的内容
  alert( str.replace(/(abc6)/, "$178") ); // 12345abc678
  ```

- ```$$```,插入字符 $ 

**测试：regexp.test**

```regex.test(str)``` 方法判断某个字符是否匹配，是则返回 ```true```,否则返回 ```false```

```js
let str = "I love JavaScript";
let regexp = /LOVE/i;

alert( regexp.test(str) ); // true
```



### 总结

- 正则表达式包含两部分：模式和符号

- ```str.match(regexp)```方法查找匹配的字符，默认查找第一个匹配的字符，如果有 ```g``` 符号，则查找所有匹配的字符

- ```str.replace(regexp, replacement)```替换匹配到的字符，如果有 ```g``` 符号，则替换全部匹配的字符

- ```regexp.test(str)``` 用来测试某个字符是否符合匹配条件，是则返回 ```true```,否则返回 ```false```

  







