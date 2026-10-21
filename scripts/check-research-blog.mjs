import { access } from "node:fs/promises";
import { join } from "node:path";
import { readResearchBlogFiles, loadResearchAssets, loadResearchInfrastructure, loadResearchHighlights, loadResearchMedia, validateResearchReference } from "./lib/research-blog.mjs";

const entries = await readResearchBlogFiles();
const researchSlugs = new Set((await loadResearchAssets()).map((item) => item.slug));
const infrastructureSlugs = new Set((await loadResearchInfrastructure()).map(item => item.slug));
const errors = [];
const byPair = new Map();
const slugs = new Set();

for (const entry of entries) {
  const { data, body, file } = entry;
  for (const field of ["title", "locale", "pair", "date", "authors", "summary", "originalTitle", "originalUrl"]) {
    if (data[field] === undefined || data[field] === "" || (Array.isArray(data[field]) && data[field].length === 0)) errors.push(`${file}: missing ${field}`);
  }
  if (!["zh", "en"].includes(data.locale)) errors.push(`${file}: locale must be zh or en`);
  const referenceError = validateResearchReference(data, researchSlugs, infrastructureSlugs);
  if (referenceError) errors.push(`${file}: ${referenceError}`);
  if (data.slug) errors.push(`${file}: use articleSlug; slug overrides Astro collection IDs across locales`);
  if (data.articleSlug) {
    const route = `${data.locale}/${data.articleSlug}`;
    if (slugs.has(route)) errors.push(`${file}: duplicate article route ${route}`);
    slugs.add(route);
  }
  if (data.cover) {
    if (!data.cover.alt || !data.cover.width || !data.cover.height) errors.push(`${file}: cover requires alt, width and height`);
    await access(join("public", data.cover.src)).catch(() => errors.push(`${file}: missing cover asset ${data.cover.src}`));
  }
  if (!body) errors.push(`${file}: article body is empty`);
  const pairEntries = byPair.get(data.pair) ?? [];
  pairEntries.push(entry);
  byPair.set(data.pair, pairEntries);
}

for (const [pair, pairEntries] of byPair) {
  const localeCounts = pairEntries.reduce((counts, entry) => ({ ...counts, [entry.data.locale]: (counts[entry.data.locale] ?? 0) + 1 }), {});
  for (const locale of ["zh", "en"]) if ((localeCounts[locale] ?? 0) > 1) errors.push(`pair ${pair}: duplicate ${locale} entry`);
  const published = pairEntries.filter((entry) => entry.data.draft === false);
  if (published.length > 0) {
    const locales = new Set(pairEntries.map((entry) => entry.data.locale));
    if (!locales.has("zh") || !locales.has("en")) errors.push(`pair ${pair}: published entries require both zh and en files`);
    if (pairEntries.some((entry) => entry.data.draft !== false)) errors.push(`pair ${pair}: both locales must leave draft together`);
    if (new Set(pairEntries.map((entry) => entry.data.researchSlug)).size !== 1) errors.push(`pair ${pair}: locale files must reference the same researchSlug`);
    if (new Set(pairEntries.map(entry => entry.data.infrastructureSlug)).size !== 1) errors.push(`pair ${pair}: locale files must reference the same infrastructureSlug`);
    if (new Set(pairEntries.map(entry => String(entry.data.date))).size !== 1) errors.push(`pair ${pair}: locale files must use the same publication date`);
  }
}

for (const highlight of await loadResearchHighlights()) {
  const pair = byPair.get(highlight.articlePair) ?? [];
  for (const locale of ["zh", "en"]) if (!pair.some(entry => entry.data.locale === locale)) errors.push(`highlight ${highlight.id}: missing ${locale} article`);
  for (const asset of [highlight.image.src, highlight.image.thumbnail, ...highlight.organizations.map(org => `/assets/research/${highlight.id}/${org.id}.webp`)]) {
    await access(join("public", asset)).catch(() => errors.push(`highlight ${highlight.id}: missing asset ${asset}`));
  }
  for (const id of highlight.compactOrganizations) if (!highlight.organizations.some(org => org.id === id)) errors.push(`highlight ${highlight.id}: unknown compact organization ${id}`);
}

for (const media of await loadResearchMedia()) {
  if (!media.url.startsWith("https://") || !media.sourceUrl || !media.verified) errors.push(`media ${media.id}: requires an HTTPS article link, source, and verification date`);
  if (media.logo) await access(join("public", media.logo)).catch(() => errors.push(`media ${media.id}: missing logo ${media.logo}`));
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Research Blog check passed (${entries.length} Markdown files).`);
