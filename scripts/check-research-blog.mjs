import { readResearchBlogFiles, loadResearchAssets } from "./lib/research-blog.mjs";

const entries = await readResearchBlogFiles();
const researchSlugs = new Set((await loadResearchAssets()).map((item) => item.slug));
const errors = [];
const byPair = new Map();

for (const entry of entries) {
  const { data, body, file } = entry;
  for (const field of ["title", "locale", "pair", "date", "authors", "summary", "researchSlug", "originalTitle", "originalUrl"]) {
    if (data[field] === undefined || data[field] === "" || (Array.isArray(data[field]) && data[field].length === 0)) errors.push(`${file}: missing ${field}`);
  }
  if (!["zh", "en"].includes(data.locale)) errors.push(`${file}: locale must be zh or en`);
  if (!researchSlugs.has(data.researchSlug)) errors.push(`${file}: unknown researchSlug ${data.researchSlug}`);
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
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Research Blog check passed (${entries.length} Markdown files).`);
