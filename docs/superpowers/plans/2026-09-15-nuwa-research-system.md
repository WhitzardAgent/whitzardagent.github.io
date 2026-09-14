# NUWA Research System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved bilingual NUWA research experience, including the three-theme research landing, verified evidence visuals, paired arXiv–Research Blog publishing, Markdown authoring commands, terminology enforcement, feeds, SEO, and human-review deployment gate.

**Architecture:** Keep Astro 7 static output as the rendering boundary. Research facts continue to come from the existing JSONL ingestion pipeline; a dedicated Astro content collection stores only human-authored bilingual Research Blog Markdown. Pure relationship helpers join Blog entries to generated research assets, while the existing React island remains limited to archive filtering.

**Tech Stack:** Astro 7, TypeScript, Astro content collections, MD/MDX, React 19 island for archive filters, CSS design tokens, Node 22 scripts and `node:test`, `yaml` for safe frontmatter handling, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-15-nuwa-research-system-design.md`

## Global Constraints

- Read the approved spec and every file in `docs/website-v2/` before implementation.
- Preserve Astro static output, React islands, Tailwind, MDX/content collections, JSONL ingestion, GitHub Pages deployment, and valuable legacy routes.
- Chinese is unprefixed; English uses `/en/*`; existing `/zh/*` static redirect stubs remain intact.
- Keep the canonical names `白泽 / Whitzard` and `女娲 / NUWA`; the full English lab name is `NUWA Frontier AI Safety Lab`.
- Keep the exact research mission `为全球 AI 治理提供风险证据与公共产品 / Shared Risk Evidence and Public Goods for the World`.
- Keep exactly three homepage research themes; the existing six categories remain archive filters.
- Research Blog content is human-written and human-edited; scripts may generate structure and validate content but must never rewrite prose.
- Public Research Blog entries require Chinese and English editions and a Pull Request review before merge.
- Do not invent customers, partners, deployments, benchmarks, performance figures, research claims, or historical translations.
- Source paper metadata from `public/assets/info/ai_safety_research_assets_metadata.jsonl` through `npm run ingest:info`.
- Preserve WCAG AA contrast, responsive behavior, semantic HTML, keyboard access, and `prefers-reduced-motion` support.
- Avoid new client JavaScript and large dependencies; Blog index and article pages render fully at build time.
- The repository is currently dirty. Never reset, discard, or broadly stage existing changes. At every commit, stage only the exact files listed by that task and review `git diff --cached` first.
- Because required research files already have uncommitted edits, execute in the current checkout unless those edits are first committed by their owner. Do not create a clean worktree from `HEAD` and silently omit them.
- After every task, run its focused checks. Before completion run `npm run ingest:info`, `npm test`, `npm run check`, `npm run build`, `npm run check:content`, and `npm run check:links` in that order.

## File Structure

### New source files

- `src/data/terminology.ts` — canonical bilingual terms and deprecated variants.
- `src/data/researchPrograms.ts` — the three approved research themes and their mapping to archive categories.
- `src/i18n/pages/researchBlog.ts` — native Chinese and English Blog interface copy.
- `src/content/researchBlogSchema.ts` — dedicated frontmatter schema shared by Astro and tests.
- `src/content/research-blog/.gitkeep` — keeps the empty content root until the first human article is approved.
- `src/lib/researchBlog.ts` — pure locale, pairing, research lookup, and route helpers.
- `src/components/research/ResearchMission.astro` — mission and three-theme module.
- `src/components/research/ResearchBlogPreview.astro` — latest/featured Blog entries on the research landing.
- `src/components/research/ResearchBlogIndex.astro` — build-time Blog index.
- `src/components/research/ResearchBlogArticle.astro` — article shell and structured metadata.
- `src/components/research/CompanionPaper.astro` — paper title, arXiv/PDF/resources, and citation connection.
- `src/components/research/ResearchFigure.astro` — provenance-bearing research figure.
- `src/pages/nuwa/blog/index.astro` and `src/pages/en/nuwa/blog/index.astro` — localized Blog indexes.
- `src/pages/nuwa/blog/[slug].astro` and `src/pages/en/nuwa/blog/[slug].astro` — localized static article routes.
- `src/pages/nuwa/blog/rss.xml.ts` and `src/pages/en/nuwa/blog/rss.xml.ts` — localized Blog feeds.
- `src/styles/research-blog.css` — Blog index and long-form reading styles.
- `scripts/lib/load-terminology.mjs` — bundles and loads the TypeScript term source for Node scripts.
- `scripts/lib/research-blog.mjs` — shared Markdown/frontmatter and research-record utilities.
- `scripts/check-terminology.mjs` — source/content terminology validation.
- `scripts/new-research-blog.mjs` — safe paired-template generator.
- `scripts/check-research-blog.mjs` — paired-entry publication validator.
- `scripts/terminology.test.mjs`, `scripts/research-blog.test.mjs`, and `scripts/research-contract.test.mjs` — focused Node tests.
- `templates/research-blog/zh.md` and `templates/research-blog/en.md` — human-authoring templates.
- `docs/website-v2/13-bilingual-terminology.md` — editorial terminology guide.
- `docs/website-v2/14-research-blog-publishing.md` — author/editor runbook.

### Existing files to modify

- `package.json` and `package-lock.json` — test, terminology, Blog creation, and Blog check commands; direct `yaml` dev dependency.
- `src/content.config.ts` — dedicated `researchBlog` collection.
- `src/data/generated/researchAssets.ts` — regenerated only through ingestion; never edited manually.
- `src/i18n/pages/nuwa.ts` and `src/i18n/pages/research.ts` — approved mission and native copy.
- `src/i18n/ui.ts` — four-item navigation and Research Blog footer entry.
- `src/i18n/routes.ts` — Blog index/detail locale-peer recognition.
- `src/layouts/BaseLayout.astro` — article Open Graph type, dates, authors, feed discovery, and exact NUWA brand name.
- `src/components/Header.astro` — active states for the four approved navigation groups.
- `src/components/Footer.astro` — Research Blog link and approved product/ecosystem labels.
- `src/components/research/NuwaOverview.astro` — approved lab mission and three-theme overview.
- `src/components/research/ResearchIndex.astro` — approved research landing narrative.
- `src/components/research/ResearchExplorer.tsx` — optional Blog action on paired publication records.
- `src/styles/research.css` and `src/styles/nuwa-overview.css` — approved sans-serif, grid, ring, evidence, and responsive treatment.
- `src/pages/blog.astro` and `src/pages/en/blog.astro` — permanent compatibility redirects after Blog indexes exist.
- `src/pages/rss.xml.ts` — retain the publication feed with corrected canonical research links and naming.
- `astro.config.mjs` — sitemap rules for Blog routes and redirect-only aliases.
- `scripts/check-content.mjs` — approved mission, route, research-order, evidence, and deprecated-copy checks.
- `.github/workflows/deploy.yml` — PR/push validation before GitHub Pages deployment.

---

## Phase 1 — Canonical language and data contracts

### Task 1: Add the bilingual terminology source and validator

**Files:**
- Create: `src/data/terminology.ts`
- Create: `docs/website-v2/13-bilingual-terminology.md`
- Create: `scripts/lib/load-terminology.mjs`
- Create: `scripts/check-terminology.mjs`
- Create: `scripts/terminology.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `TerminologyEntry`, `terminology`, and `lockedBrandCopy` from `src/data/terminology.ts`.
- Produces: `findTerminologyViolations(files, entries)` returning `Array<{ file: string; termId: string; match: string }>`.
- Consumed by: Blog validation, site content validation, and copy normalization tasks.

- [ ] **Step 1: Add the failing terminology unit test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { findTerminologyViolations } from "./check-terminology.mjs";

test("flags deprecated NUWA variants without rejecting canonical branding", () => {
  const entries = [{ id: "nuwa", status: "locked", zh: "女娲", en: "NUWA", deprecated: ["NVWA", "Nvwa"] }];
  const violations = findTerminologyViolations([
    { file: "bad.md", text: "NVWA studies frontier risk." },
    { file: "good.md", text: "女娲 · NUWA" },
  ], entries);
  assert.deepEqual(violations.map((item) => item.match), ["NVWA"]);
});

test("does not scan legacy redirect paths as visitor-facing prose", () => {
  const entries = [{ id: "nuwa", status: "locked", zh: "女娲", en: "NUWA", deprecated: ["NVWA"] }];
  assert.equal(findTerminologyViolations([{ file: "src/pages/NVWA-Project/index.astro", text: "redirect" }], entries).length, 0);
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `node --test scripts/terminology.test.mjs`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `check-terminology.mjs`.

- [ ] **Step 3: Add the canonical term types and initial locked/preferred entries**

```ts
export type TerminologyStatus = "locked" | "preferred" | "allowed" | "deprecated";

export type TerminologyEntry = {
  id: string;
  zh: string;
  en: string;
  status: TerminologyStatus;
  definition: string;
  useWhen: string;
  avoid?: string[];
  deprecated?: string[];
  notes?: string;
  sources?: string[];
};

export const lockedBrandCopy = {
  company: { zh: "白泽", en: "Whitzard" },
  lab: { zh: "女娲", en: "NUWA" },
  labFull: { zh: "女娲实验室", en: "NUWA Frontier AI Safety Lab" },
  productMission: { zh: "打造智能体时代的安全基础设施", en: "Build security infrastructure for the agentic AI era" },
  researchMandate: { zh: "前沿 AI 风险研究与治理", en: "Frontier AI risk research and governance" },
  researchMission: { zh: "为全球 AI 治理提供风险证据与公共产品", en: "Shared Risk Evidence and Public Goods for the World" },
} as const;

export const terminology: TerminologyEntry[] = [
  { id: "whitzard", zh: "白泽", en: "Whitzard", status: "locked", definition: "公司品牌。", useWhen: "所有公司品牌位置。", deprecated: ["WhitzardAgent 公司"] },
  { id: "nuwa", zh: "女娲", en: "NUWA", status: "locked", definition: "研究实验室品牌。", useWhen: "简称或品牌组合。", deprecated: ["NVWA", "Nvwa", "Nuwa Lab", "NUWA Lab"] },
  { id: "nuwa-full", zh: "女娲实验室", en: "NUWA Frontier AI Safety Lab", status: "locked", definition: "实验室正式全称。", useWhen: "首次出现、SEO 与结构化数据。", deprecated: ["Nuwa Frontier AI Safety Lab"] },
  { id: "research-blog", zh: "Research Blog", en: "Research Blog", status: "locked", definition: "女娲实验室的研究解读栏目。", useWhen: "栏目标题和页面导航。", deprecated: ["女娲简报", "NUWA Brief"] },
  { id: "evaluation", zh: "评测", en: "evaluation", status: "preferred", definition: "以任务、环境或协议测量系统能力与行为。", useWhen: "技术测试与实验结果。", avoid: ["评估"] },
  { id: "assessment", zh: "评估", en: "assessment", status: "preferred", definition: "综合证据形成风险或准备度判断。", useWhen: "风险、治理与准备度结论。", avoid: ["评测"] },
  { id: "reasoning-trace", zh: "推理轨迹", en: "reasoning trace", status: "preferred", definition: "可观察的模型推理记录。", useWhen: "研究或产品技术说明。", deprecated: ["thought chain"] },
  { id: "action-impact", zh: "行动影响", en: "action impact", status: "preferred", definition: "智能体行动对外部系统和业务造成的影响。", useWhen: "运行时风险与处置。", deprecated: ["action effect"] },
];
```

Add the remaining entries with these exact canonical pairs: `智能体 / AI agent`, `前沿 AI 风险 / frontier AI risk`, `模型安全 / model safety`, `安全 / safety`, `安全防护 / security safeguards`, `可信 / trustworthy`, `治理 / governance`, `控制 / control`, `防护 / safeguards`, `处置 / response`, `隐蔽谋划 / scheming`, `推理轨迹 / reasoning trace`, `行动影响 / action impact`, `研究成果 / research output`, `研究基础设施 / research infrastructure`, and `公共产品 / public goods`. Definitions must encode the distinctions in section 10 of the spec. Add deprecated forms `算计`, `thought chain`, `action effect`, and `安全版跑分榜` to their corresponding canonical entries.

- [ ] **Step 4: Implement the loader and pure scanner**

`scripts/lib/load-terminology.mjs` uses the already-installed `esbuild` package to bundle `src/data/terminology.ts` in memory and import the result. `scripts/check-terminology.mjs` exports the pure function under test, skips redirect stubs and generated files, and scans `.astro`, `.ts`, `.tsx`, `.md`, and `.mdx` visitor-facing sources. Its CLI exits `1` with `file: deprecated "…"; use …` lines when violations exist.

```js
export function findTerminologyViolations(files, entries) {
  const deprecated = entries.flatMap((entry) => (entry.deprecated ?? []).map((match) => ({ entry, match })));
  return files
    .filter(({ file }) => !file.includes("/generated/") && !file.includes("/NVWA-Project/") && !file.includes("/public/zh/"))
    .flatMap(({ file, text }) => deprecated
      .filter(({ match }) => text.includes(match))
      .map(({ entry, match }) => ({ file, termId: entry.id, match })));
}
```

- [ ] **Step 5: Write the human editorial guide**

The guide repeats the locked brand table, defines evaluation versus assessment, safety versus security, trustworthy, governance, control, safeguards, and response, and includes paired good/bad Chinese and US-English examples. It explicitly records that `Research Blog` is not translated in the displayed product name.

- [ ] **Step 6: Add and run the command**

Add to `package.json`:

```json
"test": "node --test scripts/*.test.mjs",
"check:terminology": "node scripts/check-terminology.mjs"
```

Run: `node --test --test-name-pattern=terminology scripts/terminology.test.mjs`
Expected: PASS for both terminology tests.

- [ ] **Step 7: Commit only terminology files**

```bash
git add src/data/terminology.ts docs/website-v2/13-bilingual-terminology.md scripts/lib/load-terminology.mjs scripts/check-terminology.mjs scripts/terminology.test.mjs package.json
git diff --cached --check
git commit -m "feat: add bilingual terminology governance"
```

### Task 2: Normalize NUWA copy, research programs, and route contracts

**Files:**
- Create: `src/data/researchPrograms.ts`
- Create: `scripts/research-contract.test.mjs`
- Modify: `src/i18n/pages/nuwa.ts`
- Modify: `src/i18n/pages/research.ts`
- Modify: `src/i18n/routes.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `scripts/check-content.mjs`

**Interfaces:**
- Consumes: `lockedBrandCopy` and canonical terms from Task 1.
- Produces: `researchPrograms: ResearchProgram[]` with exactly three stable IDs.
- Produces: Blog-aware `hasLocalizedPeer()` for index and detail routes.
- Consumed by: NUWA overview, research landing, Blog filters, and article metadata.

- [ ] **Step 1: Add failing contract tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("research copy contains the locked bilingual mission", async () => {
  const source = await readFile("src/i18n/pages/research.ts", "utf8");
  assert.match(source, /为全球 AI 治理提供风险证据与公共产品/);
  assert.match(source, /Shared Risk Evidence and Public Goods for the World/);
});

test("research programs expose exactly the three approved IDs", async () => {
  const source = await readFile("src/data/researchPrograms.ts", "utf8");
  assert.deepEqual([...source.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]), [
    "frontier-ai-risk-control",
    "agent-model-safety",
    "risk-evaluation-governance",
  ]);
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `node --test scripts/research-contract.test.mjs`
Expected: FAIL because `researchPrograms.ts` does not exist and old copy does not contain the locked mission.

- [ ] **Step 3: Add the typed three-program model**

```ts
import type { ResearchCategory } from "./generated/researchAssets";

export type ResearchProgramId = "frontier-ai-risk-control" | "agent-model-safety" | "risk-evaluation-governance";
export type ResearchProgram = {
  id: ResearchProgramId;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  terms: { zh: string[]; en: string[] };
  archiveCategories: ResearchCategory[];
};

export const researchPrograms: ResearchProgram[] = [
  { id: "frontier-ai-risk-control", title: { zh: "前沿 AI 风险与控制", en: "Frontier AI Risk and Control" }, description: { zh: "研究能力更强、更具自主性的 AI 系统可能形成的风险，以及可验证的控制方法。", en: "Study risks from increasingly capable and autonomous AI systems and develop verifiable approaches to control." }, terms: { zh: ["自主性", "欺骗", "隐蔽谋划", "失控风险"], en: ["Autonomy", "Deception", "Scheming", "Loss of control"] }, archiveCategories: ["frontier-risk-control"] },
  { id: "agent-model-safety", title: { zh: "智能体与模型安全", en: "Agent and Model Safety" }, description: { zh: "研究推理、行动、工具使用、模型行为与人机信任中的系统性安全问题。", en: "Study systemic safety questions in reasoning, action, tool use, model behavior, and human–AI trust." }, terms: { zh: ["智能体行为", "模型安全", "工具调用", "可信交互"], en: ["Agent behavior", "Model safety", "Tool use", "Trustworthy interaction"] }, archiveCategories: ["agent-model-safety", "software-system-security", "trustworthy-ml"] },
  { id: "risk-evaluation-governance", title: { zh: "风险评测与治理方法", en: "Risk Evaluation and Governance Methods" }, description: { zh: "建设可执行、可复现的评测环境，研究如何将证据用于风险评估与治理决策。", en: "Build executable, reproducible evaluations and study how evidence should inform risk assessment and governance decisions." }, terms: { zh: ["能力评测", "风险评估", "评测环境", "治理方法"], en: ["Capability evaluation", "Risk assessment", "Evaluation environments", "Governance methods"] }, archiveCategories: ["cybersecurity-privacy", "ai-systems-methods"] },
];
```

- [ ] **Step 4: Replace legacy NUWA naming and mission copy**

Use `lockedBrandCopy` in both i18n modules and BaseLayout. Replace `NUWA Lab`, `NVWA`, `Nuwa Frontier AI Safety Lab`, “Research frontier risk. Build control.”, “安全版跑分榜”, and “算计” with their approved native equivalents. Use `honors`, not `honours`. Keep `女娲实验室由白泽发起并支持。` and avoid independence language.

- [ ] **Step 5: Extend locale-peer recognition**

Update `hasLocalizedPeer()` so both `/nuwa/blog` and any `/nuwa/blog/<slug>` have an English/Chinese peer. Add `/nuwa/blog` to `localizedRoutes`; add a prefix branch parallel to `/news/` for Blog detail pages.

- [ ] **Step 6: Update content checks and run focused validation**

Add locked mission markers and forbidden brand variants to `scripts/check-content.mjs`. Preserve current verified public-impact, recognition, infrastructure, and figure checks until their presentation is deliberately relocated in Task 8.

Run: `npm run ingest:info && node --test scripts/research-contract.test.mjs && npm run check:terminology`
Expected: ingestion succeeds, contract tests pass, and terminology check reports no current-source deprecated branding.

- [ ] **Step 7: Commit the contract changes**

```bash
git add src/data/researchPrograms.ts scripts/research-contract.test.mjs src/i18n/pages/nuwa.ts src/i18n/pages/research.ts src/i18n/routes.ts src/layouts/BaseLayout.astro scripts/check-content.mjs
git diff --cached --check
git commit -m "feat: define NUWA research language contract"
```

### Task 3: Add the dedicated Research Blog content schema and relationship helpers

**Files:**
- Create: `src/content/researchBlogSchema.ts`
- Create: `src/content/research-blog/.gitkeep`
- Create: `src/lib/researchBlog.ts`
- Create: `src/i18n/pages/researchBlog.ts`
- Create: `scripts/research-blog.test.mjs`
- Modify: `src/content.config.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: generated `ResearchAsset` and `Locale`.
- Produces: `researchBlogSchema`.
- Produces: `ResearchBlogEntryLike = { id: string; data: ResearchBlogData }` and `ResearchBlogPair = { slug: string; zh: ResearchBlogEntryLike; en: ResearchBlogEntryLike; researchAsset: ResearchAsset }`.
- Produces: `getBlogLocale(id: string): Locale`, `getBlogSlug(id: string): string`, `pairResearchBlogEntries(entries: ResearchBlogEntryLike[]): Map<string, ResearchBlogPair>`, `resolveResearchAsset(slug: string): ResearchAsset`, and `blogPath(slug: string, locale: Locale): string`.
- Consumed by: generator checks, Blog indexes, Blog detail routes, feeds, and publication cards.

- [ ] **Step 1: Install the one direct frontmatter dependency**

Run: `npm install --save-dev yaml@^2.8.1`
Expected: `package.json` and `package-lock.json` record `yaml`; no other direct dependency is added.

- [ ] **Step 2: Add failing pure-helper tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";

async function loadHelpers() {
  const result = await build({ entryPoints: ["src/lib/researchBlog.ts"], bundle: true, platform: "node", format: "esm", write: false });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
}

test("derives locale, stable slug, and localized paths", async () => {
  const { getBlogLocale, getBlogSlug, blogPath } = await loadHelpers();
  assert.equal(getBlogLocale("autocontrol-arena/zh.md"), "zh");
  assert.equal(getBlogSlug("autocontrol-arena/en.mdx"), "autocontrol-arena");
  assert.equal(blogPath("autocontrol-arena", "zh"), "/nuwa/blog/autocontrol-arena");
  assert.equal(blogPath("autocontrol-arena", "en"), "/en/nuwa/blog/autocontrol-arena");
});
```

- [ ] **Step 3: Run the helper test and verify failure**

Run: `node --test scripts/research-blog.test.mjs`
Expected: FAIL because `src/lib/researchBlog.ts` does not exist.

- [ ] **Step 4: Implement the dedicated schema**

```ts
import { z } from "astro/zod";

export const researchBlogSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  authors: z.array(z.string().min(1)).min(1),
  editors: z.array(z.string().min(1)).min(1),
  research_asset: z.string().min(1),
  featured: z.boolean().default(false),
  draft: z.boolean().default(true),
  social_image: z.string().optional(),
  revision_note: z.string().optional(),
});
```

Register it with `glob({ pattern: "**/{zh,en}.{md,mdx}", base: "./src/content/research-blog" })` under collection key `researchBlog`.

- [ ] **Step 5: Implement pure pairing and lookup helpers**

`pairResearchBlogEntries()` must reject duplicate locales, mismatched `research_asset`, missing peers for public entries, and duplicate featured entries. It returns `Map<string, { slug: string; zh: Entry; en: Entry; researchAsset: ResearchAsset }>` for public pairs and excludes pairs where both entries are drafts.

- [ ] **Step 6: Add native interface copy**

Create `researchBlogCopy` with typed `zh` and `en` objects for index title, explanation, category labels, article metadata, companion-paper actions, citation, revision history, language switch, related work, subscription, and empty state. The displayed title is `Research Blog` in both locales.

- [ ] **Step 7: Run tests and Astro schema validation**

Run: `node --test scripts/research-blog.test.mjs && npm run check`
Expected: helper tests pass; Astro reports no schema/type errors from the empty collection.

- [ ] **Step 8: Commit the schema boundary**

```bash
git add package.json package-lock.json src/content.config.ts src/content/researchBlogSchema.ts src/content/research-blog/.gitkeep src/lib/researchBlog.ts src/i18n/pages/researchBlog.ts scripts/research-blog.test.mjs
git diff --cached --check
git commit -m "feat: add paired research blog content model"
```

---

## Phase 2 — Human-first Markdown publishing

### Task 4: Build the safe paired Markdown template generator

**Files:**
- Create: `templates/research-blog/zh.md`
- Create: `templates/research-blog/en.md`
- Create: `scripts/lib/research-blog.mjs`
- Create: `scripts/new-research-blog.mjs`
- Modify: `scripts/research-blog.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: research JSONL fields `Title`, `ArXiv ID`, and generated research slug rules.
- Produces: `createResearchBlogPair({ root, slug, arxivId, date })`.
- Produces CLI: `npm run blog:new -- <slug> <arxiv-id>`.
- Consumed by: authors and Task 5 validation.

- [ ] **Step 1: Add failing generator tests using an isolated temporary root**

```js
test("creates paired draft templates and refuses overwrite", async () => {
  const root = await mkdtemp(join(tmpdir(), "nuwa-blog-"));
  await mkdir(join(root, "public/assets/info"), { recursive: true });
  await writeFile(join(root, "public/assets/info/ai_safety_research_assets_metadata.jsonl"), JSON.stringify({
    Title: "AutoControl Arena: Synthesizing Executable Test Environments for Frontier AI Risk Evaluation",
    "ArXiv ID": "2603.07427"
  }));
  const result = await createResearchBlogPair({ root, slug: "autocontrol-arena", arxivId: "2603.07427", date: "2026-09-15" });
  assert.deepEqual(result.created.map((file) => basename(file)), ["zh.md", "en.md"]);
  await assert.rejects(() => createResearchBlogPair({ root, slug: "autocontrol-arena", arxivId: "2603.07427", date: "2026-09-15" }), /already exists/);
});
```

- [ ] **Step 2: Run the generator test and verify failure**

Run: `node --test --test-name-pattern="creates paired" scripts/research-blog.test.mjs`
Expected: FAIL because `createResearchBlogPair` is not exported.

- [ ] **Step 3: Write the two complete editorial templates**

Both files contain valid frontmatter tokens and the approved article structure. Chinese headings are `为什么开展这项研究`, `我们如何研究`, `主要发现`, `证据边界与局限`, `对技术与治理的意义`, and `原文与相关资源`. English headings are `Why We Studied This`, `How We Conducted the Research`, `Key Findings`, `Limitations and Evidence Boundaries`, `Implications for Technology and Governance`, and `Paper and Resources`. Guidance appears in HTML comments so it does not render.

- [ ] **Step 4: Implement safe generation**

Validate `slug` with `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, validate arXiv with `/^\d{4}\.\d{4,5}(?:v\d+)?$/i`, require exactly one matching JSONL record, calculate `research_asset` with the same lowercase/non-alphanumeric/truncate-80 rule used by ingestion, and create files using exclusive mode `flag: "wx"`. If either target exists, create neither file.

- [ ] **Step 5: Add the package command and test real dry failure behavior**

```json
"blog:new": "node scripts/new-research-blog.mjs"
```

Run: `npm run blog:new -- Invalid_Slug 2603.07427`
Expected: exits `1` with `slug must use lowercase kebab-case`; no content directory is created.

- [ ] **Step 6: Run the complete generator tests**

Run: `node --test scripts/research-blog.test.mjs`
Expected: PASS for known arXiv lookup, paired creation, invalid slug, missing arXiv, and no-overwrite tests.

- [ ] **Step 7: Commit the authoring generator**

```bash
git add templates/research-blog/zh.md templates/research-blog/en.md scripts/lib/research-blog.mjs scripts/new-research-blog.mjs scripts/research-blog.test.mjs package.json
git diff --cached --check
git commit -m "feat: generate paired research blog drafts"
```

### Task 5: Add the publication checker and human editorial runbook

**Files:**
- Create: `scripts/check-research-blog.mjs`
- Create: `docs/website-v2/14-research-blog-publishing.md`
- Modify: `scripts/research-blog.test.mjs`
- Modify: `scripts/check-content.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `parseFrontmatter()`, research JSONL lookup, and terminology scanner.
- Produces: `validateResearchBlog(root, slug?)` returning `{ errors: string[]; checkedPairs: number }`.
- Produces CLI: `npm run blog:check -- [slug]` and `npm run blog:check` for all entries.
- Consumed by: local authors, CI, and final verification.

- [ ] **Step 1: Add failing validation tests**

Add a fixture writer and table-driven assertions for the exact failure classes:

```js
async function writeEdition(root, slug, locale, fields, body = "## 主要发现\n\n人工撰写的正文。") {
  const dir = join(root, "src/content/research-blog", slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${locale}.md`), `---\n${stringify(fields)}---\n\n${body}\n`);
}

test("validation rejects incomplete or inconsistent public pairs", async () => {
  const root = await createValidationRoot();
  const base = {
    title: "Native title",
    summary: "Native summary",
    date: "2026-09-15",
    authors: ["Author Name"],
    editors: ["Editor Name"],
    research_asset: "autocontrol-arena-synthesizing-executable-test-environments-for-frontier-ai-risk",
    featured: false,
    draft: false,
  };
  await writeEdition(root, "autocontrol-arena", "zh", base);
  let result = await validateResearchBlog(root, "autocontrol-arena");
  assert.match(result.errors.join("\n"), /missing en\.md/);

  await writeEdition(root, "autocontrol-arena", "en", { ...base, date: "2026-09-16" }, "## Key Findings\n\nHuman-written copy.");
  result = await validateResearchBlog(root, "autocontrol-arena");
  assert.match(result.errors.join("\n"), /date must match/);
});

test("validation rejects deprecated prose, missing images, and skipped headings", async () => {
  const root = await createValidationRoot();
  await writeValidPair(root, {
    zhBody: "## 主要发现\n\n![证据图](./assets/missing.webp)\n\n#### 对技术与治理的意义\n\nNUWA Lab",
  });
  const result = await validateResearchBlog(root, "autocontrol-arena");
  assert.match(result.errors.join("\n"), /missing\.webp/);
  assert.match(result.errors.join("\n"), /deprecated.*NUWA Lab/);
  assert.match(result.errors.join("\n"), /heading level skips from 2 to 4/);
});
```

Add separate assertions that mismatched `research_asset`, empty authors, a different arXiv resource ID, and one public/one draft edition are rejected. Add one bilingual draft pair and one bilingual public pair that return `errors: []`.

- [ ] **Step 2: Run the validation tests and verify failure**

Run: `node --test --test-name-pattern="validation" scripts/research-blog.test.mjs`
Expected: FAIL because `validateResearchBlog` is not implemented.

- [ ] **Step 3: Implement deterministic validation**

Use `yaml.parse()` only for frontmatter. Compare controlled facts across languages: `date`, `updated`, `authors`, `editors`, `research_asset`, `featured`, `draft`, and revision metadata. Permit different `title`, `summary`, paragraphs, and headings. A public edition (`draft: false`) requires its peer to be public in the same commit. Report errors; never modify Markdown.

- [ ] **Step 4: Add source, image, and structure checks**

Resolve relative Markdown images against the article directory, require non-empty alt text, reject remote hotlinked evidence figures unless they are source links rather than embedded media, validate the referenced research record and arXiv ID, and call the terminology scanner on prose with fenced code removed.

- [ ] **Step 5: Wire the commands**

```json
"blog:check": "node scripts/check-research-blog.mjs",
"check:content": "node scripts/check-content.mjs && node scripts/check-research-blog.mjs && node scripts/check-terminology.mjs"
```

- [ ] **Step 6: Write the human runbook**

Document the exact author flow: run `blog:new`; edit both files; add local images; run `npm run dev`; run `blog:check`; run full checks; open a Pull Request; request a research-fact review and a bilingual editorial review; merge only when both editions are approved. State explicitly that scripts do not draft, translate, or rewrite prose.

- [ ] **Step 7: Run and commit the publishing gate**

Run: `npm test && npm run blog:check && npm run check:terminology`
Expected: all tests pass; empty production Blog collection is valid with `checkedPairs: 0`.

```bash
git add scripts/check-research-blog.mjs scripts/research-blog.test.mjs scripts/check-content.mjs package.json docs/website-v2/14-research-blog-publishing.md
git diff --cached --check
git commit -m "feat: validate bilingual research blog releases"
```

---

## Phase 3 — Research Blog and evidence experience

### Task 6: Build the static Research Blog index and article pages

**Files:**
- Create: `src/components/research/ResearchBlogIndex.astro`
- Create: `src/components/research/ResearchBlogArticle.astro`
- Create: `src/components/research/CompanionPaper.astro`
- Create: `src/components/research/ResearchFigure.astro`
- Create: `src/pages/nuwa/blog/index.astro`
- Create: `src/pages/en/nuwa/blog/index.astro`
- Create: `src/pages/nuwa/blog/[slug].astro`
- Create: `src/pages/en/nuwa/blog/[slug].astro`
- Create: `src/styles/research-blog.css`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `scripts/research-contract.test.mjs`

**Interfaces:**
- Consumes: `getCollection("researchBlog")`, `pairResearchBlogEntries()`, `researchBlogCopy`, and generated research assets.
- Produces: static Blog indexes and one static route per public bilingual pair.
- Produces BaseLayout props: `contentType`, `publishedTime`, `modifiedTime`, `authors`, and `feedHref`.
- Consumed by: research landing preview, feeds, language switch, and SEO.

- [ ] **Step 1: Add failing source-contract assertions**

```js
test("Research Blog has paired static routes and companion-paper rendering", async () => {
  const paths = [
    "src/pages/nuwa/blog/index.astro",
    "src/pages/en/nuwa/blog/index.astro",
    "src/pages/nuwa/blog/[slug].astro",
    "src/pages/en/nuwa/blog/[slug].astro",
    "src/components/research/ResearchBlogArticle.astro",
  ];
  const [zhIndex, enIndex, zhDetail, enDetail, article] = await Promise.all(paths.map((path) => readFile(path, "utf8")));
  assert.match(zhIndex, /ResearchBlogIndex/);
  assert.match(enIndex, /ResearchBlogIndex/);
  assert.match(zhDetail, /getStaticPaths/);
  assert.match(enDetail, /getStaticPaths/);
  assert.match(zhDetail, /blogPath/);
  assert.match(enDetail, /blogPath/);
  assert.match(article, /CompanionPaper/);
});
```

- [ ] **Step 2: Run the contract test and verify failure**

Run: `node --test scripts/research-contract.test.mjs`
Expected: FAIL with missing Blog route/component files.

- [ ] **Step 3: Implement the build-time index**

Load public pairs only, select `featured` first and then reverse chronological order, and render NUWA identity, the untranslated `Research Blog` heading, localized explanation, featured article, list, theme labels, author labels when useful, subscribe link, RSS discovery, and the verified existing external article as an explicitly external legacy entry. The empty state must be useful and must not claim future publication dates.

- [ ] **Step 4: Implement localized static paths**

Each `[slug].astro` loads all entries at build time, calls `pairResearchBlogEntries()`, chooses the locale-specific entry, calls `render(entry)`, and passes the rendered `Content` component plus pair/research metadata to `ResearchBlogArticle`. Draft pairs produce no paths.

- [ ] **Step 5: Implement the article shell and companion-paper module**

The hero renders category, date, updated date, authors, editors, title, summary, and a direct peer-language link. `CompanionPaper` renders the unchanged paper title, arXiv ID, paper/PDF/code/project links that actually exist, and citation metadata derived from the research asset. The article body receives semantic long-form styles; a compact table of contents is generated only when at least three `h2` headings exist.

- [ ] **Step 6: Extend BaseLayout metadata without changing existing callers**

Default `contentType` to `website`; for Blog articles emit `og:type=article`, `article:published_time`, optional `article:modified_time`, `article:author`, feed discovery, and `BlogPosting` schema supplied by the article component. Keep canonical and reciprocal `hreflang` generation.

- [ ] **Step 7: Add visual and accessibility styles**

Use the approved moon-white/paper, xuanqing/indigo, jade, restrained cinnabar, grid lines, incomplete ring, and sans-serif system. Set article measure to approximately `68ch` English and a visually equivalent Chinese measure. Style figures, tables, code, footnotes, citations, focus rings, mobile layout, and print. Under reduced motion, remove transitions and scrolling effects.

- [ ] **Step 8: Compile and commit the Blog presentation**

Run: `npm run check && npm run build`
Expected: both Blog indexes build; no detail route is emitted while the collection is empty; no client island is added to Blog pages.

```bash
git add src/components/research/ResearchBlogIndex.astro src/components/research/ResearchBlogArticle.astro src/components/research/CompanionPaper.astro src/components/research/ResearchFigure.astro src/pages/nuwa/blog/index.astro src/pages/en/nuwa/blog/index.astro 'src/pages/nuwa/blog/[slug].astro' 'src/pages/en/nuwa/blog/[slug].astro' src/styles/research-blog.css src/layouts/BaseLayout.astro scripts/research-contract.test.mjs
git diff --cached --check
git commit -m "feat: add bilingual NUWA Research Blog"
```

### Task 7: Connect publications and Research Blog bidirectionally

**Files:**
- Create: `src/components/research/ResearchBlogPreview.astro`
- Modify: `src/components/research/ResearchExplorer.tsx`
- Modify: `src/components/research/ResearchIndex.astro`
- Modify: `src/components/research/NuwaOverview.astro`
- Modify: `src/lib/researchBlog.ts`
- Modify: `src/styles/research.css`
- Modify: `src/styles/nuwa-overview.css`
- Modify: `scripts/research-contract.test.mjs`

**Interfaces:**
- Consumes: public Blog pair map from Task 3 and routes from Task 6.
- Produces: `BlogLinkMap = Record<string, { title: string; href: string }>` keyed by `research_asset`.
- Produces: publication action priority of Blog first, arXiv second when paired; arXiv first when unpaired.

- [ ] **Step 1: Add failing tests for action priority**

```js
test("research actions prioritize a real Blog pair and never invent one", async () => {
  const { researchActions } = await loadHelpers();
  const asset = {
    links: [
      { kind: "paper", url: "https://arxiv.org/abs/2603.07427" },
      { kind: "pdf", url: "https://arxiv.org/pdf/2603.07427" },
    ],
  };
  const paired = researchActions(asset, "zh", { title: "研究解读", href: "/nuwa/blog/autocontrol-arena" });
  assert.deepEqual(paired.map((action) => action.kind), ["blog", "paper", "pdf"]);
  const unpaired = researchActions(asset, "en");
  assert.deepEqual(unpaired.map((action) => action.kind), ["paper", "pdf"]);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node --test --test-name-pattern="action priority" scripts/research-blog.test.mjs`
Expected: FAIL because `researchActions` does not exist.

- [ ] **Step 3: Implement the pure action helper and serializable link map**

Return only links supported by real data. Pass the plain `BlogLinkMap` into `ResearchExplorer`; do not pass content collection objects into the React island.

- [ ] **Step 4: Update featured and archive publication cards**

For a paired item, show `阅读研究解读 / Read the research article` as primary and `查看 arXiv 原文 / View on arXiv` as secondary. For an unpaired item, preserve the current paper/PDF/code/project actions and make the paper the primary link. Add analytics attributes `research-blog-open`, `research-arxiv-open`, `research-pdf-open`, and `research-resource-open`.

- [ ] **Step 5: Add the Research Blog landing preview**

Render at most three public pairs: one editorial lead and two compact cards, followed by `查看全部 / View all`. When no onsite public pair exists, show the verified external Substack essay as an external legacy entry and label the source; do not imply a bilingual onsite edition.

- [ ] **Step 6: Add the preview to NUWA overview and research landing**

Use the same component with localized copy. Do not add Research Blog to the global navbar. Keep it as a page-index entry and a substantive research-page module.

- [ ] **Step 7: Verify and commit connections**

Run: `npm test && npm run check && npm run build`
Expected: helper tests pass; publication cards have no empty links; research and NUWA routes compile.

```bash
git add src/components/research/ResearchBlogPreview.astro src/components/research/ResearchExplorer.tsx src/components/research/ResearchIndex.astro src/components/research/NuwaOverview.astro src/lib/researchBlog.ts src/styles/research.css src/styles/nuwa-overview.css scripts/research-contract.test.mjs scripts/research-blog.test.mjs
git diff --cached --check
git commit -m "feat: pair research publications with blog analysis"
```

### Task 8: Implement the approved NUWA research landing narrative

**Files:**
- Create: `src/components/research/ResearchMission.astro`
- Modify: `src/components/research/ResearchIndex.astro`
- Modify: `src/components/research/NuwaOverview.astro`
- Modify: `src/components/research/PublicImpactPath.astro`
- Modify: `src/i18n/pages/research.ts`
- Modify: `src/i18n/pages/nuwa.ts`
- Modify: `src/styles/research.css`
- Modify: `src/styles/nuwa-overview.css`
- Modify: `scripts/check-content.mjs`

**Interfaces:**
- Consumes: `researchPrograms`, verified `researchVisuals`, `researchInfrastructure`, Blog preview, Whitzard Index route, public-impact records, recognition records, and archive explorer.
- Produces: the approved principal order: mission → three themes → featured evidence → Research Blog → infrastructure/public goods → complete archive → collaboration.
- Preserves: verified public-impact and recognition evidence as subordinate content within the public-goods/archive modules, not as competing top-level programs.

- [ ] **Step 1: Tighten the rendered-order test before markup changes**

Update `scripts/check-content.mjs` to locate principal section IDs and assert this order:

```js
const expectedOrder = ["mission", "programs", "featured", "research-blog", "infrastructure", "research-index", "collaboration"];
const offsets = expectedOrder.map((id) => researchHtml.indexOf(`id="${id}"`));
if (offsets.some((offset) => offset < 0) || offsets.some((offset, index) => index > 0 && offset <= offsets[index - 1])) {
  violations.push(`dist/nuwa/research/index.html: expected ${expectedOrder.join(" → ")}`);
}
```

Keep exact-count and source checks for public impact, infrastructure, recognition, and research records.

- [ ] **Step 2: Run the current build/check and verify the new order fails**

Run: `npm run build && npm run check:content`
Expected: FAIL because the current page does not render all approved principal IDs in the new order.

- [ ] **Step 3: Build the mission and three-program module**

Use NUWA logo as identity, the exact mandate and mission, `女娲实验室由白泽发起并支持。`, the three entries from `researchPrograms`, and a compact editorial page index. Do not add a second navbar. Do not display counts in the hero.

- [ ] **Step 4: Rebuild featured evidence around verified figures**

Use `ResearchFigure` for records in `researchVisuals`, preserving figure label, PDF page, localized caption, alt text, and direct PDF source. Use text-led cards when no verified figure exists. Remove decorative monograms where a verified figure is available.

- [ ] **Step 5: Integrate infrastructure, public goods, public impact, and recognition without losing evidence**

Keep AgentCyberRange and AutoControl Arena as the two verified infrastructure cards. Add Whitzard Index and verified public-impact records inside the broader infrastructure/public-goods module. Keep the six sourced recognition records as an archive-adjacent evidence list. Do not show “built/planned” status badges and do not claim participation, partnership, or independent status.

- [ ] **Step 6: Keep six categories only in the archive explorer**

Remove six-direction promotional cards from the upper page. Preserve all six filter values, year grouping, publication type, member filters, search, source links, and data-derived counts in `ResearchExplorer`.

- [ ] **Step 7: Apply the approved visual language**

Use only the current modern sans-serif stack. Build hierarchy with type scale, weight, grid lines, whitespace, paper/moon surfaces, indigo, jade, restrained cinnabar/gold, incomplete rings, and screen-like axes. Ensure mobile cards collapse to one column and the editorial index becomes an in-flow horizontal/stacked list. Keep all evidence legible at 200% zoom.

- [ ] **Step 8: Verify rendered evidence and commit**

Run: `npm run build && npm run check:content && npm run check:links`
Expected: order check passes; 86 research records, two infrastructure entries, six recognition records, verified figure markers, public-impact sources, and all localized links remain present.

```bash
git add src/components/research/ResearchMission.astro src/components/research/ResearchIndex.astro src/components/research/NuwaOverview.astro src/components/research/PublicImpactPath.astro src/i18n/pages/research.ts src/i18n/pages/nuwa.ts src/styles/research.css src/styles/nuwa-overview.css scripts/check-content.mjs
git diff --cached --check
git commit -m "feat: redesign NUWA research around evidence"
```

---

## Phase 4 — Routes, discovery, migration, and release gates

### Task 9: Add Blog discovery, feeds, redirects, and approved navigation labels

**Files:**
- Create: `src/pages/nuwa/blog/rss.xml.ts`
- Create: `src/pages/en/nuwa/blog/rss.xml.ts`
- Create: `src/lib/researchBlogFeed.ts`
- Modify: `src/pages/rss.xml.ts`
- Modify: `src/pages/blog.astro`
- Modify: `src/pages/en/blog.astro`
- Modify: `src/i18n/ui.ts`
- Modify: `src/i18n/routes.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `astro.config.mjs`
- Modify: `scripts/research-contract.test.mjs`

**Interfaces:**
- Consumes: public Blog pairs and localized Blog paths.
- Produces: localized Blog feeds and compatibility redirects.
- Produces: four global nav groups: Products, Frontier Research, Open Ecosystem, About.

- [ ] **Step 1: Add failing route/feed/navigation contract tests**

```js
test("Blog discovery and the four global navigation groups use approved routes", async () => {
  const [zhAlias, enAlias, uiSource, footer, zhFeed, enFeed] = await Promise.all([
    readFile("src/pages/blog.astro", "utf8"),
    readFile("src/pages/en/blog.astro", "utf8"),
    readFile("src/i18n/ui.ts", "utf8"),
    readFile("src/components/Footer.astro", "utf8"),
    readFile("src/pages/nuwa/blog/rss.xml.ts", "utf8"),
    readFile("src/pages/en/nuwa/blog/rss.xml.ts", "utf8"),
  ]);
  assert.match(zhAlias, /Astro\.redirect\("\/nuwa\/blog", 301\)/);
  assert.match(enAlias, /Astro\.redirect\("\/en\/nuwa\/blog", 301\)/);
  for (const label of ["核心产品", "前沿研究", "开放生态", "关于我们", "Products", "Frontier Research", "Open Ecosystem", "About"]) assert.match(uiSource, new RegExp(label));
  assert.doesNotMatch(uiSource, /label: "(?:Developers|开发者)"/);
  assert.match(footer, /Research Blog/);
  assert.match(zhFeed, /researchBlogFeed/);
  assert.match(enFeed, /researchBlogFeed/);
});
```

- [ ] **Step 2: Run the contract tests and verify failure**

Run: `node --test scripts/research-contract.test.mjs`
Expected: FAIL on missing feeds and legacy navigation labels.

- [ ] **Step 3: Implement localized feeds**

The Chinese feed uses Chinese Blog titles/summaries and `<language>zh-CN</language>`; English uses native English and `<language>en-US</language>`. Both link to onsite canonical Blog routes and include only public paired entries. Keep `/rss.xml` as the research-publication feed, rename its title/description to the canonical NUWA full name, and use `/nuwa/research` as fallback rather than `/research`.

- [ ] **Step 4: Convert legacy Blog routes to permanent redirects**

`src/pages/blog.astro` returns `Astro.redirect("/nuwa/blog", 301)`. The English route returns `Astro.redirect("/en/nuwa/blog", 301)`. Do this only after Task 6 indexes build successfully.

- [ ] **Step 5: Normalize navigation and footer**

Top-level Chinese labels are `核心产品`, `前沿研究`, `开放生态`, `关于我们`; English labels are `Products`, `Frontier Research`, `Open Ecosystem`, `About`. Product children contain AgentGuard, Model Services, and Use Cases. Research children contain NUWA overview, Research, Research Blog, and Whitzard Index. Open Ecosystem points to the existing ecosystem/developers route without exposing “Developers” as its label. Add restrained inline SVG icons and separators without a new icon dependency.

- [ ] **Step 6: Preserve CTA language**

Use `加入心愿单` in Chinese and `Join the waitlist` in English. If the destination form is not yet implemented, route to the existing real contact/waitlist destination; do not use `#`, an empty link, or claim registration exists. This task changes only labels and valid routes, not SaaS authentication.

- [ ] **Step 7: Update sitemap and language switches**

Exclude redirect-only `/blog` and `/en/blog`, include Blog index/detail outputs, and ensure `localeSwitchPath()` preserves the Blog slug. Draft content must not enter sitemap or feeds.

- [ ] **Step 8: Build, inspect, and commit discovery changes**

Run: `npm run build && node --test scripts/research-contract.test.mjs && npm run check:links`
Expected: Blog indexes and feeds are generated, redirect aliases are not canonical sitemap entries, and all nav/footer links resolve.

```bash
git add src/pages/nuwa/blog/rss.xml.ts src/pages/en/nuwa/blog/rss.xml.ts src/lib/researchBlogFeed.ts src/pages/rss.xml.ts src/pages/blog.astro src/pages/en/blog.astro src/i18n/ui.ts src/i18n/routes.ts src/components/Header.astro src/components/Footer.astro astro.config.mjs scripts/research-contract.test.mjs
git diff --cached --check
git commit -m "feat: expose NUWA research blog discovery"
```

### Task 10: Migrate the existing external essay without fabricating bilingual content

**Files:**
- Modify: `src/data/externalArticles.ts`
- Modify: `src/data/news.ts`
- Modify: `src/components/research/ResearchBlogIndex.astro`
- Modify: `src/components/research/ResearchBlogPreview.astro`
- Modify: `src/components/news/NewsPage.astro`
- Modify: `src/data/links.ts`
- Modify: `scripts/check-content.mjs`

**Interfaces:**
- Consumes: the verified existing Substack URL.
- Produces: one `externalLegacy` Research Blog item with source language and no fake onsite peer.
- Preserves: news visibility where useful without duplicating content ownership.

- [ ] **Step 1: Add a failing rendered-content check**

Add these exact assertions to `scripts/check-content.mjs`:

```js
const researchBlogHtml = withoutEmbeddedCode(await readFile("dist/nuwa/blog/index.html", "utf8"));
for (const marker of [
  "https://nuwasafety.substack.com/p/science-of-frontier-ai-risk-evaluation",
  "The Science of Frontier AI Risk Evaluation",
  "英文原文",
]) if (!researchBlogHtml.includes(marker)) violations.push(`dist/nuwa/blog/index.html: missing external legacy marker ${marker}`);
if (researchBlogHtml.includes('/nuwa/blog/science-of-frontier-ai-risk-evaluation')) {
  violations.push("dist/nuwa/blog/index.html: must not invent an onsite edition for the external legacy essay");
}
```

- [ ] **Step 2: Run build/content check and verify failure**

Run: `npm run build && npm run check:content`
Expected: FAIL because the new Blog index has not yet rendered the legacy external record under the required policy.

- [ ] **Step 3: Normalize the external record**

Extend `ExternalArticle` with `brand`, `sourceLanguage`, and `kind: "externalLegacy"`. Keep the verified URL and existing source record. The Chinese listing may use its existing localized summary but must display `英文原文 / English source`; it must not claim that a Chinese full article exists.

- [ ] **Step 4: Remove NUWA Brief naming from news and links**

Change subscription labels to `订阅研究更新 / Subscribe to research updates`. Keep the Substack URL as a distribution channel. Remove visitor-facing “NUWA Brief” labels without removing the valid external link.

- [ ] **Step 5: Verify and commit migration**

Run: `npm run build && npm run check:content && npm run check:terminology && npm run check:links`
Expected: legacy essay is visible as external English content; no fabricated onsite article or translation exists; old Brief branding is absent.

```bash
git add src/data/externalArticles.ts src/data/news.ts src/components/research/ResearchBlogIndex.astro src/components/research/ResearchBlogPreview.astro src/components/news/NewsPage.astro src/data/links.ts scripts/check-content.mjs
git diff --cached --check
git commit -m "refactor: migrate NUWA essay into Research Blog"
```

### Task 11: Enforce the Pull Request gate and complete release verification

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Modify: `docs/website-v2/12-acceptance-checklist.md`
- Modify: `docs/website-v2/generated/release-report.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: every check and build command from earlier tasks.
- Produces: CI validation on Pull Requests and deployment only from validated `main` pushes.
- Produces: final evidence record distinguishing automation from human review.

- [ ] **Step 1: Split CI validation from deployment**

Trigger the workflow on Pull Requests to `main`, pushes to `main`, and manual dispatch. Add a `validate` job that runs:

```yaml
- run: npm ci
- run: npm run ingest:info
- run: npm test
- run: npm run check
- run: npm run build
- run: npm run check:content
- run: npm run check:links
```

Make the Pages deployment job depend on `validate` and guard it with `if: github.event_name != 'pull_request'`. Upload `./dist` only on deployable runs.

- [ ] **Step 2: Run the exact local release sequence**

Run:

```bash
npm run ingest:info
npm test
npm run check
npm run build
npm run check:content
npm run check:links
```

Expected: every command exits `0`. Record exact output summaries; do not claim missing lint, performance, or browser results.

- [ ] **Step 3: Inspect generated route and metadata evidence**

Use `rg` against `dist` to verify Chinese and English Blog indexes, both feed files, redirect output, canonical URLs, reciprocal `hreflang`, the exact mission, Research Blog title, no deprecated NUWA variants in visitor-facing HTML, and no draft entries in output.

- [ ] **Step 4: Perform browser QA at three widths**

Use the project preview and Playwright workflow to inspect `/nuwa`, `/nuwa/research`, `/nuwa/blog`, `/en/nuwa`, `/en/nuwa/research`, and `/en/nuwa/blog` at 1440×1000, 768×1024, and 390×844. Verify keyboard navigation, visible focus, no horizontal overflow, readable figures/captions, archive filters, language switching, and 200% zoom. Repeat with reduced motion enabled and confirm content is unchanged.

- [ ] **Step 5: Test the author workflow in a temporary copy**

Run `blog:new` against a temporary repository root using arXiv `2603.07427`, confirm paired files, deliberately remove one edition, confirm `blog:check` fails, restore it, confirm checks pass as drafts, and delete only that validated temporary directory. Do not create a fabricated production article.

- [ ] **Step 6: Update acceptance and release documentation**

Record routes, automated commands, browser sizes, reduced-motion result, known absence of a public onsite Blog article, the external legacy essay policy, and the remaining human requirement: real article prose and bilingual editorial approval. Do not convert engagement metrics into public impact claims.

- [ ] **Step 7: Ignore visual-companion scratch output and commit the release gate**

Add `/.superpowers/` to `.gitignore` only after confirming the directory contains design-companion scratch files rather than production assets. Preserve `.zcode/` unless its owner explicitly decides otherwise.

```bash
git add .github/workflows/deploy.yml docs/website-v2/12-acceptance-checklist.md docs/website-v2/generated/release-report.md .gitignore
git diff --cached --check
git commit -m "ci: gate NUWA research publishing"
```

- [ ] **Step 8: Final branch review**

Run `git status --short`, `git log --oneline --decorate -12`, and `git diff b328d54...HEAD --stat`. Confirm no unrelated pre-existing working-tree files were staged in any task. Open a Pull Request summarizing design decisions, verification evidence, and the fact that Blog prose remains human-authored.

---

## Phase Gates

### Gate A — Foundation complete

Tasks 1–3 are accepted when terminology checks pass, the exact mission and three research programs are typed once, Blog content has a dedicated schema, and locale/pair helpers have unit coverage.

### Gate B — Publishing workflow complete

Tasks 4–5 are accepted when authors can safely generate paired drafts, validators reject incomplete or inconsistent public pairs, and no automation rewrites prose.

### Gate C — Visitor experience complete

Tasks 6–8 are accepted when Blog index/article routes compile statically, paper–Blog links are bidirectional, verified paper figures carry provenance, and the research landing follows the approved evidence narrative.

### Gate D — Release ready

Tasks 9–11 are accepted when feeds, redirects, navigation, external legacy migration, CI, full build checks, responsive QA, accessibility checks, and the Pull Request gate all pass with recorded evidence.
