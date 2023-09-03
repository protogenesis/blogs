---
title: "使用 Jekyll 搭建 Github Pages 指南"
not_excerpt: ""
author: protogenesis
---

# Jekyll 安装指南

使用 Jekyll 在 Github Pages 上面搭建一个博客站点，同时具有良好的 SEO 效果。

*安装建议：在下载软件和在终端执行命令建议都通过国外代理进行下载，避免因为网络原因导致的安装失败或者一直卡住*



这个指南主要针对 Windows 用户



安装步骤：

1. 在 https://rubyinstaller.org/downloads 上下载 RubyInstaller，自行选择对应的版本，我下载的是 [Ruby+Devkit 3.2.2-1 (x64)](https://github.com/oneclick/rubyinstaller2/releases/download/RubyInstaller-3.2.2-1/rubyinstaller-devkit-3.2.2-1-x64.exe)

2. 安装过程中注意事项：

   1. 勾选添加 Ruby 到环境变量
   2. 当安装完毕后弹出一个命令框时，提示你选择一个 MSYS2 component 安装，输入```3```，选第三个

3. 下载 [gem zip](https://rubygems.org/pages/download) 安装包，下载完毕后解压

4. 使用系统管理员权限打开 cmd，执行操作

   1. ```shell
      cd /d [zip 安装包解压后的文件夹路径]
      ```

   2. ```shell
      ruby setup.rb
      ```

   3. ```shell
      gem install bundler jekyll
      ```

5. 使用 jekyll 创建项目

   1. ```shell
      jekyll new my-awesome-site
      ```

      创建完毕后会自动执行 ```bundle install```，在使用代理的情况下应该会安装成功。如果没有成功，先 ```cd my-awesome-site``` 到文件夹，再手动执行 ```bundle install```

   2. 执行 ```jekyll serve --force_polling``` 启动项目

   3. 启动成功，打开 http://127.0.0.1:4000 预览项目，修改项目文件后，刷新页面可以看到效果。



References:

> https://ry09iu.github.io/note/jekyll/2020/01/30/jekyll-note.html
>
> https://jekyllrb.com/
>
> https://jekyllrb.com/docs/installation/windows/