# NUWA Index 下一版本迭代与上线计划

用户于 2026-11-01 批准实施及上线，覆盖旧文档中研究知识库定位和仅本地预览限制。平台先完整上线，不运行新实验、不创建定时任务。

目标：模型安全比较、风险趋势、NUWA 标准化评测发布、外部结果汇聚。保持 Astro 静态输出、React islands、现有组件和双语路由；历史证据与快照不可变。

基线：origin/main 97da386；当前生产证据包为 2026-10-29.1，通过 src/data/nuwa-index/index.ts 使用，不直接使用旧 catalogue.json。

## Task 1: 公共展示与验证
- [x] 保存基线及历史哈希，验证原始测试。
- [x] 测试先行：比较选择/排序/截止/配置差异/严格资格/导出一致性；NUWA 回执及外部归属。
- [x] 实现展示投影、版本、精选发现、计划与批次最小接口，不改科学数据。

## Task 2: 首页与任务入口
- [x] 双语首页：首屏、模型预览、六主题、NUWA 评测、外部评测、解读、方法与版本。
- [x] 主标题：比较前沿模型的安全表现／追踪 AI 风险的变化。
- [x] 模型比较 2–4 系统，默认 CyberGym 101 共同困难任务 2M token；描述性比较不声称严格排名。
- [x] 新入口 models/compare/、trends/、evaluations/、assessments/、research/；保留旧 /compare/ 协议比较及查询视图。
- [x] 精简 Index 公司入口，其他产品导航不变。查询/哈希入口继续显示旧工作台。

## Task 3: 内容与发布
- [x] 趋势先结论后图表；数据、CSV、SVG、引用、URL 状态一致。
- [x] NUWA 计划和回执发布结构，缺回执不发布新批次；外部结果保留实际执行方。
- [x] 外部评测主题/机构/模型/日期筛选；研究、框架、方法、来源与更新保持可达。
- [x] 清理引用作者展示、来源巡检折叠；尺寸无覆盖时不展示无效图例。

## Task 4: 验收与上线
- [x] npm test、check、check:nuwa-index、check:nuwa-publication、check:terminology、check:research-blog、ingest:info、build、check:content、check:links、公开输出隐私。
- [ ] 最终提交浏览器双语 1440/1024/808/390、键盘/触屏、URL历史/语言切换、无JS/reduced-motion、旧入口及CSV/SVG。
- [x] 验证首页不内联完整 catalogue，历史哈希无变；独立代码审查并修复关键发现。
- [ ] PR 检查通过，正常合并 main，等待 Pages，线上复验并交付 SHA/PR/部署结果；发现核心回归正常回退。

## Review Focus
结果身份包括配置；描述性排序不升级严格比较；未知值与零值不混；语言/历史状态一致；外部成果不重标 NUWA 执行。
