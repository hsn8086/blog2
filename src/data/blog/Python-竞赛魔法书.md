---
title: Python竞赛魔法书
date: 2025-06-14 16:00:00
katex: true
tags:
  - 算法
  - python
  - 模板
reprintPolicy: cc_by_nc_nd
---

# 输入
## 输入单个变量
Python 默认读入是字符串.
``` python
s = input()
```

若想转换成整数, 最简单的办法便是"强转".
``` python
n = int(input())
```

当然也可以读入一些其他类型, 比如说浮点.
``` python
n = float(input())
```

或者是十进制小数.
``` python
from decimal import Decimal

n = Decimal(input())
```

**注, 请不用使用 eval , 那会超级慢!**

## 输入多个变量
解包, 是一种将可迭代对象中的元素分成单个变量的技巧. 利用这一点我们可以简洁的读入一行多个值.
``` python
# map 并不对应 cpp 的树形映射表.
# 在 python 中, map 将给定的函数依次应用于迭代器的每一个元素, 并返回计算结果.
a, b, c = map(int, input().split()) # 注意, split默认以空白字符分割.
```

相同的, 输入也可以是其他类型, 比如浮点.
``` python
a, b, c = map(float, input().split())
```

## 输入一行列表
既然读入后返回的是一个迭代器 (生成器), 那我们也可以简单的转换成列表.
``` python
lst = list(map(int, input().split()))
```

当然了, 输入也可以是其他类型.
``` python
lst = list(map(float, input().split()))
```

或者是, 当需要拆位输入的时候.
``` python
lst = list(map(int, input()))
```

## 混合输入
可能有一些题目会要求输入多种不同的操作.
``` python
cmd, *args = map(int, input().split()) # args读进来是list.
```

或者是, 一行, 第一个整数 $n$ , 后面跟 $n$ 个整数.
``` python
_, *lst = map(int, input().split()) # args读进来是list.
```

## 快读
快读小板子.
``` python
import sys

input = sys.stdin.readline
```

快读大板子
``` python
import sys
import os
from io import BytesIO, IOBase

BUFSIZE = 8192


class FastIO(IOBase):
    newlines = 0

    def __init__(self, file):
        self._fd = file.fileno()
        self.buffer = BytesIO()
        self.writable = "x" in file.mode or "r" not in file.mode
        self.write = self.buffer.write if self.writable else None

    def read(self):
        while True:
            b = os.read(self._fd, max(os.fstat(self._fd).st_size, BUFSIZE))
            if not b:
                break
            ptr = self.buffer.tell()
            self.buffer.seek(0, 2), self.buffer.write(b), self.buffer.seek(ptr)
        self.newlines = 0
        return self.buffer.read()

    def readline(self):
        while self.newlines == 0:
            b = os.read(self._fd, max(os.fstat(self._fd).st_size, BUFSIZE))
            self.newlines = b.count(b"\n") + (not b)
            ptr = self.buffer.tell()
            self.buffer.seek(0, 2), self.buffer.write(b), self.buffer.seek(ptr)
        self.newlines -= 1
        return self.buffer.readline()

    def flush(self):
        if self.writable:
            os.write(self._fd, self.buffer.getvalue())
            self.buffer.truncate(0), self.buffer.seek(0)


class IOWrapper(IOBase):
    def __init__(self, file):
        self.buffer = FastIO(file)
        self.flush = self.buffer.flush
        self.writable = self.buffer.writable
        self.write = lambda s: self.buffer.write(s.encode("ascii"))
        self.read = lambda: self.buffer.read().decode("ascii")
        self.readline = lambda: self.buffer.readline().decode("ascii")


sys.stdin, sys.stdout = IOWrapper(sys.stdin), IOWrapper(sys.stdout)
input = lambda: sys.stdin.readline().rstrip()
```

纯数字超快读:
``` python
import sys
import os
from io import BytesIO, IOBase

BUFSIZE = 1 << 24


class FastIO(IOBase):
    newlines = 0

    def __init__(self, file):
        self._fd = file.fileno()
        self.buffer = BytesIO()
        self.writable = "x" in file.mode or "r" not in file.mode
        self.write = self.buffer.write if self.writable else None

    def read(self):
        while True:
            b = os.read(self._fd, max(os.fstat(self._fd).st_size, BUFSIZE))
            if not b:
                break
            ptr = self.buffer.tell()
            self.buffer.seek(0, 2), self.buffer.write(b), self.buffer.seek(ptr)
        self.newlines = 0
        return self.buffer.read()

    def readline(self):
        while self.newlines == 0:
            b = os.read(self._fd, max(os.fstat(self._fd).st_size, BUFSIZE))
            self.newlines = b.count(b"\n") + (not b)
            ptr = self.buffer.tell()
            self.buffer.seek(0, 2), self.buffer.write(b), self.buffer.seek(ptr)
        self.newlines -= 1
        return self.buffer.readline()

    def flush(self):
        if self.writable:
            os.write(self._fd, self.buffer.getvalue())
            self.buffer.truncate(0), self.buffer.seek(0)


read, write = FastIO(sys.stdin), FastIO(sys.stdout)


def num_reader(max=10):
    cache = 0
    flag = False
    neg = False
    while chunk := read.read():
        for byte in chunk:
            if 48 <= byte <= 57:
                cache = (cache << 3) + (cache << 1) + byte - 48
                flag = True
                continue

            if flag:
                yield -cache if neg else cache
                cache = 0
                flag = False
                neg = False

            if byte == 45:
                neg = True


inp = num_reader()
```
# 输出
## 输出一行列表
依靠手动解包, 我们可以很简洁的输出列表
``` python
print(*lst)
```

假如需要换行.
``` python
print(*lst, sep="\n")
```

# 变量
## 变量交换
``` python
a, b = b, a
# 甚至
a, b, c, d = c, d, a, b
```
## 解包
在输入命令那节, 我们用解包实现了命令和参数的拆解, 而现在是完整的性质.
``` python
a, *lst = line # 取出第一个元素和后续元素
a, *lst, b = line # 取出首尾元素和中间元素
a, *_, b = line # 如果你想省略中间元素
a, b, *lst = line # 嗯, 还可以取俩
a, *lst, b, c = line # 当然了, 前面再加一个也可以
```
# 列表和迭代器
## 初始化
这些, 可能并不是魔法, 而是一些坑点.
``` python
lst = [0] * 10  # 正确的

lst = [[0, 1]] * 10  # 错误的
lst = [[0, 1] for _ in range(10)] # 正确的
```

请注意 `list` 的 `*` 是, 浅拷贝!
按照错误实例创建出来的数组, 每一个元素指针都是**一样的**.
当其中一个元素被改变 (注意被替换不是被改变), 其余元素也会被同样的改变.

值得展开的是.
``` python
def func(lst=[]): ... # 错误

def func(lst=None): # 正确
    if not lst:
        lst = []
```

## 排序
对列表排序有两种办法.
``` python
lst.sort()
# 或
lst = sorted(lst)
```

第二种的好处是, 任意迭代器, 包括生成器都可排序.
但是, 第一种简洁, 而且可能会占用更小的空间 (未验证).

如果希望排序后是逆序, 加入 `reverse=True` 即可.
``` python
lst.sort(reverse=True)
lst = sorted(lst, reverse=True)
```

或者, 更高级的排序.
``` python
# 此例子的作用是按元组第一项排序
lst = [(1, 1), (1, 0), (2, 4)]
lst.sort(key=lambda x: x[1])
lst = sorted(lst, key=lambda x: x[1])
```

假如你希望用 `cmp` 函数而不是 `key` .
``` python
from functools import cmp_to_key

lst.sort(key=cmp_to_key(cmp))
```

## 前缀和
前缀和并不用手动求, 用 `accumulate()` 可以很简洁的求得.
``` python
from itertools import accumulate

prefix = list(accumulate(lst))
```

当然也可以应用在乘法上
``` python
from itertools import accumulate
from operator import mul

prefix = list(accumulate(lst, func=mul))
```

## for循环小技巧
当想要同时获取索引和元素时, 直接低级循环再取元素吗? 那太麻烦了吧!
``` python
# 0-base
for i, v in enumerate(lst):
    ...
# 1-base
for i, v in enumerate(lst, 1):
    ...
```
是不是方便多了?

当一个列表需要枚举所有 `l` 和 `r` 的时候.
``` python
from itertools import product

for l, r in product(a, repeat=2):
    ...
```

当遇到两层 `for` 的时候.
``` python
from itertools import product

for ai, bi in product(a, b):
    ...
```

又假如需要将两个长度相等的列表一起遍历呢?
``` python
for ai, bi in zip(a, b):
    ...
```

或者说, 同一个数组想枚举相邻元素. (Python 3.10+)
``` python
from itertools import pairwise

for i, j in pairwise(lst):
    ...
```

或者是, 需要分批处理. (Python 3.12+)
``` python
from itertools import batched

for lst_n in batched(lst, n):
    ...
```
## 布尔数组加速
这是oiwiki上的线性筛:
``` python
def euler_sieve(n):
    pri = []
    not_prime = [False] * (n + 1)
    for i in range(2, n + 1):
        if not not_prime[i]:
            pri.append(i)
        for pri_j in pri:
            if i * pri_j > n:
                break
            not_prime[i * pri_j] = True
            if i % pri_j == 0:
                break
    return pri
```
而这是优化过的:
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
看起来好像并无太大差异, 但是后者可以通过洛谷模板题, 而前者不行.
todo: 内存视图可以加速吗..?
# 哈希
## 集合
todo
## 字典
`defaultdict` 方便了字典的创建.
比如建图的时候.
``` python
from collections import defaultdict

e = defaultdict(list)
for _ in range(m):
    u, v = map(int, input().split())
    e[u].append(v)
    e[v].append(u)
```

又或者计数? 啊不, 计数还有更好用的, `Counter` .
``` python
from collections import Counter

ct = Counter(lst)
```
todo

## 防卡
卡哈希要特定数值特定顺序才能卡, 所以只要打乱顺序或者随机偏移就好了.
``` python
from random import shuffle

lst=[1, 2, 3]
shuffle(lst)
set(lst)
```
如果不方便打乱的话, 可以加随机偏移.
``` python
from random import randint

key = int(input())
rnd = randint(100, 1000)
mp = {}
mp[key + rnd] = 1
print(mp[key + rnd]) # 返回 1
```

# 搜索
## 二分
对于二分查找, Python 有 `bisect` 库.
``` python
idx = bisect.bisect(lst, x)
```

当然也可以使用 `key` 参数进行一些定制化的查找.

## 记忆化 dfs
比如计算 fib 时.
``` python
from functools import cache

@cache
def fib(n):
    if n <= 2:
        return 1
    return fib(n - 1) + fib(n - 2)
```

## 栈
Python 在 dfs 深度超过 $10^4$ 时会爆栈, 所以有以下模板.
``` python
def calc(n):
    if n <= 1:
        return n
    else:
        a = yield calc(n - 1)
        return a + 1


def event_loop(s):
    stk, last_rst = [s], None
    while stk:
        try:
            func, last_rst = stk[-1].send(last_rst), None
            stk.append(func)
        except StopIteration as e:
            last_rst = e.value
            stk.pop()
    return last_rst


print(f"Final result: {event_loop(calc(1000000))}")
```
使用 `yield` 返回"函数".


# 数学和数论
## 公约数公倍数
Python 的公约数公倍数比较神奇, 因为他可以输入两个以上的元素, 甚至是一整个列表.
``` python
from math import gcd
lst = [6, 12, 10]
gcd(*lst) # 将会返回 2
```
## 整数平方根
求整数平方根, 在其他语言大概想到的是二分或者牛顿迭代. 但是 Python 有一个函数专门处理此问题, `math.isqrt`.
``` python
from math import isqrt

isqrt(5) # 将会返回 2
```
## 模逆元
可能听说过 $exgcd$ 比 快速幂 快, 但是在 Python 中是哪个快呢? 嗯, 都不是, 在 Python 中, 直接求逆元快. 
``` python
inv = pow(a, -1, mod)
```

## 极坐标转换(反三角函数)
如果要把笛卡尔坐标转换成极坐标, 大概会想到`atan`, 不过, Python 中有更方便的`atan2`, 可以剩下判断正负的时间.
``` python
from math import atan2

deg = atan2(x, y)
```

## 无穷
`inf=1<<70`快于`math.inf`快于`float("inf")`