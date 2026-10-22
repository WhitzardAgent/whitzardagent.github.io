# Research · Blogs 发布流程

Blogs 是 Research 统一页面中的研究解读分类，替代原独立 Research Blog 列表。每个公开条目由中文和英文两份 Markdown 组成，并与仓库中已有的研究记录绑定。现有模板命令、目录与文章 URL 保持兼容。

## 1. 生成双语草稿

研究项目解读使用 `npm run new:research-blog -- --project <infrastructure-slug> --slug <article-slug> --author "Author Name"`；论文仍使用下方命令。项目解读关联现有基础设施并显示“项目与资源”。研究亮点的跨页面呈现见 `17-research-highlights-and-navigation.md`。

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

## 5. 图示与长文目录

详见 [21｜研究图示与长文阅读](21-research-reading-and-figures.md)。在 Markdown 中用独立一段的图片语法，并将图注写入图片标题：

```markdown
![替代文本](/assets/research/your-study/results.webp "图 1｜比较对象、任务设置与读图要点。")

图示来源：[论文或项目](https://example.org/)。
```

构建自动生成 figure、图注、图片尺寸、响应式资源和原图入口。图后用一两段解释观察与含义，不推测图中没有提供的精确数值或因果结论。封面支持独立 `caption` 和 `thumbnail`；跨页面研究亮点优先读取关联文章封面。封面已在正文用同一路径展示时，文章页不再重复输出封面。

目录自动读取 H2、H3；三个及以上标题时，1200px 起显示左侧跟随目录，较窄屏幕在正文开头显示折叠目录。写作者无需维护标题 ID 或目录列表。发布文章时检查标题层级和目录顺序。
