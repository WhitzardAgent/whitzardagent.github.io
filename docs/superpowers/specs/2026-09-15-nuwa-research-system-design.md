# NUWA Research System and Research Blog Design

**Status:** Approved design  
**Date:** 2026-09-15  
**Scope:** NUWA overview, research landing, publication archive, Research Blog, bilingual editorial workflow, and Markdown publishing  
**Production implementation:** Not included in this document

## 1. Purpose

This design turns the NUWA area of the Whitzard website into a coherent research system rather than a collection of loosely related publication cards.

The system must:

- state NUWA's mission clearly;
- organize current work around a small number of durable research themes;
- present verified research evidence with appropriate provenance;
- pair significant arXiv releases with accessible, human-written Research Blog articles;
- expose research infrastructure and public goods;
- preserve a searchable record of all sourced research outputs;
- support native Chinese and English editions;
- make authoring and publishing possible through Markdown without requiring authors to edit Astro components.

## 2. Locked brand and mission language

The following names and statements are canonical and must not be paraphrased in primary brand positions.

| Concept | Chinese | English |
|---|---|---|
| Company | 白泽 | Whitzard |
| Research lab | 女娲 | NUWA |
| Full lab name | 女娲实验室 | NUWA Frontier AI Safety Lab |
| Company product-system purpose | 打造智能体时代的安全基础设施 | Build security infrastructure for the agentic AI era |
| Lab mandate | 前沿 AI 风险研究与治理 | Frontier AI risk research and governance |
| Research mission | 为全球 AI 治理提供风险证据与公共产品 | Shared Risk Evidence and Public Goods for the World |

The preferred relationship statement is:

- Chinese: `女娲实验室由白泽发起并支持。`
- English: `NUWA Frontier AI Safety Lab was initiated and is supported by Whitzard.`

Do not emphasize organizational independence in primary website copy. Do not describe NUWA as merely a research section inside AgentGuard.

## 3. Information architecture

### 3.1 Global navigation

The global navigation remains limited to four entries:

1. 核心产品 / Products
2. 前沿研究 / Frontier Research
3. 开放生态 / Open Ecosystem
4. 关于我们 / About

Each entry uses a restrained line icon and clear separation. Research Blog does not become a fifth global navigation item.

The Chinese primary acquisition CTA remains `加入心愿单`. The native English CTA remains `Join the waitlist`.

### 3.2 Research routes

Chinese remains the unprefixed default locale. English remains under `/en/*`.

| Purpose | Chinese route | English route |
|---|---|---|
| NUWA overview | `/nuwa` | `/en/nuwa` |
| Research landing and publication archive | `/nuwa/research` | `/en/nuwa/research` |
| Research Blog index | `/nuwa/blog` | `/en/nuwa/blog` |
| Research Blog article | `/nuwa/blog/[slug]` | `/en/nuwa/blog/[slug]` |
| Whitzard Index | `/nuwa/whitzard-index` | `/en/nuwa/whitzard-index` |

Compatibility behavior:

- `/research` redirects permanently to `/nuwa/research`.
- `/en/research` redirects permanently to `/en/nuwa/research`.
- `/blog` redirects permanently to `/nuwa/blog`.
- `/en/blog` redirects permanently to `/en/nuwa/blog`.
- Existing `/zh/*` redirect stubs remain intact.

## 4. Research landing page

### 4.1 Page narrative

The research landing follows one continuous evidence narrative:

1. Mission
2. Core research themes
3. Featured research evidence
4. Research Blog
5. Research infrastructure and public goods
6. Complete publication archive
7. Research collaboration

There is one global navbar only. A compact editorial index may appear inside the hero or page body, but it must not resemble a second navbar.

### 4.2 Hero

The hero contains:

- NUWA identity and logo;
- `NUWA Frontier AI Safety Lab`;
- the mandate `前沿 AI 风险研究与治理` / `Frontier AI risk research and governance`;
- the locked bilingual mission;
- the Whitzard–NUWA relationship statement;
- a primary link to research outputs;
- a secondary link for research collaboration;
- an editorial page index on wide screens.

Use a modern sans-serif stack. Do not use Songti or another serif display face. The current preferred stack begins with Geist and Chinese system sans-serif families.

### 4.3 Core research themes

The research landing uses exactly three durable top-level themes:

1. **前沿 AI 风险与控制 / Frontier AI Risk and Control**  
   Research risks from increasingly capable and autonomous AI systems and verifiable control approaches.

2. **智能体与模型安全 / Agent and Model Safety**  
   Research systemic safety questions in reasoning, action, tool use, model behavior, and human–AI trust.

3. **风险评测与治理方法 / Risk Evaluation and Governance Methods**  
   Build executable and reproducible evaluation environments and study how evidence should inform risk assessment and governance decisions.

The existing six research categories remain available as archive filters. They are not presented as six competing homepage programs.

### 4.4 Featured research

Featured research uses verified paper figures as the principal visual material wherever the repository contains a verified figure record.

Each figure must show:

- paper title;
- figure label;
- PDF page number;
- localized caption;
- direct source link;
- accessible alternative text.

Do not redraw a paper figure unless the replacement is explicitly labeled as an interpretation. Never present a decorative reconstruction as original research evidence.

For research without a verified figure, use a restrained text-led card. Do not invent diagrams or empirical claims.

### 4.5 Research infrastructure and public goods

Infrastructure cards are generated from repository evidence, currently including projects such as AgentCyberRange and AutoControl Arena. The section may also link to the Whitzard Index and other verified public resources.

Do not use status badges such as “built,” “planned,” or “under construction” unless the repository contains an authoritative status source and the status is part of the intended public message.

### 4.6 Complete archive

The archive retains:

- full-text search;
- year grouping;
- topic filters;
- publication-type filters;
- member filters;
- links to paper, PDF, code, project, and Research Blog when available.

Counts must always be derived from repository data. Never hard-code publication, award, or project totals into marketing copy.

## 5. Research Blog

### 5.1 Name and role

The canonical product name is **Research Blog** in both locales. Do not translate the displayed title to “研究博客” and do not use “女娲简报” or “NUWA Brief” as the primary name.

NUWA establishes brand ownership around the title. Chinese explanatory copy may describe the section's function in Chinese.

Research Blog is the editorial layer between formal research evidence and broader technical or governance discussion. It is not a generic corporate news feed.

### 5.2 Paper–article pairing

The default publication model is:

1. publish an arXiv paper;
2. publish a companion Research Blog article;
3. link both items bidirectionally;
4. surface the pair on the research landing and in the complete archive;
5. distribute the Blog edition through RSS and, where useful, Substack.

The arXiv paper is the formal source record. The Blog article explains:

- why the problem matters;
- how the research was conducted;
- the principal findings;
- evidence boundaries and uncertainty;
- technical and governance implications;
- where to find the original paper, PDF, code, data, and citation.

Research cards use two clear actions:

- primary: `阅读研究解读` / `Read the research article`;
- secondary: `查看 arXiv 原文` / `View on arXiv`.

When a companion Blog article does not exist, the paper source remains the primary action. The interface must not render an empty or fake Blog link.

### 5.3 Index page

The Research Blog index contains:

- NUWA identity;
- title `Research Blog`;
- a concise localized explanation;
- one featured article;
- a chronological article list;
- research-theme filters;
- author filters when the corpus becomes large enough;
- subscription links;
- RSS/Atom discovery.

The initial content emphasis is paper explainers. Secondary editorial types may include research updates, evidence notes, methods and tools, and governance observations, but these must not obscure the paper-linked publishing model.

General company milestones, hiring, and event notices belong to the organization/news area rather than the main research evidence stream.

### 5.4 Article page

Every article page includes:

1. NUWA and Research Blog identity;
2. localized title and summary;
3. author, editor, publication date, and revision date;
4. associated core research theme;
5. a prominent companion-paper module;
6. an optional compact table of contents for long articles;
7. human-authored Markdown content;
8. verified figures with captions and sources;
9. evidence limitations and applicable boundaries;
10. governance implications where relevant;
11. original paper and resource links;
12. citation metadata;
13. revision history;
14. related research and related Blog articles;
15. language switch to the paired edition.

The compact table of contents is part of the article layout, not a second site navbar.

## 6. Bilingual editorial contract

Every public Research Blog article is released in Chinese and English at the same time.

The editions are equal publications, not an “original” and a subordinate translation.

The following must match across languages:

- underlying research claims;
- figures and numeric results;
- evidence status;
- paper and resource links;
- author and editor records;
- publication and revision dates;
- citation and version metadata;
- limitations and material caveats.

The following should be edited natively for each language:

- Blog title;
- deck/summary;
- paragraph structure;
- transitions;
- examples and brief terminology explanations;
- CTA wording.

The formal paper title remains unchanged. Blog titles do not need to be literal translations of each other.

Use US English consistently. Chinese follows formal modern written Chinese with spacing around Latin acronyms such as `AI` and `API`.

Each pair shares one stable `translationKey` and equivalent slug. Pages include explicit language links, canonical URLs, and reciprocal `hreflang` metadata.

## 7. Markdown authoring model

### 7.1 File structure

One research topic owns one directory:

```text
src/content/research-blog/
└── autocontrol-arena/
    ├── zh.md
    ├── en.md
    └── assets/
        ├── figure-01.webp
        └── social-card.png
```

Images referenced in Markdown use relative paths. The build is responsible for optimization and hashed output.

### 7.2 Minimal frontmatter

Authors should only enter editorial information that cannot be derived safely:

```yaml
---
title: "本语言的原生标题"
summary: "本语言的文章摘要"
date: 2026-09-15
authors:
  - "Author Name"
editors:
  - "Editor Name"
research_asset: "autocontrol-arena-synthesizing-executable-test-environments-for-frontier-ai-risk"
featured: false
draft: true
---
```

The system derives:

- locale from `zh.md` or `en.md`;
- translation key and route from the parent directory;
- formal paper title, arXiv ID, PDF URL, authorship metadata, year, and source links from `researchAssets`;
- research theme from the associated research record;
- canonical and `hreflang` URLs;
- citation block;
- RSS and SEO metadata.

If an editorial author differs from the paper authors, both groups are labeled explicitly.

### 7.3 Body template

The generated Markdown includes prompts for:

```markdown
## 为什么开展这项研究

## 我们如何研究

## 主要发现

## 证据边界与局限

## 对技术与治理的意义

## 原文与相关资源
```

The English template uses native headings rather than mechanical translations.

The original paper/resource section can be rendered from structured metadata; authors should not have to maintain duplicate URLs manually.

## 8. Authoring and publication workflow

### 8.1 Commands

The implementation should add:

```bash
npm run blog:new -- <slug> <arxiv-id>
npm run blog:check -- <slug>
```

`blog:new`:

- validates the slug;
- finds or verifies the associated research record and arXiv ID;
- creates the paired `zh.md` and `en.md` templates;
- creates the asset directory;
- sets both editions to draft;
- refuses to overwrite existing content.

`blog:check`:

- validates both files and their shared identity;
- checks required frontmatter;
- validates the research-record association;
- validates paper, PDF, code, and data links where present;
- checks terminology and deprecated brand variants;
- checks image existence and required alt text/captions;
- checks heading structure;
- checks that facts controlled by structured metadata agree across languages;
- runs relevant content and site checks;
- reports actionable errors without modifying authored prose.

`npm run dev` remains the normal local preview command.

### 8.2 Human review gate

Research Blog content is human-written and human-edited. Automated tools must not rewrite prose during publication checks.

The approved publishing gate is:

1. create paired templates;
2. write and edit both editions;
3. preview locally;
4. run automated checks;
5. open a GitHub Pull Request;
6. complete human editorial review;
7. merge to `main`;
8. deploy automatically through the existing GitHub Pages workflow.

The publishing command must not push directly to `main` or bypass review.

## 9. Content schema and integration

Add a dedicated Astro content collection for Research Blog. Do not overload the existing generic posts collection with research-specific validation.

The collection schema should cover:

- title;
- summary;
- date;
- optional updated date;
- authors;
- editors;
- research asset reference;
- featured flag;
- draft flag;
- optional social image;
- optional revision note.

Article resolution joins the content entry to `src/data/generated/researchAssets.ts` through `research_asset`. Source-controlled research metadata remains authoritative.

Publication cards and Research Blog cards should use a shared relationship helper rather than duplicating lookup logic across components.

## 10. Terminology governance

The website needs one machine-readable bilingual terminology source plus a human editorial guide.

Recommended files:

- `src/data/terminology.ts` — canonical terms, preferred forms, deprecated forms, and validation metadata;
- `docs/website-v2/13-bilingual-terminology.md` — definitions, usage guidance, examples, and editorial rationale.

Each entry should support:

- stable ID;
- Chinese term;
- English term;
- status: locked, preferred, allowed, or deprecated;
- definition;
- usage conditions;
- forms to avoid;
- notes and sources.

Content checks should reject deprecated organization variants such as `NVWA`, `Nvwa`, and `Nuwa Lab` when they are used as current public branding. Historical URLs may remain as redirect paths.

Technical distinctions must be maintained, including:

- 评测 / evaluation;
- 评估 / assessment;
- 安全 / safety or security according to context;
- 可信 / trustworthy;
- 治理 / governance;
- 控制 / control;
- 防护 / protection or safeguards;
- 处置 / response or enforcement action.

## 11. Visual language

The research experience uses the approved Whitzard/NUWA visual direction:

- structural inspiration from Vercel's grid, typography discipline, contrast, and progressive disclosure;
- moon-white and warm paper backgrounds;
- xuanqing/indigo for institutional authority;
- jade for evidence links and active states;
- restrained cinnabar and gold accents;
- screen-like divisions, editorial axes, incomplete rings, and flowing boundaries;
- NUWA logo as research identity, not as an oversized decorative hero graphic;
- modern sans-serif typography only;
- paper figures as evidence-bearing visuals.

Avoid literal clouds, dragons, mountains, seal-shaped buttons, cyberpunk effects, generic shield imagery, and decorative patterns that compete with research evidence.

## 12. Accessibility, performance, and motion

- Preserve WCAG AA text and control contrast.
- Use semantic headings and landmarks.
- Provide useful alt text for every meaningful research figure.
- Provide captions and source links adjacent to evidence visuals.
- Ensure all filters and language controls are keyboard accessible.
- Keep article reading width comfortable in both Chinese and English.
- Use Astro static output and avoid client JavaScript on article pages.
- Load the interactive publication explorer only where filtering requires it.
- Optimize and lazy-load below-the-fold figures.
- Preserve `prefers-reduced-motion`; research figures themselves must never require motion to communicate evidence.

## 13. SEO, feeds, and citation

Each Blog article receives:

- localized title and description;
- canonical URL;
- reciprocal `hreflang` links;
- Open Graph and social metadata;
- article publication and modification dates;
- person/organization author metadata;
- connection to the companion paper;
- structured citation information;
- inclusion in localized RSS/Atom feeds when public.

The research archive and Blog index should expose separate feed discovery where useful. Draft content must never enter sitemaps, feeds, or generated search records.

## 14. Analytics

Analytics should measure content usefulness without turning the research page into a conversion funnel.

Recommended events:

- open Research Blog article;
- open arXiv paper;
- open PDF;
- open code or data;
- switch article language;
- copy citation;
- subscribe to research updates;
- use archive filters or search;
- initiate research collaboration.

Do not present internal engagement metrics publicly as evidence of research impact.

## 15. Migration

- Reuse verified research data and figure provenance already in the repository.
- Preserve valuable existing research routes and redirect aliases.
- Replace the current generic `/blog` page with a redirect only after the Research Blog index exists.
- Migrate the existing external NUWA article record into the new Blog index as an external legacy item unless a full, human-approved bilingual onsite edition is supplied.
- Keep the Substack link as a distribution channel. The Whitzard website becomes the canonical home for future bilingual editions.
- Do not fabricate historical Chinese editions for previously published English-only content.

## 16. Non-goals

This design does not authorize:

- AI-generated or automatically rewritten Blog prose;
- publication without human review;
- invented customers, partners, deployments, benchmarks, or claims;
- a new global navigation item for Research Blog;
- a second NUWA navbar;
- a CMS dependency;
- dynamic server rendering;
- changes to AgentGuard product behavior;
- revival of the rejected four-layer capability matrix;
- removal of valuable legacy routes.

## 17. Acceptance criteria

The design is successfully implemented when:

- the locked NUWA mission and organization names are used consistently;
- the research page presents the approved six-module narrative;
- the three core research themes are distinct from the six archive filters;
- verified paper figures include provenance and accessible captions;
- Research Blog has bilingual index and article routes;
- a paper card can link to its paired Blog article and arXiv source;
- a Blog article prominently links back to its companion paper;
- Chinese and English editions are paired and published together;
- `blog:new` creates safe, non-overwriting paired templates;
- `blog:check` catches missing editions, metadata, sources, and terminology errors;
- research prose remains human-authored and human-reviewed;
- merging an approved Pull Request to `main` triggers the existing static deployment;
- `npm run ingest:info`, `npm run check`, `npm run check:content`, `npm run check:links`, and `npm run build` remain operational;
- responsive behavior, WCAG AA contrast, and reduced-motion support are preserved.

## 18. Reference patterns

The information architecture may learn from, but must not imitate mechanically:

- Vercel Geist: grid, typography, color discipline, and progressive disclosure — <https://vercel.com/geist>
- Apollo Research: separation of scientific work and organizational Blog communication — <https://www.apolloresearch.ai/science> and <https://www.apolloresearch.ai/blog>
- METR: research records paired with detailed research-update articles and primary-source links — <https://metr.org/research/> and <https://metr.org/blog/>

Whitzard and NUWA retain their own bilingual terminology, Chinese visual character, and evidence-led editorial voice.
