---
title: Python 树状数组
date: 2025-05-21 12:43:00
katex: true
tags:
  - 算法
  - python
  - 数据结构
  - 模板
reprintPolicy: cc_by_nc_nd
---
# 一般树状数组
单点更改, 区间查询
``` python
class FenwickTree:
    def __init__(self, size):
        self.size = size
        self.tree = [0] * (self.size + 1)

    def update(self, index, delta):
        while index <= self.size:
            self.tree[index] += delta
            index += index & -index

    def query_prefix(self, index):
        res = 0
        while index > 0:
            res += self.tree[index]
            index -= index & -index
        return res

    def query(self, index):
        return self.query_range(index, index)

    def query_range(self, left, right):
        return self.query_prefix(right) - self.query_prefix(left - 1)
```
## 例题
[P3374 【模板】树状数组 1](https://www.luogu.com.cn/problem/P3374)
# 差分树状数组
区间更改, 单点查询
``` python
class DiffFenwickTree:
    def __init__(self, size):
        self.size = size
        self.tree = [0] * (self.size + 1)

    def _update(self, index, delta):
        while index <= self.size:
            self.tree[index] += delta
            index += index & -index

    def update(self, index, delta):
        self._update(index, delta)
        self._update(index + 1, -delta)

    def update_range(self, start, end, delta):
        self._update(start, delta)
        self._update(end + 1, -delta)

    def query(self, index):
        res = 0
        while index > 0:
            res += self.tree[index]
            index -= index & -index
        return res

```
## 例题
[P3368 【模板】树状数组 2](https://www.luogu.com.cn/problem/P3368)

# 双树状数组
水群知道的, 比较有趣的知识.

支持区间修改区间查询

``` python
class RURQFenwickTree:
    def __init__(self, size):
        self.ft1 = FenwickTree(size)
        self.ft2 = FenwickTree(size)

    def _update(self, index, delta):
        self.ft1.update(index, delta)
        self.ft2.update(index, delta * index)

    def update(self, index, delta):
        self.update_range(index, index, delta)

    def update_range(self, left, right, delta):
        self._update(left, delta)
        self._update(right + 1, -delta)

    def query_prefix(self, index):
        return (index + 1) * self.ft1.query_prefix(index) - self.ft2.query_prefix(index)

    def query_range(self, left, right):
        return self.query_prefix(right) - self.query_prefix(left - 1)

    def query(self, index):
        return self.query_range(index, index)
```

## 例题
[P3372 【模板】线段树 1](https://www.luogu.com.cn/problem/P3372)
[题解提交](https://www.luogu.com.cn/record/218151991)
## 证明
### 差分数组  $b_i$  和原数组  $a_i$  的关系
在代码中, $a_i$  是原数组, 而  $b_i$  是它的**差分数组**, 定义为：

$$ b_i = a_i - a_{i-1} $$

这样，原数组  $a_i$  可以表示为差分数组  $b_i$  的前缀和：

$$ a_i = \sum_{j=1}^{i} b_j $$



---

### 区间和 `sum(a[l:r])` 的推导
现在考虑计算区间 `[l, r]` 的和：

$$ \sum_{i=l}^{r} a_i = \sum_{i=l}^{r} \sum_{j=1}^{i} b_j $$


这个双重求和可以重新排列：

$$ \begin{aligned} \sum_{i=l}^{r} \sum_{j=1}^{i} b_j &= \sum_{j=1}^{r} b_j \cdot (r - j + 1) - \sum_{j=1}^{l-1} b_j \cdot (l - j) \end{aligned} $$

---

对于以上操作, 更直观的理解, 考虑由$b_j$组成的"三角形", 由上倒下分别:

$$ \begin{array}{c}  &b_1 \cr  &b_1, b_2 \cr  &\vdots \cr  &b_1, b_2, \cdots, b_n  \end{array} $$

可以发现, 期间有$n$个$b_1$, $n-1$个$b_2$直到一个$b_n$. 所以式子可以如此转化:

$$ \sum_{i=1}^{n} \sum_{j=1}^{i} b_j = \sum_{j=1}^{n} b_j \cdot (n - j + 1)$$

当只需要$l \to r$时, 相当于大三角形减去小三角形:

$$ \begin{array}{c} &b_1, \cdots, b_l \cr &b_1, b_2, \cdots, b_{l+1} \cr &\vdots \cr &b_1, b_2, b_3, \cdots, b_n \end{array} $$


可以得到:

$$ \sum_{i=l}^{r} \sum_{j=1}^{i} b_j = \sum_{i=1}^{r} \sum_{j=1}^{i} b_j - \sum_{i=1}^{l-1} \sum_{j=1}^{i} b_j = \sum_{j=1}^{r} b_j \cdot (r - j + 1) - \sum_{j=1}^{l-1} b_j \cdot (l - j) $$


### 使用树状数组优化计算
为了高效计算这个和, 代码使用了**两个树状数组**:
- `tr1[i]`: 维护差分数组 $b_i$ 的前缀和(即 `sum(b[1:i])`)
- `tr2[i]`: 维护 `i * b[i]` 的前缀和(即 `sum(j * b[j] for j in range(1,i+1)`)
这样, 区间和可以表示为:

$$ \sum_{i=l}^{r} a_i = \text{query}(r) - \text{query}(l-1) $$


其中 `query(p)` 计算的是：

$$ \text{query}(p) = (p + 1) \cdot \text{sum}(b[1:p]) - \text{sum}(j \cdot b[j] \text{ for j in range(1, p+1)}) $$



即:

$$ \text{query}(p) = (p + 1) \cdot tr1[p] - tr2[p] $$


到此, 我们完成了区间查询的证明.