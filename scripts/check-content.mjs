import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

async function filesUnder(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

const forbiddenRenderedCopy = [
  "Public papers, reports, position papers, and technical notes preserved from the current research data pipeline.",
  "The current public team record is preserved from the repository.",
  "generated research records",
  "public ecosystem metadata",
  "从仓库自动生成的研究记录",
  "保留现有研究数据管线",
  "公开元数据",
  "以下公开团队记录来自当前仓库",
  "contact@whitzard.tech",
  "这个演示",
  "看见策略如何做出决定",
  "告诉我们智能体能够访问什么",
  "一次危险行动很少只有单一原因",
  "在能够公开验证的地方保持开放",
];

const forbiddenFontPatterns = [
  /Songti/i,
  /STSong/i,
  /Noto\s+Serif/i,
  /Source\s+Serif/i,
  /font-serif/i,
  /font-family\s*:[^;}]*(?:Georgia|\bserif\b)/i,
  /class(?:Name)?\s*=\s*["'][^"']*\bserif\b/i,
];

const violations = [];
const sourceFiles = (await filesUnder("src")).filter((file) => [".astro", ".css", ".ts", ".tsx"].includes(extname(file)));
for (const file of sourceFiles) {
  const content = await readFile(file, "utf8");
  for (const pattern of forbiddenFontPatterns) {
    if (pattern.test(content)) violations.push(`${file}: forbidden font pattern ${pattern}`);
  }
}

const htmlFiles = (await filesUnder("dist")).filter((file) => extname(file) === ".html");
for (const file of htmlFiles) {
  const content = await readFile(file, "utf8");
  for (const phrase of forbiddenRenderedCopy) {
    if (content.includes(phrase)) violations.push(`${file}: forbidden visitor-facing copy: ${phrase}`);
  }
}

const parseJsonl = async (file) => (await readFile(file, "utf8"))
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const ecosystemHtml = await readFile("dist/open-ecosystem/index.html", "utf8");
const visibleProjects = (await parseJsonl("public/assets/info/whitzardagent_open_assets_metadata.jsonl"))
  .filter((item) => String(item["Visible or hidden"]).toLowerCase() === "visible");
for (const project of visibleProjects) {
  const description = project["One-line description zh"];
  if (!description) violations.push(`open ecosystem: ${project.Name} has no Chinese description`);
  else if (!ecosystemHtml.includes(description)) violations.push(`dist/open-ecosystem/index.html: missing Chinese description for ${project.Name}`);
}

const researchHtml = await readFile("dist/research/index.html", "utf8");
const researchRecords = await parseJsonl("public/assets/info/ai_safety_research_assets_metadata.jsonl");
for (const record of researchRecords) {
  if (!record["One-line summary zh"]) violations.push(`research: ${record.Title} has no Chinese summary`);
  if (!record["Topic zh"]) violations.push(`research: ${record.Title} has no Chinese topic`);
  if (record["Featured or not"] && !researchHtml.includes(record["One-line summary zh"])) {
    violations.push(`dist/research/index.html: missing Chinese summary for ${record.Title}`);
  }
}

const aboutHtml = await readFile("dist/about/index.html", "utf8");
for (const englishBioMarker of ["is the CEO of Whitzard", "is the CTO of Whitzard", "is an Assistant Professor at Fudan University"]) {
  if (aboutHtml.includes(englishBioMarker)) violations.push(`dist/about/index.html: English team biography leaked into Chinese page`);
}

const decodeText = (value) => value
  .replace(/<[^>]*>/g, " ")
  .replace(/&[a-z#0-9]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();
const chineseBudget = (value) => {
  const cjk = value.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const technicalTerms = value.match(/[A-Za-z0-9][A-Za-z0-9 .&×-]*/g)?.length ?? 0;
  return cjk + technicalTerms;
};
const coreRoutes = ["", "agentguard", "solutions", "nuwa", "research", "open-ecosystem", "about", "contact"];
for (const route of coreRoutes) {
  const file = join("dist", route, "index.html");
  const content = await readFile(file, "utf8");
  for (const [, tag, raw] of content.matchAll(/<(h1|h2)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = decodeText(raw);
    const limit = tag.toLowerCase() === "h1" ? 16 : 14;
    if (chineseBudget(text) > limit) violations.push(`${file}: ${tag.toUpperCase()} exceeds Chinese copy budget (${chineseBudget(text)}/${limit}): ${text}`);
    if (text.endsWith("。")) violations.push(`${file}: ${tag.toUpperCase()} must not end with a Chinese full stop: ${text}`);
  }
}

for (const route of coreRoutes) {
  const file = join("dist", "en", route, "index.html");
  const content = await readFile(file, "utf8");
  const h1 = content.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1) continue;
  const text = decodeText(h1[1]);
  const words = text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0;
  if (words > 8) violations.push(`${file}: H1 exceeds English copy budget (${words}/8): ${text}`);
}

for (const route of coreRoutes) {
  const zhFile = join("dist", route, "index.html");
  const enFile = join("dist", "en", route, "index.html");
  const zhHtml = await readFile(zhFile, "utf8");
  const enHtml = await readFile(enFile, "utf8");
  const expectedEn = route ? `/en/${route}` : "/en/";
  const expectedZh = route ? `/${route}` : "/";
  if (!zhHtml.includes(`class="language-switch" href="${expectedEn}"`)) {
    violations.push(`${zhFile}: language switch does not preserve route semantics`);
  }
  if (!enHtml.includes(`class="language-switch" href="${expectedZh}"`)) {
    violations.push(`${enFile}: language switch does not preserve route semantics`);
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log(`Content check passed: ${sourceFiles.length} source files and ${htmlFiles.length} rendered pages.`);
