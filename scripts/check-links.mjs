import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = new URL("../dist/", import.meta.url).pathname;
const htmlFiles = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html")) htmlFiles.push(path);
  }
}
walk(root);
const routes = new Set(htmlFiles.map((file) => {
  const path = `/${relative(root, file).replace(/index\.html$/, "").replace(/\.html$/, "")}`.replace(/\/+/g, "/");
  return path === "/" ? "/" : path.replace(/\/$/, "");
}));
const failures = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/href=["']([^"'#?]+)["']/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    if (extname(href)) {
      try { statSync(join(root, href)); } catch { failures.push(`${relative(root, file)} -> ${href}`); }
      continue;
    }
    const route = href === "/" ? "/" : href.replace(/\/$/, "");
    if (!routes.has(route) && !route.endsWith(".xml")) failures.push(`${relative(root, file)} -> ${href}`);
  }
}
if (failures.length) {
  console.error(`Broken internal links (${failures.length}):\n${[...new Set(failures)].join("\n")}`);
  process.exit(1);
}
console.log(`Checked ${htmlFiles.length} HTML files: no broken internal links.`);
