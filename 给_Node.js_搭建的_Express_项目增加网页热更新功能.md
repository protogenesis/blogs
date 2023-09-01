---
title: "给 Node.js 搭建的 Express 项目增加网页热更新功能"
description: "Node.js 脚手架，项目结构，Live server"
author: protogenesis
---

通过 Node.js 和 Express 搭建的后台项目，通过 Express 来渲染 HTML 模版，虽然后端可以通过 [nodemon](https://www.npmjs.com/package/nodemon) 来实现热更新，但是热更新后并不会直接反应到网页上，而是要刷新一遍，因为浏览器并没有热更新。

解决这个问题的办法就是通过 [Live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 这个插件。

具体流程如下：

1. 先在编辑器上安装这个插件，推荐使用 VS Code；
2. 在浏览器上安装一个 Live Server 插件，[Chrome](https://chrome.google.com/webstore/detail/live-server-web-extension/fiegdmejfepffgpnejdinekhfieaogmj/) 或 [Firefox](https://addons.mozilla.org/en-US/firefox/addon/live-server-web-extension/)；
3. 启动你的 Express 服务，并且能够正常访问项目；
4. 打开你的浏览器插件，填写项目信息：
   1. 项目地址，即浏览器中项目的访问网址
   2. Live Server 的地址，即 VS Code 中这个插件运行的地址，默认是 ```http://127.0.0.1:5000```
5. 在编辑器中启动 Live Server 服务（在 VS Code 编辑器中，右下角有一个“Go Live”选项）
6. 访问项目，当对文件作出修改时，网页会自动更新。

如果项目有用到预编译工具，例如 scss，less 等，请接着往下看：

如果项目有用到预编译工具，例如 scss，less 等，修改后不会自动热更新，要新建一个配置文件。

在根目录新建一个 .vocde 文件夹，在文件夹里新建一个 settings.json 文件，然后复制代码：

```json
{
  "liveServer.settings.root": "/",
  "liveServer.settings.ignoreFiles" : [
          ".vscode/**",
  ]
}	
```

保存或重启 Live Server，刷新网页，后面改动样式也会自动更新了。

参考：

> https://github.com/ritwickdey/live-server-web-extension/blob/master/docs/Setup.md
>
> https://github.com/ritwickdey/vscode-live-server/blob/master/docs/faqs.md#how-to-configure-the-settings-in-my-project

