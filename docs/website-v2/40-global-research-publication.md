# 40｜全球研究与证据工作台公开版

2026-10-29，按用户“全面上线到官网NUWA Index分区”授权，将已审阅候选local-6efe31bc4a0c0f37发布为2026-10-29.1。公开范围为214研究、85协议、5专题、4观点，2408条有效结果；完整验证目录保留2409条原始记录，二者分开计数。新增转录继续保留独立人审pending，不将出版授权变成学术批准。

## 当前内容与历史

src/data/nuwa-index/public-editions/2026-10-29.1.json是完整版本化公开包。src/data/nuwa-index/index.ts为唯一当前入口，正常npm ci与npm run build不依赖私有目录。旧catalogue.json、reading及历史快照作为保留基底，不改原有字节。当前release.json、snapshot.json、正文、搜索和下载均输出新版本。214份record-editions/2026-10-29.1.json冻结完整正文和元数据。

公开包保留复核范围、来源URL/版本/哈希、原始数值、实验条件与公开图像；排除原始缓存、本机路径及内部核查日志。验证目录仅恢复原纠正链所需的一条历史结果及一个withdrawn协议变体，完整通过既有目录校验，其effective projection必须与实际公开目录完全相同。

旧政治材料的作品、结果和Benchmark入口显示范围调整说明；当前目录、搜索、推荐与导出不再包含它们，旧快照保留。主页卡片使用当前release中的实际数量及发布日期。新页面具备双语canonical、语言切换及公开索引元数据。

## GitHub Pages检索

官网继续静态部署。搜索弹窗及独立页默认按需GET版本化global-search.json，在浏览器中执行基础关键词检索，不调用localhost或不存在的/api/search。支持跨类型、字符组合、有限拼写近似、真实片段与章节锚点。原Python服务与语义缓存保留为未来可选服务，公开版不宣称语义检索已经上线。

静态84题独立评测与Python FTS分开报告。源数据、实现及测试共同固定版本；首载网络时间与引擎计算时间分开记录。

## 发布与回退

现有check:nuwa-publication同时检查保留基底、历史不可变文件、新公开包与214份冻结记录；CLI基底参数正确传给原门禁。public-editions加入历史不可变文件检查。新增源数值继续采用未独立复核的来源汇编组，不自动获得accepted/matched/longitudinal身份。

通过现有检查和公开产物隐私检查后，经GitHub PR/Pages流程发布。部署后核对正式域名双语首页、代表Record/Benchmark、Opinion/Sources、静态搜索、版本下载及旧范围入口。回退部署旧Git提交，保留历史文件，不强推历史。

40–60份完整来源深读、全部相关表图/附录审计及237项旧结果逐值来源链复核继续作为研究队列，不能因公开操作标完成。每周五16:00 Asia/Shanghai保持准备与集中审阅机制；本次批准仅覆盖本次版本，不授权未来批次自动公开。后续准备从实际线上release和已部署Git基底继续，不把旧私有candidate重新当作新发布版本。

## 风险框架入口恢复

用户指出整体风险体系入口缺失。生产复现确认框架内容完整，直接`?view=framework`能显示机制图、风险主题与观测维度；但共享顶栏将Framework置于折叠About中，手机端又隐藏About，导致核心入口不可见。修复将Framework／风险框架恢复为第一个一级入口，Methodology／方法说明也保留一级入口；手机导航换行显示核心入口。默认首页仍是Trend，原Framework查询参数、锚点、原图及交互保持。

浏览器回归另确认Astro页面切换时自定义组件首次连接早于URL更新，一级导航可出现地址变了但栏目仍是上一项。IndexExplorer在astro:page-load后沿用现有restore重新读取查询与锚点；原popstate/hashchange逻辑保留。验证覆盖点击框架、机制图与六风险主题、切回Trend和浏览器返回。
