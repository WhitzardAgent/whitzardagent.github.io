import { access, readFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { imageMetadata } from "astro/assets/utils";

const cache = new Map();
/** Resolve only local public assets. No remote fetching during rendering. */
export function researchFigureAsset(src) {
  if (!cache.has(src)) cache.set(src, resolveAsset(src));
  return cache.get(src);
}
async function resolveAsset(src) {
  if (!src.startsWith("/assets/") || src.includes("?") || src.includes("#")) throw new Error(`Research figure must use a local /assets/ path: ${src}`);
  const root = resolve("public");
  const path = resolve(root, `.${src}`);
  if (!path.startsWith(root + sep)) throw new Error(`Invalid research figure path: ${src}`);
  const metadata = await imageMetadata(await readFile(path), src);
  const base = src.slice(0, -extname(src).length);
  const candidates = [];
  for (const width of [640, 1280]) {
    const candidate = `${base}-${width}.webp`;
    if (width < metadata.width && await exists(resolve(root, `.${candidate}`))) candidates.push(`${candidate} ${width}w`);
  }
  candidates.push(`${src} ${metadata.width}w`);
  const original = `${base}-original.png`;
  return { ...metadata, srcset: candidates.join(", "), original: await exists(resolve(root, `.${original}`)) ? original : src };
}
async function exists(path) { try { await access(path); return true; } catch { return false; } }
