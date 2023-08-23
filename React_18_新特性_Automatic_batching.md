## React-18-新特性-Automatic-batching（译）

### 简介

React 18 新增了一个新特性：Automatic batching，用来提升性能，此特性在 React 18 中会默认启用，这篇文章将会介绍什么是 batch，在 React 18 以前它是怎么工作的，在 React 18 之后有哪些改变。

### 什么是 batching?

batching 即在更新数据 data 时，如果存在多个 setState，React 会把多次的 setState 操作合并成一次，以减少 re-render 次数并提升性能。

例如：假如在一次鼠标点击事件中，使用了两次 setState 操作，React 总是会把两次 setState 操作合并成一次，所以两次 setState 操作只会产生一次 re-render。例如下面的代码，虽然在事件处理函数中，有两次 setState 操作，但只会 re-render 一次：

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1); // 暂时不会 re-render
    setFlag(f => !f); // 暂时不会 re-render
    // React 仅仅会在最后 re-render 一次（batching）
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

✅ [Demo：React 17 在事件处理函数中会合并 setState ](https://codesandbox.io/s/spring-water-929i6?file=/src/index.js) （注意 console 面板中的打印）

使用 batching 减少了 re-render 次数，提升了性能。它同样避免了组件在数据更新到一半的时候重新 render 可能导致的 bug；（就好像你在餐厅点单，服务员不会在你点完第一道菜就跑去厨房，而是等你点完以后才去）。

React 18 以前并不是在所有情况下都是自动 batch，例如你在上面代码中的点击事件中通过网络请求获取数据，获取完毕后在回调函数中再进行 setState，那就会产生两个 re-render。

因为 React 18 前只会在浏览器事件中[（也就是通过 React 绑定的事件 ）](https://github.com/facebook/react/issues/14259#issuecomment-439632622)才会合并 setState，在网络请求的回调函数中再去 setState，此时事件已经处理，所以会产生两次 re-render。

```js
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // 在 React 17 及以前不会 batch setState 操作
      // 因为他们是在 click 事件里面网络请求的 **回调函数** 中执行的，不是在 **handleClick** 中
      setCount(c => c + 1); // 会 re-render
      setFlag(f => !f); // 再次 re-render
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

🟡 [Demo：React 17 不会 batch 在事件处理函数外的 setState ](https://codesandbox.io/s/trusting-khayyam-cn5ct?file=/src/index.js) （注意 console 面板中的打印内容）

在 React 18 之前，只有在事件处理函数中的 setState 才会进行自动 batch。在 Promise，setTimeout，原生的（Native）事件中默认都不会自动 batch。

### 什么是自动 batch？

React 18 中有一个 [CreatRoot](https://github.com/reactwg/react-18/discussions/5)，所有的 setState 操作都会自动进行 batch，无论他们是在 Promise, setTimeout 或是其他函数中，它们和在浏览器事件中的表现是一样的。这么做是为了提升应用的性能。

```js
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // React 18 及后续版本会进行自动 batch
      setCount(c => c + 1);
      setFlag(f => !f);
      // React 仅仅会在最后 re-render 一次（batching）
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

✅ [Demo：React 18 使用 ```createRoot``` 会 batch setState 操作，即使是在非浏览器事件中！](https://codesandbox.io/s/morning-sun-lgz88?file=/src/index.js)（注意 console 面板中的打印）

🟡 [Demo：React 18 使用 React 17 中的 ```render``` 方法来保持以前的行为](https://codesandbox.io/s/jolly-benz-hb1zx?file=/src/index.js)

> 在 React 18 中，建议使用 ```createRoot``` 方法，而不是使用 ```render``` 方法，```render```存在的目的是为了在生产环境中进行版本间的实验。

React 会自动进行 batch，无论它们在哪执行，例如：

```js
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
  // 仅仅会 re-render 一次
}
```

又例如：

```js
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
  // 仅仅会 re-render 一次
}, 1000);

```

又例如：

```js
fetch(/*...*/).then(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
	// 仅仅会 re-render 一次
})
```

又例如：

```js
elm.addEventListener('click', () => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
  // 仅仅会 re-render 一次
});
```



> 注意：React 仅仅在它认为安全的情况下才会合并 setState。例如：对于每一次用户触发的事件中，例如 click 或者 keypress 事件，React 会确保 DOM 在下一次事件之前完全更新完毕。例如 Form 表达在第一次提交中，不允许第二次提交

### 假如不想自动 batch 怎么办？

通常情况下，自动 batch 是安全的。但是如果某些代码的执行条件依赖于某个 setState 更新完毕后的 DOM，则可以使用 ```ReactDOM.flushSync()```	来阻止自动 batch。

```js
import { flushSync } from 'react-dom'; // 注意: react-dom, not react

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
 	// 此时 React 已经对 DOM 更新完毕
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
  // 此时 React 已经对 DOM 更新完毕
}
```

建议尽量不要使用 ```flushSync```。

### Automatic batch 对 Class component 造成的微弱影响

有一种边缘情况，自动 batch 会对 Class component 造成影响。

在 React 17 及以前的版本中，Class 组件在事件处理中进行 setState 会立即更新 state：

```js
handleClick = () => {
  setTimeout(() => {
    this.setState(({ count }) => ({ count: count + 1 }));

    // { count: 1, flag: false }
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```

但是在 React 18 中，情况不是这样。因为多次的 setState 操作会自动进行 batch，React 在第一次进行 setState 时不会同步更新 state，它会在浏览器的下一次 tick 中更新：

```js
handleClick = () => {
  setTimeout(() => {
    this.setState(({ count }) => ({ count: count + 1 }));

    // { count: 0, flag: false }
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```

See [sandbox](https://codesandbox.io/s/interesting-rain-hkjqw?file=/src/App.js)

但是这种情况在 React 18 中是可以避免的，那就是使用 ```ReactDOM.flushSync``` 来强制更新，但建议少用：

```js
handleClick = () => {
  setTimeout(() => {
    ReactDOM.flushSync(() => {
      this.setState(({ count }) => ({ count: count + 1 }));
    });

    // { count: 1, flag: false }
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```

See [sandbox](https://codesandbox.io/s/hopeful-minsky-99m7u?file=/src/App.js)

### 什么是 `unstable_batchedUpdates`？

有些 React 库使用这个没有在文档中提及的 API 来使事件函数外的 setState 强制进行 batch。

```js
import { unstable_batchedUpdates } from 'react-dom';

unstable_batchedUpdates(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
});
```

这个 API 在 React 18 中仍然存在，但是因为已经有了自动 batch，这个 API 已经没有使用的必要了。在未来，如果一些很流行的 React 库中不再继续使用这个 API 的话，可能会被移除。



References:

> https://github.com/reactwg/react-18/discussions/21
>
> https://github.com/facebook/react/issues/14259#issuecomment-439632622



