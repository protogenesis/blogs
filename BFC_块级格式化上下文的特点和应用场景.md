##### BFC(Block Formatting Context)的特点是元素拥有独立的渲染区域,元素内部的内容(边距,浮动元素等)不会影响到外部元素。

#### 哪些情况下会触发BFC

- 设置 overflow 属性,值不为 visible
- 设置 float 属性,值不为 none
- 设置 position 属性,值为 absolute 或 fixed
- 设置 display 属性,值为 inline-block, table-cell, table-caption, flex, inline-flex, grid 或者 inline-grid

#### BFC 的典型应用场景: 解决块级元素的塌陷问题(Collapsing)

1. 块级元素的垂直塌陷: 当两个相邻的块级元素拥有上下方向相邻的边距时(例如:上面的元素拥有 margin-bottom 值,下面的元素拥有 margin-top 值),此时上下元素之间的间隙不是两者边距之和,而是两者之中的值较大的一个
2. 块级元素的包含塌陷: 当块级父元素没有 boder, padding 值,块级子元素有 margin-top 值时,子元素的 margin-top 值会在父元素的外部生效,也就是整个父元素区域会向下偏移,这个偏移值由子元素的 margin-top 值决定

此外, BFC 还可以用于清除浮动带来的影响等