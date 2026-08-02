# Project rules

- Read `docs/website-v2/` before changing site structure, visual language, copy, motion, localization, or SEO.
- Preserve Astro static output, React islands, Tailwind, MDX/content collections, JSONL ingestion, GitHub Pages deployment, and all valuable legacy routes.
- Follow the bilingual route contract: English is unprefixed; Chinese lives under `/zh/*`. Keep locale metadata, design tokens, WCAG AA contrast, responsive behavior, and `prefers-reduced-motion` support intact.
- Never invent customers, partners, deployments, benchmarks, performance figures, or research claims. Source evidence from the repository's data files.
- Keep pages compositional, pass localized copy into interactive components, and avoid unnecessary client JavaScript or large dependencies.
- Do not break `npm run ingest:info`. Run `npm run build` after changes; also run available checks without fabricating missing lint/test results.

