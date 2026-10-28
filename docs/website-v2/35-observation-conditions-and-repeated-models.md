# Observation conditions and repeated model names

2026-10-27. This corrects the presentation projection in 31–34 without rewriting source results or historical snapshots.

## Root cause

The APE default view contained 32 observations: four systems measured in eight topic conditions from Neo Research’s Kimi K3 report, §7.1, Table 16, p.58. All shared the generic task-set label `APE topic categories`. The original condition was retained in `protocol`, but task-set-only faceting and model-only chart labels hid it. Numeric sorting put eight different DeepSeek V4 Flash condition scores next to each other. These were not eight copies of a single model-wide score.

## Corrected projection

The existing extraction format is `report; condition; source-specific configuration`. Explicit within-report conditions now become named scopes when a system has measurements in multiple conditions. This uses the recorded condition rather than inferring it from the score or model name. Compact topic views display one condition at a time, with source-order condition pagination and independently sorted model bars. The complete table and exports retain all observations. APE retains 32 cells, including 15 reported zeros. PersuSafety, shutdown, language, evaluation-cue and other conditional experiments use the same projection. The existing goal/threat factorial matrix keeps its axes.

When same-name systems remain in a scope, chart labels include the distinguishing budget, Harness, report or source location. Original system names remain unchanged in the catalogue. This is display disambiguation, not evidence deduplication: independent runs, rounded values, repeated report quotations and differing configurations are not automatically merged or counted as independent replications. Previously reviewed measurement aliases continue to determine known quotations.

The selected-record panel, searchable conditions, AG Grid, static fallback table, keyboard point labels, tooltip, SVG and CSV carry the experimental context. CSV appends `protocol`, `observationCondition`, and `observationLabel`; earlier columns retain their meanings. Chart height is calculated from the visible scope and label length rather than the entire unpaged dataset.

## Coverage audit

`nuwa-observation-context-audit.json` audits all 201 display sets and 1,537 result–metric projections. Twenty sets previously repeated model names within a task scope. They now use explicit condition scopes, configuration/source qualifiers, or the existing factorial matrix. The audit reports no unresolved ambiguous non-factorial axis labels. This is a presentation audit and does not claim a new full-text source verification.

Regression acceptance covers the reported URL, eight APE scopes, 32 observations, all original zeros, bilingual labels, condition paging/history, selected-record context, numeric order, table/CSV, static no-JavaScript output and source attribution. The raw catalogue and source result counts remain unchanged. Delivery remains local.

## Verified local delivery

175 unit tests pass. Astro checks 329 files with no errors, warnings or hints; data, content, terminology, Research Blog, internal links and public-output privacy checks pass. Production/editorial builds complete with 3,142/3,150 pages. Browser acceptance passes six bilingual condition layouts, all eight APE conditions, complete 32-row CSV, selection/history and no-JS; the existing editorial suite passes 40 view/layout combinations, and selector/metadata suites each pass six layouts. CSV regression counts records with quoted multiline fields rather than mistaking display-label line breaks for new observations. Protocol and localized condition/budget filters use the same text projection as the grid.
