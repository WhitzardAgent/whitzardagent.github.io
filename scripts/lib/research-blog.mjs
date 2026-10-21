import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import YAML from "yaml";
import { build } from "esbuild";

export const researchBlogRoot = join("src", "content", "research-blog");

async function loadData(file, exportName) {
  const result = await build({
    entryPoints: [file],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
  });
  const source = result.outputFiles[0]?.text;
  if (!source) throw new Error("Unable to load generated research assets");
  return (await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`))[exportName];
}
export const loadResearchAssets = () => loadData("src/data/generated/researchAssets.ts", "researchAssets");
export const loadResearchInfrastructure = () => loadData("src/data/generated/researchInfrastructure.ts", "researchInfrastructure");
export const loadResearchHighlights = () => loadData("src/data/researchHighlights.ts", "researchHighlights");
export const loadResearchMedia = () => loadData("src/data/researchMedia.ts", "selfReplicationMedia");

export function validateResearchReference(data, researchSlugs, infrastructureSlugs) {
  if (Boolean(data.researchSlug) === Boolean(data.infrastructureSlug)) return "reference exactly one researchSlug or infrastructureSlug";
  if (data.researchSlug && !researchSlugs.has(data.researchSlug)) return `unknown researchSlug ${data.researchSlug}`;
  if (data.infrastructureSlug && !infrastructureSlugs.has(data.infrastructureSlug)) return `unknown infrastructureSlug ${data.infrastructureSlug}`;
  return undefined;
}

export function parseResearchBlogFile(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);
  const data = YAML.parse(match[1]);
  return { data, body: source.slice(match[0].length).trim() };
}

export async function readResearchBlogFiles() {
  const names = await readdir(researchBlogRoot).catch(() => []);
  return Promise.all(names.filter((name) => [".md", ".mdx"].includes(extname(name))).map(async (name) => {
    const file = join(researchBlogRoot, name);
    return { file, ...(parseResearchBlogFile(await readFile(file, "utf8"), file)) };
  }));
}

export function safeSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72);
}
