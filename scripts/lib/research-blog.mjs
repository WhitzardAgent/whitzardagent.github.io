import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import YAML from "yaml";
import { build } from "esbuild";

export const researchBlogRoot = join("src", "content", "research-blog");

export async function loadResearchAssets() {
  const result = await build({
    entryPoints: ["src/data/generated/researchAssets.ts"],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
  });
  const source = result.outputFiles[0]?.text;
  if (!source) throw new Error("Unable to load generated research assets");
  return (await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`)).researchAssets;
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
