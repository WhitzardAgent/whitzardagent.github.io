import type { APIRoute } from "astro";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const assetDirectory = resolve("src/assets/loc-report");
const contentTypes: Record<string, string> = { svg: "image/svg+xml", webp: "image/webp", png: "image/png" };

export async function getStaticPaths() {
  const files = await readdir(assetDirectory);
  return files.filter(file => contentTypes[file.split(".").pop() ?? ""]).map(file => ({ params: { file } }));
}

export const GET: APIRoute = async ({ params }) => {
  const file = params.file!;
  const bytes = await readFile(resolve(assetDirectory, file));
  return new Response(new Uint8Array(bytes), { headers: { "Content-Type": contentTypes[file.split(".").pop()!] } });
};
