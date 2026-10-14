import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
const args = process.argv.slice(2);
const output = "public/assets/brand";
await mkdir(output, { recursive: true });
for (let i = 0; i < args.length; i += 2) {
  const name = args[i].replace(/^--/, "");
  if (!["home", "nuwa", "ecosystem", "about"].includes(name) || !args[i + 1]) throw new Error("Pass --home, --nuwa, --ecosystem, --about and their original image paths.");
  const original = sharp(args[i + 1]);
  for (const [variant, width, height, maxBytes] of [["wide",1600,900,400*1024],["mobile",750,900,150*1024]]) {
    const pipeline = variant === "mobile" ? original.clone().extract({left:640,top:0,width:896,height:1024}) : original.clone();
    for (const format of ["avif", "webp"]) {
      const file = `${output}/v4-${name}-${variant}.${format}`;
      let quality = format === "avif" ? 58 : 76;
      let size;
      do {
        await pipeline.clone().resize(width,height,{fit:"cover",position:sharp.strategy.attention})[format]({quality,effort:format === "avif" ? 6 : 4}).toFile(file);
        size = (await stat(file)).size;
        quality -= 5;
      } while (size > maxBytes && quality >= 38);
      if (size > maxBytes) throw new Error(`${file} exceeds image budget`);
      console.log(`${file}: ${(size/1024).toFixed(1)} KiB`);
    }
  }
}
