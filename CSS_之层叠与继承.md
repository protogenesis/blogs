---
title: "CSS 之层叠与继承"
description: "深入 CSS 概念，层级关系"
author: protogenesis
---

##### CSS 层叠（Cascading）指的是某个元素会根据样式规则的优先级来设置某个元素的外观。

###### 层叠样式的优先级主要有三方面：

1. 根据样式域判断，是用户代理样式（user agent stylesheet），还是我们自己写的样式；是否存在 `!important` 标识；
2. 根据元素样式属性判断，是否是写在元素行内的 style 属性中；
3. 根据选择器判断。

###### 用户代理样式是什么？

基本上所有浏览器都有默认的样式，例如 `<h1>-<h6>`，`<p>` 标签都有默认的上边距和下边距，这是由浏览器默认设置的，所以叫用户代理样式。

###### 如果一个元素身上有很多相同的样式规则，那么到底该应用哪一条呢？

首先，浏览器会先判断当前样式是用户代理样式还是我们自己写的样式，这两者中，我们自己写的样式优先级要高，所以如果同一个元素上存在相同的样式规则，我们自己写的会覆盖浏览器默认样式；

然后，判断当前样式规则是否存在 `!important`标识，如果存在，说明它的优先级高，则应用该样式；

其次，判断当前样式规则是否是行内样式，如果是行内样式，它的优先级高于其他样式（但是除了有 `!important` 标识的除外）；

然后，根据选择器的优先级来判断，选择器的优先级顺序从大到小是：ID 选择器、类选择器、属性选择器、伪元素选择器、标签选择器；

最后，根据选择器的个数判断，如果 ID 选择器的个数都相同，则判断类选择器的个数，如果又都相同，则判断属性，伪类元素的个数，如果最后得到的优先级一样，则根据代码顺序，后来者居上，后者覆盖前者。

下面是样式层叠的规则，根据优先级大小降序排列：

1. 是否是行内样式，并且有 `!important` 标识；
2. 是否具有 `!important` 标识；
3. 是否具有 ID 选择器；
4. 是否具有类选择器；
5. 是否具有属性、伪元素选择器；
6. 是否具有标签选择器；
7. 是否具有通配符选择器；
8. 用户代理样式；
9. 继承样式。

#### 继承（Inheritance）

继承指的是元素可以通过继承祖先元素的样式给自身，但是并不是所有样式都可以继承。

几乎所有样式属性都可以属性值 `inherit` 来实现继承祖先元素的样式。

###### 文本可以继承的样式

这些文本属性可以通过继承实现：color，font，font-size，font-weight，font-variant，font-style，font-family，line-height，word-spacing，white-space，letter-spacing，text-transfrom，text-indent，text-align。

###### 其他可继承的样式

列表元素的部分样式可以通过继承实现：list-style，list-style-type，list-style-position，list-style-image。
表格元素的边框属性：border-collapse，border-spacing。

**tips:**
平时我们在开发中，最好少用 `!important` 标识和 ID 选择器，应该它们的优先级很高，如果我们后面想要覆盖他们的样式则必须用相同的方式继续添加 `!important` 或 ID 来实现，这种方式不利于维护。我们可以通过类选择器、样式层叠规则来覆盖。

> 参考： 《CSS in Depth》 Keith J. Grant 著