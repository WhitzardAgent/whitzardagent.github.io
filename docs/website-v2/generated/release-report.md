# Whitzard Website V3.1 release report

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

- The homepage and AgentGuard page share one deterministic runtime console. Its three scenarios cover derived-data egress, untrusted-content-to-shell behavior, and low-trust database writes requiring human approval.
- The console exposes the canonical `ALLOW · SANITIZE · ALIGN · DEGRADE · APPROVE · DENY` spectrum, policy hits, trace nodes, replay, and approve-once/reject interactions. Keyboard tabs and reduced-motion output were verified.
- The Chinese homepage leads with “企业级智能体安全基础设施”, real supported-adapter evidence, and the compact console before moving to product, deployment, research, and open evidence.
- AgentGuard uses the public project's real dashboard, policy editor, policy-generation screenshot, and official click-to-play demo video. The interactive example uses the documented `retrieve_doc → send_email_to` allow/deny rule.
- The video is not fetched on initial page load (`preload="none"`) and is accompanied by a complete text walkthrough.
- The solutions page is now organized around four enterprise workflows—data and knowledge, development and operations, external actions, and multi-agent platforms—without repeating the product architecture.
- NUWA is formally named “女娲实验室 / NUWA Lab”. Its existing logo is the hero's primary visual, with a cool moon-white, graphite, and jade Neo Lab system.
- All 21 ecosystem records now have Chinese descriptions. All 18 research records have localized summaries and topics, and team roles, biographies, and link labels are localized.
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
| `npm run check:content` | Passed: 94 source files and 34 rendered pages; localization, copy budget, legacy email, route mapping, and serif checks |
| `npm run check:links` | Passed: no broken internal links |
| Sitemap | Passed: only canonical Chinese and English public routes |
| Browser QA | Passed at 1440px, 1024px, and 390px on eight Chinese core pages plus English homepage; no visible orphaned Chinese tails |
| Accessibility interaction | Runtime tabs, node inspection, approval actions, replay, mobile menu focus return, and reduced-motion output verified |
| Mobile Lighthouse, Chinese home | Performance 97, Accessibility 100, Best Practices 100, SEO 100 |
| Core Web Vitals lab result | LCP 2.4 s, TBT 0 ms, CLS 0 |
| JavaScript budget | All emitted JavaScript totals 158,730 bytes gzip, below the 180 KB budget |

## Human-owned follow-ups

The site deliberately does not invent legal entity details, privacy/terms language, customer evidence, testimonials, production deployment figures, performance benchmarks, or CRM workflows. Those require approved company inputs before publication; they are not blockers for the current static release.
