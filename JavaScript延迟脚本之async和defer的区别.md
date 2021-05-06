#### avaScript延迟脚本之async和defer的区别

defer 和 async 都是`<script>`标签的属性，属于 HTML4 的规范，作用是延迟加载脚本和异步执行 JS 代码。

##### defer 属性

浏览器在解析 HTML 文档时，如果遇到有 defer 属性的`<script>`标签，会立即下载该文件，下载的同时不阻塞 HTML 的解析与渲染，一旦页面解析和渲染完毕，就会执行该文件。

在 HTML5 的规范中，规定了多个带有 defer 属性的`<script>`标签在执行时按照在页面中的先后顺序来执行，并且执行的时机是在页面的 [DomContentLoaded()](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/DOMContentLoaded_event) 事件之前。
但是在现实中，多个 defer 属性**并不一定按照顺序执行，也不一定是在 DomContentLoaded 事件之前执行**（各个浏览器之间实现可能各不一样）。

##### async 属性

浏览器在解析 HTML 文档时，如果遇到带有 async 属性的`<script>`标签，会立即下载该文件，下载的同时不阻塞 HTML 的解析和渲染，一旦该文件下载完成，则停止解析 HTML 并且执行该文件，文件执行完毕后，继续解析 HTML。

当页面中有多个带有 async 属性的`<script>`标签时，它们的执行顺序不是按照页面顺序来执行，而是无论任意一个文件先下载完成，则此文件先执行。

另外，不建议在该文件中修改 HTML 结构，因为此时文档可能还在加载中。

------

defer 和 async 属性只能用于引入外部文件的`<script>`标签中，否则会被忽略。

如果一个`<script>`标签同时拥有 defer 和 async 属性，则 defer 属性会被忽略。

###### 这两个属性显著的区别就是:

- 带有 defer 属性的`<script>`标签执行顺序是一致的，并且是在 HTML 渲染完毕后才执行。
- 带有 async 属性的`<script>`标签执行顺序是不固定的，并且只要文件下载完成就执行，不论 HTML 是否已渲染完成。