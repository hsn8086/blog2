---
title: Astro 博客 SEO 优化实践
date: 2026-07-18 01:10:00
description: 一次 Astro 博客 SEO 优化复盘：从 canonical、社交元数据和 JSON-LD，到 sitemap、语义化 HTML、时区稳定性与自动化测试。
tags: [Astro, SEO, 前端, Web]
reprintPolicy: cc_by_nc_nd
---

# 前言

最近重新整理了一次博客的 SEO. 最初站点的 `<head>` 中只有标题和图标, 搜索引擎虽然能够打开页面, 却很难准确理解每个页面是什么、哪一个 URL 才是正式地址, 分享到社交平台时也没有完整的摘要.

SEO 并不是在页面里堆叠关键词. 对一个静态博客而言, 更实际的目标是:

1. 搜索引擎能够发现所有应该收录的页面.
2. 每个页面都有明确且独立的标题、摘要和规范地址.
3. 文章结构能够被机器正确理解.
4. 同一篇内容长期使用稳定的 URL.
5. 这些约束能够通过测试持续验证.

# 统一管理页面元数据

如果在每个页面中分别编写 SEO 标签, 很容易出现字段缺失或规则不一致. 因此我把元数据集中放到了 Astro 的博客布局中, 页面只需要传入标题、摘要、图片、发布时间和标签.

## Description 与 canonical

`description` 应该概括当前页面, 而不是所有页面共用一句站点介绍. 首页、标签页和友情链接页使用各自的摘要, 文章页则优先读取 frontmatter 中的 `description`.

`canonical` 用来声明页面的正式地址. 它应该使用生产域名和不含查询参数的路径:

```astro
---
const baseUrl = Astro.site ?? new URL(Astro.url.origin);
const canonicalUrl = new URL(Astro.url.pathname, baseUrl).toString();
---

<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />
```

这里需要在 Astro 配置中设置正确的 `site`, 否则静态构建可能生成 `localhost` 地址. 我同时保留了 `SITE_URL` 环境变量, 便于预览环境覆盖正式域名.

## Open Graph 与 Twitter Card

搜索结果之外, 链接在社交平台中的展示同样重要. 页面需要提供标题、摘要、URL 和绝对图片地址:

```html
<meta property="og:type" content="article" />
<meta property="og:title" content="文章标题 | 站点名称" />
<meta property="og:description" content="文章摘要" />
<meta property="og:url" content="https://example.com/post/" />
<meta property="og:image" content="https://example.com/cover.png" />
<meta name="twitter:card" content="summary" />
```

相对图片路径在浏览器中可以显示, 但很多爬虫无法正确补全它, 所以社交图片应转换为绝对 URL.

# 用 JSON-LD 描述内容关系

普通 meta 标签解决了“如何展示”, JSON-LD 则帮助搜索引擎理解“这是什么”. 本次使用 `@graph` 关联了三类实体:

- `Person`: 作者名称、主页、头像和 GitHub.
- `WebSite`: 站点地址、名称、语言和发布者.
- `BlogPosting`: 文章标题、摘要、图片、发布时间、标签和作者.

文章的 `mainEntityOfPage` 指向 canonical, `author` 与 `publisher` 则引用同一个作者实体. 这样比在每篇文章里复制一份互不关联的数据更清晰.

需要注意, 结构化数据不能替代页面上真实可见的内容. JSON-LD 中的标题、日期和作者应该与正文保持一致.

# Sitemap 与 robots.txt

Astro 可以通过 `@astrojs/sitemap` 在构建时生成 sitemap. 但“自动生成”不代表可以完全不检查结果.

这个博客有一个 `/img/[...path]` 静态图片端点. 如果不加过滤, 每张图片都可能被当成普通页面写进 sitemap. 因此生成时排除了 `/img/` 和 `robots.txt`, 只保留真正可索引的页面.

`robots.txt` 本身很简单:

```text
User-agent: *
Allow: /

Sitemap: https://www.zh314.xyz/sitemap-index.xml
```

它不是提升排名的魔法文件, 作用是明确抓取规则并告诉爬虫 sitemap 在哪里.

# 语义化 HTML 比样式更重要

原来的文章列表使用普通段落显示标题和日期, Markdown 正文中还可能出现多个一级标题. 浏览器看起来没有问题, 但页面层级并不明确.

调整后做了这些约束:

- 页面标题是唯一的 `<h1>`.
- Markdown 中的标题整体下移一级, 从 `<h2>` 开始.
- 文章正文使用 `<article>` 包裹.
- 发布时间使用带 `datetime` 的 `<time>`.
- 列表中的文章标题使用 `<h2>`.
- 标签链接使用 `rel="tag"` 并指向标签聚合页.

语义化标签不会直接让内容变得更好, 但能减少搜索引擎理解页面时的歧义, 对屏幕阅读器也更友好.

# 为历史文章自动生成摘要

旧文章没有手写 `description`, 一次性补全几十篇并不现实. 我的处理方式是允许 frontmatter 覆盖, 缺省时再从 Markdown 正文生成摘要.

提取时不能直接截取原始文件的前 160 个字符, 否则摘要中可能充满代码围栏、图片地址、引用链接、模板标记和公式. 自动摘要会先清理这些 Markdown 结构, 合并空白, 最后再限制长度. 对正文为空或只有代码的文章, 则回退到由标题生成的说明.

自动摘要只是兜底. 对重要文章手写一句准确的 description, 通常仍然比机械截取更好.

# 最隐蔽的问题: 时区改变了文章 URL

这次检查中最危险的问题与 meta 标签无关.

文章路径由 frontmatter 的日期生成. YAML 时间被解析为 `Date` 后, 原代码使用 `getFullYear()`、`getMonth()` 和 `getDate()` 读取本地时间. 同一份内容在 UTC 与 UTC+8 的构建机器上可能得到不同日期, 晚间发布的文章甚至会被移动到第二天的 URL.

这会造成旧链接失效、搜索引擎重复收录, 还可能让按 pathname 映射的评论分裂成两个讨论. 最终路由改为读取 UTC 日历字段, 日期展示也明确指定 UTC, 保证不同构建环境生成相同路径.

更理想的长期方案是让新文章时间带上明确时区. 无论采用哪种规则, 已发布 URL 的稳定性都比“日期看起来更符合本地时间”重要.

# 性能也是 SEO 的一部分

博客原先在首页、标签页和文章页都会加载评论脚本与 KaTeX 样式. 实际上只有文章页需要评论, 只有包含公式的文章需要 KaTeX. 改成按需加载后, 普通列表页少了不必要的第三方请求.

侧栏和友情链接组件本身没有交互, 因此也不需要 Vue 客户端水合. 不过移除水合时遇到了一个细节: 原头像组件依赖客户端状态决定图片是否显示, 只保留 SSR 会一直展示 fallback. 最后将它换成带固定宽高的原生 `<img>`, 同时避免布局偏移和 Vue 运行时开销.

所以减少 JavaScript 不能只删除 `client:*` 指令, 删除后仍然要在真实浏览器中检查 SSR 输出.

# 把 SEO 当作可测试的页面契约

只在浏览器开发者工具中看一两个页面并不可靠. 这次增加了构建产物测试, 遍历全部生成的 HTML 并检查:

1. 每页恰好有一个 title、description、canonical 和主标题.
2. 所有 canonical 都唯一且使用正式域名.
3. Open Graph 与 Twitter Card 字段完整.
4. JSON-LD 能够被正常解析.
5. 文章包含 `BlogPosting`、发布时间和语义化标签.
6. sitemap 包含文章与标签页, 但不包含图片端点.
7. 不同时区下文章路径不会发生日期漂移.

部署后还需要检查真实线上响应, 而不只是相信构建日志. 我最终确认了 Cloudflare Pages 部署状态, 并直接请求首页、文章页、`robots.txt` 与 sitemap, 验证新元数据确实已经生效.

# 总结

这次实践后, 我更倾向于把 SEO 看成一组工程约束, 而不是一套玄学技巧:

- 内容要有独立且准确的摘要.
- 页面要有清晰的语义结构.
- URL 必须稳定且只有一个规范版本.
- 爬虫需要明确的发现入口.
- 社交平台需要可直接读取的分享信息.
- 构建与部署结果需要自动化验证.

这些工作不保证一篇文章立刻获得更高排名, 但会让高质量内容更容易被发现、理解和长期收录. 对个人博客来说, 这已经是技术 SEO 最重要的价值.
