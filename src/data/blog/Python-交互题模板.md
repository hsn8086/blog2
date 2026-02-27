---
title: Python交互题模板
date: 2025-04-24 18:03:00
katex: true
tags:
  - 算法
  - python
  - 模板
  - 交互题
reprintPolicy: cc_by_nc_nd
---
# 答题
``` python
import sys
def output(s):
    sys.stdout.write(s + "\n")
    sys.stdout.flush()


def answer(*args):
    output("! " + " ".join(map(str, args)))


def query(*args):
    output("? " + " ".join(map(str, args)))
    return input()

```
# 交互器
``` python
import subprocess


class Interactor:
    def __init__(self):
        self.init_output = ""

    def response(self, query: str): ...

    def start(self, cmd):
        with subprocess.Popen(
            cmd,
            text=True,
            stdin=-1,
            stdout=-1,
        ) as p:
            if self.init_output:
                p.stdin.write(self.init_output + "\n")
                p.stdin.flush()
            while resp := self.response(p.stdout.readline()):
                p.stdin.write(resp + "\n")
                p.stdin.flush()

```