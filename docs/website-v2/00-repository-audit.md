# 00｜当前代码仓库审计

## 当前技术栈

当前仓库已经具备适合企业官网的基础，不建议迁移到 Next.js 或重新建站：

- Astro 6
- React 19 islands
- Tailwind CSS 3
- Framer Motion 12
- MDX 与 Astro Content Collections
- GitHub Actions + GitHub Pages
- JSONL → TypeScript 的研究和开源项目数据导入脚本

这套技术栈适合“静态内容为主、少量高质量交互”的公司网站。

## 当前主要文件

| 当前文件 | 现状 | V2 方向 |
|---|---|---|
| `src/pages/index.astro` | 首页以通用安全理念、新闻、研究和开源内容为主 | 改为企业价值、AgentGuard、三链技术、研究—产品循环、企业落地 |
| `src/components/WhitzardHero.tsx` | 已有 Framer Motion、滚动视差和 SVG 背景 | 保留 React island，重做为 Runtime Trace 主视觉 |
| `src/components/HeroBackdropWhitzard.tsx` | 抽象曲线和节点 | 升级为可解释的 Agent 执行轨迹 |
| `src/pages/agentguard.astro` | Policy / Trace / Approval / Audit 为主 | 改为四层平台、运行时演示、部署架构、企业证据 |
| `src/pages/nuwa.astro` | 独立研究页 | 保留，但明确“Whitzard 背后的前沿研究引擎” |
| `src/pages/open-ecosystem.astro` | 开源项目列表 | 作为开发者生态页，不再承担首页主叙事 |
| `src/layouts/BaseLayout.astro` | `<html lang="en">` 固定；基础 SEO | 增加 locale、hreflang、语言路由、页面转场 |
| `src/components/Header.astro` | 英文单语，产品导航较弱 | 增加 Platform、Solutions、Research、Open Source、Company、语言切换和 Book a Demo |
| `src/styles/global.css` | 已有 Whitzard / Nuwa token | 重构为语义化 token，保留兼容别名 |
| `src/styles/motion.css` | 基础 CSS 动效 | 增加统一节奏、reduced-motion 和视觉组件状态 |
| `astro.config.mjs` | 未启用 i18n | 保留英文无前缀路由，新增中文 `/zh/*` |
| `package.json` | 已有 `framer-motion` | 保留 Motion，增加 GSAP、Lenis 和类名工具 |

## 当前网站的优势

1. 已经是 Astro + React islands，不需要技术重构。
2. 已有品牌颜色、Nuwa 子品牌和若干定制 SVG 视觉。
3. 研究论文、开源项目和新闻均已数据化。
4. 已有 OG 图片、RSS、sitemap 和自动部署。
5. 已经安装 Framer Motion，并在 Hero 中使用 `useScroll`、`useTransform` 和 reduced motion。

## 当前网站的核心问题

### 1. 公司认知不足

首页更像研究组织入口，没有在前两屏明确回答：

- Whitzard 是什么公司；
- AgentGuard 是什么产品；
- 企业为什么需要它；
- 如何预约演示。

### 2. 产品技术被过度简化

AgentGuard 页面中的 `Policy / Trace / Approval / Audit` 过于通用，没有体现：

- 思维链实时校准；
- 行为链风险推理；
- 数据链血缘追踪；
- 规则、小模型和大模型协同；
- 多框架 Runtime Hook；
- 工具和 MCP 调用控制；
- 自动红队与持续评测。

### 3. 动态视觉存在，但缺少“叙事对象”

现有 Hero 的曲线、弧线、节点和漂浮标签具有科技感，却没有清晰解释 AgentGuard 观察、判断和控制了什么。

V2 中所有动态视觉必须对应真实概念：

`Intent → Reasoning → Tool → Data → Action → Decision`

### 4. 双语能力尚未进入底层架构

- `<html lang="en">` 固定；
- Header 文案固定英文；
- 页面文案直接写在 `.astro` 和 `.tsx` 中；
- 无 hreflang 和语言路由映射。

### 5. 页面内容密度较均匀

当前多数 section 均为“标题 + 文本 + 卡片”，缺少强弱节奏。V2 应形成：

- 留白首屏；
- 深色价值判断屏；
- 固定视觉 + 滚动文字的技术叙事屏；
- 明确证据屏；
- 深色转化屏。
