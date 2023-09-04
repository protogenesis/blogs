---
title: "部署 Github pages 遇到的问题"
description: "Github Pages SEO，怎么做 SEO？"
author: protogenesis
---

# 部署 Github Pages

当部署某个项目到 Github Pages 的时候，只需要根据网上的教程操作就可以了。

但是在实际部署完以后发现，在项目中 Readme 的跳转链接中如果带有一些英文字符，则无法正确的解析。

例如：

```markdown
[跳转链接](./跳转链接所在的文件名(这是英文括号).md)
```

链接的 URL 文件名，在 Github Pages 中点击跳转的话会打开一个乱码的 markdown 页面，出现这种问题的解决方案是把英文字符改成中文字符。

继续测试发现当把后缀名 ```.md``` 去掉的话，即使包含英文字符也能正常解析，但是在 Github 中点击该链接就无法打开对应的文件了（因为 .md 被去掉了，当前仓库找不到对应的文件了）。

最后还是选择了通过将英文字符改成中文字符这种方式，在 Github Pages 和 Github 仓库里面都是正常打开。

**SEO**

搭建完毕以后，默认情况下你的页面是没有 mate 标签的一些相关信息的，如果你需要做到更好的 SEO，则需要通过 Jekyll 提供的一些插件来实现。下面介绍一下使用 Front matter 格式在文章的开头插入标记，以便 Jekyll 动态生成 mate 标签的功能。

在使用 Jekyll 解析 Markdown 文件并部署到 GitHub Pages 时，你可以通过配置 Jekyll 的头部信息（Front Matter）来添加 SEO 信息。Front Matter 是位于文件开头的一段 YAML 格式的元数据，可以在其中设置页面的各种属性，包括 SEO 相关的信息。以下是一些常见的 SEO 相关的 Front Matter 配置项：

1. 在你的 markdown 文件中，插入这段代码，然后将你需要修改的地方改成你想要的信息，不需要的删除即可。

   ```yml
   ---
   layout:      # 指定页面布局
   title:       # 页面标题
   description: # 页面描述
   keywords:    # 页面关键词
   author:      # 作者
   date:        # 发布日期
   modified:    # 最后修改日期
   image:       # 页面主图像 URL
   ---
   ```

2. readme 中不能含有 front matter 标记，否则在构建后页面无法打开，而是需要通过在根目录的 _config.yml 文件中配置（如果没有此文件则新建一个）：

   ```yml
   title   : 网站标题
   description: 网站描述
   ```

   



References:

> https://jekyll.stevefenton.co.uk/about/front-matter/
