---
title: Python防爆栈模板
date: 2025-04-23 18:51:41
katex: true
tags:
  - 算法
  - python
  - 模板
reprintPolicy: cc_by_nc_nd
---
# 简介
类似协程, `yield`函数, `return`结果.

# 代码
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