# Research · Blogs 发布流程

Blogs 是 Research 统一页面中的研究解读分类，替代原独立 Research Blog 列表。每个公开条目由中文和英文两份 Markdown 组成，并与仓库中已有的研究记录绑定。现有模板命令、目录与文章 URL 保持兼容。

## 1. 生成双语草稿

先从 `src/data/generated/researchAssets.ts` 找到论文的 `slug`，再运行：

```bash
npm run new:research-blog -- --research <research-slug> --slug <article-slug> --author "Author Name"
```

命令会在 `src/content/research-blog/` 同时生成 `.zh.md` 与 `.en.md`。两份文件默认 `draft: true`，不会出现在网站或 RSS 中。

## 2. 人工撰写与编辑

中文与英文都应按各自语言的正式表达重新编辑，不做逐句直译。正文应清楚区分研究问题、方法与证据、关键发现、局限与适用边界、治理意义。不得添加论文或仓库证据没有支持的性能、部署、客户或影响力声明。

## 3. 发布前校验

完成双语审校后，将两份文件同时设为 `draft: false`，然后运行：

```bash
npm run check:research-blog
npm run check:terminology
npm test
npm run build
```

校验会检查中英配对、研究记录关联、必填元数据与正文。构建成功后，文章会自动进入 `/nuwa/research?kind=blogs` 与英文对应页；详情保留 `/nuwa/blog/<slug>`、`/en/nuwa/blog/<slug>` 和对应 RSS。旧列表页跳转到统一 Research 的 Blogs 分类。

文章列表直接读取已发布 Markdown 的标题、摘要、日期、作者、标签及关联论文，不另维护一份列表 JSON。双语标签应维持语义和顺序一致，便于共享筛选 ID；文章文案仍独立编辑。

## 4. 编辑责任

内容由团队人工撰写和编辑。自动化只用于生成安全模板、校验结构和发布静态页面；任何自动生成的初稿都必须经过作者与编辑复核后才能公开。
