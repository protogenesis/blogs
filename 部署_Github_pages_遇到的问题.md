---
title: "部署 Github pages 遇到的问题"
description: "Github Pages SEO，怎么做 SEO？"
author: protogenesis
---

当部署某个项目到 Github Pages 的时候，只需要根据网上的教程操作就可以了。

但是在实际部署完以后发现，在项目中 Readme 的跳转链接中如果带有一些英文字符，则无法正确的解析。

例如：

```markdown
[跳转链接](./跳转链接所在的文件名(这是英文括号).md)
```

链接的 URL 文件名，在 Github Pages 中点击跳转的话会打开一个乱码的 markdown 页面，出现这种问题的解决方案是把英文字符改成中文字符。

继续测试发现当把后缀名 ```.md``` 去掉的话，即使包含英文字符也能正常解析，但是在 Github 中点击该链接就无法打开对应的文件了（因为 .md 被去掉了，当前仓库找不到对应的文件了）。

最后还是选择了通过将英文字符改成中文字符这种方式，在 Github Pages 和 Github 仓库里面都是正常打开。