---
title: Johnson全源最短路径 - Python模板
date: 2025-03-09 14:51:42
katex: true
tags:
  - 算法
  - 最短路
  - 图论
  - 模板
  - python
reprintPolicy: cc_by_nc_nd
---
**此文章已过时**
{% post_link Python-最短路 %}
# 简介
模板使用defaultdict实现, 不必要时可以更换list减少内存开销.
有结果时返回一个字典, 有负环返回None.
查询方式`print(johnson(e, nodes)[start][end])`

# 代码
``` python
from random import randint
from collections import defaultdict, deque
import heapq


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


def spfa(e, s):
    dis = defaultdict(lambda: float("+inf"))
    dis[s] = 0
    queue = deque([s])
    in_queue = defaultdict(bool)
    in_queue[s] = True
    count = defaultdict(int)
    count[s] = 1

    while queue:
        u = queue.popleft()
        in_queue[u] = False

        for v, w in e[u]:
            if dis[v] > dis[u] + w:
                dis[v] = dis[u] + w
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
                    count[v] += 1
                    if count[v] > len(e):
                        return None
    return dis


def johnson(e, nodes):
    virtual_node = hex(randint(1 << (4 * 4), 1 << (5 * 4)))
    e[virtual_node] = [(node, 0) for node in nodes]

    h = spfa(e, virtual_node)
    if h is None:
        return None

    new_edges = defaultdict(list)
    for u in e:
        for v, w in e[u]:
            new_edges[u].append((v, w + h[u] - h[v]))

    result = defaultdict(lambda: defaultdict(lambda: float("+inf")))
    for u in nodes:
        dist = dijkstra(new_edges, u)
        result[u].update({v: dist[v] - h[u] + h[v] for v in dist if v != virtual_node})

    return result
```

# 使用案例
[# P7551 [COCI 2020/2021 #6] Alias](https://www.luogu.com.cn/problem/P7551)
## 解
``` python
e = defaultdict(list)
points = set()
n, m = map(int, input().split())
for i in range(m):
    a, b, t = input().split()
    e[a].append((b, int(t)))
    points.add(a)
    points.add(b)


dis = johnson(e, points)

for i in range(int(input())):
    a, b = input().split()
    if dis[a][b] < float("+inf"):
        print(dis[a][b])
    else:
        print("Roger")
```
