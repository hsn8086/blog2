---
title: Python拓扑排序模板
date: 2025-06-6 13:02:41
katex: true
tags:
  - 算法
  - python
  - 模板
  - 图论
reprintPolicy: cc_by_nc_nd
---
``` python
from collections import defaultdict, deque


def topo_sort(graph):
    lst = []
    in_degree = defaultdict(int)
    for u in graph:
        for v in graph[u]:
            in_degree[v] += 1

    s = deque([u for u in graph if in_degree[u] == 0])
    while s:
        lst.append(n := s.popleft())
        for m in graph.get(n, []):
            in_degree[m] -= 1
            if in_degree[m] == 0:
                s.append(m)

    return None if any(in_degree.values()) else lst
```