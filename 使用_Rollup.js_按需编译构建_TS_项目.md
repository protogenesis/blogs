---
title: "使用 rollup.js 按需编译构建 TS 项目"
description: "前端，构建工具，打包，按需加载，TypeScript"
author: protogenesis
---

假设你有以下项目结构：

````
```
project
│   README.md
│		rollup.config.js
│		tsconfig.json
└───package
│    └───src       
│      │  └───core
│      │  │   │   index.ts
│      │  │   │    file.ts
│      │  │ 
│      │  └───plugin
│      │  │    └───a
│      │  │ 			│	index.ts
│      │  │    └───b
│      │  │ 			│	index.ts

```
````

如果能够分别把 src 文件夹下面的 core 和 plugin 分别打包编译 TS，然后生成不同的 dist 文件夹呢？



例如：当我打包 src/core 文件夹时，不需要管 src/plugin 文件夹的内容，打包后的内容是一个 dist 文件夹，位于 src/core 目录，里面包含编译后打包好的文件。而当我打包 src/plugin/a 文件夹时应该也是同上。



在一番摸索之后发现使用 Rollup 官方提供的功能无法实现，因为编译后的 TS 文件是根据当前 tsconfig.json 中配置的包含文件来编译的，而 tsconfig.json 在我们的根目录上。导致最终编译后的文件包含了其他不需要的文件，例如：当我在打包 src/core 文件夹时， plugin 文件夹也会被 TS 编译。而解决问题的关键在于动态的修改 tsconfig.json 中的包含文件（include 字段）。

> 摸索方案：
>
> rollup.config.js 中 input 字段配置成对象形式、数组形式
>
> 修改 tsconfig.json 字段
>
> 修改 @rollup/plugin-typescript 包配置





解决方案：

使用 Node.js 来分别打包，生成不同的 dist 文件夹。

完整项目已发布到 Github: https://github.com/protogenesis/Rollup-TS-for-npm-plugins