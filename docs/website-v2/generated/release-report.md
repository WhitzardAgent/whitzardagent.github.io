# Whitzard Website V3.1 release report

## V3.4 — 2026-08-03

- 首页以业务可读的 AgentGuard 边界演示替换技术型轨迹控制台，并新增智能体安全运营中台。
- 新增七项框架的共享数据和自托管来源说明。
- 白泽开放生态以 WhitzardOS、WhitzardEval、Thought-Aligner、MATE 建立四项核心能力，同时保留完整目录。
- 研究目录由 32 条扩展至 86 条跨主页去重记录，增加六类主题与成员筛选，固定五项旗舰成果，并只保留六项已确认荣誉。
- 已在 1440、1024、390 三档验证页面；场景键盘切换、URL 筛选、浏览器前进后退与横向溢出检查均通过。

Release candidate date: 2026-08-03
Delivery architecture: Astro static output, React Islands, Tailwind CSS, MDX/Content Collections, JSONL ingestion, GitHub Pages

## Release outcome

V3.1 presents Whitzard as a ToB AI-agent security company, AgentGuard as the commercial product, NUWA Lab / 女娲实验室 as the research engine, and the open ecosystem as verifiable technical evidence. The implementation preserves static output, the existing ingestion pipeline, public evidence routes, and valuable legacy URLs. It does not introduce invented customers, deployments, benchmarks, or research claims.

## Information architecture and routes

- Chinese is the default language on unprefixed routes: `/`, `/agentguard`, `/solutions`, `/nuwa`, `/research`, `/open-ecosystem`, `/about`, and `/contact`.
- English mirrors the eight core routes under `/en/*`.
- `/zh/*` contains static `noindex` compatibility pages that point to the corresponding unprefixed Chinese route and are excluded from the sitemap.
- `/open-source`, `/publications`, and `/NVWA-Project/` remain as compatibility entries to the English ecosystem, research, and NUWA pages.
- English-only editorial content lives under `/en/blog`, `/en/news`, and `/en/news/[slug]`; the previous unprefixed URLs remain reachable but are excluded from the sitemap.
- Canonical, `zh-CN`, `en`, and `x-default` metadata follow the new route contract. The language switch preserves page meaning and records the visitor's choice without browser-language redirects.

## Product and research implementation

- The homepage now uses a business-first boundary demo; the AgentGuard product page retains the detailed deterministic enterprise scenario lab.
- The product lab exposes public DSL decisions, policy hits, trace nodes, replay, and approve-once/reject interactions. Keyboard tabs and reduced-motion output were verified.
- The Chinese homepage leads with “企业级智能体安全基础设施”, real supported-adapter evidence, and the compact console before moving to product, deployment, research, and open evidence.
- AgentGuard uses the public project's real dashboard, policy editor, policy-generation screenshot, and official click-to-play demo video. The obsolete two-node recipient demo has been removed.
- The video is not fetched on initial page load (`preload="none"`) and is accompanied by a complete text walkthrough.
- The solutions page is now organized around four enterprise workflows—data and knowledge, development and operations, external actions, and multi-agent platforms—without repeating the product architecture.
- NUWA is formally named “女娲实验室 / NUWA Lab”. Its existing logo is the hero's primary visual, with a cool moon-white, graphite, and jade Neo Lab system.
- All visible ecosystem records have Chinese descriptions. The research index contains 86 deduplicated records with localized summaries and topics; team roles, biographies, and link labels are localized.
- Research remains generated from the repository's JSONL evidence and foregrounds the research question, type, year, source, and original link without exposing ingestion or repository-process language.
- Contact intent is split into enterprise demo, research collaboration, and open-source/technical exchange. All routes use the centralized `whitzardindex@fudan.edu.cn` address.

## Typography and visual system

- Geist Sans Variable is self-hosted with its license, `font-display: swap`, and a preload for the first render.
- Chinese uses PingFang SC, Source Han Sans SC, Noto Sans CJK SC, Microsoft YaHei, then system sans-serif fallbacks.
- Visitor source no longer contains Songti, STSong, Noto Serif, Source Serif, Georgia, `font-serif`, `.serif`, or a global serif declaration.
- Eastern character comes from moon-white space, xuan-indigo structure, jade research accents, fine dividers, asymmetric grids, and restrained state motion rather than traditional type or decorative mythology.
- Chinese headings use balanced strict line breaking; body and card copy use pretty wrapping. Core page copy follows explicit heading, lead, card, and CTA length budgets.

## Validation

| Check | Result |
|---|---|
| `npm run ingest:info` | Passed: 18 research and 21 visible ecosystem records |
| `npm run check` | Passed: 0 errors, 0 warnings; 30 non-blocking existing hints |
| `npm run build` | Passed: 26 Astro routes plus static compatibility output |
| `npm run check:content` | Passed: 99 source files and 34 rendered pages; localization, copy budget, team/advisor facts, shared runtime semantics, route mapping, and serif checks |
| `npm run check:links` | Passed: no broken internal links |
| Sitemap | Passed: only canonical Chinese and English public routes |
| Browser QA | Passed at 1440px, 1024px, and 390px on eight Chinese core pages plus English homepage; no visible orphaned Chinese tails |
| Accessibility interaction | Runtime tabs, node inspection, approval actions, replay, mobile menu focus return, and reduced-motion output verified |
| Mobile Lighthouse, Chinese home | Performance 97, Accessibility 100, Best Practices 100, SEO 100 |
| Core Web Vitals lab result | LCP 2.4 s, TBT 0 ms, CLS 0 |
| JavaScript budget | All emitted JavaScript totals 174,365 bytes gzip, below the 180 KB budget; AgentGuard scenario island remains below 70 KB gzip |

## Human-owned follow-ups

The site deliberately does not invent legal entity details, privacy/terms language, customer evidence, testimonials, production deployment figures, performance benchmarks, or CRM workflows. Those require approved company inputs before publication; they are not blockers for the current static release.

## V3.5 implementation note

V3.5 unifies the Chinese company brand as 白泽（Whitzard）, corrects the research-team roles and advisor references, installs the confirmed NUWA Lab vision, and replaces disconnected runtime diagrams with one shared deterministic interaction-boundary model. Home renders the business projection; AgentGuard renders the complete chronological trace, three tag streams, Gate intervention, approval state, payload change, and audit evidence.

## V3.6 AgentGuard three-layer narrative

V3.6 replaces the debugger-like product story with three shared projections: a system-wide propagation map, a unified data/authorization/effect analysis engine, and a deterministic task simulator for customer-data egress, long-term memory, and shell/production commit. The homepage uses compact projections; the product page exposes node filters, detailed evidence, payload changes, sandboxing, and one-time approval. The real Community dashboard remains as product evidence after the principle narrative.

### V3.6 validation — 2026-08-04

- `npm run ingest:info`: passed with 86 research records and 22 visible ecosystem records.
- `npm run check`: passed with 0 errors; 31 pre-existing non-blocking framework hints remain.
- `npm run build`: passed with 26 generated pages.
- `npm run check:content`: passed across 104 source files and 34 rendered pages.
- `npm run check:links`: passed across 34 HTML files with no broken internal links.
- Browser QA: passed at 1440px, 1024px, and 390px for the Chinese homepage and AgentGuard page; English projections share the same component and scenario model.
- Keyboard QA: flow-mode arrow navigation, scenario selection, node inspection, replay, approve-once, and rejection controls are reachable and stateful.
- JavaScript budget: all emitted JavaScript totals 176,091 bytes gzip; the three new islands are 2,768, 1,357, and 2,415 bytes gzip respectively.

## V3.7 homepage responsibility reset — 2026-08-05

V3.7 removes the compact task simulator, protected-object strip, duplicate framework strip, and security-stack comparison from the homepage. The research-to-product loop now follows the enterprise-risk section, making the company structure visible before the remaining compact product principle. AgentGuard becomes the sole home for the full simulator, protected-object summary, and IAM/DLP/API Gateway/SIEM comparison; the use-cases page remains focused on business workflows.
