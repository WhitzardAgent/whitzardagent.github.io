# Whitzard Website V2 release report

Release candidate date: 2026-08-02  
Repository baseline: `d7f98f5`  
Delivery architecture: Astro static output, React Islands, Tailwind CSS, MDX/Content Collections, GitHub Pages

## Release outcome

The site has been rebuilt as a bilingual corporate and product website for Whitzard. The information architecture now presents Whitzard as the company and AI Agent Security Infrastructure brand, AgentGuard as the enterprise runtime-security platform, NVWA Lab as the research engine behind Whitzard, and WhitzardAgent as the open evidence ecosystem.

The release candidate is buildable, locally previewable, compatible with the existing GitHub Pages workflow, and preserves the JSONL ingest pipeline and externally valuable legacy routes. No customer names, partner logos, deployment counts, performance claims, or research results were invented.

## Brand and product implementation

- Core proposition: “Secure autonomy, by design.” / “守其边界，行其智能”.
- Visual system: moon-white space, xuan-indigo structure, jade research accents, cinnabar state changes, restrained borders and editorial rhythm.
- Homepage: semantic Agent Runtime Trace (`Intent → Reasoning → Tool → Data → Action`), AgentGuard decisions, autonomy statement, risk framing, four-layer platform, three-chain narrative, research-to-deployment loop, enterprise deployment, selected open evidence, and demo CTA.
- AgentGuard: before/after LLM and tool controls, thought/behavior/data chains, DSL and model collaboration, framework and MCP integration, identity, sandbox, red-team/evaluation, private deployment, and evidence links.
- NVWA and Research: “The research engine behind Whitzard”, paper-toned visual language, 18 ingested research records retained, and `ResearchOrganization` schema.
- Open Ecosystem: 21 ingested visible records organized into Runtime Security, Safety Models, Evaluation, Agent Infrastructure, and Cybersecurity.
- Commercial paths: outcome-oriented Solutions, brand-architecture Company page, and a direct Book a Demo path using the existing verified `contact@whitzard.tech` address.

## Route map

English remains unprefixed. Chinese core pages use `/zh/*` and the language switch preserves page meaning when a localized peer exists.

| Previous / public route | Release route and treatment |
|---|---|
| `/` | Rebuilt company homepage; Chinese peer `/zh/` |
| `/agentguard` | Rebuilt enterprise product page; Chinese peer `/zh/agentguard` |
| `/nuwa` | Repositioned NVWA Lab page; Chinese peer `/zh/nuwa` |
| `/research` | Rebuilt data-driven research index; Chinese peer `/zh/research` |
| `/open-ecosystem` | Rebuilt categorized ecosystem; Chinese peer `/zh/open-ecosystem` |
| `/about` | Rebuilt company page; Chinese peer `/zh/about` |
| `/contact` | Rebuilt demo/contact conversion page; Chinese peer `/zh/contact` |
| `/solutions` | New enterprise solutions page; Chinese peer `/zh/solutions` |
| `/blog` | Preserved English route and existing content behavior |
| `/news` | Preserved English index and existing data |
| `/news/nuwa-lab-launch` | Preserved and moved into the unified article system |
| `/rss.xml` | Preserved and validated |
| `/open-source` | Permanent `301` compatibility redirect to `/open-ecosystem` |
| `/publications` | Permanent `301` compatibility redirect to `/research` |
| `/NVWA-Project/` | Permanent `301` compatibility redirect to `/nuwa` |
| unknown route | Dedicated branded `/404.html` recovery page |

## SEO and structured data

- Canonical URL is generated from the production origin and semantic route, not the local request host.
- `hreflang="en"`, `hreflang="zh-CN"`, and `x-default` are emitted only when valid; unlocalized content does not advertise a nonexistent Chinese peer.
- OG locale, alternate locale, image alt, Twitter card, title, and description are present.
- JSON-LD includes `Organization` globally, `BreadcrumbList` for interior pages, `SoftwareApplication` for AgentGuard, and `ResearchOrganization` for NVWA.
- `robots.txt`, sitemap index, sitemap, and RSS are present. Both sitemap XML files and RSS pass `xmllint` parsing.
- Sitemap output contains 22 public URLs, including 8 Chinese core routes.

## Accessibility and interaction

- Skip link, semantic landmarks, visible focus treatment, current-page state, and keyboard-operable navigation are implemented.
- The mobile menu exposes `aria-expanded`/`aria-controls`, moves focus into the menu, closes on Escape, restores focus, and cleans up listeners.
- Accessible names contain their visible wordmark/language-switch text.
- Text-specific cinnabar, jade, muted, and subtle tokens meet AA contrast without changing the display/fill brand colors.
- `prefers-reduced-motion` disables smooth scrolling and collapses animation durations; Framer Motion uses reduced-motion state, GSAP scenes use media queries/context cleanup, and mobile presentations become static sequences.
- Lenis only loads for desktop fine-pointer environments without reduced-motion and is destroyed on Astro page swaps.

## Performance and bundle results

Baseline `dist` size was 7.6 MB. The release output is 3.4 MB, a reduction of approximately 55%, primarily from resizing the oversized logo, favicon, and OG PNG assets. External Google Font requests were removed from the render path in favor of high-quality system Chinese/Latin stacks.

Final local Lighthouse runs against the production build:

| Profile | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Desktop, English home | 85 | 100 | 100 | 100 | 1.4 s | 2.0 s | 0 ms | 0 |
| Mobile, Chinese home | 99 | 100 | 100 | 100 | 1.2 s | 2.1 s | 0 ms | 0 |

The desktop score is influenced by Lighthouse's throttled first-load cost for the explicitly required React/Framer Motion hero. Non-critical GSAP narratives use `client:visible`; no 3D, particle, Lottie, or other large decorative runtime was introduced.

## Engineering validation

| Check | Result |
|---|---|
| Clean dependency install | Passed: `npm ci` completed from the committed lockfile |
| JSONL ingest | Passed: 18 research and 21 visible open-source records generated |
| `npm run check` | Passed: 0 errors; 30 non-blocking hints, mainly Astro 6 compatibility deprecations in the existing content schema |
| `npm run build` | Passed: 23 static pages generated |
| `npm run check:links` | Passed: 23 HTML files, no broken internal links |
| Sitemap and RSS XML parsing | Passed |
| Legacy redirect output | Passed: permanent static redirect pages generated |
| Browser console | Passed on tested home routes; no console errors |
| Horizontal overflow | None on tested desktop and mobile profiles |
| Hydrated islands | Home uses one load-time semantic hero and two visibility-triggered narratives |
| Lint | No lint command exists in the repository; no result is claimed |
| Unit/e2e tests | No test command or test runner exists in the repository; no result is claimed |
| GitHub Pages workflow | Preserved: Node 22 → `npm ci` → `npm run build` → Pages artifact/deploy |

The four empty MDX collection directories are intentionally retained with `.gitkeep`. Astro reports informational “no files found” loader messages until editorial content is added; these do not affect the build.

## Added dependencies

| Dependency | Reason and boundary |
|---|---|
| `gsap` | Only the three-chain and research/product-loop scroll narratives; context and listener cleanup included |
| `lenis` | Optional desktop fine-pointer smooth scrolling; disabled for mobile and reduced motion |
| `clsx` | Typed conditional class composition utility |
| `tailwind-merge` | Safe merging for reusable class-based UI primitives |
| `@astrojs/check` (dev) | Formal Astro/TypeScript diagnostics |
| `typescript` (dev) | Explicit project typechecking toolchain |

Framer Motion remains the hero and micro-interaction library. No prohibited large visual dependency was added.

## Complete implementation file inventory

The baseline comparison contains 94 file entries. In addition to the implementation files below, the complete V2 source-of-truth package is now versioned at `docs/website-v2/`: `README.md`, `00-repository-audit.md`, `01-brand-strategy.md`, `02-design-system.md`, `03-information-architecture-i18n.md`, `04-homepage-blueprint.md`, `05-agentguard-page.md`, `06-nvwa-and-ecosystem.md`, `07-motion-system.md`, `08-component-and-code-plan.md`, `09-bilingual-copydeck.md`, `10-migration-plan.md`, `11-performance-accessibility-seo.md`, `12-acceptance-checklist.md`, `CODEX_MASTER_PROMPT.md`, `CODEX_PHASE_PROMPTS.md`, `COPY_TO_REPO.md`, `design-tokens.json`, `implementation-map.json`, and `package-recommendations.md`.

### Governance, configuration, and validation

- `AGENTS.md`
- `astro.config.mjs`
- `package.json`
- `package-lock.json`
- `tailwind.config.mjs`
- `public/robots.txt`
- `scripts/check-links.mjs`
- `docs/website-v2/generated/current-site-audit.md`
- `docs/website-v2/generated/release-report.md`

### Layout, locale, metadata, and shared chrome

- `src/layouts/BaseLayout.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/LanguageSwitch.astro`
- `src/components/motion/SmoothScroll.astro`
- `src/i18n/config.ts`
- `src/i18n/routes.ts`
- `src/i18n/ui.ts`

### Localized product/content data

- `src/i18n/pages/home.ts`
- `src/i18n/pages/agentguard.ts`
- `src/i18n/pages/research.ts`
- `src/i18n/pages/company.ts`
- `src/content/posts/.gitkeep`
- `src/content/briefs/.gitkeep`
- `src/content/notes/.gitkeep`
- `src/content/reports/.gitkeep`

### Home and product components

- `src/components/home/HomePage.astro`
- `src/components/home/HomeHero.tsx`
- `src/components/home/ThreeChainScrolly.tsx`
- `src/components/home/ResearchProductLoop.tsx`
- `src/components/agentguard/AgentGuardPage.astro`
- `src/components/agentguard/AgentRuntimeDemo.tsx`
- `src/components/agentguard/DeploymentArchitecture.tsx`

### Research, ecosystem, and commercial components

- `src/components/research/NvwaPage.astro`
- `src/components/research/ResearchIndex.astro`
- `src/components/ecosystem/EcosystemPage.astro`
- `src/components/enterprise/SolutionsPage.astro`
- `src/components/enterprise/CompanyPage.astro`
- `src/components/enterprise/ContactPage.astro`

### Pages and compatibility routes

- `src/pages/index.astro`
- `src/pages/agentguard.astro`
- `src/pages/nuwa.astro`
- `src/pages/research.astro`
- `src/pages/open-ecosystem.astro`
- `src/pages/solutions.astro`
- `src/pages/about.astro`
- `src/pages/contact.astro`
- `src/pages/news/[slug].astro`
- `src/pages/open-source.astro`
- `src/pages/publications.astro`
- `src/pages/NVWA-Project/index.astro`
- `src/pages/404.astro`
- `src/pages/zh/index.astro`
- `src/pages/zh/agentguard.astro`
- `src/pages/zh/nuwa.astro`
- `src/pages/zh/research.astro`
- `src/pages/zh/open-ecosystem.astro`
- `src/pages/zh/solutions.astro`
- `src/pages/zh/about.astro`
- `src/pages/zh/contact.astro`

### Visual system and optimized assets

- `src/styles/global.css`
- `src/styles/motion.css`
- `src/styles/home.css`
- `src/styles/agentguard.css`
- `src/styles/research.css`
- `src/styles/ecosystem.css`
- `src/styles/company.css`
- `src/styles/content.css`
- `src/components/WhitzardHero.tsx` (legacy type compatibility only; no longer composed)
- `src/components/NuwaHero.tsx` (legacy type compatibility only; no longer composed)
- `public/favicon.png`
- `public/assets/logo/whitzard_logo.png`
- `public/assets/logo/nvwa_logo.png`
- `public/assets/og/whitzard-og.png`
- `public/assets/og/nuwa-og.png`

## Real content still requiring human ownership

The release intentionally does not invent the following:

1. Approved legal entity name, registered address, privacy policy, terms, and jurisdiction-specific compliance copy.
2. A sales/CRM form provider, routing rules, consent text, and retention policy if the mailto conversion path is later replaced.
3. Approved customer names, logos, testimonials, deployment counts, measured product latency, and benchmark claims.
4. Final legal approval of all bilingual commercial copy and an editorial owner for Chinese updates to news/blog content.
5. Final vector master logo/wordmark and formally art-directed social-card exports, if assets beyond the optimized existing PNG sources are desired.

These items are content/operations dependencies, not build blockers. The current website is deployable without them using the verified email path and evidence already present in the repository.
