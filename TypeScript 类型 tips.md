#### 从对象类型衍生一个 union 类型

```typescript
export const fruitCounts = {
    apple: 1,
    pear: 4,
    banana: 26,
}

type FruitCounts = typeof fruitCounts

/*
type SingleFruitCount =
  | {
      apple: number
    }
  | {
      banana: number
    }
  | {
      pear: number
    }
*/

type SingleFruitCount = {
    [K in keyof FruitCounts]: {
        [k2 in K]: FruitCounts[K]
    }
}[keyof FruitCounts]


const singleFruitCount: SingleFruitCount = {
    apple: 2
}
```



#### 使用 in 操作符转换一个 union 为另一个 union

```typescript
export type Entity =
  | {
      type: "user"
    }
  | {
      type: "post"
    }
  | {
      type: "comment"
    }

/**
	type EntityWithId = ({
    type: "user";
} & Record<"userId", string>) | ({
    type: "post";
} & Record<"postId", string>) | ({
    type: "comment";
} & Record<"commentId", string>)
*/

type EntityWithId = {
  [EntityType in Entity["type"]]: {
    type: EntityType
  } & Record<`${EntityType}Id`, string>
}[Entity["type"]]

const result: EntityWithId = {
    type: 'comment',
    commentId: '132',
}
```



#### 使用 *extends* 关键字推测泛型的值

```typescript
export const getDeepValue = <
    Obj,
    FirstKey extends keyof Obj,
    SecondKey extends keyof Obj[FirstKey]
>(
    obj: Obj,
    firstKey: FirstKey,
    secondKey: SecondKey
)=> {
    return obj[firstKey][secondKey]
}

const obj = {
    foo: {
        a: true,
        b: 2
    },
    bar: {
        c: 'cool',
        d: 2,
    }
}

// result: number
const result = getDeepValue(obj, "bar", "d")
```



#### 接收任意 React 组件的 Props 类型

```tsx
import React from 'react'

const MyComponent = (props: {enabled: boolean}) => {
  return null
}

class MyOtherComponent extends React.Component<{
  enabled: boolean
}>{}

type PropsFrom<T> = T extends React.FC<infer Props> ? Props : 
T extends React.Component<infer Props> ? Props : never

const props: PropsFrom<typeof MyComponent> = {
	enabled: true,
}
```



#### 使用泛型创建动态 React 组件

```tsx
import React from 'react'

interface TableProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

export const Table = <T,>(props: TableProps<T>) => {
  return null
}

const Component = () => {
  return (
  	<Table<{id: string}>
      items={[
        {
          id: '1',
        }
      ]}
      renderItem={(item) => <div>{item.id}</div>}
      >
    </Table>
  )
}
```



#### union 小技巧

```typescript
// IconSize: string
type Size = "sm" | "xs" | string 

// type IconSize = "sm" | "xs" | Omit<string, "xs", "sm">  
type Size2 = "sm" | "xs" | Omit<string, "xs", "sm"> 

type LooseAutocomplete<T extends string> = T | Omit<string, T> 
```



#### 使用泛型动态定义函数的参数类型

```typescript
export type Event =
    | {
        type: "LOG_IN"
        payload: {
            userId: string
        }
    }
    | {
        type: "SIGN_OUT"
    }

const sendEvent = <Type extends Event["type"]>(
    ...args: Extract<Event, { type: Type }> extends { payload: infer TPayload }
        ? [Type, TPayload]
        : [Type]
) => { }

sendEvent('LOG_IN', {
    userId: "1",
})

sendEvent("SIGN_OUT")
```



#### 遍历 union

```typescript
export type Letters = "a" | "b" | "c"

type RemoveC<TType> = any

// type WowWithoutC = "a" | "b"
type WowWithoutC = RemoveC<Letters>
```



#### 使用一个 "本地" 泛型来 "保存" 临时类型

```typescript
type ValuesOfKeysStartingWithA<
    Obj,
    _ExtractedKeys extends keyof Obj = Extract<keyof Obj, `a${string}`>
> = {
    [K in _ExtractedKeys]: Obj[K]
}[_ExtractedKeys]

export type Obj = {
  a: "a"
  a2: "a2"
  a3: "a3"
  b: "b"
  b1: "b1"
  b2: "b2"
}

// type NewUnion = "a" | "a2" | "a3"
type NewUnion = ValuesOfKeysStartingWithA<Obj>
```



#### assertion function 之 class

```typescript
export class SDK1 {
  constructor(public loggedInUserId?: string) {}

  createPost(title: string) {
    this.assertUserIsLoggedIn()

    // this.loggedInUserId: string | undefined  // *
    this.loggedInUserId
    this.createPost(title)
  }

  assertUserIsLoggedIn() {
    if (this.loggedInUserId) {
      throw new Error("User is not logged in")
    }
  }
}


export class SDK2 {
    constructor(public loggedInUserId?: string) { }

    createPost(title: string) {
        this.assertUserIsLoggedIn()
				
      	// this.loggedInUserId: string // *
        this.loggedInUserId
        this.createPost(title)
    }

    assertUserIsLoggedIn(): asserts this is this & { // *
        loggedInUserId: string
    } {
        if (this.loggedInUserId) {
            throw new Error("User is not logged in")
        }
    }
}

```



#### 使用 infer 与字符串字面量操作对象的成员

```typescript
interface ApiData {
    "maps:longitude": string
    "maps:latitude": string
    awesome: boolean
}

type RemoveMaps<T> = T extends `maps:${infer U}` ? never : T

type RemoveMapsFromObj<T> = {
    [K in keyof T as RemoveMaps<K>]: T[K]
}

/*
type DesiredShape = {
    awesome: boolean;
}
*/
type DesiredShape = RemoveMapsFromObj<ApiData>
```

