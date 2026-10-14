// Vendor Xiaomi's official unicode-range webfont shards without modifying them.
import { mkdir, writeFile } from "node:fs/promises";
const base = "public/assets/fonts/misans";
await mkdir(base, { recursive: true });
const source = "https://cdn-font.hyperos.mi.com/font/css?family=MiSans_VF:VF:Chinese_Simplify,Latin&display=swap";
const response = await fetch(source);
if (!response.ok) throw new Error(`MiSans stylesheet: ${response.status}`);
const css = await response.text();
const rules = [...css.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)];
let total = 0;
const localized = await Promise.all(rules.map(async ([, body], index) => {
  const remote = body.match(/url\("([^\"]+\.woff2)"\)/)?.[1];
  const range = body.match(/unicode-range:\s*([^;]+);/)?.[1];
  if (!remote || !range || !remote.startsWith("https://cdn-file.hyperos.mi.com/")) throw new Error("Unexpected official font shard");
  const res = await fetch(remote);
  if (!res.ok) throw new Error(`Font shard ${index}: ${res.status}`);
  const data = Buffer.from(await res.arrayBuffer());
  total += data.length;
  const name = `MiSans-${index}.woff2`;
  await writeFile(`${base}/${name}`, data);
  return `@font-face{font-family:"MiSans Local";font-style:normal;font-weight:100 900;font-display:swap;src:url("/assets/fonts/misans/${name}") format("woff2");unicode-range:${range};}`;
}));
await writeFile(`${base}/misans.css`, `/* MiSans official Xiaomi webfont subsets. Source: ${source} */\n${localized.join("\n")}\n`);
const license = await fetch("https://hyperos.mi.com/font-download/" + encodeURIComponent("MiSans字体知识产权许可协议.pdf"));
if (!license.ok) throw new Error(`MiSans license: ${license.status}`);
await writeFile(`${base}/LICENSE.pdf`, Buffer.from(await license.arrayBuffer()));
console.log(`Vendored ${rules.length} official MiSans shards, ${(total / 1024 / 1024).toFixed(2)} MiB. Browser loads only matching unicode ranges.`);
