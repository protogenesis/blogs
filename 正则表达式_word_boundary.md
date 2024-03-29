---
title: "正则表达式 word boundary"
description: "正则表达式字符边界，\b 用法"
author: protogenesis
---

「字符边缘」 ```\b``` 用于匹配是否处于字符边缘。

有三种情况，字符边缘 ```\b``` 会匹配到：

1. 在字符串最开始的位置，如果第一个字符是字符类型 ```\w```
2. 在字符串中，两个相邻的字符，如果一个是字符类型 ```\w```，而另一个不是
3. 在字符串结束的位置，如果最后一个字符是字符类型 ```\w```

例如，正则表达式 ```\bJava\b``` 可以匹配到字符：```Hello, Java!```，因为 Java 是一个单独的字符；在 ```Hello, JavaScript!``` 中则无法匹配到。

```js
alert( "Hello, Java!".match(/\bJava\b/) ); // Java
alert( "Hello, JavaScript!".match(/\bJava\b/) ); // null
```

同样，```\bHello\b``` 也可以匹配到 Hello 这个字符，因为：

1. 在字符串最开始的时候，匹配到 ```\b```
2. 然后匹配到 Hello
3. 然后在 Hello 的后面匹配到 ```\b```

所以 ```\bHello\b``` 会匹配到 Hello，但是 ```\bhell\b``` 匹配不到任意字符，因为在 ```l``` 后面不是字符边缘，同样 ```Java!\b ``` 也不会被匹配到，因为感叹号不是一个字符串类型 ```\w```。

```js
alert( "Hello, Java!".match(/\bHello\b/) ); // Hello
alert( "Hello, Java!".match(/\bJava\b/) );  // Java
alert( "Hello, Java!".match(/\bHell\b/) );  // null (no match)
alert( "Hello, Java!".match(/\bJava!\b/) ); // null (no match)
```

我们同样可以和数字一起搭配使用。

例如，正则表达式 ```\b\d\d\b``` 匹配单独的两个数字，也就是查找一个两位数的数字，这个数字前后的字符都是非字符类型 ```\W```，例如空格。

```js
alert( "1 23 456 78".match(/\b\d\d\b/g) ); // 23,78
alert( "12,34,56".match(/\b\d\d\b/g) ); // 12,34,56
```

>「字符边缘」```\b``` 在非拉丁字符下不起作用
>
>字符边缘会查看某个字符的一边是否是字符类型 ```\w``` ,另一边不是字符类型 ```\W```。
>
>但是 ```\w``` 是代表一个拉丁字符 ```a-zA-Z```（或者是一个数字、下划线），所以它无法匹配到其他例如象形文字等字符。

