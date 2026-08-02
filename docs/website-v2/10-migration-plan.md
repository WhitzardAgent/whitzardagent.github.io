# 10｜分阶段迁移计划

## Phase 0：建立基线

- 执行 `npm ci`
- 执行 `npm run build`
- 记录 dist 大小
- Lighthouse 桌面/移动基线
- 保存当前首页、AgentGuard、Nuwa、Research 截图
- 列出所有现有 URL

## Phase 1：设计系统与底层能力

修改：

- `astro.config.mjs`
- `BaseLayout.astro`
- `Header.astro`
- `Footer.astro`
- `global.css`
- `motion.css`
- `tailwind.config.mjs`

新增：

- i18n
- tokens
- ClientRouter
- language switch
- locale-aware metadata

验收：旧页面视觉基本不变，但双语底层和设计 token 已可用。

## Phase 2：首页 V2

优先完成：

1. Hero Runtime Trace
2. Manifesto Band
3. Platform Stack
4. Three Chains
5. Research Product Loop
6. Enterprise Proof
7. CTA

验收：可以作为正式公司首页对外发布。

## Phase 3：AgentGuard

- 重写产品 Hero
- 加 Runtime Demo
- 加平台四层
- 加部署架构
- 加可核实证据
- 加 Demo CTA

## Phase 4：NVWA、Research、Open Ecosystem

- 保留内容管线
- 统一品牌结构
- 补充中文
- 优化筛选与项目分类

## Phase 5：全站完成

- About
- Solutions
- Contact
- News / Blog
- SEO
- OG
- Analytics
- Accessibility
- Performance

## 发布策略

- 每个 Phase 独立 PR
- 不一次性删除旧组件
- 新首页通过 feature branch 预览
- 保留 legacy redirect
- 确认内容后再删除旧 Hero 和旧视觉组件
