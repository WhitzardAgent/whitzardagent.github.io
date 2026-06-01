# Whitzard Website

The official website for [Whitzard](https://www.whitzard.tech/) and [Nuwa Frontier AI Safety Lab](https://www.whitzard.tech/nuwa).

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
| `/research` | Research and reports index |
| `/blog` | Posts, briefs, notes, updates |
| `/open-source` | WhitzardAgent open-source ecosystem |
| `/agentguard` | AgentGuard project page |
| `/contact` | Collaboration and contact |
| `/NVWA-Project/` | Legacy redirect to `/nuwa` |

## Add New Content

Use the built-in scripts:

```bash
npm run new:post    # Create a new blog post
npm run new:brief   # Create a new Nuwa Brief
npm run new:note    # Create a new technical note
npm run new:report  # Create a new report
npm run new:update  # Create a new update
```

Each script creates a Markdown file with frontmatter and `draft: true`.

### Publish a Nuwa Brief

1. Run `npm run new:brief`
2. Edit the generated file in `src/content/briefs/`
3. Set `brand: nuwa` in the frontmatter
4. Change `draft: false` when ready
5. Commit and push — GitHub Actions deploys automatically

### Frontmatter Schema

```yaml
title: "Your Title"
date: 2026-01-01
type: brief
brand: whitzard | nuwa | whitzardagent
authors: []
summary: "A short summary."
tags: []
draft: true
external_url:
substack_url:
github_url:
pdf_url:
doi_url:
project:
```

**Draft content (`draft: true`) does not appear in public lists.**

### Content Visibility

- Reports appear in `/research`
- Briefs appear in `/blog` and `/nuwa`
- Projects appear in `/open-source`
- All non-draft content appears in `/blog`

## GitHub Pages Deployment

The site deploys automatically via GitHub Actions on every push to `main`.

Workflow: `.github/workflows/deploy.yml`

Steps:
1. Checkout code
2. Install Node 20
3. `npm ci`
4. `npm run build`
5. Upload `./dist` as artifact
6. Deploy to GitHub Pages

## DNS / CNAME

The `CNAME` file contains the custom domain for GitHub Pages.

Current CNAME: `www.whitzard.tech`

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

- Verify that `www.whitzard.tech` resolves to GitHub Pages.
- Verify HTTPS certificate is active.
- If switching canonical domain from `www.whitzard.tech` to `whitzard.tech`, update both the `CNAME` file and GitHub Pages settings.

## Official Links

| Channel | URL |
|---|---|
| X | <https://x.com/NuwaAISafety> |
| Substack | <https://nuwasafety.substack.com/> |
| GitHub | <https://github.com/WhitzardAgent> |
| Hugging Face | <https://huggingface.co/WhitzardAgent> |

All links are centralized in `src/data/links.ts`.

## Legacy Content

The previous website implementation is preserved in `legacy-backup/`.
