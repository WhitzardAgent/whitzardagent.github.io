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

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log(`Content check passed: ${sourceFiles.length} source files and ${htmlFiles.length} rendered pages.`);
