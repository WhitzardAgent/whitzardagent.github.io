# Index selectors and primary-metric ordering

2026-10-27. This supersedes the release-date default and score-sort restriction in 33. Strict comparability still controls comparison claims and connecting trend lines. It does not control descriptive numeric display order.

## Select component

Index pages use the MIT-licensed `@headlessui/react` Combobox (2.2.10), designed to integrate with Tailwind. The shared skin uses the site's white, navy and jade tokens. Long lists support in-control search. Every popup shows focus and selection states; model/developer options retain official marks. Floating anchored menus avoid container clipping and remain within mobile screen boundaries. Keyboard navigation, Escape, outside click and focus behavior come from Headless UI.

The Astro/native select remains the form and URL-controller interface. Only visible controls are enhanced, existing options/value changes synchronize through the shared adapter, and native selects remain the no-JavaScript output. Research, Benchmarks, Trend, model selection and the Index detail-page filters use the same component. This does not migrate unrelated company pages or install a new chart engine.

## Ordering

The first Systems view orders the complete metric selection before row pagination. `primaryMetricOrder` reads the explicit metric/group order (`asc` or `desc`); currently curated score/rate/capability metrics are higher-first. Lower-first measurements must declare that meaning in metric presentation metadata. Unknown display metrics use descending numeric order without calling a high value safer or better. Explicit source, model-name and release-date ordering remain available.

Both value directions are available for source-reported and partially comparable observations. Facets preserve task/protocol distinctions; display order neither merges independent runs nor upgrades comparability, connects unrelated observations, or creates a cross-benchmark total. Grid value headers support numeric sorting. Chart rows, table projections and CSV retain the active sort/filter state. Original values, units, intervals, qualifiers, source attribution and all zero observations remain intact. Condition heatmaps continue to use their measured experimental axes.

## Acceptance

Exercise searchable model/organization menus, short non-search lists, hidden curated options, changing protocols, URL history, locale, keyboard, mobile portal geometry and original native/no-JS output. Verify default descending and explicit lower-first configurations, ascending/descending controls on descriptive data, pre-pagination order and source-order restoration. Run the editorial/metadata suites and standard repository checks before refreshing the local review build.

## Verification — 2026-10-27

172 unit tests passed. Astro checked 326 files with no diagnostics. NUWA data, content, terminology, Research Blog, internal links and public-output privacy checks passed. Static production output: 3,142 pages; private editorial output: 3,150 pages. The selector browser suite passed six bilingual desktop/tablet/mobile layouts, searchable options, keyboard selection/Escape, URL history, numeric/grid sorting and no-JavaScript fallback. The editorial suite passed 40 responsive view combinations, condition-matrix, source/export, framework, model and locale regressions. Headless UI selector code is scoped to Index routes and absent from the company homepage script list. This remains a local review delivery.
