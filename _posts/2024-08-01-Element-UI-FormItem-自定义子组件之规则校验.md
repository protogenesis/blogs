---
title: "Element UI FormItem 自定义子组件怎么进行规则校验"
author: protogenesis
---

背景：业务方觉得 Element UI 的 Input 密码输入框不能一直显示小眼睛图标，不太好看，提出了想一直显示的需求。

需求：看了 Element UI 的文档，没办法通过传递属性来实现，于是需要自己对 Input 密码输入框进行二次封装。

要实现的功能：

1. 对 `<ElInput>` 组件进行二次封装，支持一直显示小眼睛图标，并且可以切换明文和密码两种模式
2. 通过 `<ElFormItem>` 组件嵌套的时候能支持像 `<ElInput>` 组件的自动校验
3. 当使用组件时，支持像 `<ElInput>` 组件的传参 TS 提示

方案：

1. Vue $attrs 可以拿到所有的属性和事件，但是组件在消费的时候，没有 `<ElInput` 那样的类型自动提示，解决办法是通过 `defineProps` 定义类型，然后对 `$attrs`和`props` 进行合并
2. 通过 Element UI 提供的 useFormItem 在组件内部调用 `validate` 方法触发校验事件

二次封装组件 `<PwdInput>`:

```js
<template>
  <ElInput
    v-bind="{ ...props, ...$attrs }"
    :type="type"
    @blur="
      () => {
        formItem?.validate('blur')
      }
    "
    @change="
      () => {
        formItem?.validate('change')
      }
    "
  >
    <template #suffix>
      <icon-eye-outline
        @click="toggle"
        v-if="type === 'text'"
        class="icon-eye"
      />
      <icon-off-outline
        @click="toggle"
        v-if="type === 'password'"
        class="icon-eye"
      />
    </template>
  </ElInput>
</template>

<script setup lang="ts">
  import {} from 'vue'
  import { InputProps, useFormItem } from 'element-plus'

  const { formItem } = useFormItem()
  const props = defineProps<Partial<InputProps>>()

  const type = ref(props.type || 'password')

  const toggle = () => {
    type.value = type.value === 'password' ? 'text' : 'password'
  }
</script>

<style scoped lang="scss">
  .icon-eye {
    cursor: pointer;
  }
</style>

```

使用 `<PwdInput>` 组件：

```js
<template>
  <ElForm :rules="...{}"">
    <ElFormItem label="密码" prop="password">
      <PwdInput v-model="password" />
    </ElFormItem>
  </ElForm>
</template>
```

参考：

> [https://github.com/element-plus/element-plus/blob/e48eec1c5804b99872aee18a1f33dd83bf118f7e/packages/components/input/src/input.vue#L266](https://github.com/element-plus/element-plus/blob/e48eec1c5804b99872aee18a1f33dd83bf118f7e/packages/components/input/src/input.vue#L266)

> [https://github.com/element-plus/element-plus/blob/e48eec1c5804b99872aee18a1f33dd83bf118f7e/packages/components/input/src/input.vue#L481](https://github.com/element-plus/element-plus/blob/e48eec1c5804b99872aee18a1f33dd83bf118f7e/packages/components/input/src/input.vue#L481)

> [https://github.com/element-plus/element-plus/blob/e48eec1c5804b99872aee18a1f33dd83bf118f7e/packages/components/form/src/form-item.vue#L397](https://github.com/element-plus/element-plus/blob/e48eec1c5804b99872aee18a1f33dd83bf118f7e/packages/components/form/src/form-item.vue#L397)

>[https://github.com/element-plus/element-plus/blob/e48eec1c5804b99872aee18a1f33dd83bf118f7e/packages/components/form/src/form.vue#L96](https://github.com/element-plus/element-plus/blob/e48eec1c5804b99872aee18a1f33dd83bf118f7e/packages/components/form/src/form.vue#L96)

> [https://github.com/element-plus/element-plus/blob/e48eec1c5804b99872aee18a1f33dd83bf118f7e/packages/components/form/src/hooks/use-form-item.ts#L16](https://github.com/element-plus/element-plus/blob/e48eec1c5804b99872aee18a1f33dd83bf118f7e/packages/components/form/src/hooks/use-form-item.ts#L16)