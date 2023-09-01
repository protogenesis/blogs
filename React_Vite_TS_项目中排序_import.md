---
title: "React / Vite / TS 项目中排序 import"
description: "前端工程化，构建工具，ESLint, import order"
author: protogenesis
---

# React + Vite + TS 项目中排序 import 

使用此方案前：

```tsx
// import 语句排序混乱，不够直观
// 通过手动调整比较耗费时间和精力

import react from 'react'
import a from './a'
import moment from 'moment'
import './style.css'
import { Modal } from 'antd'
```



使用此方案后：

```tsx
// import 语句按照规则排序，清晰明了

import react from 'react'
import moment from 'moment'
import { Modal } from 'antd'

import a from './a'

import './style.css'
```



使用此方案后的模块引入代码更加直观，利于 Code Review 和保持代码风格一致。



使用此方案前置条件：

- 使用 tsx 语法
- 使用 ESLint 并且代码编辑器中已经安装了 ESLint 插件



实现步骤：

1. 安装开发依赖：

   1. ```shell
      pnpm install @typescript-eslint/parser eslint eslint-plugin-import eslint-plugin-prettier prettier typescript -D
      ```

      

2. 配置 ```eslintrc``` 文件，如果没有该文件，可以自行在根目录创建 ```.eslintrc.js``` 文件，然后添加以下规则：

   1. ```shell
      /* eslint-env node */
      module.exports = {
        parser: "@typescript-eslint/parser",
        plugins: ["prettier", "import"],
        extends: ["eslint:recommended"],
        rules: {
          "import/order": [
            "error", // 错误类型，error => 语法错误报红提示
            {
              // groups 为 import 的顺序
              groups: [
                // 内置模块
                "builtin",
                // 外部模块 例如：react，antd，material-ui
                "external",
                // 内部模块，例如你设置了别名 @ 指向当前 src 文件夹，通过 import A from '@/a' 的方式导入的则匹配
                "internal",
                // 未知的模块
                "unknown",
                // 相对路径模块，例如 ./ 或 ../，这里用中括号包裹是因为可以把它们看做一个排序组，用于下方的插入新行规则
                ["parent", "sibling", "index"],
                // 对象模块，例如 import { SayHi } from './b'
                "object",
                // 类型模块
                "type",
              ],
              // 在每一个排序组中插入新行，用于格式化
              "newlines-between": "always",
            },
          ],
        },
      }
      
      ```

3. 重启当前程序后即可看到，如果 import 没有按照规则填写，则会出现错误提示，此时可以通过手动或者编辑器的快速修复（ctrl + .）修复问题。



> [order-import](https://www.npmjs.com/package/order-imports) 

> https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md