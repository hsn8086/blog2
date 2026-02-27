---
title: CF2032D - Codeforces Round 983 (Div. 2) C. Trinity 题解
date: 2025-02-27 14:51:41
katex: true
tags:
  - 算法
  - 题解
  - CodeForces
reprintPolicy: cc_by_nc_nd
---
# 思路
不难注意到,要保证$c,d,e$可以组成三角形, 即要保证$a,b,f$可以组成三角形即可($a\le b \le c \le d \le e \le f$).
若一个数组(以下简写为$a$)已经有序, 只需要保证$a_0 + a_1 > a_{-1}$即可保证$a$是 "所有互不相同的三元组都成三角形" 的数组.
对于"操作" 中的 "赋值", 不难注意到, 可以直接忽略 "赋值"这一操作的影响.
所以我们只要对数组进行排序, 并可以找出保证条件成立的最长子数组, 原数组长度减去最长子数组长度即为答案.
通过维护一个滑动窗口, 确保窗口内的元素满足三角形条件, 得出最长子数组.
## 优化
了简化计算, 我们可以预先计算$b_i = a_i + a_{i+1}$, 这样在判断三角形条件时可以直接使用$b_i$​来替代$a_i+a{i+1}$.​

# 题解代码
``` python
for _ in range(int(input())):
    n = int(input())
    a = sorted(map(int, input().split()))
    b = [sum(i) for i in zip(a[1:], a[:-1])]
    left = 0
    right = 2
    rst = n - 2
    while right < n:
        while a[right] - b[left] >= 0 and right - left >= 2:
            left += 1
        rst = min(rst, n - (right - left + 1))
        right += 1
    print(rst)

```