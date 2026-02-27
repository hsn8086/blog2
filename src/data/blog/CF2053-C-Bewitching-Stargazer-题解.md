---
title: "CF2053C - Good Bye 2024: 2025 is NEAR C. Bewitching Stargazer 题解"
date: 2025-01-21 14:51:41
katex: true
tags:
  - 算法
  - 题解
  - CodeForces
reprintPolicy: cc_by_nc_nd
---
# 解题思路
由题意知, 每次观测完Iris都会把区间二等分, 易知左边区间和右边区间的幸运点**一一对应**$^{\text{†}}$, 且值右区间每个幸运点分别减去左区间对应的幸运点都等于中值.所以每次只需求左区间幸运点值之和和幸运点数量,并由此求出右区间幸运点值之和,两者相加即为答案.( 如当前区间为奇数长度, 还需加上中点值) 时间复杂度为$O(n)$. 

---
$^{\text{†}}$两区间的幸运点**一一对应**, 即对于区间$a$上的任意幸运点$a_i$, 在区间$b$上存在对应的幸运点$b_i$, 反之亦然.

# 代码
``` python
import sys

sys.setrecursionlimit(114514) # 设置递归上限


def check(start: int, end: int, k: int) -> tuple[int, int]:
	"""
	检查当前区间的所有幸运点和幸运点数量.
	"""
    if end - start + 1 < k: # 终止条件, 当小于k时停止检查.
        return 0, 0

    mid = (start + end) // 2 # 求中点
    luck = mid if (start - end + 1) % 2 == 1 else 0 # 判断当前区间是否为奇数, 为奇数则设置幸运值为中点值.

    l_rst, l_luck_point = check(start, mid + (-1 if luck else 0), k) # 向下递归, 获取左区间的幸运点值之和和幸运点数
    r_rst = l_rst + mid * l_luck_point # 由幸运点数量和左区间幸运点值求右区间幸运点值

    return (
        l_rst + r_rst + luck, # 返回左区间右区间和当前区间幸运点值之和
        2 * l_luck_point + (1 if luck else 0),# 返回数量和
    )


for _ in range(int(input())):
    n, k = map(int, input().split())
    print(check(1, n, k)[0])
```