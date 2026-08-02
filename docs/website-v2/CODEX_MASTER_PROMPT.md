# Codex 总执行指令

你正在修改仓库 `WhitzardAgent/whitzardagent.github.io`。

请先完整阅读 `docs/website-v2/` 下全部文档。项目目标是将当前 Astro 官网升级为成熟、现代、双语、具有东方理性主义气质的 AI Agent Security 公司网站。

## 不可违背的约束

1. 保留 Astro、React islands、Tailwind、MDX、JSONL ingest 和 GitHub Pages。
2. 不迁移到 Next.js。
3. 不删除现有研究、新闻、开源项目和 redirect。
4. 英文现有 URL 保持兼容，中文新增 `/zh/*`。
5. 使用现有 Framer Motion；GSAP 仅用于复杂滚动叙事；Lenis 必须可降级。
6. 不使用 Three.js、React Flow、Lottie、粒子背景、3D 地球和图库盾牌。
7. 所有动效支持 `prefers-reduced-motion`。
8. 保持网站可静态构建。
9. 不编造合作伙伴、客户、指标或项目数据。
10. 每个阶段都必须执行 build 和基础检查。

## 第一步：代码审计

在任何大规模修改之前，生成：

`docs/website-v2/generated/current-site-audit.md`

内容必须包括：

- 当前 package 版本；
- 页面与路由；
- 组件依赖图；
- 可复用视觉组件；
- 内容数据来源；
- i18n 缺口；
- SEO、性能和无障碍缺口；
- 每个现有文件的处理建议；
- build 基线；
- 分阶段实施计划。

完成审计后继续实施，不需要等待人工确认；但必须按 Phase 独立提交修改，并在每个 Phase 后输出变更摘要。

## Phase 顺序

1. Foundation：tokens、layout、i18n、header、SEO
2. Homepage V2
3. AgentGuard V2
4. NVWA / Research / Open Ecosystem
5. Solutions / About / Contact
6. Polish：性能、无障碍、SEO、OG、测试

## 代码质量要求

- TypeScript 严格类型；
- React 组件接收 copy props，不硬编码双语长文案；
- Astro 页面主要负责组合；
- 动态组件清理 event listener 和 GSAP context；
- 不重复创建全局动画实例；
- 使用 `client:visible` 延迟加载非首屏 island；
- 为移动端提供静态降级；
- 为所有动画提供 reduced motion 路径；
- 不在组件中写大量 inline style；
- 不破坏内容 ingest 脚本。

## 交付要求

完成后提供：

- 修改文件清单；
- 新增依赖及原因；
- 新旧路由映射；
- 构建结果；
- Lighthouse 结果；
- 尚未完成和需要人工提供的内容；
- 关键页面截图或本地预览说明。
