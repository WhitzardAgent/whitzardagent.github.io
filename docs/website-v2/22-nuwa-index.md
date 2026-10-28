# 22｜NUWA Index：全球前沿 AI 风险研究知识库

Approved implementation scope: 2026-10-25. This document supersedes the evaluation-only local preview. English defines the conceptual copy; Chinese remains the unprefixed default locale.

## Positioning and task

**NUWA Frontier AI Safety Index** is a public research knowledge base maintained by NUWA Lab. Readers should identify the research question, responsible institutions, method, source finding, inference limits and unresolved questions. The primary task is finding and reading original work with a traceable NUWA note.

English description: “A research knowledge base on frontier AI risks, maintained by NUWA Lab.”

中文说明：“由女娲实验室维护的前沿 AI 风险研究知识库。”

## Research organization

Five research functions provide catalogue entry points: Risk Discovery, Risk Evaluation, Risk Monitoring, Risk Investigation and Risk Governance. Each work has one primary function; a justified secondary contribution can be recorded. Governance initially covers technical safeguards, control, assurance, safety cases and deployment decisions. General policy news and legal compilations are outside this first research scope.

NUWA retains two risk groups and six topics: Agentic Risks (Autonomy, Deception); Dual-Use Risks (Cybersecurity, CBRN, Disinformation, Autonomous Physical Harm). Cross-cutting work may have no topic association if forcing one would overstate the source.

Propensity, Capability and Behavior describe evaluation constructs. A work does not require a dimension or numerical score. A protocol has one main dimension; metric-level dimensions and source locators remain explicit. Research functions, topics and observation dimensions are not severity levels.

## Page composition

The compact header leads into Overview, Library, Results, Reports and Methodology. Overview connects five functions to risk topics using actual catalogue membership and leads to recent work. The map has no autoplay and the connecting structure implies no causal direction.

Cards use equal columns on desktop and one column at 1024px and below. They show research function, work type, full original title, role-specific institutional attribution, original publication date, summary, topic and applicable protocol badges. The title links to the original publication; the single NUWA record action leads to the local note. Institutional bylines group names inline with a middle-dot separator and show each contribution role once. Use the same byline in cards, matrices and work records; allow natural wrapping on narrow screens without clipping or hidden affiliations. Unknown affiliation stays explicit; original authors are retained where verified.

The library combines text search, research function, topic, institution, type, year and protocol-dimension filters with publication, update and relevance ordering. Search includes verified aliases and author names. URL state supports history and language switching. Static function and institution pages preserve browsing without JavaScript. Results have their own source/protocol filters and do not inherit unrelated library filters.

Work notes contain question, method, source finding, interpretation, limits and context, with sources, protocols and supported research relations. Desktop notes use a sticky contents list; smaller screens use a native collapsible contents list. Risk topics show representative research and retain the question-by-dimension matrix. An empty matrix cell means no question-level evaluation association in this catalogue.

## Data and compatibility

Schema 3.0 introduces ResearchWork, Organization, role-specific Contribution and ResearchRelation. Existing `benchmarks` are retained as the stable serialized collection for EvaluationProtocol; `EvaluationProtocol` is the explicit TypeScript name. This avoids breaking existing IDs and `/benchmark/` routes. Works reference protocols using `protocolIds`. Protocols are reusable across works. A result's source may differ from the protocol publication, but its recorded protocol version must resolve.

All original 35 protocol records and 23 numerical records are preserved. New research does not manufacture additional numerical evidence. Current schema-3 snapshots are validated separately from historical schema-2 snapshots. Existing snapshot bytes are retained. JSON exports expose an explicit schema version; CSV keeps existing columns and meaning.

New static routes are `/work/:id`, `/function/:id` and `/organization/:id` under the existing bilingual Index base. `/risk/`, `/benchmark/`, `/result/`, reports and exports remain. `view=risks` maps to Overview; `view=benchmarks` maps to Library's evaluation scope. Old hashes remain valid.

## Evidence and publication

Research inclusion requires a traceable original, a defined question, a recognizable method and bounded findings. Public scores and source code are not requirements. Numerical comparison has a separate, stricter gate for model/system identity, tasks, protocol, denominator, harness, tools, budget and sampling.

Institutional roles follow the publication's author block or official masthead. Publisher attribution does not imply authorship or independent evaluation. A checked source is not a replicated experiment. Primary work and source finding remain distinct from NUWA interpretation.

The search covers 2022 through the snapshot cutoff, supplemented by foundational work. The public coverage audit reports finite source-page captures and pending review limitations; the private queue retains unresolved candidates and raw retrieval material. A retrieved page is not automatically a verified finding. First-party model cards remain source documents until a discrete evaluation is identified.

## Delivery and acceptance

Local review only; no push, deployment, schedule or unattended publication is enabled by this change. Run catalogue and historical-snapshot validation, migration/source-role tests, bilingual content and terminology checks, Research Blog checks, Astro diagnostics, build and link checks. Browser acceptance covers 1440, 1200, 1024, 900, 808 and 390px, both languages, keyboard, touch, filters, history, source actions, static pages, no JavaScript, reduced motion and all legacy detail routes.

## Evidence presentation revision

Schema 3.1, source deduplication, chart-first pages and the 61-page visual audit follow [23-index-evidence-charts.md](23-index-evidence-charts.md). It supersedes source sidebars and repeated inline publication citations.

## Model-evidence extension — schema 4.0

The approved extension in [24-model-evidence-and-trends.md](24-model-evidence-and-trends.md) restores the P + C → B mechanism and optional multi-agent system layer, adds model/report/variant entities, and introduces source-specific release timelines. Current coverage and remaining extraction gaps are documented in nuwa-model-evidence-coverage.md（内部审阅材料保留在私有归档）. Earlier snapshot descriptions remain historical.
