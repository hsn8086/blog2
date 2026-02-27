---
title: Codeforces Python防卡哈希模板
date: 2025-04-09 21:00:00
katex: true
tags:
  - 算法
  - python
  - codeforces
  - 模板
reprintPolicy: cc_by_nc_nd
---
``` python
import sys
from collections import defaultdict, Counter
from random import randint


input = sys.stdin.readline


class CFDefaultDict(defaultdict):
    def __init__(self, default_factory: callable):
        super(CFDefaultDict, self).__init__()
        self.rnd = randint(57, 8086)
        self.default_factory = default_factory

    def _v(self, i):
        return i + self.rnd

    def __contains__(self, key):
        return super().__contains__(self._v(key))

    def __getitem__(self, key):
        return super().__getitem__(self._v(key))

    def __setitem__(self, key, value):
        super().__setitem__(self._v(key), value)

    def __delitem__(self, key):
        super().__delitem__(self._v(key))
    def __iter__(self):
        return (key - self.rnd for key in super().__iter__())
        
    def update(self, iterable):
        for key, value in iterable:
            self[key] = value
            
class CFCounter(Counter):
    def __init__(self, iterable=None, /, **kwds):
        self.rnd = randint(57, 8086)
        super(CFCounter, self).__init__(iterable, **kwds)

    def _v(self, i):
        return i + self.rnd

    def __contains__(self, key):
        return super().__contains__(self._v(key))

    def __getitem__(self, key):
        return super().__getitem__(self._v(key))

    def __setitem__(self, key, value):
        super().__setitem__(self._v(key), value)

    def __delitem__(self, key):
        super().__delitem__(self._v(key))

    def update(self, iterable):
        for elem in iterable:
            self[elem] += 1


class CFSet:
    def __init__(self, iterable=None, /):
        self.rnd = randint(57, 8086)

        if iterable is None:
            self.s = set()
        else:
            self.s = set(map(self._v, iterable))

    def _v(self, i):
        return i + self.rnd

    def add(self, elem):
        self.s.add(self._v(elem))

    def remove(self, elem):
        self.s.remove(self._v(elem))

    def discard(self, elem):
        self.s.discard(self._v(elem))

    def __contains__(self, elem):
        return self._v(elem) in self.s

    def __iter__(self):
        for elem in self.s:
            yield elem - self.rnd

    def __len__(self):
        return len(self.s)
```