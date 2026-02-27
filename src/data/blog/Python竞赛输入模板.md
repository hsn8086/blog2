---
title: Python竞赛输入模板
date: 2025-03-26 14:51:41
katex: true
tags:
  - 算法
  - python
  - 模板
reprintPolicy: cc_by_nc_nd
---
# 简洁优先
``` python
n, m = map(int, input().split())
a = list(map(int, input().split()))

cmd_raw, args_raw = input().split(maxsplit=1)
cmd = int(cmd_raw)
args = list(map(int, args_raw.split()))

```

# 优化读入
## 速度优化
``` python
input=sys.stdin.readline

# Example
n, m = map(int, input().split())
a = list(map(int, input().split()))
```
## 快读大板子
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

## 纯数字快读(内存优化)
``` python
import sys


def num_reader():
    cache = 0
    flag = False
    neg = False
    while chunk := sys.stdin.buffer.read(1<<16):
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
## 纯数字超快读
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


def num_reader():
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
# 防Invalid Input(II)
## 最简洁
``` python
import sys
inp = map(int, filter(bool, sys.stdin.read().split()))

# Example
n, m = next(inp), next(inp)
a = [next(inp) for _ in range(n)]
```


## 内存优化(即使不防II)
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


# Example
inp = chunk_reader(chunk_size=1 << 18)
n, m = next(inp), next(inp)
a = [next(inp) for _ in range(n)]
```
