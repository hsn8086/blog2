---
title: ICPC 2024 台中 B. 保龄球 题解
date: 2024-12-14 14:51:41
katex: true
tags:
  - ACM
  - 算法
  - 题解
  - ICPC
reprintPolicy: cc_by_nc_nd
---
# 解题思路
可很容易推导,无论黑白瓶比例为多少,必然有一种办法在每一行颜色相同的情况放下所有的瓶.

注意到,理想状态下(_球瓶框架边长为实数_)球瓶框架边长$x$满足方程$x(x+1)/2=w+b$,可转换为$f(x)=x(x+1)-2(w+b)$与$f(x)=0$,则$f'(x)=2x+1$,由牛顿迭代得出结果并向下取整.
# 代码实现
``` python
import math


def newton_method(f, fd, x0, eps=1e-10, max_iter=100):
    x = x0
    for _ in range(max_iter):
        fx = f(x)
        if abs(fx) < eps:
            return x
        x = x - fx / fd(x)
    return x


ntc = int(input())
for _ in range(ntc):
    w, b = map(int, input().split())
    rst = newton_method(
        lambda x: x**2 + x - 2 * (w + b),
        lambda x: 2 * x + 1,
        100000,
    )
    print(math.floor(rst))

```