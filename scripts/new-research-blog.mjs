import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadResearchAssets, loadResearchInfrastructure, researchBlogRoot, safeSlug } from "./lib/research-blog.mjs";

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, item, index, all) => {
  if (item.startsWith("--")) pairs.push([item.slice(2), all[index + 1]]);
  return pairs;
}, []));

if (Boolean(args.research) === Boolean(args.project) || !args.slug || !args.author) {
  console.error("Usage: npm run new:research-blog -- (--research <paper-slug> | --project <project-slug>) --slug <article-slug> --author \"Name\"");
  process.exit(1);
}

const research = args.project ? (await loadResearchInfrastructure()).find(item => item.slug === args.project) : (await loadResearchAssets()).find((item) => item.slug === args.research);
if (!research) {
  console.error(`Unknown research reference: ${args.research ?? args.project}`);
  process.exit(1);
}

const slug = safeSlug(args.slug);
if (!slug) throw new Error("The article slug must contain Latin letters or numbers.");
const pairId = `${new Date().toISOString().slice(0, 10)}-${slug}`;
const originalUrl = args.project ? research.websiteUrl : research.links.find((link) => link.kind === "paper")?.url ?? research.links[0]?.url;
if (!originalUrl) throw new Error(`Research record has no original URL: ${research.slug}`);
const arxivUrl = research.arxivId ? `https://arxiv.org/abs/${research.arxivId}` : undefined;
const originalTitle = args.project ? research.name : research.title;

await mkdir(researchBlogRoot, { recursive: true });
for (const locale of ["zh", "en"]) {
  const template = await readFile(join("templates", "research-blog", `${locale}.md`), "utf8");
  const target = join(researchBlogRoot, `${slug}.${locale}.md`);
  const values = {
    DATE: new Date().toISOString().slice(0, 10),
    PAIR_ID: pairId,
    ARTICLE_SLUG: slug,
    AUTHOR: args.author,
    REFERENCE_LINE: `${args.project ? "infrastructureSlug" : "researchSlug"}: "${research.slug}"\n`,
    ORIGINAL_TITLE: originalTitle,
    ORIGINAL_URL: originalUrl,
    ARXIV_LINE: arxivUrl ? `arxivUrl: \"${arxivUrl}\"\n` : "",
    TITLE_ZH: args["title-zh"] ?? `研究解读：${originalTitle}`,
    TITLE_EN: args["title-en"] ?? `Research explainer: ${originalTitle}`,
    SUMMARY_ZH: args["summary-zh"] ?? (research.summary ?? research.description).zh,
    SUMMARY_EN: args["summary-en"] ?? (research.summary ?? research.description).en,
  };
  const content = Object.entries(values).reduce((result, [key, value]) => {
    const replacement = ["ARXIV_LINE", "REFERENCE_LINE"].includes(key) ? String(value) : String(value).replaceAll('"', '\\"');
    return result.replaceAll(`{{${key}}}`, replacement);
  }, template);
  await writeFile(target, content, { flag: "wx" });
  console.log(`Created ${target}`);
}
console.log("Both files are drafts. Human authors and editors must review both before setting draft: false.");
