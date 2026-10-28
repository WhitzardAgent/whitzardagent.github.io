# NUWA Index — research expression and visual topics

Approved implementation: 2026-10-27. This supersedes presentation choices in 30–31 while retaining the catalogue, original results and publication workflow.

## Reading model

Framework / Trend / Research / Benchmarks remain the four entries. Trend defaults to Autonomy. Each topic has one editorially selected main chart, a research brief alongside it, at most two supporting views, and a specific next research question. Desktop uses approximately 8:4 columns; at 1050px and below the brief follows the chart. Research retains only Discovery, Evaluation and Governance. Monitoring and incident investigation remain tags.

The framework is an accessible SVG with P/C feeding Behavior under external conditions, agentic mechanisms linking across all four dual-use domains, enabling capabilities, and multi-agent dynamics. Node selection updates one evidence panel. Mobile has an equivalent readable navigation layout. The graph organizes research questions rather than assigning risk levels.

## Editorial configuration

`editorial.mjs` identifies default metrics by stable benchmark/metric identity. It does not select the largest result set, change review status or infer numerical equivalence. Known measurement families have explicit rules. Remaining legacy display labels stay addressable without newly claiming equivalence. `nuwa-editorial-coverage.json` records every current display set, its disposition and dated/undated coverage. All 201 legacy display groups and 1537 result–metric observations remain available; 14 display groups have explicit metric rules in this iteration. Further semantic review is recorded as work remaining, rather than represented as completed source verification.

Deception defaults to SaferAI's 108-cell factorial experiment. Compact charts page its three scenarios; all cells, including 103 source-reported zeros, remain in Data/CSV and complete SVG export. A zero is an observation under 30 rollouts, not missing evidence. Release dates are not used as an experimental axis for these conditions.

## Research briefs

English defines the initial analysis; Chinese is independently edited. Briefs contain findings, evidence links, interpretation, source-specific limits and next verification. Each finding refers to results in the bound analysis evidence set. Filters change the chart subset; the brief remains scoped to its declared complete evidence set and snapshot.

Drafts remain in an external private store and enter only explicit local-review builds. The public catalogue has no newly approved analysis. Existing four private briefs were revised, with three primary examples: METR measurement coverage, CyberGym budget sensitivity, and SaferAI goal/threat conditions. Source-reported experiments retain METR, SaferAI, Lyptus and other original evaluator attribution. Source transcription is distinct from experimental replication.

The Hugging Face incident work has a source-reported chronology and an investigation-scope panel. Original investigators remain credited. It is a governance investigation, not a scored benchmark.

## Visual grammar

White chart panels, quiet grids, navy text and jade selection. Developer colors and official marks retain identity; condition markers retain their separate meaning. Chart and model selectors occupy one compact toolbar; other conditions share one Filters disclosure. Protocol detail moves to benchmark records. Research coverage uses counts by topic and primary function, not risk severity. Directory cards use the existing seven-track subgrid, with full titles and aligned actions.

## Verification

Final verification (2026-10-27): 165 unit tests pass. Astro checks 317 files with zero errors, warnings or hints. Public/editorial builds complete with 3142/3150 Astro pages. Content (243 source files), terminology (219 source files), Research Blog (4 Markdown articles), internal links and the public-output private-content scan pass. New editorial browser acceptance covers 40 bilingual/viewport layouts plus framework selection, coverage filters, 108 condition cells, CSV, exact-model filtering, parent navigation persistence, restored dimension filtering, no-JS and reduced motion. The existing four-entry regression suite passes 100 layout cases plus keyboard, model, history and legacy paths. The editorial default chart bounds at 1440×900 are y=584.72px, height=300px, so the complete plot is visible in the initial viewport alongside the first research finding. Public draft exclusion is checked independently from editorial completeness. Browser checks must cover first-plot visibility at 1440×900, framework node selection, topic and function filtering, all 108 experimental cells, model selection, history, bilingual switching, downloads, no-JS and reduced motion. Do not infer layout acceptance solely from type checks.
