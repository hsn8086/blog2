---
title: ICPC 2024 昆明 H.扫描地平线 题解
date: 2024-12-10 14:51:41
katex: true
tags:
  - ACM
  - 算法
  - 题解
  - ICPC
reprintPolicy: cc_by_nc_nd
---
# 解题思路
由题知,要保证无论在任何一个角度下,都能扫描到至少$k$个岛屿.即在最稀疏的部分也能保证最少$k$个岛屿被扫描.

那要做的就很简单了,只要把各个点映射到一个圆上,排序后再用长度为$k+1$的滑动窗口扫描一遍数组中的元素,求最大(_最稀疏_)的角度.

解释: 题中要求的是$k$个岛屿,但实际上只扫描$k$个元素的话不能保证偏移一点时仍能保证$k$个岛屿在窗口中,所以要$k+1$

# 代码实现
``` python
import math

ntc = int(input())
for _ in range(ntc):
    n, k = map(int, input().split())
    lst = []
    for _ in range(n):
        x, y = map(int, input().split())
        ang = math.atan2(y, x)  # 把点映射到圆上(通过反三角函数求角度)
        lst.append(ang)

    lst.sort()  # 排序

    lst.extend(map(lambda x: x + 2 * math.pi, lst[: k + 1]))  # 处理圆的连接处
    ans = max(lst[i + k] - lst[i] for i in range(0, n))  # 取最稀疏处的角度
    print(ans)

```