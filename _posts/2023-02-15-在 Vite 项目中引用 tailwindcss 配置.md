---
title: "在 Vite 项目中引用 TailWinCSS 配置"
not_excerpt: "怎么在 Vite 中使用 tailwind 配置变量？"
author: protogenesis
---

**问题**：在 tailwindcss 配置文件中配置的一些自定义变量，在项目文件中无法引用这个变量，例如：

```js
// 在项目中的 .tsx/.js 文件中无法引用这个颜色变量
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#17fd17",
      },
    },
  },
}
```

**解决方案：** tailwindcss 提供了一种[方案](https://tailwindcss.com/docs/configuration#referencing-in-java-script)，但是这种方案没有 Vite 的实现方式；下面是自己的实现方式。


**实现前提：**

- 项目根目录需要使用 ES module 的方式

实现方式主要分为四步：

1. 修改 postcss.config.js 导入导出格式

   ```js
   //
   import autoprefixer from "autoprefixer"
   import tailwind from "tailwindcss"
   import tailwindConfig from "./tailwind.config"

   export default {
     plugins: [tailwind(tailwindConfig), autoprefixer],
   }
   ```

2. 修改 tailwind.config.js 导出格式

   ```js
   export default {
      content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.tsx'],
      darkMode: 'class',
      theme: {
       extend: {
         colors: {
           primary: '#17fd17',
         },
       },
      },
      plugins: [],
    }
    ```

3. 在 vite.config.ts 中添加配置

   ```js
     import postcss from './postcss.config.js'
     export default defineConfig({
        css: {
          postcss,
        },
        // other configs
      })
      ```

4. 在项目文件中使用

   ```js
   import resolveConfig from 'tailwindcss/resolveConfig'

   import tailwindConfig from '../tailwind.config.js'

   const fullConfig = resolveConfig(tailwindConfig)
   console.log(fullConfig.theme.colors.primary) // #17fd17
   ```
   
---

供参考的模版项目地址：https://github.com/protogenesis/Renference-tailwind-configs-in-Vite

参考链接：
  > https://stackoverflow.com/questions/66402879/in-vite2-how-to-import-an-esmodule-in-tailwind-config-js/66406070#66406070

  > https://lobotuerto.com/notes/import-tailwind-config-in-vite

  > https://github.com/tailwindlabs/tailwindcss/discussions/3646
  
  > https://github.com/tailwindlabs/tailwindcss.com/issues/765