# Research：论文图文卡片与标签筛选

批准基线：2026-10-14，参考 METR Research 的编辑式图文列表。中文 `/nuwa/research`，英文 `/en/nuwa/research`，保留既有研究记录、双语路由及旧重定向。

## 内容与视觉

最新批准调整：统一名称为 Research；入口分 Publication、Technical Report、Blogs，默认全部。会议／期刊已发表或已接收记录归 Publication；未正式发表的预印本与报告归 Technical Report，人工解读归 Blogs。使用同一网格、搜索、标签、年份与关联研究筛选。旧 Research Blog 列表跳转至 Blogs 分类，首页／导航／页脚同步统一名称。白泽指数只保留“建设中”占位，原始证据数据保留。

- 简洁 Research 标题、导语、女娲介绍与白泽指数（建设中）入口；分类属于列表筛选工具，不新增第二套站点导航。
- 研究库提前呈现：桌面两列、700px 以下单列，按真实年份分组；不编造发布日期。
- 每项展示原始标题、年份、会议／期刊、摘要、作者、标签及原文／代码／来源入口。
- 50 项采用可核实论文原图：原有 3 项保留，新补 47 项。另 36 项使用用户提供的 NUWA 品牌横幅，不把品牌封面标成论文 Figure。
- 原图完整等比显示、不装饰重绘、不裁掉关键内容；长图和复杂方法图可点击阅读原始 PDF。
- 研究使命、基础设施、公共影响、认可与合作内容仍保留在研究库之后。

## 图像数据与维护

- `src/data/researchTeasers.json` 保存新主图与原论文的对应关系、原始 PDF URL、Figure、PDF 页码、PDF 点坐标裁切、SHA-256、核对日期与原始图注。
- `src/data/researchVisuals.ts` 保留原有 3 项，通过字段白名单接入新主图；不把哈希、裁切、长图注等维护字段传给客户端。
- 主图提供不超过 1280px 宽的 WebP 与 640px 缩略版，单文件分别 ≤250KB／100KB；图片懒加载并声明尺寸，固定展示区防止布局漂移。
- `scripts/render-research-teasers.py` 可从哈希命名的原始 PDF 重现新裁切；维护工具需要 PyMuPDF／Pillow，不增加网站依赖。不自动猜测 Figure。
- 品牌封面仅用于缺少可核实主图的卡片，保持用户所给图片内容；HTML 品牌名遵循 NUWA。后续获得论文主图时在数据集合补入即可自动替换。
- 原始 PDF 不加入网站仓库；已有 JSONL 研究数据仍是标题、作者、摘要、标签和论文链接的来源。

## 交互与降级

- 每张卡片的标签使用 badge 按钮；顶部提供常用标签和可展开的完整标签集合。
- 多标签内部 OR，与关键词、主题、年份、成员之间 AND。
- 标签 ID 由英文主题生成，中文与英文一致；URL 使用重复 `tag=`，支持分享、刷新、返回、清空和单独移除。
- 更新查询时保留 Astro history state；`noscript` 在 Astro 外层隐藏不可工作的筛选工具，所有研究与来源仍静态输出。
- 键盘可聚焦并激活标签，选择状态使用 `aria-pressed`，结果数使用 status；移动端单列、触摸友好，reduced-motion 不播放过渡。

## 验收清单

- 原图身份、页码、图注、裁切与来源逐项核对，品牌封面没有 Figure／PDF 页码信用标注。
- 86 项研究记录完整；禁用 JS 后保留全部标题、摘要、作者、图片、标签文本和原文入口。
- 两种语言 × 1440／1024／900／808／390px：网格列数、横向溢出、图片加载、标题断行及密集标签可读性。
- 鼠标／键盘／触摸筛选、移除、重置、组合条件、空结果、未知标签、刷新、Back／Forward 与 Astro 客户端导航；监听 hydration 错误。
- 执行类型、内容、术语、Research Blog、内部链接、单元测试与静态构建。Research Blog 尚无已发布 Markdown，不把模板能力误称已有文章。
- 本轮交付本地审阅版本，发布另行执行。

## 本地验收记录

- 2026-10-14：类型检查 170 个文件，0 errors／warnings／hints；13 项单元测试通过；内容、术语、Research Blog、内部链接检查通过；静态构建 40 页，兼容重定向一起检查 48 个 HTML。
- `scripts/check-research-browser.mjs`：两种语言 × 五档宽度通过；键盘 Enter、触摸、标签移除、搜索、清空、刷新、Back／Forward、Blog → Research 客户端导航、无 JS 与 reduced-motion 验证通过，无 hydration 错误。第三方统计请求在交互验收中隔离。
- 图源维护：RAG-Thief 使用标题一致的 arXiv v1 原文 Figure 2（PDF 第 4 页），避免新版论文改名导致主图来源混淆。
- 复核修正：把 noscript 样式移出 React island；保留 Astro history state；窄幅图片不生成重复 srcset 宽度描述符；英文筛选字段统一为正文无衬线字体。

### Research 合并版验收（2026-10-14）

- 86 项研究按仓库元数据归类：80 项 Publication、6 项 Technical Report；现有外部研究文章进入 Blogs。Markdown collection 当前没有已发布文章，不声称已有新解读。
- 分类切换清空次级筛选；筛选重置保留分类。标签与年份按当前分类生成，Blogs 不显示无关论文标签；双语切换保留查询参数。
- 新增 `check-research-hub-browser.mjs`：双语桌面／移动的分类切换、刷新、旧列表跳转、女娲介绍入口、移动菜单收起、键盘 ArrowDown／Escape 和白泽指数占位通过；原搜索／多标签／历史回归与双语五档布局通过。
- 全站 12 条核心路线 × 两种语言 × 五档宽度，共 120 组 metadata／Organization／溢出回归通过。菜单、表单、语言、无 JS 与 reduced-motion 的既有交互回归保留，指数检查改为占位内容检查。
- 18 项测试通过。旧独立 Blog 页面和重复的列表组件已替换；文章、RSS、模板命令、JSONL 与指数原始数据仍保留。
- 导航复核修正：装饰序号不进入前沿研究链接的 accessible name；`hidden` 不再被移动菜单 display 覆盖；桌面面板 visibility 不延迟焦点，Escape 恢复到展开按钮。
