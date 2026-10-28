# NUWA Index — citations and evidence charts

Approved scope: 2026-10-25. Local review only. This specification supersedes earlier inline-citation and independent-source-sidebar requirements.

## Reading order

Evaluation title and brief scope → full-width result chart or original figure → metric conditions → data table → method and limitations → related research → Sources. The source sidebar is removed. Source shortcuts link to the bottom of the same page. Research cards retain an original-linked title and one NUWA record action.

Visual references: [Artificial Analysis Cyber Index](https://artificialanalysis.ai/evaluations/artificial-analysis-cyber-index) for metric controls, explicit values and chart/table reading; [methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking) for independent version and method explanations. NUWA does not inherit their scores, composite index or ranking rules.

## Document identity and attribution

`PageSources.astro` is shared by protocol, work, risk, result, report and Blog templates. `collectPageSources` groups citations by explicit document identity, falling back to canonical arXiv/DOI/URL identity. Source `aliases` resolve known alternate document addresses; unrelated DOI and arXiv identifiers require a verified alias, never a title-similarity guess. Versions, original locations and page applicability are combined in one entry. Different papers, reports and project sites remain separate.

Precise source IDs, versions and locators remain on each fact, metric and contribution. Authors and institutional attribution follow the existing verified records. Source checking and numerical transcription do not imply experimental replication. Single-document numerical pages state once that values are source-reported. Captions explain figures without repeating full publication links. Original-image links are local viewing actions.

Blog authors maintain additional sources in frontmatter `citations`, including optional `version`, `locator` and `appliesTo`. `originalUrl`, `arxivUrl`, `codeUrl` and highlight sources join the same footer. Markdown image titles remain captions; publication sources are no longer repeated after each figure.

## Data contract — schema 3.1

- `ChartSpec` references existing result IDs and metric IDs. It holds source order, domain, default metric, panel arrangement, meaning, conditions and date notes; it does not duplicate numerical values.
- `ReportedInterval` records only source-reported intervals with a level and provenance. Existing AgentDojo ± percentage-point 95% confidence intervals are converted to endpoints for drawing, not statistically re-estimated. SEM and standard deviation remain explicitly labelled; neither is drawn as a confidence interval.
- `OriginalFigure` holds local responsive assets, original image, exact dimensions, original figure/panel locator and retrieval URL. Complete figures retain their legends; a selected panel is labelled as such. No pixel-to-value inference.
- `VisualAudit` covers every protocol, including missing result assets. A protocol overview is not evidence that a study is qualitative or lacks scores.
- Schema 2.0 and 3.0 historical snapshots remain unchanged. Snapshot 2026-10-25.4 adds the current data. The original 23 result objects and all protocol IDs remain unchanged. Legacy CSV column meanings are preserved; filtered chart exports have their own explicit columns.

## Charts and interaction

The source-report group is the default. No value sorting, ranks, best labels or combined safety score. A verified-comparison chart requires an approved group and complete comparable conditions. Chart additions or framing changes require review under fact-update policy.

Horizontal bars start at zero. AgentCyberRange uses aligned Web/Post panels with identical system order; AgentDojo defaults to targeted ASR, offers utility metrics and aligned before/under-attack panels; Self-Replication labels ten controlled trials per system and does not present deployment probabilities. Ratios retain a 0–1 scale. Weighted scores are not relabelled as percentages. Missing metrics are omitted or marked “Not reported”, never zero.

One lightweight custom element handles metric choice, system selection, chart/table view and downloads. All share the same records and state. URL fields `metric`, repeated `system`, `chartView` and `all` preserve unrelated filters, browser history state and bilingual switching. Source order is stable; over twelve systems show the first twelve with an explicit count and Show all. CSV/SVG export the displayed selection. The table is keyboard-scrollable. SVG labels include full systems and standalone source credit.

No automatic chart animation. No new dependency or React island. No JavaScript: default chart, all records and all metrics in the static table, configurations and bibliography remain readable. Reduced motion needs no alternative chart state.

## Coverage and open work

See 61-page audit（内部审阅材料保留在私有归档） and machine-readable audit（内部审阅材料保留在私有归档）. This pass provides 18 structured chart pages, 42 original figure pages and one suite overview. The numerical set expands from 23 to 180 system/configuration records. The robot study uses its separate technical report, with simulation prompt conditions kept distinct from physical trials. The CyberSecEval introduction describes a suite without a unified score, so its components form the overview; numerical records belong to individual versioned protocols. This finite audit does not imply global completeness.

Source original tables and figures were inspected from the finite 2026-10-25 captures. The remaining original figures are not fully transcribed tables. Future work can add exact results after protocol/metric/denominator verification, using a new immutable snapshot.

## Acceptance

Run type checks, tests, NUWA data checks, content, terminology, Research Blog, JSONL ingestion, build and links. Browser checks cover both languages, all 61 protocol routes at desktop/mobile, the three samples at 1200/1024/900/808px, single document entries, history, language, keyboard, touch, metric/system filtering, missing values, Show all, CSV/SVG, no JavaScript and reduced motion. Read the generated screenshots, not only DOM assertions. No push or deployment is included.

## Local verification record

- Astro diagnostics: 231 files, zero errors/warnings/hints.
- Unit tests: 49 passed, including source identity, baseline preservation, chart/table state, original CI handling and source-table spot checks.
- Catalogue: 61 audits, 18 charts, 42 original figures, one suite overview, 180 numerical records; schema and source references valid.
- Browser: 268 chart-layout checks, 156 knowledge-base layout checks and 84 research-reading layout checks; keyboard, touch, history, language, exports, no-JS and reduced-motion passed without page errors.
- CSV download parsed with 23 consistent columns; SVG download parsed as valid XML and visually rendered for review.
- Content, terminology, Research Blog, JSONL prebuild and static build passed. Build: 984 generated pages; 992 HTML files including compatibility stubs checked without broken internal links.
- Local preview remains on port 4324. No push, deployment or scheduled publication was performed.
