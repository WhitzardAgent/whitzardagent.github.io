# Whitzard Website

The official information hub for [Whitzard](https://www.whitzard.tech/) and [Nuwa Frontier AI Safety Lab](https://www.whitzard.tech/nuwa).

**Repository:** <https://github.com/WhitzardAgent/whitzardagent.github.io>
**Domain:** [www.whitzard.tech](https://www.whitzard.tech)
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

Output goes to `./dist`.

## Routes

| Path | Description |
|---|---|
| `/` | Whitzard main entrance |
| `/nuwa` | Nuwa Frontier AI Safety Lab |
| `/research` | Research and publications |
| `/blog` | Posts, briefs, notes, updates |
| `/about` | Team and organization |
| `/contact` | Collaboration and contact |
| `/open-source` | WhitzardAgent open-source ecosystem |
| `/agentguard` | AgentGuard project page |
| `/NVWA-Project/` | Legacy redirect to `/nuwa` |
| `/rss.xml` | RSS feed |

## Add New Content

### Blog post

```bash
npm run new:post
# Edit src/content/posts/YYYY-MM-DD-new-post.md
# Set draft: false when ready
```

### Research note

```bash
npm run new:note
# Edit src/content/notes/YYYY-MM-DD-new-note.md
# Set brand: nuwa, draft: false
```

### Nuwa Brief

```bash
npm run new:brief
# Edit src/content/briefs/YYYY-MM-DD-new-brief.md
# Set brand: nuwa, draft: false
# Optionally add substack_url for cross-posting
```

### Frontmatter Schema

```yaml
title: "Title"
date: 2026-01-01
type: post | brief | note | report | framework | update
brand: whitzard | nuwa | whitzardagent
authors: []
summary: "Short summary."
tags: []
draft: true
featured: false
homepage: false
research_area: ""
external_url:
substack_url:
github_url:
pdf_url:
doi_url:
project:
```

- `draft: true` content does not appear publicly
- `featured: true` content appears in Featured sections on Research and Nuwa pages
- `homepage: true` content appears on the homepage Latest Research section
- `research_area` tags content for research area filtering

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

## Publish to Substack from MDX

1. Write the content as a Nuwa Brief in `src/content/briefs/`
2. Build and verify locally
3. Copy the markdown body to Substack editor
4. Add `substack_url` to the frontmatter for cross-linking

## GitHub Pages Deployment

The site deploys automatically via GitHub Actions on every push to `main`.

Workflow: `.github/workflows/deploy.yml`

Steps:
1. Checkout code
2. Install Node 22
3. `npm ci`
4. `npm run build`
5. Upload `./dist` as artifact
6. Deploy to GitHub Pages

**Important**: GitHub Pages source must be set to "GitHub Actions" in repo Settings > Pages.

## DNS / CNAME

CNAME file contains: `www.whitzard.tech`

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

- Verify `www.whitzard.tech` resolves to GitHub Pages
- Verify HTTPS certificate is active
- If switching canonical domain, update both CNAME file and GitHub Pages settings

## Official Links

| Channel | URL |
|---|---|
| X | <https://x.com/NuwaAISafety> |
| Substack | <https://nuwasafety.substack.com/> |
| GitHub | <https://github.com/WhitzardAgent> |
| Hugging Face | <https://huggingface.co/WhitzardAgent> |
| Email | <mailto:contact@whitzard.tech> |

All links are centralized in `src/data/links.ts`.

## Contact Email

The contact page uses `contact@whitzard.tech`. Verify this mailbox is configured and receiving mail. If not yet configured, update `src/data/links.ts` with the correct email address.

## Legacy Content

The previous website implementation is preserved in `legacy-backup/`.
