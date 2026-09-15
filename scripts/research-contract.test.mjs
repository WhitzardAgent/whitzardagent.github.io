import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("research copy contains the locked bilingual mission", async () => {
  const sources = await Promise.all([
    readFile("src/i18n/pages/research.ts", "utf8"),
    readFile("src/i18n/pages/nuwa.ts", "utf8"),
  ]);
  const source = sources.join("\n");
  assert.match(source, /为全球 AI 治理提供风险证据与公共产品/);
  assert.match(source, /Shared Risk Evidence and Public Goods for the World/);
});

test("research programs expose exactly the three approved IDs", async () => {
  const source = await readFile("src/data/researchPrograms.ts", "utf8");
  assert.deepEqual([...source.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]), [
    "frontier-ai-risk-control",
    "agent-model-safety",
    "risk-evaluation-governance",
  ]);
});
