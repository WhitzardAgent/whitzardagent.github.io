import test from "node:test";
import assert from "node:assert/strict";
import { parseResearchBlogFile, safeSlug } from "./lib/research-blog.mjs";

test("Research Blog frontmatter parses independently from the article body", () => {
  const result = parseResearchBlogFile("---\ntitle: Test\nlocale: en\n---\n\nBody", "test.md");
  assert.equal(result.data.locale, "en");
  assert.equal(result.body, "Body");
});

test("Research Blog slugs are URL safe and bounded", () => {
  assert.equal(safeSlug("  Evidence & Control  "), "evidence-control");
  assert.ok(safeSlug("a".repeat(100)).length <= 72);
});
