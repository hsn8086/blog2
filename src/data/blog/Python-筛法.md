---
title: Python筛法
date: 2025-06-13 20:53:00
katex: true
tags:
  - 算法
  - python
  - 模板
  - 筛法
  - 数论
reprintPolicy: cc_by_nc_nd
---
# 欧拉筛(线性筛)
``` python
def euler_sieve(n):
    pri = []
    not_prime = bytearray(n + 1)
    for i in range(2, n + 1):
        if not not_prime[i]:
            pri.append(i)
        for p in pri:
            if i * p > n:
                break
            not_prime[i * p] = 1
            if i % p == 0:
                break
    return pri
```