---
title: CF2044D - Codeforces Round 993 (Div. 4) D. Harder Problem
date: 2024-12-18 14:51:41
katex: true
tags: [ CodeForces,算法,题解 ]
reprintPolicy: cc_by_nc_nd
---
# 前言
本来想着dict是ordered的,直接用dict查重+查询就能过了,没想到被卡哈希了.既然哈希不行,py中也没红黑树实现的set,那就直接排序查重吧.
# 解题思路
要保证$a_i$在$[b_1,b_2,b_3,...,b_i]$中是众数,只要保证$b_n$任意数都众数,即$b_n$无重复数,和保证$a_i$在$b_n$中且所在位置$j \leq i$,按照此思路即可构造出符合要求的数组.
# 实现原理
## 排序
既要保证插入顺序,又要排序,那只能是创建一个元组,记录顺序和值,py中的`enumerate`很好的实现了这点需求,而后用`sorted(a,key=lambda x:x[1])`即可得到按值排序的数组.

## 去重
去重就很简单了,排序之后相同值是挨在一起的,可以在线性时间内完成去重.

## 重排
按插入时的顺序重新排序即可.

## 构造
已有sorted数组和ordered数组,将sorted数组中间的空隙提出放在$b_n$尾部即可

# 实现代码
``` python
from itertools import chain, pairwise


def dedup_sort(a):
    lst = sorted(enumerate(a), key=lambda x: x[1])  # 按值排序

    sorted_lst = [lst[0]]
    for e in lst[1:]:  # 去重
        if sorted_lst[-1][1] != e[1]:
            sorted_lst.append(e)

    ordered_lst = sorted(sorted_lst, key=lambda x: x[0])  # 按插入顺序排序
    return map(lambda x: x[1], sorted_lst), map(lambda x: x[1], ordered_lst)  # 输出


for _ in range(int(input())):  # 处理多tc
    n = int(input())
    sorted_a, ordered_a = dedup_sort(map(int, input().split()))

    print(
        *ordered_a,  # 输出ordered数组
        *chain.from_iterable(  # 输出间隙
            map(
                lambda t: range(t[0] + 1, t[1]), pairwise(chain([0], sorted_a, [n + 1]))
            )
        ),
    )

```
