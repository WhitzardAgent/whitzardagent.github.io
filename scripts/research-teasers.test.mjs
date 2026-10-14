import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
const records = JSON.parse(await readFile("src/data/researchTeasers.json", "utf8"));
const source = await readFile("src/data/generated/researchAssets.ts", "utf8");
test("curated research figures have unique paper identities and reproducible original sources", () => {
  assert.equal(new Set(records.map(record => record.researchSlug)).size, records.length);
  for (const record of records) {
    assert.ok(source.includes(JSON.stringify(record.researchSlug)), record.title);
    assert.match(record.sourcePdfUrl, /^https?:\/\//);
    assert.match(record.pdfSha256, /^[a-f0-9]{64}$/);
    assert.match(record.figureLabel, /^Figure \d+$/);
    assert.ok(Number.isInteger(record.page) && record.page > 0);
    assert.ok(record.captionOriginal && record.verifiedAt);
    const [x0, y0, x1, y1] = record.cropPdfPoints;
    assert.ok(x1 > x0 && y1 > y0);
    assert.ok(record.width > 0 && record.height > 0);
  }
});
test("every curated figure has bounded responsive image assets and the NUWA fallback exists", async () => {
  for (const record of records) {
    const full = await stat(`public${record.assetPath}`);
    const thumbnail = await stat(`public${record.thumbnailPath}`);
    assert.ok(full.size > 0 && full.size <= 250_000, record.assetPath);
    assert.ok(thumbnail.size > 0 && thumbnail.size <= 100_000, record.thumbnailPath);
  }
  assert.ok((await stat("public/assets/research/nuwa-brand-cover.webp")).size < 150_000);
  assert.ok((await stat("public/assets/research/nuwa-brand-cover-640.webp")).size < 80_000);
});
