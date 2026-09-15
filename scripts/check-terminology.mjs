import { pathToFileURL } from "node:url";
import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { loadTerminology } from "./lib/load-terminology.mjs";

const sourceExtensions = new Set([".astro", ".ts", ".tsx", ".md", ".mdx"]);
const skippedPathSegments = [
  `${sep}data${sep}generated${sep}`,
  `${sep}pages${sep}NVWA-Project${sep}`,
  `${sep}public${sep}zh${sep}`,
];

async function filesUnder(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

function shouldSkip(file) {
  const normalized = `${sep}${file.split(/[\\/]/).join(sep)}`;
  return file.endsWith("src/data/terminology.ts")
    || file.endsWith("src\\data\\terminology.ts")
    || skippedPathSegments.some((segment) => normalized.includes(segment));
}

export function findTerminologyViolations(files, entries) {
  const deprecated = entries.flatMap((entry) =>
    (entry.deprecated ?? []).map((match) => ({
      entry,
      match,
      replacement: /[\u3400-\u9fff]/.test(match) ? entry.zh : entry.en,
    })),
  );

  return files
    .filter(({ file }) => !shouldSkip(file))
    .flatMap(({ file, text }) => deprecated.flatMap(({ entry, match, replacement }) => {
      if (!text.includes(match)) return [];
      return [{ file, termId: entry.id, match, replacement }];
    }));
}

async function main() {
  const { terminology } = await loadTerminology();
  const paths = (await filesUnder("src")).filter((file) => sourceExtensions.has(extname(file)));
  const files = await Promise.all(paths.map(async (file) => ({
    file: relative(process.cwd(), file),
    text: await readFile(file, "utf8"),
  })));
  const violations = findTerminologyViolations(files, terminology);

  if (violations.length > 0) {
    for (const item of violations) {
      console.error(`${item.file}: deprecated "${item.match}"; use ${item.replacement}`);
    }
    process.exitCode = 1;
    return;
  }
  console.log(`Terminology check passed: ${files.length} source files.`);
}

const invokedAsScript = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (invokedAsScript) await main();
