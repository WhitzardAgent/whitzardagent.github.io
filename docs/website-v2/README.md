# Whitzard Website V2：代码感知设计与实施文档包

本目录面向仓库：

`https://github.com/WhitzardAgent/whitzardagent.github.io`

目标是在**保留 Astro 静态站点、研究内容管线和 GitHub Pages 部署方式**的基础上，将网站升级为一套成熟、现代、双语、具有东方理性主义气质的 AI 安全企业官网。

## 设计目标

最新研究导航与亮点展示基线见 [17-research-highlights-and-navigation.md](17-research-highlights-and-navigation.md)，覆盖历史导航与指数命名条目。

最新中英文文案、两位创始人与友情链接规则见 [18-editorial-audit.md](18-editorial-audit.md)，覆盖历史团队、导师与口语化标题要求。

- 公司优先：Whitzard 是公司品牌，AgentGuard 是核心产品，NUWA Lab 是研究引擎，WhitzardAgent 是开源生态。
- 商业优先：首页首先解释“我们解决什么企业问题”，研究与论文用于证明壁垒。
- 双语优先：中文使用无前缀默认路由，英文使用 `/en/*`，旧 `/zh/*` 保留兼容入口。
- 动态但克制：用高质量滚动叙事、轨迹动画和页面转场建立成熟度，不堆叠粒子、3D 地球和炫技效果。
- 性能优先：继续使用 Astro Islands；静态内容不水合，只为关键动态视觉加载 React。
- 可实施：所有方案均对应当前仓库中的具体页面、组件和配置文件。

## 推荐阅读顺序

1. `00-repository-audit.md`
2. `01-brand-strategy.md`
3. `02-design-system.md`
4. `03-information-architecture-i18n.md`
5. `04-homepage-blueprint.md`
6. `05-agentguard-page.md`
7. `06-nvwa-and-ecosystem.md`
8. `07-motion-system.md`
9. `08-component-and-code-plan.md`
10. `09-bilingual-copydeck.md`
11. `10-migration-plan.md`
12. `11-performance-accessibility-seo.md`
13. `12-acceptance-checklist.md`
14. `CODEX_MASTER_PROMPT.md`
15. `CODEX_PHASE_PROMPTS.md`
16. `16-research-cards-and-tags.md`（Research 图文卡片与标签筛选）

## 一句话方向

> 玄青为骨，月白为空，玉青为气，朱砂为印。  
> 为全球AI治理分享风险实证与公共产品。

## 当前产品展示补充

- [19｜双产品展示与静态产品证据](19-dual-products-and-static-evidence.md)：WhitzardGateway、首页等权展位、全站模拟演示撤下及本地验收。
- [20｜企业应用场景与安全价值](20-use-cases-and-security-value.md)：四类场景、双语安全维度、产品职责及验收。
- [21｜研究图示与长文阅读](21-research-reading-and-figures.md)：AgentCyberRange 新图、Markdown 图注、左侧目录与响应式长文。

- [38｜NUWA Index 公开阅读版与每周维护](38-public-launch-and-weekly-maintenance.md)：正式内容、初始化发布基线、每周五候选准备与统一审阅发布。
