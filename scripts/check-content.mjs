import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

async function filesUnder(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

const forbiddenRenderedCopy = [
  "Public papers, reports, position papers, and technical notes preserved from the current research data pipeline.",
  "The current public team record is preserved from the repository.",
  "generated research records",
  "public ecosystem metadata",
  "从仓库自动生成的研究记录",
  "保留现有研究数据管线",
  "公开元数据",
  "以下公开团队记录来自当前仓库",
  "contact@whitzard.tech",
  "这个演示",
  "看见策略如何做出决定",
  "告诉我们智能体能够访问什么",
  "一次危险行动很少只有单一原因",
  "在能够公开验证的地方保持开放",
];

const forbiddenFontPatterns = [
  /Songti/i,
  /STSong/i,
  /Noto\s+Serif/i,
  /Source\s+Serif/i,
  /font-serif/i,
  /font-family\s*:[^;}]*(?:Georgia|\bserif\b)/i,
  /class(?:Name)?\s*=\s*["'][^"']*\bserif\b/i,
];

const violations = [];
const sourceFiles = (await filesUnder("src")).filter((file) => [".astro", ".css", ".ts", ".tsx"].includes(extname(file)));
for (const file of sourceFiles) {
  const content = await readFile(file, "utf8");
  for (const pattern of forbiddenFontPatterns) {
    if (pattern.test(content)) violations.push(`${file}: forbidden font pattern ${pattern}`);
  }
}

const htmlFiles = (await filesUnder("dist")).filter((file) => extname(file) === ".html");
for (const file of htmlFiles) {
  const content = await readFile(file, "utf8");
  for (const phrase of forbiddenRenderedCopy) {
    if (content.includes(phrase)) violations.push(`${file}: forbidden visitor-facing copy: ${phrase}`);
  }
}

const parseJsonl = async (file) => (await readFile(file, "utf8"))
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const ecosystemHtml = await readFile("dist/open-ecosystem/index.html", "utf8");
const visibleProjects = (await parseJsonl("public/assets/info/whitzardagent_open_assets_metadata.jsonl"))
  .filter((item) => String(item["Visible or hidden"]).toLowerCase() === "visible");
for (const project of visibleProjects) {
  const description = project["One-line description zh"];
  if (!description) violations.push(`open ecosystem: ${project.Name} has no Chinese description`);
  else if (!ecosystemHtml.includes(description)) violations.push(`dist/open-ecosystem/index.html: missing Chinese description for ${project.Name}`);
}

const researchHtml = await readFile("dist/research/index.html", "utf8");
const researchRecords = await parseJsonl("public/assets/info/ai_safety_research_assets_metadata.jsonl");
if (researchRecords.length !== 86) violations.push(`research: expected 86 deduplicated records, found ${researchRecords.length}`);
const normalizedResearchTitles = new Set();
const sourceMemberCounts = { "xudong-pan": 0, "jiarun-dai": 0, "geng-hong": 0 };
for (const record of researchRecords) {
  if (!Array.isArray(record.Authors) || record.Authors.length === 0) violations.push(`research: ${record.Title} has no authors`);
  if (!Number.isInteger(record.Year)) violations.push(`research: ${record.Title} has no valid year`);
  if (!record["One-line summary zh"]) violations.push(`research: ${record.Title} has no Chinese summary`);
  if (!record["Topic zh"]) violations.push(`research: ${record.Title} has no Chinese topic`);
  if (!record["Venue / Status"]) violations.push(`research: ${record.Title} has no venue or status`);
  if (!Array.isArray(record["Source URLs"]) || record["Source URLs"].length === 0) violations.push(`research: ${record.Title} has no source profile`);
  if (!Array.isArray(record["Member slugs"]) || record["Member slugs"].length === 0) violations.push(`research: ${record.Title} has no member attribution`);
  if (!record.URL) violations.push(`research: ${record.Title} has no original research link`);
  const normalizedTitle = String(record.Title).toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (normalizedResearchTitles.has(normalizedTitle)) violations.push(`research: duplicate normalized title ${record.Title}`);
  normalizedResearchTitles.add(normalizedTitle);
  if (record["ArXiv ID"] && !/^\d{4}\.\d{4,5}(?:v\d+)?$/i.test(record["ArXiv ID"])) violations.push(`research: malformed arXiv ID for ${record.Title}: ${record["ArXiv ID"]}`);
  for (const slug of record["Member slugs"] ?? []) if (slug in sourceMemberCounts) sourceMemberCounts[slug] += 1;
  if (record["Featured or not"] && !researchHtml.includes(record["One-line summary zh"])) {
    violations.push(`dist/research/index.html: missing Chinese summary for ${record.Title}`);
  }
}
for (const [slug, expected] of Object.entries({ "xudong-pan": 42, "jiarun-dai": 25, "geng-hong": 25 })) {
  if (sourceMemberCounts[slug] !== expected) violations.push(`research: expected ${expected} records for ${slug}, found ${sourceMemberCounts[slug]}`);
}
const expectedFeatured = [
  "Privacy Risks of General-Purpose Language Models",
  "Autonomy Comes with Costs: Detecting Denial-of-Service Vulnerabilities Caused by Resource Abusing in LLM-based Agents",
  "Large language model-powered AI systems achieve self-replication with no human intervention",
  "AutoControl Arena: Synthesizing Executable Test Environments for Frontier AI Risk Evaluation",
  "Think Twice Before You Act: Enhancing Agent Behavioral Safety with Thought Correction",
];
const actualFeatured = researchRecords.filter((record) => record["Featured rank"]).sort((a, b) => a["Featured rank"] - b["Featured rank"]).map((record) => record.Title);
if (JSON.stringify(actualFeatured) !== JSON.stringify(expectedFeatured)) violations.push(`research: featured order does not match V3.4 specification`);
const privacyRecord = researchRecords.find((record) => record.Title === expectedFeatured[0]);
if (privacyRecord?.Pages !== "1314–1331" || !researchHtml.includes("1314–1331")) violations.push("research: Privacy Risks page range must be 1314–1331");

const aboutHtml = await readFile("dist/about/index.html", "utf8");
for (const englishBioMarker of ["is the CEO of Whitzard", "is the CTO of Whitzard", "is an Assistant Professor at Fudan University"]) {
  if (aboutHtml.includes(englishBioMarker)) violations.push(`dist/about/index.html: English team biography leaked into Chinese page`);
}
for (const marker of ["打造AI智能体时代的安全基础设施", "团队愿景", "公共安全产品", "持续建设可验证、可复用的模型、工具、数据与评测基础设施"]) {
  if (!aboutHtml.includes(marker)) violations.push(`dist/about/index.html: missing V3.5 about marker: ${marker}`);
}
for (const legacy of ["构建智能体安全基础设施", "我们的工作原则", "有选择地开放", "复旦大学青年研究员"]) {
  if (aboutHtml.includes(legacy)) violations.push(`dist/about/index.html: legacy company copy must not remain: ${legacy}`);
}
if ((aboutHtml.match(/复旦大学副研究员/g) ?? []).length !== 2) violations.push("dist/about/index.html: Dai and Pan must both be 复旦大学副研究员");
if ((aboutHtml.match(/复旦大学助理研究员/g) ?? []).length !== 1) violations.push("dist/about/index.html: Hong must be 复旦大学助理研究员");
if ((aboutHtml.match(/师从<a class="team-advisor-link" href="https:\/\/min-yang-fudan\.github\.io\/"/g) ?? []).length !== 3) violations.push("dist/about/index.html: all three biographies must link Prof. Min Yang inline");
if (/<h3>杨珉教授<\/h3>/.test(aboutHtml)) violations.push("dist/about/index.html: Prof. Min Yang must not appear as a team member");

const decodeText = (value) => value
  .replace(/<[^>]*>/g, " ")
  .replace(/&[a-z#0-9]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();
const chineseBudget = (value) => {
  const cjk = value.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const technicalTerms = value.match(/[A-Za-z0-9][A-Za-z0-9 .&×-]*/g)?.length ?? 0;
  return cjk + technicalTerms;
};
const coreRoutes = ["", "agentguard", "solutions", "nuwa", "research", "open-ecosystem", "about", "contact"];
for (const route of coreRoutes) {
  const file = join("dist", route, "index.html");
  const content = await readFile(file, "utf8");
  for (const [, tag, raw] of content.matchAll(/<(h1|h2)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = decodeText(raw);
    const limit = tag.toLowerCase() === "h1" ? 16 : 14;
    if (chineseBudget(text) > limit) violations.push(`${file}: ${tag.toUpperCase()} exceeds Chinese copy budget (${chineseBudget(text)}/${limit}): ${text}`);
    if (text.endsWith("。")) violations.push(`${file}: ${tag.toUpperCase()} must not end with a Chinese full stop: ${text}`);
  }
}

const withoutEmbeddedCode = (html) => html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
for (const route of coreRoutes) {
  const file = join("dist", route, "index.html");
  const visibleHtml = withoutEmbeddedCode(await readFile(file, "utf8"));
  for (const label of ["NUWA Lab", "NUWA LAB", "NUWA 研究"]) {
    if (visibleHtml.includes(label)) violations.push(`${file}: Chinese visitor-facing copy must use 女娲实验室 instead of ${label}`);
  }
}

const homeHtml = withoutEmbeddedCode(await readFile("dist/index.html", "utf8"));
const navHtml = homeHtml.match(/<nav class="site-nav"[\s\S]*?<\/nav>/i)?.[0] ?? "";
if (!navHtml.includes("应用场景") || navHtml.includes(">解决方案<")) violations.push("dist/index.html: Chinese navigation must label /solutions as 应用场景");
const englishHomeHtml = withoutEmbeddedCode(await readFile("dist/en/index.html", "utf8"));
const englishNavHtml = englishHomeHtml.match(/<nav class="site-nav"[\s\S]*?<\/nav>/i)?.[0] ?? "";
if (!englishNavHtml.includes("Use Cases") || englishNavHtml.includes(">Solutions<")) violations.push("dist/en/index.html: English navigation must label /solutions as Use Cases");

const homeRequirements = [
  "在安全边界内释放自主智能价值",
  "智能体时代带来全新安全挑战",
  "智能体安全运营中台",
  "AgentGuard 智能体安全引擎",
  "低侵入适配各类主流智能体架构",
  "研究驱动产品持续演进",
  "白泽开放生态",
  "AgentGuard Interaction Boundary Runtime",
  "AgentGuard 正在追踪",
  "边界冲突",
  "AgentGuard 处置",
  "业务结果",
  "数据",
  "授权",
  "动作影响",
];
for (const marker of homeRequirements) if (!homeHtml.includes(marker)) violations.push(`dist/index.html: missing V3.4 homepage marker: ${marker}`);
for (const legacy of ["admin@example.com", "alice@example.com", "retrieve_doc", "send_email_to", "真实策略，真实处置"]) {
  if (homeHtml.includes(legacy)) violations.push(`dist/index.html: legacy homepage marker must not remain: ${legacy}`);
}
for (const framework of ["LangChain", "Microsoft AutoGen", "OpenAI Agents SDK", "LangGraph", "LlamaIndex", "Dify", "OpenClaw"]) {
  if (!homeHtml.includes(framework)) violations.push(`dist/index.html: missing supported framework: ${framework}`);
}
const homeEcosystem = homeHtml.match(/<section class="ecosystem-preview[\s\S]*?<section class="final-cta/)?.[0] ?? "";
const homeEcosystemCards = homeEcosystem.match(/<article\b/g)?.length ?? 0;
if (homeEcosystemCards !== 4) violations.push(`dist/index.html: homepage must show exactly four ecosystem capabilities, found ${homeEcosystemCards}`);
for (const project of ["WhitzardOS", "WhitzardEval", "Thought-Aligner", "MATE"]) if (!homeEcosystem.includes(project)) violations.push(`dist/index.html: missing core ecosystem capability ${project}`);

for (const [file, html] of [["dist/open-ecosystem/index.html", ecosystemHtml], ["dist/en/open-ecosystem/index.html", await readFile("dist/en/open-ecosystem/index.html", "utf8")]]) {
  for (const project of ["WhitzardOS", "WhitzardEval", "Thought-Aligner", "MATE"]) if (!html.includes(project)) violations.push(`${file}: missing core ecosystem capability ${project}`);
}

const recognitionSection = researchHtml.match(/<section id="recognition"[\s\S]*?<section class="section research-team/)?.[0] ?? "";
const recognitionCount = recognitionSection.match(/<article\b/g)?.length ?? 0;
if (recognitionCount !== 6) violations.push(`dist/research/index.html: recognition must contain exactly six entries, found ${recognitionCount}`);
for (const forbidden of ["潘旭东", "戴嘉润", "洪赓", "Awarded to", "个人荣誉", "研究团队荣誉"]) if (recognitionSection.includes(forbidden)) violations.push(`dist/research/index.html: recognition must not expose attribution: ${forbidden}`);

for (const file of htmlFiles) {
  const content = withoutEmbeddedCode(await readFile(file, "utf8"));
  for (const match of content.matchAll(/<a\b[^>]*href="https:\/\/github\.com\/WhitzardAgent\/AgentGuard"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const label = decodeText(match[1]);
    const marker = file.includes("/en/") ? /Community/i : /社区版/;
    if (!marker.test(label)) violations.push(`${file}: AgentGuard GitHub link must be labelled as the ${file.includes("/en/") ? "Community Edition" : "社区版"}: ${label}`);
  }
}

const agentGuardZh = withoutEmbeddedCode(await readFile("dist/agentguard/index.html", "utf8"));
const agentGuardEn = withoutEmbeddedCode(await readFile("dist/en/agentguard/index.html", "utf8"));
for (const [file, content] of [["dist/agentguard/index.html", agentGuardZh], ["dist/en/agentguard/index.html", agentGuardEn]]) {
  if (!content.includes("AgentGuard Community") || !content.includes("AgentGuard Enterprise")) violations.push(`${file}: both AgentGuard editions must be present`);
}

const agentGuardRequirements = [
  ["dist/agentguard/index.html", agentGuardZh, ["AGENTGUARD 交互边界运行时", "客户续约分析", "生产事故响应", "供应商付款核验", "AgentGuard 正在追踪", "数据", "授权", "动作影响", "边界冲突", "公开规则", "企业策略示例", "从策略配置到审计闭环", "执行模拟"]],
  ["dist/en/agentguard/index.html", agentGuardEn, ["AGENTGUARD INTERACTION BOUNDARY RUNTIME", "How AgentGuard protects action boundaries", "Renewal analysis", "Production incident", "Vendor payment", "AgentGuard is tracking", "Data", "Authorization", "Effect", "Boundary conflict", "Community rule", "Enterprise policy example", "From policy to audit.", "Run simulation"]],
];
for (const [file, content, required] of agentGuardRequirements) {
  for (const marker of required) if (!content.includes(marker)) violations.push(`${file}: missing AgentGuard V3.3 marker: ${marker}`);
  for (const legacy of ["retrieve_doc", "send_email_to", "admin@example.com", "alice@example.com"]) {
    if (content.includes(legacy)) violations.push(`${file}: legacy two-node product demo must not remain: ${legacy}`);
  }
}
const enterpriseScenarioSource = await readFile("src/data/agentguardEnterpriseScenarios.ts", "utf8");
for (const rule of ["chain-redact-pii-on-http-post", "chain-deny-llm-output-to-shell", "trace-deny-unfiltered-to-exec", "ex4-human-check"]) {
  if (!enterpriseScenarioSource.includes(rule)) violations.push(`AgentGuard V3.3 scenario data: missing verified Community rule: ${rule}`);
}
const nuwaZh = withoutEmbeddedCode(await readFile("dist/nuwa/index.html", "utf8"));
const nuwaEn = withoutEmbeddedCode(await readFile("dist/en/nuwa/index.html", "utf8"));
if (!nuwaZh.includes("实验室愿景") || !nuwaZh.includes("为全球AI治理分享风险实证与公共产品")) violations.push("dist/nuwa/index.html: missing confirmed lab vision");
if (!nuwaEn.includes("LAB VISION") || !nuwaEn.includes("Shared Risk Evidence and Public Goods for the World")) violations.push("dist/en/nuwa/index.html: missing confirmed lab vision");

for (const route of coreRoutes) {
  const file = join("dist", "en", route, "index.html");
  const content = await readFile(file, "utf8");
  const h1 = content.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1) continue;
  const text = decodeText(h1[1]);
  const words = text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0;
  if (words > 8) violations.push(`${file}: H1 exceeds English copy budget (${words}/8): ${text}`);
}

for (const route of coreRoutes) {
  const zhFile = join("dist", route, "index.html");
  const enFile = join("dist", "en", route, "index.html");
  const zhHtml = await readFile(zhFile, "utf8");
  const enHtml = await readFile(enFile, "utf8");
  const expectedEn = route ? `/en/${route}` : "/en/";
  const expectedZh = route ? `/${route}` : "/";
  if (!zhHtml.includes(`class="language-switch" href="${expectedEn}"`)) {
    violations.push(`${zhFile}: language switch does not preserve route semantics`);
  }
  if (!enHtml.includes(`class="language-switch" href="${expectedZh}"`)) {
    violations.push(`${enFile}: language switch does not preserve route semantics`);
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log(`Content check passed: ${sourceFiles.length} source files and ${htmlFiles.length} rendered pages.`);
