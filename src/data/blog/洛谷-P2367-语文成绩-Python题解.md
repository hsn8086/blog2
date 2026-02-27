---
title: "洛谷 P2367.语文成绩 Python题解"
date: 2025-01-24 14:51:41
katex: true
tags:
  - 算法
  - 题解
reprintPolicy: cc_by_nc_nd
---
# 解题思路
## 抽象输入
> 以前经常开玩笑给py写上cin cout, 没想到, 这次真得手写cin了...

> 乍一看, 这题不就是差分吗? 有什么难的? 上手写了啊, 写完一交, MLE! 不对, 肯定是读入存数组里炸了, 再试试, 改了改哈, 一交, MLE! 那肯定是读入字符串太多了, 上stdin, 又改了哈, 这次厉害, 一个个读入, 读完还del, 绝对不可能爆空间了, 一交, TLE!



点解呢? 全部读进来不行, 一个个读也不行, 那就折中, 一块块来. 
`chunk = sys.stdin.read(8192)`
而后一点点把数字提取出来. 即可正常解题. 
输入部分代码:
``` python
from collections.abc import Generator
import sys


def chunk_reader(func=int, chunk_size=1 << 15) -> Generator[int, None, None]:
    inp_cache = ""
    while True:
        chunk = sys.stdin.read(chunk_size) # 读入一块
        if not chunk: # 判断是否为结尾
            if inp_cache: # 判断缓存内是否还有内容
                yield func(inp_cache) # 输出
                del inp_cache # 删除缓存
            break # 跳出循环

        for c in chunk: 
            if c.isspace(): # 判断当前字符是否是空格或者换行
                if inp_cache: # 如果当前缓存有内容, 即代表此内容已经到了结尾
                    yield func(inp_cache) # 输出
                    del inp_cache 
                    inp_cache = "" # 删除缓存并重新初始化
            else:
                inp_cache += c # 否则把字符串加入缓存
            del c # 删除字符
        del chunk # 删除区块
```

## 真正的题解
频繁的区域变动当然是用差分啦, 不知道差分也没关系, 差分是一种非常高效的处理区间更新的方法, 假设老师在黑板上记录学生每天的课堂表现得分: 

- 周一: $10$分
- 周二: $15$分
- 周三: $12$分
- 周四: $18$分

差分就是每天得分的变化量: 

- 周一到周二: $+5$分 ($15 - 10 = 5$) 
- 周二到周三: $-3$分 ($12 - 15 = -3$) 
- 周三到周四: $+6$分 ($18 - 12 = 6$) 

这些变化量就是差分, 它反映了学生每天得分的增减情况. 只要知道了初值, 就可以很轻松的通过差分数组得出每个节点的数值情况.

回到本题, 我们只需要在差分数组$x-1$处标记$+z$, 在$y$处标记$-z$即可快速登记分数变动.

再耗费$O(n)$的时间还原出答案数组,求最小值即可. 总时间复杂度为$O(n+p)$


# 代码
``` python
inp = chunk_reader() # 上文有提到
n, p = next(inp), next(inp) # 取n和p

a = [next(inp) for _ in range(n)] # 取成绩数组
dif = [0 for _ in range(n + 1)] # 初始化差分数组
for _ in range(p):
    x, y, z = next(inp), next(inp), next(inp) # 取变动区间和变动值
    dif[x - 1] += z # 记录加分
    dif[y] -= z # 减回去

for i in range(1, n):
    dif[i] += dif[i - 1] # 还原数组
    
m = min(ai + di for ai, di in zip(a, dif)) # 求最小值
print(m) # 输出答案
```