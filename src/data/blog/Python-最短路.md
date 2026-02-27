---
title: Python-最短路
date: 2025-07-11 16:50:00
katex: true
tags:
  - 算法
  - 最短路
  - 图论
  - 模板
  - python
reprintPolicy: cc_by_nc_nd
---
# Dijkstra
0-base, 预留长度兼容 1-base, 如专用 0-base 请减小.
``` python
import heapq


def dijkstra(e, s, n):
    INF = 1 << 70
    queue = [(0, s)]
    dis = [INF] * (n + 1)
    dis[s] = 0
    while queue:
        d, u = heapq.heappop(queue)
        if d > dis[u]:
            continue
        for v, w in e[u]:
            if dis[v] > dis[u] + w:
                dis[v] = dis[u] + w
                heapq.heappush(queue, (dis[v], v))
    return dis
```

# Dijkstra(Any)
``` python
from collections import defaultdict
import heapq


def dijkstra(e, s):
    INF = 1 << 70
    queue = [(0, s)]
    dis = defaultdict(lambda: INF)
    dis[s] = 0
    while queue:
        d, u = heapq.heappop(queue)
        if d > dis[u]:
            continue
        for v, w in e[u]:
            if dis[v] > dis[u] + w:
                dis[v] = dis[u] + w
                heapq.heappush(queue, (dis[v], v))
    return dis
```

# BellmanFord
0-base, 预留长度兼容 1-base, 如专用 0-base 请减小.
``` python
def bellman_ford(e, s, n):
    INF = 1 << 70
    dis = [INF] * (n + 1)
    dis[s] = 0
    for _ in range(n):
        updated = False
        for u in range(1, n + 1):
            for v, w in e[u]:
                if dis[u] < INF and dis[v] > dis[u] + w:
                    dis[v] = dis[u] + w
                    updated = True
        if not updated:
            break
    else:
        return None
    return dis
```


# BellmanFord(Any)
``` python
from collections import defaultdict

def bellman_ford(e, s, n):
    INF = 1 << 70
    dis = defaultdict(lambda: INF)
    dis[s] = 0
    for _ in range(n):
        updated = False
        for u in e:
            for v, w in e[u]:
                if dis[u] < INF and dis[v] > dis[u] + w:
                    dis[v] = dis[u] + w
                    updated = True
        if not updated:
            break
    else:
        return None
    return dis
```

# johnson(Any)

``` python
def johnson(e, nodes):
    virtual_node = hex(randint(1 << (4 * 4), 1 << (5 * 4)))
    e[virtual_node] = [(node, 0) for node in nodes]

    h = bellman_ford(e, virtual_node,len((nodes)))
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