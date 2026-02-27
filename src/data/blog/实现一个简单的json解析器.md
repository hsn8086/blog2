---
title: 实现一个简单的json解析器
date: 2025-01-27 14:51:41
katex: true
tags:
  - 编程
  - 重复造轮子
reprintPolicy: cc_by_nc_nd
---
# 0x00: 抽象解析器
当然不是说解析器很抽象, 只是我们需要大致画出解析器的骨架. 代码如下:
``` python
def load(string: str):
    if string[0] == '"' and string[-1] == '"':
        return string[1:-1]
    elif string[0] == "[" and string[-1] == "]":
	    return string # todo: return list(list_parse(string))
    elif string[0] == "{" and string[-1] == "}":
        return string # todo: return dict(dict_parse(string))
    elif string == "true":
        return True
    elif string == "false":
        return False
    elif string == "null":
        return None
    elif string.isdigit():
        return int(string)
    else:
        try:
            return float(string)
        except ValueError:
            raise ValueError("Invalid value")
```
# 0x01: 解析pair
我对字典的理解是一堆pair, 所以第一步我选择解析pair.

pair的解析很好实现, 根据json的语法, key的类型只能是字符串, 所以只需遍历到不在引号内的冒号,拆分两部分即可. 代码如下:
``` python
def pair_parse(string: str) -> tuple[str, None | bool | int | str | list | dict]:
    lock = False
    for i, c in enumerate(string):
        if c == ":" and not lock: # 假如冒号在引号外即为分隔符
            key, value = string[:i].strip(), string[i + 1 :].strip()
            return load(key), load(value)
        if c == '"':
            lock = not lock

    raise ValueError("Invalid pair")
```

# 0x02: 解析列表
列表就需要考虑更多的东西了, 比如列表里可能嵌套列表, 再或是套字典. 不过可以很容易想到有效的列表分隔符不在任何一个元素内, 简单点说:
``` python
["123",[1,2],{"a":"b","c":"d"}] # 第一个逗号是有效分隔符, 第二个逗号则不是(1与2中间),第三个是有效分隔符,第四个不是.
```
如果仿造上面对着每种情况都单独写个lock那就大错特错了, 中括号和大括号其实可以归为一类, 因为他们在引号外都是必须闭合并且不能相互穿插的. 代码如下:
``` python
def list_parse(
    string: str,
) -> Generator[None | bool | int | str | list | dict, None, None]:
    lock = False # 初始化文本锁
    bracket = 0 # 初始化嵌套计数
    string = string.strip()[1:-1] # 去除首末中括号
    last_index = 0 # 初始化文本裁切标记
    for i, c in enumerate(string):
        if c == "," and not lock and not bracket: # 假如一个逗号不在引号内也不在中/大括号内, 即为有效
            yield load(string[last_index:i].strip())
            last_index = i + 1
        elif c == '"':
            lock = not lock
        elif (c == "{" or c == "[") and not lock: # 假如一个括号不在引号内即为有效括号
            bracket += 1
        elif (c == "}" or c == "]") and not lock:
            bracket -= 1
    yield load(string[last_index:].strip()) # 最后一个元素
```
# 0x03: 解析字典
字典, 不就是由pair组成的列表吗. 直接按列表解析即可. 代码如下:
``` python
def dict_parse(string: str) -> Generator[tuple[str, None | bool | int | str | list | dict], None, None]:
    lock = False
    bracket = 0
    string = string.strip()[1:-1]
    last_index = 0
    for i, c in enumerate(string):
        if c == "," and not lock and not bracket:
            yield pair_parse(string[last_index:i].strip()) # 不同之处, 这里是解析pair而不是解析json对象
            last_index = i + 1
        elif c == '"':
            lock = not lock
        elif (c == "{" or c == "[") and not lock:
            bracket += 1
        elif (c == "}" or c == "]") and not lock:
            bracket -= 1

    if string[last_index:].strip():
        yield pair_parse(string[last_index:].strip())
```
# 0x04: 合并
补全0x00的load函数, 即可得到完整体的解析器!
``` python
def load(string: str):
    if string[0] == '"' and string[-1] == '"':
        return string[1:-1]
    elif string[0] == "[" and string[-1] == "]":
        return list(list_parse(string))
    elif string[0] == "{" and string[-1] == "}":
        return dict(dict_parse(string))
    elif string == "true":
        return True
    elif string == "false":
        return False
    elif string == "null":
        return None
    elif string.isdigit():
        return int(string)
    else:
        try:
            return float(string)
        except ValueError:
            raise ValueError("Invalid value")
```
至此就完成了json解析器的编写. 当然你也可以把字典和列表的解析合二为一. 这就是后话了, 毕竟只是个简单的解析器. 完整代码可以在[gist](https://gist.github.com/hsn8086/2fee2730a59db52067855a6cab9faf10)找到. 