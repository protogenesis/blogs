---
title: "什么时候使用 useMeo、useCallback（译）"
not_excerpt: "React 进阶，性能优化，技术博客翻译"
author: protogenesis
---

什么时候应该使用 useMemo 和 useCallback 呢？

先说结论：大多数情况下都不需要用。

### useMemo 和 useCallback 的作用

两者的作用都用于性能优化，但是性能优化也是有成本的。使用它们不一定能提升性能，但是一定会增加使用成本。

### 所以到底什么时候用 useMemo 和 useCallback

React 提供这两个 hooks 有以下原因：

1. 引用比较造成的 re-render
2. 复杂（耗费性能）的计算



#### 引用比较

在 React 中，两种情况会对引用比较造成影响：

##### 依赖项（dependency list）

例如以下代码会存在一个问题：

```js
function Foo({bar, baz}) {
  const options = {bar, baz}
  React.useEffect(() => {
    buzz(options)
  }, [options]) // 我们想在 bar，baz 改变的时候重新执行
  return <div>foobar</div>
}

function Blub() {
  return <Foo bar="bar value" baz={3} />
}
```

这个问题就是 useEffect 会在 re-render 的时候对依赖项做一个「引用浅比较」，所以每一次的 options 都是一个全新的对象，所以 React 在判断依赖项是否更改的时候，总是会返回 true，也就意味着 useEffect hook 在每一次 render 的时候都会执行，而不是只在 bar 或 baz 更改时才执行。

有两种修复的方案：

```js
// option 1
function Foo({bar, baz}) {
  React.useEffect(() => {
    const options = {bar, baz}
    buzz(options)
  }, [bar, baz]) // 我们想在 bar，baz 改变的时候重新执行
  return <div>foobar</div>
}
```

这一种方案在 bar 和 baz 是「原始数据类型」（primitive）时是有效的，但是在「非复杂数据类型」（non-primitive）- objects/arrays/functions 时这种方案就无效了。

```js
function Blub() {
  const bar = () => {}
  const baz = [1, 2, 3]
  return <Foo bar={bar} baz={baz} />
}
```



考虑到上述情况，于是就出现了 useMemo 和 useCallback：

```js
function Foo({bar, baz}) {
  React.useEffect(() => {
    const options = {bar, baz}
    buzz(options)
  }, [bar, baz])
  return <div>foobar</div>
}

function Blub() {
  const bar = React.useCallback(() => {}, [])
  const baz = React.useMemo(() => [1, 2, 3], [])
  return <Foo bar={bar} baz={baz} />
}
```

> 以上情况对其他应用「依赖项」的 hooks 同样适用
>
> 例如：useEffect、useLayoutEffect、useCallback、useMemo

### React.memo

代码示例：

```js
function CountButton({onClick, count}) {
  return <button onClick={onClick}>{count}</button>
}

function DualCounter() {
  const [count1, setCount1] = React.useState(0)
  const increment1 = () => setCount1(c => c + 1)

  const [count2, setCount2] = React.useState(0)
  const increment2 = () => setCount2(c => c + 1)

  return (
    <>
      <CountButton count={count1} onClick={increment1} />
      <CountButton count={count2} onClick={increment2} />
    </>
  )
}
```

在上述代码中，每一次点击任意一个按钮时，```DualCounter``` 组件的状态都会更新，然后触发 re-render，导致每一个 ```CountButton``` 组件都被重新渲染。但是我们实际上只需要 re-render 我们点击的那一个按钮。所以在点击第一个按钮时，第二个按钮也跟着重新渲染了，但是其实第二个按钮的状态并没有变，这种情况叫做 「unnecessary re-render」。

**大多数情况下其实你不需要在意组件是否存在不必要的渲染**。因为 React 本身实际上是非常快的。

但是，在某些情况下渲染过程可能会持续一段时间，例如高阶交互（Graphs/Charts/Animations/etc.）这种情况下 useMemo 就派上用场了：

```js
const CountButton = React.memo(function CountButton({onClick, count}) {
  return <button onClick={onClick}>{count}</button>
})
```

现在 ```CountButton``` 组件只有在 props 更新的时候才会 re-render。

但是还存在一个问题，在 ```DualCounter``` 组件中，我们定义了 ```increment1```，```increment2``` 两个函数，这意味着每一次 ```DualCounter``` 组件 re-render，这两个函数都是被重新定义成一个新的函数，并不等于上一次 render 的函数，所以会导致 两个 ```CountButton``` 组件都重新渲染（re-render）。这种情况下 useCallback 就派上用上了：

```js
const CountButton = React.memo(function CountButton({onClick, count}) {
  return <button onClick={onClick}>{count}</button>
})

function DualCounter() {
  const [count1, setCount1] = React.useState(0)
  // ⬇️
  const increment1 = React.useCallback(() => setCount1(c => c + 1), [])

  const [count2, setCount2] = React.useState(0)
  // ⬇️
  const increment2 = React.useCallback(() => setCount2(c => c + 1), [])

  return (
    <>
      <CountButton count={count1} onClick={increment1} />
      <CountButton count={count2} onClick={increment2} />
    </>
  )
}
```

现在 ```CountButton``` 不会再有 「unnecessary re-render」了。

**再次强调**：我强烈建议不要使用 ```React.memo```（或者是类似的：```pureComponent```/```shouldCOmponentUpdate```），因为使用它不一定会有性能提升，但是肯定会有使用的成本。除非你已经确定它可以带来可见的性能提升。

#### 复杂（耗费性能）的计算

useMemo 成为一个 React hook 还有一个原因，就是你可以保存一个值：

```js
function RenderPrimes({iterations, multiplier}) {
  const primes = React.useMemo(
    () => calculatePrimes(iterations, multiplier),
    [iterations, multiplier],
  )
  return <div>Primes! {primes}</div>
}
```

即使定义一个函数，在每次 render 中都去计算 primes 的值，React 仅会在 primes 需要用到的时候才去获取。React 同样会保存上一次输入参数后返回的值，如果下一次输入相同的参数，返回的就是上一次返回的值，这是 React 的「memoization」的作用。

### 总结

使用 useCallback 和 useMemo 会使代码更加复杂，并且不利于协同开发，你可以会漏掉一个依赖项；而且在调用 useCallback/useMemo 这些 hooks 时，有可能会带来更糟糕的性能，因为它中断了垃圾回收机制「garbage collection」。但是如果能够带来可见的性能提升的话，这个成本都是可以承受的。

> References:
>
> https://kentcdodds.com/blog/usememo-and-usecallback





