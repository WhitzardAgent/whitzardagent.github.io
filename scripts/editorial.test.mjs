import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";

async function sourceModule(path) {
  const result = await build({ entryPoints: [path], bundle: true, write: false, platform: "node", format: "esm" });
  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}

test("the company team contains only the two confirmed founders without advisor presentation", async () => {
  const { team } = await sourceModule("src/data/team.ts");
  assert.deepEqual(team.map(member => member.name.zh), ["戴嘉润", "潘旭东"]);
  assert.deepEqual(team.map(member => member.role.en), ["CEO", "CTO"]);
  assert.ok(team.every(member => member.category === "founding" && !member.advisor));
  assert.doesNotMatch(JSON.stringify(team), /师从|杨珉|supervision|Strategic.*Partner/);
  assert.ok(team.every(member => member.links.length > 0 && member.bio.en && member.bio.zh));
});

test("approved bilingual editorial titles and primary actions remain consistent", async () => {
  const { nuwaOverviewCopy: nuwa } = await sourceModule("src/i18n/pages/nuwa.ts");
  const { homeCopy: home } = await sourceModule("src/i18n/pages/home.ts");
  const { modelsCopy: models } = await sourceModule("src/i18n/pages/models.ts");
  const { companyCopy: company } = await sourceModule("src/i18n/pages/company.ts");
  const { agentguardCopy: product } = await sourceModule("src/i18n/pages/agentguard.ts");
  assert.deepEqual([nuwa.zh.missionTitle, nuwa.en.missionTitle], ["核心问题", "Core questions"]);
  assert.deepEqual([home.zh.products.title, home.en.products.title], ["产品与服务", "Products & services"]);
  assert.deepEqual([models.zh.sourceTitle, models.en.sourceTitle], ["模型来源", "Model provenance"]);
  assert.deepEqual([company.zh.company.teamTitle, company.en.company.teamTitle], ["创始团队", "Founders"]);
  assert.deepEqual([product.zh.runtime.title, product.en.runtime.title], ["行动边界控制", "Action boundary control"]);
  assert.equal(home.zh.closing.primary, "加入心愿单");
  assert.equal(home.en.closing.primary, "Join the waitlist");
});

test("owner-confirmed impact and incubation copy do not become deployment claims", async () => {
  const { researchHighlights } = await sourceModule("src/data/researchHighlights.ts");
  const impact = researchHighlights.find(item => item.id === "agentcyberrange");
  assert.equal(impact.impact.zh, "100+ 家全球研究机构申请使用");
  assert.match(impact.impact.en, /Access requests from 100\+/);
  const { ui } = await sourceModule("src/i18n/ui.ts");
  assert.equal(ui.zh.footer.incubation, "由复旦大学系统软件与安全实验室孵化");
  assert.equal(ui.en.footer.incubation, "Incubated by Fudan University Security Lab");
});
