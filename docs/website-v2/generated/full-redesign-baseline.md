# Whitzard Full-Site Redesign Baseline

Date: 2026-09-15

## Repository state

The redesign starts from a working tree with pre-existing, user-owned changes. Those changes are preserved and must not be reset or broadly staged.

### Approved and reusable

- Astro static output, bilingual routing, canonical metadata, React islands, JSONL ingestion, and GitHub Pages deployment remain healthy.
- New `/nuwa`, `/nuwa/research`, `/nuwa/whitzard-index`, `/models`, and `/developers` route work can be reused.
- The current Header dropdown implementation supplies a useful keyboard/mobile foundation.
- The current homepage has moved toward a company-first narrative and modern sans-serif Chinese typography.
- Research data includes 86 deduplicated works, two research-infrastructure records, and 22 visible open-ecosystem assets.

### Approved but incomplete

- Navigation groups exist but still expose `开发者 / Developers`, use older research naming, and do not have the approved icon/separator treatment.
- The header exposes a console link through `/developers#console` rather than a truthful console boundary.
- The primary acquisition CTA still uses contact-sales language rather than `加入心愿单 / Join the waitlist`.
- Model Services exists but still uses preparation/status language rather than a complete product/service narrative.
- NUWA routes exist but mission, three-program architecture, Research Blog, and canonical terminology are incomplete.
- Open Ecosystem currently routes through the Developers implementation and needs a canonical visitor-facing identity.

### Superseded by later decisions

- `NUWA Lab`, `NVWA`, `Nvwa`, and `Nuwa Frontier AI Safety Lab` as current public brand variants.
- `女娲简报 / NUWA Brief`; the approved name is `Research Blog` in both languages.
- `开发者 / Developers` as a global navigation category.
- Songti or serif display typography.
- The logo as the homepage's main decorative hero visual.
- A second NUWA navigation bar.
- The rejected four-layer capability/status matrix.
- Homepage removal of every research-to-product bridge; a concise evidence bridge is required.

### Unrelated or owner-controlled

- `.zcode/` remains untouched.
- `AGENTS.md` is treated as an owner-controlled instruction file.
- `.superpowers/` contains design-companion scratch output and remains outside production until it is deliberately ignored.

## Baseline verification

Commands run in order:

```text
npm run ingest:info
npm run check
npm run build
npm run check:content
npm run check:links
```

Results:

- Ingestion passed: 86 research works, two research-infrastructure entries, and 22 visible open-source assets generated.
- Astro check passed with zero errors and two hints.
- Hint: `src/components/Header.astro` imports `links` without using it.
- Hint: `src/components/Header.astro` declares `isGroupActive` without using it.
- Static build passed: 34 pages.
- Content check passed: 127 source files and 42 rendered pages.
- Internal link check passed: 42 HTML files and no broken internal links.

## Implementation rule

All following work must stage exact paths or exact hunks only. No pre-existing modification may be attributed to a new implementation commit without reviewing its full diff and confirming that it belongs to the approved redesign.
