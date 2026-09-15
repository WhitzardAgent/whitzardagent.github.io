# Whitzard Full-Site Redesign Implementation Plan

**Status:** Master implementation plan
**Date:** 2026-09-15
**Scope:** Entire bilingual corporate website
**Research sub-plan:** `docs/superpowers/plans/2026-09-15-nuwa-research-system.md`

## 1. Goal

Redesign the complete Whitzard corporate website into a modern, native bilingual company presence that clearly separates and connects:

- Whitzard's company mission: building security infrastructure for the agentic AI era;
- AgentGuard and Model Services as products and services;
- NUWA Frontier AI Safety Lab as the frontier AI risk research and governance system;
- the Whitzard Open Ecosystem;
- company, team, news, contact, waitlist, and future console entry points.

The NUWA Research System is one workstream inside this plan. It does not define the boundary of the full-site redesign.

## 2. Source-of-truth order

When old documents or current code conflict, use this precedence:

1. decisions explicitly approved in the design conversation;
2. `docs/superpowers/specs/2026-09-15-nuwa-research-system-design.md` for NUWA research;
3. this master plan;
4. `docs/website-v2/` for repository audit, established constraints, reusable design reasoning, and legacy-route requirements;
5. current implementation, when it does not conflict with an approved decision.

## 3. Confirmed decisions across the entire site

### Brand and organizational model

- Company: `白泽 / Whitzard`.
- Research lab: `女娲 / NUWA`.
- Full English lab name: `NUWA Frontier AI Safety Lab`.
- Whitzard product-system mission: `打造智能体时代的安全基础设施`.
- NUWA mandate: `前沿 AI 风险研究与治理`.
- NUWA mission: `为全球 AI 治理提供风险证据与公共产品 / Shared Risk Evidence and Public Goods for the World`.
- Preferred relationship: `女娲实验室由白泽发起并支持。`
- Do not overemphasize independence.

### Global navigation

The desktop and mobile navigation use four top-level entries only:

1. `核心产品 / Products`
2. `前沿研究 / Frontier Research`
3. `开放生态 / Open Ecosystem`
4. `关于我们 / About`

Each top-level item receives a restrained line icon and visible separation. `开发者 / Developers` is removed as a top-level concept. Developer resources, GitHub, Hugging Face, models, tools, and datasets live under Open Ecosystem.

### Products and services

- AgentGuard is the core runtime security product.
- Model Services is a product/service destination, not a developer-only page.
- Use cases support the product narrative and do not become a competing company category.
- Product claims must be sourced from repository data and current product evidence.

### Homepage

- The homepage gives Whitzard's product system and NUWA a dual-path structure.
- The hero communicates Whitzard's company mission and does not use the Whitzard logo as its central decorative visual.
- The main hero visual is an abstract incomplete ring, signal, boundary, or flowing system form.
- The Whitzard logo remains in the wordmark/navigation and brand signatures.
- Preserve and refine valuable diagrams: a simplified runtime boundary and a research-to-product evidence bridge belong on the homepage.
- Do not copy detailed product diagrams that have a dedicated AgentGuard destination.

### Visual language

- Use Vercel's design-system discipline as structural inspiration: precise grid, typography, contrast, spacing, and progressive disclosure.
- Preserve a distinctive Chinese visual character through moon white, warm paper, xuanqing/indigo, jade, restrained cinnabar/gold, screen-like axes, incomplete rings, and flowing boundaries.
- Use modern sans-serif typography. Do not use Songti/serif display faces.
- Avoid literal clouds, dragons, mountains, seal-shaped buttons, generic shield imagery, cyberpunk neon, and decorative motifs that compete with evidence.

### Acquisition and SaaS direction

- Chinese acquisition CTA: `加入心愿单`.
- Native English CTA: `Join the waitlist`.
- Use the previously selected full qualification form, but keep the friendly CTA name rather than `申请测试资格`.
- Provide a real console/login entry as the company moves toward SaaS.
- The static corporate website must not pretend an authentication backend or console exists before a real console URL and auth service are available.
- Acquisition analytics should distinguish CTA click, form start, validation failure, successful submission, and console-entry click.

### NUWA research

- Use exactly three top-level research themes on the research landing.
- Keep six detailed categories only for archive filtering.
- Use verified paper figures as evidence-bearing visuals.
- Create a bilingual `Research Blog` with paired arXiv paper and human-written interpretation.
- Chinese and English editions publish together; facts and structure agree, while titles and prose are edited natively.
- Markdown templates, validation, Pull Request review, and automated deployment support authors without rewriting their prose.

## 4. Target route map

| Purpose | Chinese | English | Primary owner |
|---|---|---|---|
| Corporate homepage | `/` | `/en/` | Whitzard |
| AgentGuard | `/agentguard` | `/en/agentguard` | Products |
| Model Services | `/models` | `/en/models` | Products |
| Use cases | `/solutions` | `/en/solutions` | Products |
| Join the waitlist | `/waitlist` | `/en/waitlist` | Acquisition |
| Console entry | `/login` or configured external console URL | `/en/login` or configured external console URL | SaaS boundary |
| NUWA overview | `/nuwa` | `/en/nuwa` | NUWA |
| Research | `/nuwa/research` | `/en/nuwa/research` | NUWA |
| Research Blog | `/nuwa/blog` | `/en/nuwa/blog` | NUWA |
| Research Blog article | `/nuwa/blog/[slug]` | `/en/nuwa/blog/[slug]` | NUWA |
| Whitzard Index | `/nuwa/whitzard-index` | `/en/nuwa/whitzard-index` | NUWA |
| Open Ecosystem | `/open-ecosystem` | `/en/open-ecosystem` | Ecosystem |
| News | `/news` | `/en/news` | Company/NUWA |
| About | `/about` | `/en/about` | Company |
| Contact | `/contact` | `/en/contact` | Company |

Legacy `/developers`, `/research`, `/blog`, `/publications`, `/open-source`, `/NVWA-Project`, and `/zh/*` paths remain working through deliberate permanent redirects or static redirect stubs.

## 5. Delivery strategy

The redesign is delivered in seven phases. Each phase must leave the site buildable, preserve existing routes, and end with a focused review and commit set.

Because the current working tree already contains user-owned, overlapping changes, execution begins in the current checkout unless those changes are first committed. Never reset or overwrite them. Stage exact paths only, inspect the cached diff before every commit, and keep unrelated changes untouched.

---

## Phase 0 — Baseline reconciliation and evidence inventory

### Objective

Turn the current dirty working tree into a known implementation baseline without discarding user work.

### Tasks

1. Read all `docs/website-v2/` documents, both approved NUWA documents, `AGENTS.md`, and the current route/component map.
2. Record `git status --short`, `git diff --stat`, and per-file diffs for every overlapping file.
3. Classify current changes as:
   - approved and reusable;
   - approved but incomplete;
   - superseded by later decisions;
   - unrelated and untouchable.
4. Run the current baseline checks before editing:

```bash
npm run ingest:info
npm run check
npm run build
npm run check:content
npm run check:links
```

5. Save a baseline audit to `docs/website-v2/generated/full-redesign-baseline.md`, including actual failures and hints.
6. Do not commit pre-existing user changes as if they were produced by this implementation. If a clean checkpoint is needed, request the owner to approve that checkpoint first.

### Acceptance gate

- Every existing route and modified file has an owner/disposition.
- Baseline build status is recorded accurately.
- No user-owned change is discarded or silently staged.

---

## Phase 1 — Global design system, language, navigation, and shell

### Objective

Create the shared visual and linguistic foundation that every page uses before redesigning individual pages.

### Workstream 1.1: Design tokens and typography

**Primary files:**

- `src/styles/global.css`
- `src/styles/motion.css`
- `docs/website-v2/design-tokens.json`
- `src/components/visuals/ArcField.astro`
- `src/components/visuals/FiveStoneMotif.astro`

**Implementation:**

- Normalize moon-white, warm-paper, xuanqing/indigo, jade, cinnabar, gold, hairline, focus, and dark-surface tokens.
- Keep Geist as the Latin face and the approved Chinese system sans-serif stack.
- Define one display, heading, body, caption, mono, and evidence-caption scale.
- Define reusable grid-line, screen-panel, incomplete-ring, evidence-card, and flow-line primitives.
- Restrict motion to transform, opacity, and stroke; honor reduced motion.
- Remove forbidden serif declarations and consolidate duplicate research/home overrides.

**Validation:**

```bash
npm run check
npm run build
npm run check:content
```

### Workstream 1.2: Canonical bilingual terminology

Execute Tasks 1–2 of [the NUWA research implementation plan](/Users/morinop/Downloads/whitzardagent.github.io/docs/superpowers/plans/2026-09-15-nuwa-research-system.md) at full-site scope. The terminology table must also cover AgentGuard editions, Model Services, Open Ecosystem, waitlist states, console/login language, use cases, and company language.

**Additional locked UI pairs:**

| Chinese | English |
|---|---|
| 核心产品 | Products |
| 前沿研究 | Frontier Research |
| 开放生态 | Open Ecosystem |
| 关于我们 | About |
| 加入心愿单 | Join the waitlist |
| 登录控制台 | Sign in to Console |
| 模型服务 | Model Services |
| 应用场景 | Use Cases |
| 社区版 | Community Edition |
| 企业版 | Enterprise Edition |

### Workstream 1.3: Global header, footer, and locale routing

**Primary files:**

- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/LanguageSwitch.astro`
- `src/i18n/ui.ts`
- `src/i18n/routes.ts`
- `src/layouts/BaseLayout.astro`
- `astro.config.mjs`

**Implementation:**

- Render four top-level navigation groups with restrained inline SVG icons and separators.
- Products dropdown: AgentGuard, Model Services, Use Cases.
- Frontier Research dropdown: NUWA overview, Research, Research Blog, Whitzard Index.
- Open Ecosystem routes to the ecosystem page and exposes GitHub/Hugging Face context there.
- About routes directly to the company page.
- Keep language switching on matching localized routes, including dynamic News and Research Blog routes.
- Render `加入心愿单 / Join the waitlist` as the primary global CTA.
- Render console sign-in as a secondary action only when a valid configured console URL exists; otherwise link to a truthful `/login` explanation page created in Phase 4.
- Update footer columns to Products, NUWA, Open Ecosystem, and Company.

### Phase 1 acceptance gate

- Four navigation groups are identical in meaning across Chinese and English.
- Each route has correct active state and keyboard behavior.
- No top-level Developers label remains.
- Typography is sans-serif throughout.
- WCAG AA focus and contrast checks pass.
- `npm run ingest:info`, build, content checks, and link checks pass.

---

## Phase 2 — Corporate homepage redesign

### Objective

Make the homepage explain Whitzard's company proposition within one screen, then progressively reveal products, evidence, ecosystem, and company trust.

### Target narrative

1. Whitzard mission hero
2. Enterprise agent-risk problem
3. AgentGuard product path
4. Model Services path
5. Simplified runtime boundary diagram
6. NUWA research path
7. Research-to-product evidence bridge
8. Open Ecosystem
9. Latest verified news
10. Waitlist CTA

### Primary files

- `src/components/home/HomePage.astro`
- `src/components/home/HomeHero.tsx` or a static Astro replacement if interaction is unnecessary
- `src/components/home/AgentGuardBoundaryFlow.tsx`
- `src/components/home/LatestNews.astro`
- `src/components/home/ResearchProductBridge.astro`
- `src/components/visuals/WhitzardHeroVisual.astro`
- `src/i18n/pages/home.ts`
- `src/styles/home.css`
- `src/pages/index.astro`
- `src/pages/en/index.astro`
- `scripts/check-content.mjs`

### Implementation tasks

1. Replace the hero's decorative logo treatment with an abstract incomplete ring/boundary visual. Keep the real logo in the global wordmark.
2. Use `打造智能体时代的安全基础设施` as the primary Chinese proposition and write a native English counterpart consistent with the glossary.
3. Provide two immediate paths: explore Products and explore Frontier Research.
4. Introduce AgentGuard and Model Services as sibling product/service cards with different maturity language only when supported by repository evidence.
5. Retain a simplified runtime boundary diagram showing agent, tools, data, identity, and external actions; link the detailed explanation to AgentGuard.
6. Restore a concise research-to-product bridge: NUWA produces risk evidence and public goods; verified findings may inform product safeguards without collapsing the lab into the product.
7. Keep paper figures on research pages, not on the homepage.
8. Add Open Ecosystem and latest-news summaries from real data sources.
9. End with the full qualification CTA named `加入心愿单 / Join the waitlist`.
10. Keep the homepage mostly static; hydrate only a diagram whose interaction materially improves understanding.

### Visual review matrix

- 1440×1000 desktop
- 1024×768 compact desktop/tablet
- 768×1024 tablet
- 390×844 mobile
- 200% zoom
- reduced motion
- Chinese and English text expansion

### Phase 2 acceptance gate

- A first-time visitor can identify Whitzard, AgentGuard, Model Services, NUWA, and Open Ecosystem without opening navigation.
- The central hero visual is abstract, not the logo.
- Valuable simplified diagrams are present and link to deeper pages.
- No detailed product or paper section is duplicated.
- Homepage headings meet the approved copy budgets and use native bilingual wording.

---

## Phase 3 — Products and services

### Objective

Turn AgentGuard and Model Services into credible, distinct product/service destinations while keeping claims factual.

### Workstream 3.1: AgentGuard detail page

**Primary files:**

- `src/components/agentguard/AgentGuardPage.astro`
- `src/components/agentguard/AgentGuardShowcase.astro`
- `src/components/agentguard/AgentGuardSystemMap.tsx`
- `src/components/agentguard/UnifiedSecurityInfluenceEngine.tsx`
- `src/components/agentguard/AgentGuardRiskSimulator.tsx`
- `src/components/agentguard/AgentGuardEnterpriseScenarioLab.tsx`
- `src/components/agentguard/DeploymentArchitecture.tsx`
- `src/data/agentguardStory.ts`
- `src/data/agentguardEnterpriseScenarios.ts`
- `src/styles/agentguard.css`
- `src/styles/agentguard-story.css`
- `src/styles/enterprise-scenario-lab.css`

**Narrative:**

1. AgentGuard positioning and editions
2. What must be protected across the agent runtime
3. System propagation map
4. Unified security influence engine
5. Runtime intervention and decision states
6. Enterprise scenario simulator
7. Deployment trust boundary
8. Evidence, community resources, and enterprise CTA

**Requirements:**

- Preserve the system map, unified engine, runtime simulator, and deployment boundary because they explain distinct concepts.
- Label Community and Enterprise editions accurately.
- Any GitHub link must explicitly identify the Community Edition.
- Use `推理轨迹 / reasoning trace` and `行动影响 / action impact` consistently.
- Do not invent deployment counts, latency, coverage, or customer evidence.
- Validate all interactions with keyboard and reduced motion.

### Workstream 3.2: Model Services page

**Primary files:**

- `src/components/models/ModelsPage.astro`
- `src/i18n/pages/models.ts`
- `src/styles/models.css`
- `src/pages/models.astro`
- `src/pages/en/models.astro`

**Narrative:**

1. What Model Services provides
2. Intended enterprise problems
3. Service lifecycle and safety boundary
4. Relationship to AgentGuard
5. Access path through the waitlist

**Requirements:**

- Present Model Services as a product/service, not a developer artifact.
- Replace roadmap/status-heavy language with capability and intended-use language that does not imply unavailable functionality is live.
- Do not publish pricing, quotas, availability dates, model benchmarks, or deployment claims without approved data.
- Use the waitlist as the conversion path until a real console/onboarding path exists.

### Workstream 3.3: Use cases

**Primary files:**

- `src/components/enterprise/SolutionsPage.astro`
- `src/components/enterprise/UseCaseBoundaryExplorer.tsx`
- `src/i18n/pages/company.ts`
- `src/styles/company.css`

**Requirements:**

- Organize use cases by enterprise workflow rather than industry logos or invented customers.
- Show task, risk, safeguard, and business-continuity outcome.
- Link each use case to the relevant AgentGuard or Model Services capability.
- Keep one purposeful interactive explorer; static explanatory sections remain Astro.

### Phase 3 acceptance gate

- AgentGuard and Model Services are both discoverable as products/services.
- Each diagram has a unique explanatory purpose.
- All product claims are traceable to repository evidence.
- Use cases clarify value without implying named deployments.
- Product and use-case routes pass responsive, keyboard, content, and link checks.

---

## Phase 4 — Waitlist, acquisition measurement, and console boundary

### Objective

Support measurable acquisition now while creating a truthful path toward a separate authenticated SaaS console.

### Workstream 4.1: Full qualification waitlist

**New routes and components:**

- `src/pages/waitlist.astro`
- `src/pages/en/waitlist.astro`
- `src/components/acquisition/WaitlistPage.astro`
- `src/components/acquisition/WaitlistForm.tsx`
- `src/i18n/pages/waitlist.ts`
- `src/styles/waitlist.css`

**Form fields:**

- name;
- work email;
- organization;
- role;
- primary interest: AgentGuard, Model Services, or both;
- agent/framework environment;
- intended use case;
- current deployment stage;
- expected timeline;
- optional notes;
- privacy/consent acknowledgement.

**Behavior:**

- Keep the page and CTA title `加入心愿单 / Join the waitlist`.
- Use progressive grouping so the full qualification form does not look like a dense sales form.
- Validate fields client-side and preserve entered values after validation errors.
- Submit only to an explicitly configured real endpoint.
- If no endpoint is configured, do not render a fake success state; provide the published contact email as a truthful fallback.
- Never place endpoint secrets in public Astro environment variables.

**External dependency gate:**

Before production submission can be activated, the owner must choose and configure a real collection destination such as the company's CRM/form service or a separately deployed serverless endpoint, approve the privacy notice, and define retention/access rules. The static site implementation may ship with the honest email fallback, but it must not claim that a submission was stored.

### Workstream 4.2: Acquisition analytics

Use the existing Umami installation and add named events:

- `waitlist-cta-click`
- `waitlist-form-start`
- `waitlist-validation-error`
- `waitlist-submit-success`
- `waitlist-submit-failure`
- `console-entry-click`
- `research-collaboration-click`
- `product-detail-open`

Do not send form-field values, email addresses, names, notes, or other personal data to analytics.

### Workstream 4.3: Console/login boundary

**New routes and components:**

- `src/pages/login.astro`
- `src/pages/en/login.astro`
- `src/components/acquisition/ConsoleEntry.astro`

**Behavior:**

- Read a public, validated `PUBLIC_CONSOLE_URL` at build time.
- When configured, the header action links directly to the real HTTPS console URL.
- When absent, `/login` truthfully explains that console access is being introduced and offers the waitlist/contact route.
- Do not implement authentication, password collection, account creation, or sessions inside this static marketing repository.

**Future SaaS boundary:**

The authenticated console should be a separate application/deployment with its own auth, security headers, audit logs, privacy terms, and release lifecycle. Selecting its auth provider and backend is a separate architecture decision and is not inferred by this website redesign.

### Phase 4 acceptance gate

- Every waitlist CTA reaches a real route.
- The form never reports false success.
- Analytics contain no personal form data.
- Console links are real HTTPS destinations or an honest local explanation.
- Accessibility, validation, error, success, retry, and network-failure states are tested.

---

## Phase 5 — NUWA, Research System, and Research Blog

### Objective

Implement NUWA as Whitzard's frontier AI risk research and governance system, not as an AgentGuard subsection.

### Execution plan

Execute all four phases and 11 tasks in:

[NUWA Research System Implementation Plan](/Users/morinop/Downloads/whitzardagent.github.io/docs/superpowers/plans/2026-09-15-nuwa-research-system.md)

The work includes:

- canonical terminology and three research themes;
- NUWA overview and mission;
- evidence-led research landing;
- verified paper figures;
- research infrastructure and public goods;
- complete publication archive;
- bilingual Research Blog;
- paired arXiv and Blog actions;
- Markdown authoring templates;
- automated content checks;
- RSS, SEO, citation, revision, and language metadata;
- Pull Request editorial gate.

### Integration requirements

- Homepage Research entry links to `/nuwa`; representative work links to `/nuwa/research`.
- Research Blog remains inside the Frontier Research navigation group, not global top-level navigation.
- NUWA uses its logo as identity, while abstract rings and five-stone motifs remain secondary visual language.
- Product pages may cite verified research but must not claim that all research outputs are product capabilities.
- Public-impact and recognition records remain sourced and subordinate to the main research narrative.

### Phase 5 acceptance gate

Use Gates A–D in the Research System plan. Additionally verify homepage/product links, global navigation integration, and cross-site terminology consistency.

---

## Phase 6 — Open Ecosystem, About, News, and company trust

### Objective

Complete the non-product and non-research parts of the corporate website without reverting to generic developer or press-release pages.

### Workstream 6.1: Open Ecosystem

**Primary files:**

- `src/components/ecosystem/EcosystemPage.astro`
- `src/components/developers/DevelopersPage.astro`
- `src/i18n/pages/developers.ts`
- `src/data/generated/openSourceAssets.ts`
- `src/styles/developers.css`
- `src/pages/open-ecosystem.astro`
- `src/pages/en/open-ecosystem.astro`
- `src/pages/developers.astro`
- `src/pages/en/developers.astro`

**Implementation:**

- Make `/open-ecosystem` canonical.
- Redirect `/developers` to the localized Open Ecosystem page after migration.
- Organize real assets by tools, models, datasets, evaluation infrastructure, and integrations where metadata supports the distinction.
- Preserve GitHub and Hugging Face links and data-derived descriptions.
- Remove “developer portal,” fake console, registration, and unavailable API language.
- Explain how the ecosystem relates to Whitzard products and NUWA public goods without conflating them.

### Workstream 6.2: About

**Primary files:**

- `src/components/enterprise/CompanyPage.astro`
- `src/data/team.ts`
- `src/i18n/pages/company.ts`
- `src/pages/about.astro`
- `src/pages/en/about.astro`

**Narrative:**

1. Company purpose
2. Why agentic AI changes the security boundary
3. Whitzard product system and NUWA relationship
4. Team and sourced biographies
5. Operating principles
6. Contact and waitlist paths

Use native Chinese and US English. Preserve verified roles and profile links. Do not invent investors, offices, customers, legal registrations, or partnership claims.

### Workstream 6.3: News and contact

**Primary files:**

- `src/components/news/NewsPage.astro`
- `src/components/news/NewsArticle.astro`
- `src/data/news.ts`
- `src/components/enterprise/ContactPage.astro`
- `src/pages/news/*`
- `src/pages/contact.astro`
- `src/pages/en/contact.astro`

**Implementation:**

- Keep News for company, event, media, and ecosystem updates.
- Route paper interpretation to Research Blog rather than mixing it into generic News.
- Keep existing externally sourced articles labeled by source language.
- Make Contact concise and route product access interest to the waitlist.
- Preserve the real published email address and avoid fake form delivery.

### Phase 6 acceptance gate

- Open Ecosystem replaces Developers in visitor-facing language.
- Real assets and biographies remain sourced.
- News and Research Blog have distinct editorial roles.
- About explains the full company/lab/product relationship clearly.
- All legacy routes redirect correctly.

---

## Phase 7 — Cross-site SEO, accessibility, performance, QA, and rollout

### Objective

Verify the redesign as one coherent bilingual website and deploy it without route loss or unsupported claims.

### Technical verification

Run in this order:

```bash
npm run ingest:info
npm test
npm run check
npm run build
npm run check:content
npm run check:links
```

### Route verification

Check every canonical Chinese and English route plus all redirect-only aliases. Confirm:

- correct canonical URLs;
- reciprocal `hreflang`;
- Chinese `x-default`;
- localized title and description;
- correct organization/product/research/article schema;
- no redirect route in the sitemap;
- no draft Research Blog entry in build, sitemap, or feeds;
- no broken internal link.

### Visual and interaction QA

At 1440×1000, 1024×768, 768×1024, and 390×844, verify:

- homepage;
- AgentGuard;
- Model Services;
- Use Cases;
- Waitlist;
- login/console entry;
- NUWA overview;
- Research;
- Research Blog;
- Whitzard Index;
- Open Ecosystem;
- News;
- About;
- Contact;
- 404.

Repeat keyboard navigation and reduced-motion checks. Test 200% zoom, long English headings, Chinese punctuation, form error/success/fallback states, interactive diagrams, archive filters, dropdowns, language switches, and mobile menus.

### Performance budgets

- Static pages must not gain unnecessary hydration.
- Blog article pages ship no React island.
- Only purposeful homepage/product/archive interactions hydrate.
- Below-the-fold figures use responsive dimensions and lazy loading.
- Fonts are self-hosted and preload only the primary variable face.
- No large animation, icon, CMS, or form library is added without measured need.
- Record build output and Lighthouse/Web Vitals evidence without fabricating scores.

### CI and deployment

- Run validation on every Pull Request to `main`.
- Deploy GitHub Pages only from a validated `main` push.
- Keep the Research Blog human editorial review gate.
- Require separate owner approval before enabling a real waitlist endpoint or console URL.
- Update `docs/website-v2/generated/release-report.md` with actual automated and manual results.

### Rollout order

1. Global shell and design tokens
2. Homepage
3. AgentGuard, Model Services, and Use Cases
4. Waitlist and console boundary
5. NUWA and Research Blog
6. Open Ecosystem, About, News, and Contact
7. Redirect activation, full QA, and production release

### Final acceptance gate

- The site communicates the full Whitzard company and product system, not only Research.
- Chinese and English both read as native professional copy.
- The four-item navigation contract is consistent everywhere.
- AgentGuard and Model Services are clearly products/services.
- NUWA is clearly the frontier research and governance lab.
- Open Ecosystem replaces the developer-first narrative.
- Waitlist and console paths are truthful and measurable.
- Valuable diagrams are preserved, simplified, and placed on the right detail pages.
- All evidence, research, people, and product claims are traceable to repository sources.
- Full build, content, link, accessibility, responsive, reduced-motion, and deployment checks pass.

## 6. Milestones and review checkpoints

| Milestone | Included phases | User-visible outcome | Review decision |
|---|---|---|---|
| M1 · Foundation | 0–1 | Final visual system, glossary, navigation, footer | Approve global shell |
| M2 · Commercial core | 2–3 | Homepage, AgentGuard, Model Services, Use Cases | Approve company/product story |
| M3 · Acquisition | 4 | Waitlist, analytics, console boundary | Approve data destination and console policy |
| M4 · Research | 5 | NUWA, research archive, Research Blog | Approve research experience |
| M5 · Company breadth | 6 | Open Ecosystem, About, News, Contact | Approve full information architecture |
| M6 · Release | 7 | QA evidence, redirects, CI, production candidate | Approve deployment |

## 7. Explicit non-goals

- Do not turn the corporate site into the authenticated SaaS console.
- Do not collect passwords or implement authentication in the GitHub Pages site.
- Do not activate a waitlist data sink without an approved endpoint and privacy policy.
- Do not auto-generate or auto-translate Research Blog prose.
- Do not invent product availability, pricing, benchmarks, customers, partners, deployments, or research claims.
- Do not add a second research navbar or a fifth global navigation item.
- Do not revive the rejected four-layer capability matrix.
- Do not remove valuable legacy routes or sourced research/public-impact records.
