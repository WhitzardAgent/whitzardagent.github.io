import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadResearchAssets, researchBlogRoot, safeSlug } from "./lib/research-blog.mjs";

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, item, index, all) => {
  if (item.startsWith("--")) pairs.push([item.slice(2), all[index + 1]]);
  return pairs;
}, []));

if (!args.research || !args.slug || !args.author) {
  console.error("Usage: npm run new:research-blog -- --research <research-slug> --slug <article-slug> --author \"Name\"");
  process.exit(1);
}

const research = (await loadResearchAssets()).find((item) => item.slug === args.research);
if (!research) {
  console.error(`Unknown research slug: ${args.research}`);
  process.exit(1);
}

const slug = safeSlug(args.slug);
if (!slug) throw new Error("The article slug must contain Latin letters or numbers.");
const pairId = `${new Date().toISOString().slice(0, 10)}-${slug}`;
const originalUrl = research.links.find((link) => link.kind === "paper")?.url ?? research.links[0]?.url;
if (!originalUrl) throw new Error(`Research record has no original URL: ${research.slug}`);
const arxivUrl = research.arxivId ? `https://arxiv.org/abs/${research.arxivId}` : undefined;

await mkdir(researchBlogRoot, { recursive: true });
for (const locale of ["zh", "en"]) {
  const template = await readFile(join("templates", "research-blog", `${locale}.md`), "utf8");
  const target = join(researchBlogRoot, `${slug}.${locale}.md`);
  const values = {
    DATE: new Date().toISOString().slice(0, 10),
    PAIR_ID: pairId,
    AUTHOR: args.author,
    RESEARCH_SLUG: research.slug,
    ORIGINAL_TITLE: research.title,
    ORIGINAL_URL: originalUrl,
    ARXIV_LINE: arxivUrl ? `arxivUrl: \"${arxivUrl}\"\n` : "",
    TITLE_ZH: args["title-zh"] ?? `研究解读：${research.title}`,
    TITLE_EN: args["title-en"] ?? `Research explainer: ${research.title}`,
    SUMMARY_ZH: args["summary-zh"] ?? research.summary.zh,
    SUMMARY_EN: args["summary-en"] ?? research.summary.en,
  };
  const content = Object.entries(values).reduce((result, [key, value]) => {
    const replacement = key === "ARXIV_LINE" ? String(value) : String(value).replaceAll('"', '\\"');
    return result.replaceAll(`{{${key}}}`, replacement);
  }, template);
  await writeFile(target, content, { flag: "wx" });
  console.log(`Created ${target}`);
}
console.log("Both files are drafts. Human authors and editors must review both before setting draft: false.");
