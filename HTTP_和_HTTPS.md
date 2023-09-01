---
title: "HTTP 和 HTTPS"
description: "HTTP 和 HTTPS 的区别，介绍"
author: protogenesis
---

在我们输入一个网址并按回车后，浏览器会自动加上一个 http(s): 的前缀，那么这两者的区别是什么呢？

## HTTP

HTTP 全称 Hypertext Transfer protocal，即超文本传输协议，浏览器与服务器进行通信一般是通过 HTTP 协议进行的。

**HTTP 网站的特点：**
当用户访问该网站时，数据通信都是明文传输的，在通信的过程中，明文数据在网络传输中裸奔，例如在进行购买商品的操作时填写的一些个人信息，如手机号码、地址、密码，或者是信用卡号，黑客可以直接通过这些明文数据盗取你的账户；对于用户来说，是非常不安全的，所以 HTTPS 应运而生。

## HTTPS

HTTPS 全称 Hypertext Transfer Protocal Security，即超文本安全传输协议。

**HTTPS 网站的特点：**
顾名思义，HTTPS 的数据都是加密过后才进行传输的，在网络传输中，因为数据经过了 HTTPS 加密，即使黑客拿到了数据，得到的也只会是一段没有意义的加密后的文本。

**HTTPS 加密的方式：**
HTTPS 一般通过以下两种方式来进行加密：

1. SSL
2. TSL

**SSL**
SSL 全称 Security Socket Layer，通过 SSL 进行数据传输的网站通常客户端会先发起一个请求，请求会验证服务器的证书是否匹配，服务器收到请求后要返回安全证书，匹配通过后才进行加密数据的传输。

**TSL**
TSL 全称 Transfer Security Layer，TSL 是基于 SSL 的，但是 TSL 的加密算法是最新的工业标准级加密。

#### 使用 HTTP 的网站排名会靠后

在一些搜索引擎中，对于使用 HTTP 的网站，它的一个网页排名（Page Rank）会比使用 HTTPS 的网站要靠后，所以现在大部分网站即使没有进行敏感的数据传输也会使用 HTTPS 协议。

## 总结：

综上来说，使用 HTTPS 对于网站和用户来说都更加有利，它代表了更高的网页曝光率更安全的数据传输。
购买 HTTPS 服务应该越早越好。