---
title: "Jotai 源码解读"
description: "Jotai 源码，useReducer 用法，状态管理库"
keywords: React, Jotai, useReducer, store, state management
author: protogenesis
---

[Jotai](https://jotai.org/) 是 React 生态中的一个状态管理库，它提供了便捷的 API，使用起来很灵活，下面是通过阅读源码发现的一些实现原理。



Jotai 中的数据（store）通过 memory 保存，和框架没有关系，内部的 store 实例使用了 WeakMap 做 atom 的映射，并且允许存在多个 store 实例，如果需要对不同的 store 对象进行隔离，可以在 React 中使用 jotai 提供的 Provider 组件，但是一般在项目开发中，只会用到一个 store 实例。



useAtomValue 通过 [useReducer ](https://github.com/pmndrs/jotai/blob/f1590d48fcf09f701a403ea1ae233de490bcc64d/src/react/useAtomValue.ts#L62)来触发 re-render：

```tsx
import { useStore } from 'jotai'

// 源码简化版
export function useAtomValue(atom) {
  // 获取 store 实例
  const store = useStore()

  const [[valueFromReducer, storeFromReducer, atomFromReducer], rerender] =
    useReducer(
      (prev) => {
        const nextValue = store.get(atom)
        if (
          Object.is(prev[0], nextValue) &&
          prev[1] === store &&
          prev[2] === atom
        ) {
          return prev
        }
        return [nextValue, store, atom]
      },
      undefined,
      () => [store.get(atom), store, atom]
    )

  let value = valueFromReducer

  useEffect(() => {
    const unsub = store.sub(atom, () => {  // * 监听变化
      rerender()
    })
    
    rerender()
    return unsub
  }, [store, atom])

  return value
}
```



```jsx
import { atom, useAtomValue } from 'jotai'

export const valueAtom = atom("hello")

export function Greeting() {   
    const value = useAtomValue(valueAtom)
    
    return <p>{value}</p>
}
```

如果 value 的值发生变更，Jotai 会比较这个 atom 的值，如果上次的值和这次的值不相同，则会修改 store 中的值，然后发通知给订阅了这个 atom 的函数（用上面的代码中用 * 注释标记了），函数 A 中调用当前 react 上下文中 reducer 的 dispatch 方法来更新视图，通过这种方式修改 state，可以应用于多个 React 实例中，只要一个地方更改了 value，所有获取了 value 值的 React 上下文都会触发重新渲染，因为当前的 value 并不是存在某一个 React 实例当中。