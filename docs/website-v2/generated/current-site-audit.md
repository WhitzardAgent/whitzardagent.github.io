# Whitzard current-site audit

Audit date: 2026-08-02  
Repository baseline: `d7f98f5`  
Scope: pre-V2 implementation state

## Executive finding

The repository already has the right delivery architecture for a high-quality corporate site: Astro static generation, React islands, data-driven research/open-source content, and GitHub Pages deployment. The redesign should be an in-place product and design-system refactor. The largest gaps are company/product positioning, bilingual routing, runtime-security product semantics, metadata completeness, navigation accessibility, visual rhythm, and asset weight—not the framework.

## Stack and dependency baseline

| Package | Installed |
|---|---:|
| Astro | 6.4.2 |
| React / React DOM | 19.2.7 |
| `@astrojs/react` | 5.0.7 |
| `@astrojs/mdx` | 6.0.1 |
| Tailwind CSS | 3.4.19 |
| Framer Motion | 12.40.0 |
| `@astrojs/sitemap` | 3.7.3 |
| `@astrojs/rss` | 4.0.18 |
| Autoprefixer | 10.5.0 |

Configuration: TypeScript extends Astro strict mode; output is static; site origin is `https://www.whitzard.tech`; GitHub Actions uses Node 22, `npm ci`, `npm run build`, Pages artifact upload, and deploy-pages. There is no `.openai/hosting.json`; GitHub Pages remains authoritative.

## Baseline commands

- `npm ci`: passed, 433 packages installed.
- `npm run build`: passed; 13 pages generated in 1.58s; `dist` was 7.6 MB.
- `npm run ingest:info`: passed; generated 18 research records and 21 visible open-source records.
- Lint: no script configured.
- Typecheck: no script or `@astrojs/check` dependency configured.
- Tests: no script or test runner configured.
- Build warnings: content loader base directories for `posts`, `briefs`, `notes`, and `reports` did not exist.

Largest baseline assets were two OG PNGs at roughly 2.1 MB each, two logo PNGs at roughly 0.9–1.0 MB each, the shared React client chunk at roughly 184 KB uncompressed, and Framer Motion's reduced-motion/shared chunk at roughly 124 KB uncompressed.

## Routes and compatibility

| Existing route | Baseline behavior | V2 treatment |
|---|---|---|
| `/` | research-led Whitzard home | replace with company/product-first V2 |
| `/agentguard` | generic Policy/Trace/Approval/Audit page | replace with runtime security product story |
| `/nuwa` | Nuwa lab landing | reposition as the research engine behind Whitzard |
| `/research` | generated research index | retain data and restyle; add Chinese peer |
| `/open-ecosystem` | manually categorized generated assets | retain source data, normalize categories, add Chinese peer |
| `/open-source` | redirect to `/open-ecosystem` | preserve |
| `/publications` | redirect to `/research` | preserve |
| `/NVWA-Project/` | timed moved page | preserve legacy value and redirect semantics |
| `/about` | company/lab/team page | replace with clearer company story; add Chinese peer |
| `/contact` | collaboration email page | replace with product demo conversion path; add Chinese peer |
| `/blog` | external articles / empty updates | preserve and restyle |
| `/news` | three-item index | preserve and restyle |
| `/news/[slug]` | one generated internal detail route | preserve and unify article shell |
| `/rss.xml` | research feed | preserve and validate |

New core routes required by V2: `/solutions`, `/zh/`, `/zh/agentguard`, `/zh/solutions`, `/zh/nuwa`, `/zh/research`, `/zh/open-ecosystem`, `/zh/about`, and `/zh/contact`. Legacy English URLs remain unprefixed.

## Components and reusable assets

### Existing dependency shape

`BaseLayout` owns global CSS, metadata, `Header`, and `Footer`. Pages compose Astro cards plus selective React hero islands. `WhitzardHero` uses Framer Motion, `useScroll`, `useTransform`, and `HeroBackdropWhitzard`; that backdrop uses `SignalNodes`. `NuwaHero` uses `HeroBackdropNuwa`, `AnimatedStoneSequence`, and `FloatingResearchCards`. Research and ecosystem pages consume generated data through `UnifiedResearchCard`, `ResearchAreaCard`, and `ProjectCard`.

### Reuse decisions

| File or asset | Decision |
|---|---|
| `BaseLayout.astro` | rewrite for locale, canonical alternates, OG locale, JSON-LD, skip link, transition router |
| `Header.astro` / `Footer.astro` | rewrite as bilingual company/product navigation with accessible mobile behavior |
| `WhitzardHero.tsx` / `HeroBackdropWhitzard.tsx` | retire from active composition after runtime-trace replacement; retain until migration is stable |
| `NuwaHero.tsx` and Nuwa motion primitives | simplify and localize; preserve the slower jade/paper research idiom |
| `SignalNodes.tsx` | useful conceptual primitive, but replace abstract field in the hero with semantic runtime nodes |
| Astro cards and callouts | restyle against semantic tokens and reuse where content remains data-driven |
| five-stone and arc visuals | limit to secondary research/brand punctuation; do not use as the corporate product hero |
| PNG wordmarks / OG images | keep source assets; optimize loading and replace OG assets only if trustworthy branded exports are available |

## Content sources and integrity

- Research source of record: `public/assets/info/ai_safety_research_assets_metadata.jsonl` → `scripts/ingest-info-jsonl.mjs` → `src/data/generated/researchAssets.ts` (18 records).
- Open ecosystem source of record: `public/assets/info/whitzardagent_open_assets_metadata.jsonl` → the same ingest script → `src/data/generated/openSourceAssets.ts` (21 visible records from 36 input lines).
- News: `src/data/news.ts`; one internal detail item and external links.
- Older/manual research and project arrays: `src/data/researchPapers.ts` and `src/data/projects.ts`; do not use their placeholder or “to be verified” values as corporate evidence.
- Team: `src/data/team.ts`.
- Official channels and the only current business email: `src/data/links.ts` (`contact@whitzard.tech`).
- MDX/content collections: schemas exist for posts, briefs, notes, and reports, but the directories were absent at baseline.

No customer, partner, deployment, benchmark, performance, or framework-count claim is sufficiently centralized for promotional use. V2 evidence must link to actual repositories, models, papers, and generated records, without turning derived counts into unsupported performance claims.

## SEO, i18n, performance, and accessibility baseline

### SEO

Strengths: descriptive titles, descriptions, OG/Twitter fields, sitemap integration, RSS, and configured site origin. Gaps: canonical used the request URL directly; no language alternates; no OG locale/alt; no structured data; no breadcrumbs; no localized metadata; no dedicated 404; aliases were not uniformly represented as permanent static redirect pages; the RSS fallback date could become build-time current date.

### i18n

`html[lang]` and all navigation/copy were fixed to English. There was no locale routing, route mapping, language persistence, or Chinese content architecture. Long copy was embedded in `.astro` and `.tsx` files.

### Performance

Astro islands were used appropriately for the two heroes, but the homepage loaded Framer Motion at `client:load`, large PNG logos were used at tiny rendered sizes, Google Fonts were render-path dependencies, and both OG files were heavy. Non-critical islands did not yet exist, so `client:visible` policy was not established. Visual loops ran continuously except under reduced-motion.

### Accessibility

Strengths: many decorative SVGs were hidden and a global focus style/reduced-motion reset existed. Gaps: no skip link; mobile menu lacked `aria-expanded`, `aria-controls`, Escape handling, focus management, outside-click behavior, and route-transition listener cleanup; the menu script could duplicate listeners after client navigation; the navigation button label did not communicate state; page hierarchy and landmark labeling were inconsistent; some low-contrast small text and jade-on-pale combinations required review; the hero visual remained hidden on mobile rather than providing a semantic static equivalent.

## File-by-file implementation map

### Configuration and engineering

- `package.json` / lockfile: add only the motion/class utilities actually used; add an explicit check command if installing Astro check.
- `astro.config.mjs`: configure locale routing while keeping default English unprefixed and static output.
- `tailwind.config.mjs`: expose V2 semantic color aliases, spacing, radius, type, and motion values.
- `.github/workflows/deploy.yml`: preserve Pages flow; verify Node 22 clean install/build.
- `scripts/ingest-info-jsonl.mjs`: preserve behavior; only fix clear parser defects without changing schema.
- `src/content.config.ts`: preserve schemas; create empty collection directories to eliminate warnings.

### Layout, system, and shared components

- `src/layouts/BaseLayout.astro`: full locale/SEO/accessibility rewrite.
- `src/components/Header.astro`, `Footer.astro`: full product-first bilingual rewrite.
- `src/styles/global.css`, `motion.css`: replace token layer and component primitives while retaining aliases needed by unmigrated pages.
- Existing Astro content cards: migrate visually, retaining typed props and external-link behavior.
- Existing hero/backdrop TSX files: supersede with copy-driven V2 islands; remove only after all routes build.

### Pages

- `index.astro`: reduce to homepage composition and localized copy selection.
- `agentguard.astro`: reduce to product-page composition and verified evidence links.
- `nuwa.astro`, `research.astro`, `open-ecosystem.astro`: keep generated datasets, rewrite framing and localized counterparts.
- `about.astro`, `contact.astro`: rewrite as enterprise company and conversion pages; team and official email remain sourced.
- `solutions.astro`: add outcome-oriented enterprise scenarios, not a feature duplicate.
- `blog.astro`, `news.astro`, `news/[slug].astro`: preserve URLs and data while unifying layout/metadata.
- `open-source.astro`, `publications.astro`, `NVWA-Project/index.astro`: preserve compatibility and strengthen redirect handling.
- `rss.xml.ts`: preserve, validate dates/links.
- `404.astro`: add localized recovery navigation.

## Phase plan and acceptance gates

1. Foundation: rules, tokens, locale helpers, route mapping, layout, navigation, footer, metadata, transition, reduced motion; build and commit.
2. Homepage: copy-driven runtime trace, risk narrative, platform stack, three chains, research loop, enterprise and ecosystem proof, CTA; desktop/mobile/reduced-motion build and commit.
3. AgentGuard: full runtime control story, event/decision surface, three chains, four layers, deployment architecture, verified repository/model/research links, CTA; build and commit.
4. Research and ecosystem: bilingual Nuwa/research/ecosystem, retained generated data, normalized five-part ecosystem, unified content visuals; build and commit.
5. Enterprise pages: bilingual Solutions, Company, Contact; preserve official team/email facts; build and commit.
6. Release quality: complete route/localization coverage, 404, structured data, sitemap/RSS/redirect/link checks, responsive/keyboard/reduced-motion/browser QA, bundle and Lighthouse reporting; build and commit.

The release report must explicitly distinguish automated results from manual follow-up and list the real commercial content still required (form provider, sales routing/CRM, customer proof, deployment metrics, and final approved brand assets).
