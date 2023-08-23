## React setState 的时候是怎么去渲染的？

首先得弄清一个概念，就是 react 和 react-dom / react-native 或者其他的 renderer 包是分开的。react 只提供了 Component, createElement, hooks 等方法，而渲染操作是由 react-dom 去完成的。当我们使用 setState 时，react 把这个处理函数委派给了 renderer, renderer 来执行渲染。

##### renderer 是怎么和 react 进行通信的？

在使用 Component 注册组件的时候，renderer 会往当前组件注入一个对应的 updater 对象，在 setState 时会调用 updater 方法的 enqueueSetState 函数来进行渲染

```jsx
// Inside React DOM
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactDOMUpdater;

// Inside React DOM Server
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactDOMServerUpdater;

// Inside React Native
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactNativeUpdater;
```

```jsx
// A bit simplified
setState(partialState, callback) {
  // Use the `updater` field to talk back to the renderer!
  this.updater.enqueueSetState(this, partialState, callback);
}
```

[源码](https://github.com/facebook/react/blob/ce43a8cd07c355647922480977b46713bd51883e/packages/react/src/ReactBaseClasses.js#L58-L67)

##### renderer 是怎么渲染 hooks 的？

其实和渲染 class component 是一样的，只不过他不是注入了一个 updatere，而是一个 dispatcher, 当使用 useEffect, useState 等 hooks 时，react 会委派这些 hooks 给 dispatcher 来执行渲染。

这也就是为什么一个组件内不能使用两个 react 包提供的 API, 因为 react 和 react-dom 是有关联关系的。

Reference:

> https://overreacted.io/how-does-setstate-know-what-to-do/

