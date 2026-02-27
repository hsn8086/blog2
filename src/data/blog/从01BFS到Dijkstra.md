---
title: 从01BFS到Dijkstra
date: 2025-04-11 18:15:00
katex: true
tags:
  - 算法
  - 01BFS
  - BFS
  - Dijkstra
  - 编程
  - 最短路
reprintPolicy: cc_by_nc_nd
---

# 01BFS
## 简介
一般的BFS计算路径最短路径时, 权重默认为"1", 而01BFS加入了权重为0的边. 权重为0对长度无贡献, 所以我们可以优先处理这些点, 将其关联的节点放在队首. 为了实现这一操作, *双端队列*便是一个不错的选择.
## 实现
### BFS
我们从经典的BFS入手.
假设我们有个图 $e$ , 权值都为1, 我们希望通过广搜找到最短路.
以下是实现的代码:
``` python
from typing import Any
def bfs(e: dict[Any, list[Any]], s: Any):
	vis = set() # 已经访问的节点集合
    queue = deque([(0, s)]) # (距离, 节点)
    dis = defaultdict(lambda: float("+inf")) # 距离表
    dis[s] = 0 # 起点为0
    while queue:
        _, u = queue.popleft() #取出队首
        if u in vis:
            continue
        vis.add(u)
        for v in e[u]: # 遍历邻接节点
            dis[v] = min(dis[u] + 1, dis[v]) # 更新最短路径
            queue.append((dis[v], v))
    return dis
```

### 01BFS
基于普通BFS的逻辑, 01BFS的改动非常直观:
1. 对于权重为0的边, 将其关联的节点插入到队列前端.
2. 对于权重为1的边, 则插入到队列尾端.
这样可以确保优先处理权重为0的边, 从而正确计算最短路径. 以下是优化后的代码:
``` python
def bfs01(e, s):
    vis = set()
    queue = deque([(0, s)])
    dis = defaultdict(lambda: float("+inf"))
    dis[s] = 0
    while queue:
        _, u = queue.popleft()
        if u in vis:
            continue
        vis.add(u)
        for v, w in e[u]: # 更改1: 添加权值
            dis[v] = min(dis[u] + w, dis[v])
            if w == 0: # 更改2, 将权值为0的点放在首位
                queue.appendleft((dis[v], v))
            else:
                queue.append((dis[v], v))
    return dis
```

# Dijkstra
在理解了01BFS的基础上, Dijkstra算法的逻辑会更加清晰.  Dijkstra算法用于解决单源/全源最短路径问题, 适用于**非负权重**的有向图或无向图. 它将节点分为两类: 已确定最短路径的节点集和未确定最短路径的节点集.
算法的核心步骤如下: 
1. 初始化所有节点到起点的距离为正无穷, 起点距离为0.  
2. 从未确定距离的节点中选择距离最小的节点，加入已确定集合。 
3. 使用该节点更新其邻接节点的距离.
4. 重复步骤2和3, 直到所有节点都被处理或队列为空.

与01BFS相比, Dijkstra算法更通用, 可以处理任意非负权重的边, 而01BFS是其特例(权重仅为0或1).
## 实现
Dijkstra算法有两种常见实现方式: 暴力枚举最小距离和使用优先队列. 这里我们展示基于优先队列的实现, 因为其时间复杂度更优 (通常为 $O((N + M)logM)$ , 其中 $N$ 是节点数, $M$ 是边数). 代码如下:
``` python
def dijkstra(e, s):
    vis = set()
    queue = [(0, s)]
    dis = defaultdict(lambda: float("+inf"))
    dis[s] = 0
    while queue:
        _, u = heapq.heappop(queue)
        if u in vis:
            continue
        vis.add(u)
        for v, w in e[u]:
            if dis[v] > dis[u] + w:
                dis[v] = dis[u] + w
                heapq.heappush(queue, (dis[v], v))
    return dis

# 摘录自oi-wiki: https://oi-wiki.org/graph/shortest-path/#%E5%AE%9E%E7%8E%B0_2
```

# 例题
[Crystal Switches](https://atcoder.jp/contests/abc277/tasks/abc277_e)
正解:
- 01BFS: https://atcoder.jp/contests/abc277/submissions/64707533
- Dijkstra: https://atcoder.jp/contests/abc277/submissions/64707545