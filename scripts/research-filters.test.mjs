import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { transform } from "esbuild";
const { code } = await transform(await readFile("src/lib/researchFilters.ts", "utf8"), { loader: "ts", format: "esm" });
const { matchesResearch, matchesResearchBlog, readResearchFilters, writeResearchFilterParams, tagsForResearch, buildResearchTags } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
const paper = {
  title: "OpenDeception", authors: ["Researcher"], venue: "ICML", year: 2026,
  category: "frontier-risk-control", memberSlugs: ["xudong-pan"],
  summary: { en: "Deception and trust", zh: "欺骗与信任" },
  topics: { en: ["AI deception", "human-AI interaction"], zh: ["AI 欺骗", "人机交互"] },
};
const filters = { q: "", topic: "", year: "", member: "", tags: [] };
test("tag selection excludes nonmatching papers rather than behaving as a text query", () => {
  assert.equal(matchesResearch(paper, { ...filters, tags: ["self-replication"] }, "zh"), false);
  assert.equal(matchesResearch(paper, { ...filters, tags: ["ai-deception"] }, "zh"), true);
});
test("blog cards share tag/search/year filters and use their real companion for member/theme filtering", () => {
  const blog = { id: "example", title: "OpenDeception explained", summary: "An editorial interpretation", year: 2026, date: "2026-10-14", authors: ["Researcher"], tags: [{ id: "ai-deception", en: "AI deception", zh: "AI 欺骗" }], url: "/nuwa/blog/example", source: "NUWA", external: false, researchSlug: "opendeception" };
  assert.equal(matchesResearchBlog(blog, { ...filters, kind: "blogs", tags: ["ai-deception"], q: "OpenDeception", year: "2026", member: "xudong-pan", topic: "frontier-risk-control" }, "en", paper), true);
  assert.equal(matchesResearchBlog(blog, { ...filters, kind: "publication" }, "en", paper), false);
  assert.equal(matchesResearchBlog(blog, { ...filters, year: "2025" }, "en", paper), false);
  assert.equal(matchesResearchBlog(blog, { ...filters, member: "xudong-pan" }, "en"), false);
  assert.equal(matchesResearchBlog(blog, { ...filters, tags: ["self-replication"] }, "en", paper), false);
});
test("blog tag counts count a record once even when an editor repeats a badge", () => {
  const tag = { id: "ai-deception", en: "AI deception", zh: "AI 欺骗" };
  assert.equal(buildResearchTags([paper], [{ tags: [tag, tag] }]).find(item => item.id === tag.id).count, 2);
});
test("selected tags use OR internally, AND with search, theme, year and member", () => {
  assert.equal(matchesResearch(paper, { ...filters, tags: ["self-replication", "ai-deception"], q: "OpenDeception", year: "2026", topic: "frontier-risk-control", member: "xudong-pan" }, "en"), true);
  assert.equal(matchesResearch(paper, { ...filters, tags: ["ai-deception"], year: "2025" }, "en"), false);
  assert.equal(matchesResearch(paper, { ...filters, tags: ["ai-deception"], q: "MirrorGuard" }, "en"), false);
});
test("badges have stable bilingual IDs, deduplicate case variants and count papers once", () => {
  const duplicate = { ...paper, topics: { en: ["AI Deception", "AI deception"], zh: ["AI 欺骗", "AI 欺骗"] } };
  assert.deepEqual(tagsForResearch(duplicate).map(tag => tag.id), ["ai-deception"]);
  assert.deepEqual(buildResearchTags([paper, duplicate]).find(tag => tag.id === "ai-deception"), { id: "ai-deception", en: "AI deception", zh: "AI 欺骗", count: 2 });
});
test("shareable URL round trip preserves repeated tags and unrelated parameters", () => {
  const parsed = readResearchFilters("?tag=ai-deception&tag=ai-deception&tag=self-replication&q=trust&year=2026&utm_source=paper");
  assert.deepEqual(parsed, { ...filters, q: "trust", year: "2026", tags: ["ai-deception", "self-replication"] });
  assert.equal(writeResearchFilterParams("?utm_source=paper&tag=old", parsed), "utm_source=paper&q=trust&year=2026&tag=ai-deception&tag=self-replication");
  assert.equal(writeResearchFilterParams("?utm_source=paper&tag=old&q=trust", filters), "utm_source=paper");
});
test("Publication includes accepted preprints, not unpublished reports", () => {
  const accepted = { ...paper, publicationType: "preprint", venue: "ICML 2026 accepted; arXiv preprint" };
  const pending = { ...paper, publicationType: "preprint", venue: "arXiv preprint" };
  assert.equal(matchesResearch(accepted, { ...filters, kind: "publication" }, "en"), true);
  assert.equal(matchesResearch(pending, { ...filters, kind: "publication" }, "en"), false);
  assert.equal(matchesResearch(accepted, { ...filters, kind: "technical-report" }, "en"), false);
  assert.equal(matchesResearch(pending, { ...filters, kind: "technical-report" }, "en"), true);
  assert.equal(matchesResearch({ ...paper, publicationType: "report" }, { ...filters, kind: "publication" }, "en"), false);
  assert.equal(matchesResearch(paper, { ...filters, kind: "blogs" }, "en"), false);
});
test("Research category URLs round trip and unknown categories fall back to all", () => {
  assert.equal(readResearchFilters("?kind=blogs&tag=ai-deception").kind, "blogs");
  assert.equal(readResearchFilters("?kind=unknown").kind, "");
  assert.equal(writeResearchFilterParams("?utm_source=research", { ...filters, kind: "technical-report" }), "utm_source=research&kind=technical-report");
});
test("a preprint with a documented conference venue belongs to Publication; pending acceptance does not", () => {
  assert.equal(matchesResearch({ ...paper, publicationType: "preprint", venue: "ICLR 2026; arXiv preprint" }, { ...filters, kind: "publication" }, "en"), true);
  assert.equal(matchesResearch({ ...paper, publicationType: "preprint", venue: "WWW 2025; arXiv preprint" }, { ...filters, kind: "publication" }, "en"), true);
  assert.equal(matchesResearch({ ...paper, publicationType: "preprint", venue: "2024 IEEE Symposium on Security and Privacy (S&P)" }, { ...filters, kind: "publication" }, "en"), true);
  assert.equal(matchesResearch({ ...paper, publicationType: "preprint", venue: "28th SIGKDD, P1327–1336, 2022" }, { ...filters, kind: "publication" }, "en"), true);
  assert.equal(matchesResearch({ ...paper, publicationType: "preprint", venue: "ICML 2026 not yet accepted" }, { ...filters, kind: "technical-report" }, "en"), true);
});
