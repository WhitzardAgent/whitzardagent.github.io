import test from "node:test";
import assert from "node:assert/strict";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import rehypeResearchFigures from "../src/lib/rehypeResearchFigures.mjs";
import { researchFigureAsset } from "../src/lib/researchFigureAssets.mjs";

const processor = await createMarkdownProcessor({ rehypePlugins: [rehypeResearchFigures], syntaxHighlight: false });
const src = "/assets/research/agentcyberrange/results-comparison.webp";
const fileURL = new URL("../src/content/research-blog/agentcyberrange.zh.md", import.meta.url);

test("captioned Markdown produces a full figure with intrinsic dimensions and original-image access", async () => {
  const result = await processor.render(`![结果图](${src} "图 1：结果与范围")`, { fileURL });
  assert.match(result.code, /<figure class="rb-figure">/);
  assert.match(result.code, /width="2372" height="972"/);
  assert.match(result.code, /loading="lazy"/);
  assert.match(result.code, /results-comparison-640.webp 640w/);
  assert.match(result.code, /results-comparison-original.png/);
  assert.match(result.code, /<figcaption><span>图 1：结果与范围<\/span>/);
  assert.match(result.code, /查看原图/);
});

test("the figure adapter keeps captions escaped and does not alter inline or unrelated images", async () => {
  const escaped = await processor.render(`![Results](${src} "<script>alert(1)</script>")`, { fileURL });
  assert.doesNotMatch(escaped.code, /<script>/);
  assert.match(escaped.code, /&#x3C;script>|&lt;script&gt;/);
  const inline = await processor.render(`Text ![Results](${src} "Caption") more text`, { fileURL });
  assert.doesNotMatch(inline.code, /<figure/);
  const outside = await processor.render(`![Results](${src} "Caption")`, { fileURL: new URL("../src/content/posts/example.md", import.meta.url) });
  assert.doesNotMatch(outside.code, /<figure/);
});

test("article headings retain unique stable anchors for repeated titles and nested sections", async () => {
  const result = await processor.render("## Evidence\n\n### Method\n\n## Evidence\n\n## 研究与证据", { fileURL });
  const headings = result.metadata.headings;
  assert.deepEqual(headings.map(item => item.depth), [2, 3, 2, 2]);
  assert.equal(new Set(headings.map(item => item.slug)).size, 4);
  assert.equal(headings[0].slug, "evidence");
  assert.equal(headings[2].slug, "evidence-1");
});

test("figure assets reject remote fetching and paths outside the public asset directory", async () => {
  await assert.rejects(researchFigureAsset("https://example.com/image.png"), /local/);
  await assert.rejects(researchFigureAsset("/assets/../../package.json"), /Invalid/);
});

test("writing-template examples stay code without resolving placeholder image paths", async () => {
  const result = await processor.render('```markdown\n![Description](/assets/research/your-study/results.webp "Figure caption")\n```', { fileURL });
  assert.doesNotMatch(result.code, /<figure/);
  assert.match(result.code, /<code/);
});
