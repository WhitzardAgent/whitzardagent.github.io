# Codex 分阶段指令

## Phase 1｜Foundation

请实施：

- 新设计 token；
- locale-aware BaseLayout；
- Astro i18n；
- `/zh/*`；
- hreflang；
- 新 Header / Footer；
- language switch；
- Astro ClientRouter；
- motion provider；
- 安装 gsap、lenis、clsx、tailwind-merge；
- reduced motion；
- 保留现有路由。

完成后执行 build，并报告 bundle 和路由变化。

---

## Phase 2｜Homepage

请根据 `04-homepage-blueprint.md` 重写首页。

重点：

- HomeHero + RuntimeTrace
- ManifestoBand
- PlatformStack
- ThreeChainScrolly
- ResearchProductLoop
- EnterpriseProof
- OpenEcosystemPreview
- Final CTA

英文 `/`，中文 `/zh/`。

RuntimeTrace 必须展示可理解的 Agent 执行过程和 AgentGuard 决策，不要使用抽象粒子动画。

---

## Phase 3｜AgentGuard

请根据 `05-agentguard-page.md` 重写产品页。

保留可复用内容，删除通用化的 Policy / Trace / Approval / Audit 主叙事。

新增：

- runtime control surface
- three-chain intelligence
- platform layers
- deployment architecture
- verifiable evidence
- demo CTA

---

## Phase 4｜NVWA 与生态

请统一 NVWA、Research 和 Open Ecosystem 的视觉及双语能力。

要求：

- NVWA 明确为研究引擎；
- 保留现有内容数据；
- 开源项目按类别呈现；
- 研究页面更克制；
- 不复制产品页面风格。

---

## Phase 5｜企业页面

新增或完善：

- Solutions
- Company
- Contact / Book a Demo

Contact 页面提供清晰表单或邮件 CTA，不能只有研究合作描述。

---

## Phase 6｜发布前检查

请完成：

- 页面 title / description
- canonical / hreflang
- JSON-LD
- sitemap
- OG
- 404
- keyboard navigation
- reduced motion
- Lighthouse
- responsive QA
- broken link check
- build

将结果写入：

`docs/website-v2/generated/release-report.md`
