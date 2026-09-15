# Whitzard Website

The official bilingual website for [Whitzard](https://whitzard.tech/) and the [NUWA Frontier AI Safety Lab](https://whitzard.tech/nuwa).

**Repository:** <https://github.com/WhitzardAgent/whitzardagent.github.io>
**Domain:** [whitzard.tech](https://whitzard.tech)
**Hosting:** GitHub Pages

## Stack

- [Astro](https://astro.build) — static site framework
- [MDX](https://mdxjs.com) — Markdown + JSX content
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- GitHub Actions — build and deploy

## Run Locally

```bash
npm install
npm run dev
```

Open <http://localhost:4321> in your browser.

## Build

```bash
npm run build
```

This automatically runs `npm run ingest:info` (via `prebuild`) before building. Output goes to `./dist`.

### Product access configuration

Two optional public environment variables connect the static website to production services:

```bash
PUBLIC_CONSOLE_URL=https://console.example.com
PUBLIC_WAITLIST_ENDPOINT=https://api.example.com/waitlist
```

Only HTTPS values are accepted. Without a console URL, `/login` explains the current access path without rendering a simulated sign-in. Without a waitlist endpoint, the qualification form remains visible but does not claim to store data and offers the published email address instead.

### Manual data ingestion

```bash
npm run ingest:info
```

Reads JSONL metadata from `public/assets/info/` and generates TypeScript data files under `src/data/generated/`.

## Data Sources

### Research metadata

File: `public/assets/info/ai_safety_research_assets_metadata.jsonl`

Each line is a JSON object with fields: Title, Authors, Year, Venue / Status, URL, PDF URL, Topic, One-line summary, Featured or not.

Running `npm run ingest:info` generates `src/data/generated/researchAssets.ts` with typed `ResearchAsset` objects.

### Open-source project metadata

File: `public/assets/info/whitzardagent_open_assets_metadata.jsonl`

Each line is a JSON object with fields: Name, Status, One-line description, GitHub / HF / website link, Visible or hidden.

Running `npm run ingest:info` generates `src/data/generated/openSourceAssets.ts` with typed `OpenSourceAsset` objects. Only projects with `Visible or hidden: "visible"` are included.

### OG images

Directory: `public/assets/og/`

- `whitzard-og.png` — used for Whitzard-branded pages (home, about, contact, open source, agentguard)
- `nuwa-og.png` — used for Nuwa-branded pages (nuwa, research, blog)

To add new OG images, place them in `public/assets/og/` and update the `ogImage` prop on the relevant page.

## Routes

| Path | Description |
|---|---|
| `/` | Whitzard main entrance |
| `/agentguard` | AgentGuard product and service system |
| `/models` | Model Services |
| `/solutions` | Enterprise use cases |
| `/nuwa` | NUWA Frontier AI Safety Lab |
| `/nuwa/research` | Research programs, evidence, and publication archive |
| `/nuwa/blog` | Human-written Research Blog |
| `/nuwa/whitzard-index` | Whitzard Index |
| `/open-ecosystem` | Open ecosystem |
| `/about` | Team and organization |
| `/contact` | Collaboration and contact |
| `/waitlist` | Product waitlist and qualification form |
| `/login` | Truthful console boundary when no console URL is configured |
| `/rss.xml` | RSS feed |

Chinese routes are unprefixed. English peers live under `/en/*`. Historic `/research`, `/blog`, `/developers`, `/open-source`, `/publications`, and `/NVWA-Project/` routes are compatibility redirects.

## Publish a Research Blog article

Each Research Blog article is paired with an existing research record and published as human-written Chinese and English Markdown.

```bash
npm run new:research-blog -- --research <research-slug> --slug <article-slug> --author "Author Name"
```

The command creates paired `.zh.md` and `.en.md` drafts under `src/content/research-blog/`. Edit both, complete human review, then set `draft: false` in both files. The full editorial and release checklist is in [`docs/website-v2/14-research-blog-publishing.md`](docs/website-v2/14-research-blog-publishing.md).

## Update Team Members

Edit `src/data/team.ts`:

```ts
{
  name: "Name",
  role: "Role",
  affiliation: "whitzard" | "nuwa",
  category: "founding" | "research" | "engineering" | "advisor",
  bio: "Bio text.",
  links: [{ label: "Website", url: "https://..." }],
  photo: "/assets/team/name.jpg",
}
```

## Update Official Links

Edit `src/data/links.ts`.

## GitHub Pages Deployment

The site deploys automatically via GitHub Actions on every push to `main`.

Workflow: `.github/workflows/deploy.yml`

Steps:
1. Checkout code
2. Install Node 22
3. `npm ci`
4. Validate tests, terminology, Research Blog pairs, and Astro types
5. `npm run build`
6. Validate rendered content and internal links
7. Upload `./dist` and deploy to GitHub Pages

**Important**: GitHub Pages source must be set to "GitHub Actions" in repo Settings > Pages.

## DNS / CNAME

CNAME file contains: `whitzard.tech`

DNS configuration:

```
www    CNAME    whitzardagent.github.io
```

For apex domain (`whitzard.tech`):

```
@      A        185.199.108.153
@      A        185.199.109.153
@      A        185.199.110.153
@      A        185.199.111.153
```

No paid server or HTTPS certificate is required. GitHub Pages issues HTTPS automatically.

### Manual DNS Check

- Verify `whitzard.tech` resolves to GitHub Pages
- Verify HTTPS certificate is active
- If switching canonical domain, update both CNAME file and GitHub Pages settings

## Official Links

| Channel | URL |
|---|---|
| X | <https://x.com/NuwaAISafety> |
| Substack | <https://nuwasafety.substack.com/> |
| GitHub | <https://github.com/WhitzardAgent> |
| Hugging Face | <https://huggingface.co/WhitzardAgent> |
| Email | <mailto:whitzardindex@fudan.edu.cn> |

All links are centralized in `src/data/links.ts`.

## Contact Email

The public contact address is defined once in `src/data/links.ts` and reused across the site.

## Legacy Content

The previous website implementation is preserved in `legacy-backup/`.
