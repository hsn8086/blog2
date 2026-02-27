---
title: Python Trie(字典树)
date: 2025-04-22 18:35:00
katex: true
tags:
  - 算法
  - python
  - 数据结构
  - 模板
reprintPolicy: cc_by_nc_nd
---
# 模板
``` python
class CompressedTrieNode:
    def __init__(self):
        self.children = {}  # 子节点字典，键为字符串片段，值为子节点
        self.is_end = False  # 标记是否为一个单词的结束


class CompressedTrie:
    def __init__(self):
        self.root = CompressedTrieNode()

    def insert(self, word):
        node = self.root
        i = 0
        n = len(word)

        while i < n:
            # 查找与当前字符匹配的子节点
            matched = False
            for key in node.children:
                # 找到共同前缀的长度
                j = 0
                while j < len(key) and i + j < n and key[j] == word[i + j]:
                    j += 1

                if j > 0:  # 有共同前缀
                    matched = True
                    if j == len(key):  # 完全匹配当前键
                        node = node.children[key]
                        i += j
                    else:  # 部分匹配，需要分割节点
                        # 创建新节点来保存剩余部分
                        remaining_key = key[j:]
                        new_node = CompressedTrieNode()
                        new_node.children = node.children[key].children
                        new_node.is_end = node.children[key].is_end

                        # 更新当前节点的子节点
                        del node.children[key]
                        node.children[key[:j]] = CompressedTrieNode()
                        node.children[key[:j]].children[remaining_key] = new_node

                        # 如果插入的词也在j处结束
                        if i + j == n:
                            node.children[key[:j]].is_end = True
                        else:
                            # 添加剩余的词部分
                            remaining_word = word[i + j :]
                            node.children[key[:j]].children[remaining_word] = (
                                CompressedTrieNode()
                            )
                            node.children[key[:j]].children[
                                remaining_word
                            ].is_end = True
                            i = n
                    break

            if not matched:  # 没有匹配的子节点，直接添加剩余部分
                node.children[word[i:]] = CompressedTrieNode()
                node.children[word[i:]].is_end = True
                i = n

    def search(self, word):
        node = self.root
        i = 0
        n = len(word)

        while i < n:
            matched = False
            for key in node.children:
                j = 0
                while j < len(key) and i + j < n and key[j] == word[i + j]:
                    j += 1

                if j == len(key):  # 完全匹配当前键
                    node = node.children[key]
                    i += j
                    matched = True
                    break
                elif j > 0:  # 部分匹配但未完全匹配
                    return False

            if not matched:
                return False

        return node.is_end

    def starts_with(self, prefix):
        node = self.root
        i = 0
        n = len(prefix)

        while i < n:
            matched = False
            for key in node.children:
                j = 0
                while j < len(key) and i + j < n and key[j] == prefix[i + j]:
                    j += 1

                if j == len(key):  # 完全匹配当前键
                    node = node.children[key]
                    i += j
                    matched = True
                    break
                elif j > 0:  # 部分匹配但未完全匹配
                    return False

            if not matched:
                return False

        return True
```
# 例题
[luogu P2580 于是他错误的点名开始了](https://www.luogu.com.cn/problem/P2580)
## 题解代码
``` python
class CompressedTrieNode:
    def __init__(self):
        self.children = {}  # 子节点字典，键为字符串片段，值为子节点
        self.is_end = False  # 标记是否为一个单词的结束


class CompressedTrie:
    def __init__(self):
        self.root = CompressedTrieNode()

    def insert(self, word):
        node = self.root
        i = 0
        n = len(word)

        while i < n:
            # 查找与当前字符匹配的子节点
            matched = False
            for key in node.children:
                # 找到共同前缀的长度
                j = 0
                while j < len(key) and i + j < n and key[j] == word[i + j]:
                    j += 1

                if j > 0:  # 有共同前缀
                    matched = True
                    if j == len(key):  # 完全匹配当前键
                        node = node.children[key]
                        i += j
                    else:  # 部分匹配，需要分割节点
                        # 创建新节点来保存剩余部分
                        remaining_key = key[j:]
                        new_node = CompressedTrieNode()
                        new_node.children = node.children[key].children
                        new_node.is_end = node.children[key].is_end

                        # 更新当前节点的子节点
                        del node.children[key]
                        node.children[key[:j]] = CompressedTrieNode()
                        node.children[key[:j]].children[remaining_key] = new_node

                        # 如果插入的词也在j处结束
                        if i + j == n:
                            node.children[key[:j]].is_end = True
                        else:
                            # 添加剩余的词部分
                            remaining_word = word[i + j :]
                            node.children[key[:j]].children[remaining_word] = (
                                CompressedTrieNode()
                            )
                            node.children[key[:j]].children[
                                remaining_word
                            ].is_end = True
                            i = n
                    break

            if not matched:  # 没有匹配的子节点，直接添加剩余部分
                node.children[word[i:]] = CompressedTrieNode()
                node.children[word[i:]].is_end = True
                i = n

    def search(self, word):
        node = self.root
        i = 0
        n = len(word)

        while i < n:
            matched = False
            for key in node.children:
                j = 0
                while j < len(key) and i + j < n and key[j] == word[i + j]:
                    j += 1

                if j == len(key):  # 完全匹配当前键
                    node = node.children[key]
                    i += j
                    matched = True
                    break
                elif j > 0:  # 部分匹配但未完全匹配
                    return False

            if not matched:
                return False

        return node.is_end

    def starts_with(self, prefix):
        node = self.root
        i = 0
        n = len(prefix)

        while i < n:
            matched = False
            for key in node.children:
                j = 0
                while j < len(key) and i + j < n and key[j] == prefix[i + j]:
                    j += 1

                if j == len(key):  # 完全匹配当前键
                    node = node.children[key]
                    i += j
                    matched = True
                    break
                elif j > 0:  # 部分匹配但未完全匹配
                    return False

            if not matched:
                return False

        return True


t = CompressedTrie()
for _ in range(int(input())):
    s = input()
    t.insert(s)

rt = CompressedTrie()
for _ in range(int(input())):
    s = input()
    if rt.search(s):
        print("REPEAT")
        continue
    rt.insert(s)
    if t.search(s):
        print("OK")
    else:
        print("WRONG")

```