---
title: "JavaScript 之对象类型转换"
not_excerpt: "对象转换，前端，toString，valueOf，Symbol.toPrimitive"
author: protogenesis
---

#### 目录

1. 对象类型转换时的分类
2. 对象转换时的步骤
3. Symbol.toprimitive
4. toString和valueOf
5. 必须返回一个基础类型
6. 存在显示的 toString 方法
7. 摘要

##### 对象转换时先要确定转换的类型，这个类型在对象的`[Symbol.toPrimitive]`属性值-函数的参数中可以拿到，一共有三种：

1. string
2. number
3. default

**string**
以下两种情况会将确定对象的转换类型为 string：

1. 使用`alert(person)`
2. 将对象看做是一个对象的属性来取值时，例如`family[person]`

**number**
以下两种情况会将确定对象的转换类型为 number：

1. 使用一元数学操作符，例如`alert(+person)`
2. 使用比较运算符，例如`alert(person > 1)`

**default**
其他情况会确定对象的转换类型为 default：

- 相加操作，例如`alert(obj + 1)`
- 相等比较，例如`alert(obj == 2)`

##### 对象转换时的步骤

1. 先看对象内有没有`[Symbol.toPrimitive]`属性
2. 如果有，则执行该方法
3. 如果没有，则检查对象要转换的类型
4. 如果是 string，执行`toString()`或`valueOf()`方法，如果其中一种存在的话
5. 如果是 number，执行`valueOf()`或`toString()`方法，如果其中一种存在的话
6. 如果是 default，执行`valueOf()`或`toString()`方法，如果其中一种存在的话

下面是几个例子

- 有`[Symbol.toPrimitive]`属性：

```javascript
  let obj = {
    name: 'jack',
    money: 1,
    [Symbol.toPrimitive](hint) {
      console.log(hint);

      return hint == 'string' ? this.name : this.money;
    },
  };
  let person = {
    jack: 'property jack',
  };

  // hint equals to string
  alert(obj);  // jack
  alert(person[obj]) // property jack

  // hint equals to number
  alert(+obj); // 1
  alert(obj > 0); // true

  // hint equals to default
  alert(obj + 50); // 51
```

- 没有`[Symbol.toPrimitive]`属性

```javascript
  let obj = {
    name: 'jack',
    money: 1,
  };

  // hint equals to string, excutes the toString() and return [object object]
  alert(obj); // [object object]
  // hint equals to number, excutes the valueOf() and return the object itself
  alert(+obj); // NaN  
  // hint equals to default, excutes the valueof() and return the object itself
  alert(obj === obj);  // true  // do the same as (obj.valueOf() === obj);
  
```

##### 必须返回一个基础类型

无论是调用哪个函数，他都必须返回一个基本数据类型，如果返回的不是基本数据类型，在严格模式下会报错

##### 存在显示的 toString 方法

存在显示声明的`toString()`方法，并且不存在其他类型转换方法，例如`valueOf()`或者`[Symbol.toPrimitive]`，则无论对象是按照什么类型转换，都执行`toString()`方法。（存在显示的 toString，则只找 toString，不找 valueOf）

```javascript
 // if there exsits a toString(), and no other functions such as valueOf() or [symbol.toPromitive], then all the conversions will excute toString()
  let obj = {
    name: 'jack',
    money: 1,
    toString() {
      return  this.money;
    },
  };

  alert(obj); // 1
  alert(+obj); // 1 
  alert(obj + 9); // 10
```

##### 摘要

先确定对象是按照什么类型转换，一共有三种类型：

1. string
2. number
3. default

转换规则：

1. 先看对象内有没有`[Symbol.toPrimitive]`属性
2. 如果有，则执行该方法
3. 如果没有，则检查对象要转换的类型
4. 如果是 string，执行`toString()`或`valueOf()`方法，如果其中一种存在的话
5. 如果是 number，执行`valueOf()`或`toString()`方法，如果其中一种存在的话
6. 如果是 default，执行`valueOf()`或`toString()`方法，如果其中一种存在的话

> 参考：[https://javascript.info/objec...](https://javascript.info/object-toprimitive#symbol-toprimitive)