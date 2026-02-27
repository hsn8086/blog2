---
title: hsn的及其Pythonic的CPP竞赛模板
date: 2025-04-20 17:40:00
katex: true
tags:
  - 算法
  - cpp
  - 模板
reprintPolicy: cc_by_nc_nd
---
``` cpp
#include <bits/stdc++.h>
#define endl "\n"
#define fastio std::ios::sync_with_stdio(false), std::cin.tie(nullptr)
#define let auto
using i64 = long long;
template <typename... Args> void inpm(Args &...args) { ((std::cin >> args), ...); }

class Range {
    int start_, end_, step_;
    int current_;

  public:
    Range(int end) : start_(0), end_(end), step_(1), current_(0) {}
    Range(int start, int end, int step = 1)
        : start_(start), end_(end), step_(step), current_(start) {}

    class Iterator {
        int current_, end_, step_;

      public:
        Iterator(int current, int end, int step) : current_(current), end_(end), step_(step) {}

        int operator*() const { return current_; }

        Iterator &operator++() {
            current_ += step_;
            return *this;
        }

        bool operator!=(const Iterator &other) const {
            return step_ > 0 ? current_ < other.current_ : current_ > other.current_;
        }
    };

    Iterator begin() const { return Iterator(start_, end_, step_); }
    Iterator end() const { return Iterator(end_, end_, step_); }
};

template <typename T> T input() {

    T val;
    std::cin >> val;
    return val;
}
template <typename T0, typename... Ts> void print(T0 t0, Ts... ts) {
    std::cout << t0;
    if constexpr (sizeof...(ts) > 0) {
        std::cout << " ";
        print(ts...);
    } else
        std::cout << endl;
}
template <typename T>
void print(std::vector<T> vec, std::string sep = " ", std::string end = "\n") {
    let n = vec.size();
    for (let i : Range(n)) {
        if (i != 0) {
            std::cout << sep;
        }
        std::cout << vec[i];
    }
    std::cout << end;
}
template <typename T> std::vector<T> inpl() {
    int n = input<int>();
    std::vector<T> val(n);
    for (int i = 0; i < n; i++) {
        std::cin >> val[i];
    }
    return val;
}
template <typename T> std::vector<T> inpl(size_t size) {
    std::vector<T> val(size);
    for (int i = 0; i < size; i++) {
        std::cin >> val[i];
    }
    return val;
}

template <typename T, typename TIter = decltype(std::begin(std::declval<T>()))>
constexpr auto enumerate(T &&iterable) {
    struct iterator {
        size_t i;
        TIter iter;
        bool operator!=(const iterator &other) const { return iter != other.iter; }
        void operator++() {
            ++i;
            ++iter;
        }
        auto operator*() const { return std::tie(i, *iter); }
    };
    struct iterable_wrapper {
        T iterable;
        auto begin() { return iterator{0, std::begin(iterable)}; }
        auto end() { return iterator{0, std::end(iterable)}; }
    };
    return iterable_wrapper{std::forward<T>(iterable)};
}
```