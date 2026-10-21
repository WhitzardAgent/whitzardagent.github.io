import test from "node:test";
import assert from "node:assert/strict";
import { parseResearchBlogFile, safeSlug, validateResearchReference } from "./lib/research-blog.mjs";

test("Research Blog frontmatter parses independently from the article body", () => {
  const result = parseResearchBlogFile("---\ntitle: Test\nlocale: en\n---\n\nBody", "test.md");
  assert.equal(result.data.locale, "en");
  assert.equal(result.body, "Body");
});

test("Research Blog slugs are URL safe and bounded", () => {
  assert.equal(safeSlug("  Evidence & Control  "), "evidence-control");
  assert.ok(safeSlug("a".repeat(100)).length <= 72);
});

test("research articles accept a real project or paper, rejecting unknown and ambiguous references", () => {
  const papers = new Set(["paper"]), projects = new Set(["agentcyberrange"]);
  assert.equal(validateResearchReference({ researchSlug: "paper" }, papers, projects), undefined);
  assert.equal(validateResearchReference({ infrastructureSlug: "agentcyberrange" }, papers, projects), undefined);
  assert.match(validateResearchReference({ infrastructureSlug: "missing" }, papers, projects), /unknown infrastructureSlug/);
  assert.match(validateResearchReference({ researchSlug: "paper", infrastructureSlug: "agentcyberrange" }, papers, projects), /exactly one/);
  assert.match(validateResearchReference({}, papers, projects), /exactly one/);
});
