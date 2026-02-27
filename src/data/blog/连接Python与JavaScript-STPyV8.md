---
title: 连接Python与JavaScript-STPyV8
date: 2024-09-06 00:00:00
tags: [ 编程,python,js,介绍 ]
reprintPolicy: cc_by_nc_nd
---

# 前言

最近解析legado书源遇到了调用js的需求.
py2js确实好用,但差在太老了,新标准的无法兼容让解析陷入极大的困境.
也试图寻找过其他库,但始终无法反向调用py的内容.
直到,找到了STPyV8.

# 简介

STPyV8是由Cloudflare维护的PyV8的fork.
他使Python与GoogleV8引擎的交互成为可能.
使用他可以将js代码嵌入py中,也可以从js调用py代码.
同时他还支持几乎所有平台.

# 安装

``` bash
pip install stpyv8
```

注: STPyV8仅支持Python3.9及以上版本.

# 使用

## 调用js

``` python
import STPyV8

with STPyV8.JSContext() as ctxt:
  upcase = ctxt.eval("""
    ( (lowerString) => {
        return lowerString.toUpperCase();
    })
  """)
  print(upcase("hello world!"))
```

## js调用py

``` python
import STPyV8

class MyClass(STPyV8.JSClass):
  def reallyComplexFunction(self, addme):
    return 10 * 3 + addme

my_class = MyClass()

with STPyV8.JSContext(my_class) as ctxt:
  meaning = ctxt.eval("this.reallyComplexFunction(2) + 10;")
  print("The meaning of life: " + str(meaning))
```
