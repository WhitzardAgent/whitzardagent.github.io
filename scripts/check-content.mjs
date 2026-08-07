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
  "MirrorGuard: Toward Secure Computer-Use Agents via Simulation-to-Real Reasoning Correction",
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
const approvedExtendedHeadings = new Set([
  "细粒度管控行为链、思维链和数据链",
]);
const coreRoutes = ["", "agentguard", "solutions", "research", "open-ecosystem", "about", "contact"];
for (const route of coreRoutes) {
  const file = join("dist", route, "index.html");
  const content = await readFile(file, "utf8");
  for (const [, tag, raw] of content.matchAll(/<(h1|h2)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = decodeText(raw);
    const limit = tag.toLowerCase() === "h1" ? 16 : 14;
    if (!approvedExtendedHeadings.has(text) && chineseBudget(text) > limit) violations.push(`${file}: ${tag.toUpperCase()} exceeds Chinese copy budget (${chineseBudget(text)}/${limit}): ${text}`);
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
  const visibleText = decodeText(visibleHtml);
  if (/不是[^。！？]{0,80}而是|并非[^。！？]{0,80}而是/.test(visibleText)) violations.push(`${file}: prohibited 不是…而是 rhetorical construction`);
  if (/\bnot\s+(?:just|only|simply|merely)[^.!?]{0,120}\bbut\b/i.test(visibleText)) violations.push(`${file}: prohibited not…but rhetorical construction`);
}
for (const route of coreRoutes) {
  const file = join("dist", "en", route, "index.html");
  const visibleText = decodeText(withoutEmbeddedCode(await readFile(file, "utf8")));
  if (/\bnot\s+(?:just|only|simply|merely)[^.!?]{0,120}\bbut\b/i.test(visibleText)) violations.push(`${file}: prohibited not…but rhetorical construction`);
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
  "双向驱动，持续演进",
  "业务目标",
  "Agent 规划",
  "LLM 推理",
  "工具调用",
  "Observation",
  "Agent 再规划",
  "外部行动",
  "LLM Before / After",
  "Tool Before / After",
  "Memory Write",
  "Commit Boundary",
  "脱敏",
  "重新检查",
  "开放技术方向",
];
for (const marker of homeRequirements) if (!homeHtml.includes(marker)) violations.push(`dist/index.html: missing V3.11 homepage marker: ${marker}`);
for (const [file, content, removed] of [
  ["dist/index.html", homeHtml, [">风险成形前精准介入</h2>", ">覆盖智能体行动的完整上下文</h2>", ">补充智能体运行时上下文</h2>"]],
  ["dist/en/index.html", englishHomeHtml, [">Intervene before risk becomes impact</h2>", ">Cover the complete context of agent action</h2>", ">Add agent-aware runtime context</h2>"]],
]) {
  for (const marker of removed) if (content.includes(marker)) violations.push(`${file}: V3.7 removed homepage section must not remain: ${marker}`);
}
const homeOrder = ["在安全边界内释放自主智能价值", "智能体时代带来全新安全挑战", "双向驱动，持续演进", "开放技术方向"];
for (let index = 1; index < homeOrder.length; index += 1) {
  if (homeHtml.indexOf(homeOrder[index - 1]) >= homeHtml.indexOf(homeOrder[index])) violations.push(`dist/index.html: V3.7 homepage order is incorrect around ${homeOrder[index]}`);
}
const homeSource = await readFile("src/components/home/HomePage.astro", "utf8");
for (const component of ["AgentGuardRiskSimulator", "AgentGuardSystemMap", "UnifiedSecurityInfluenceEngine", "AgentGuardOperationsCenter"]) {
  if (homeSource.includes(component)) violations.push(`src/components/home/HomePage.astro: homepage must not import or render ${component}`);
}
if ((homeHtml.match(/class="boundary-flow__path-item"/g) ?? []).length !== 7) violations.push("dist/index.html: AgentGuard boundary flow must render exactly seven execution stages");
if ((homeHtml.match(/<small>AgentGuard 交互边界运行时<\/small>/g) ?? []).length !== 1) violations.push("dist/index.html: homepage must render one visible AgentGuard runtime title");
if (homeHtml.includes("autocontrol-arena-figure-2")) violations.push("dist/index.html: paper figures belong on the research page, not the homepage bridge");
for (const legacy of ["admin@example.com", "alice@example.com", "retrieve_doc", "send_email_to", "真实策略，真实处置"]) {
  if (homeHtml.includes(legacy)) violations.push(`dist/index.html: legacy homepage marker must not remain: ${legacy}`);
}
for (const productOnly of ["智能体安全运营中台", "细粒度管控行为链、思维链和数据链", "LangChain", "Microsoft AutoGen", "OpenAI Agents SDK", "LangGraph", "LlamaIndex", "Dify", "OpenClaw", "WhitzardOS", "WhitzardEval", "Thought-Aligner", "MATE", "/assets/agentguard/dashboard.png"]) {
  if (homeHtml.includes(productOnly)) violations.push(`dist/index.html: content with a dedicated destination must not be duplicated on the homepage: ${productOnly}`);
}

for (const [file, html] of [["dist/open-ecosystem/index.html", ecosystemHtml], ["dist/en/open-ecosystem/index.html", await readFile("dist/en/open-ecosystem/index.html", "utf8")]]) {
  for (const project of ["WhitzardOS", "WhitzardEval", "Thought-Aligner", "MATE"]) {
    const headingCount = (html.match(new RegExp(`<h3>${project.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</h3>`, "g")) ?? []).length;
    if (headingCount !== 1) violations.push(`${file}: core ecosystem capability ${project} must appear exactly once as a project heading, found ${headingCount}`);
  }
}

const publicImpactSource = await readFile("src/data/publicImpact.ts", "utf8");
for (const id of ["shanghai-consensus", "singapore-consensus", "gbt-45654"]) {
  if (!publicImpactSource.includes(`id: "${id}"`)) violations.push(`public impact: missing shared record ${id}`);
}
if ((publicImpactSource.match(/lastVerified: "2026-08-05"/g) ?? []).length !== 3) violations.push("public impact: all three records require the current verification date");
for (const marker of ["leadFact", "count: 32", "Geoffrey Hinton", "Yoshua Bengio", "姚期智 Andrew Yao"]) {
  if (!publicImpactSource.includes(marker)) violations.push(`public impact: missing verified signatory data ${marker}`);
}
for (const marker of ["public-impact-preview", "home-public-impact", "02 国际 AI 安全共识", "从前沿技术证据，到国内外共同规则"]) {
  if (homeHtml.includes(marker)) violations.push(`dist/index.html: public impact must remain on the research page: ${marker}`);
}
const publicImpactSection = researchHtml.match(/<section id="public-impact"[\s\S]*?<section id="recognition"/)?.[0] ?? "";
if ((publicImpactSection.match(/<article\b/g) ?? []).length !== 3) violations.push("dist/research/index.html: public impact must contain exactly three records");
for (const marker of [
  "研究与公共影响",
  "AI 安全上海共识",
  "AI 安全新加坡研究优先级共识",
  "GB/T 45654—2025",
  "由 100 余位全球贡献者形成，覆盖 13 个国家和 4 类研究优先级",
  "2025.04.25",
  "2025.11.01",
  "research-public-impact-source",
  "https://idais.ai/dialogue/idais-shanghai/",
  "https://aisafetypriorities.org/",
  "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=F67D3F376E0A0A0FF5317FB36B32A30A",
  "https://std.samr.gov.cn/gb/search/gbDetailed?id=33D40F1160BF5D92E06397BE0A0A5B93",
  "由 Geoffrey Hinton、Yoshua Bengio、姚期智等 32 位全球专家联署",
  "图灵奖 · 诺贝尔奖",
  "代表性联署专家",
]) {
  if (!publicImpactSection.includes(marker)) violations.push(`dist/research/index.html: public impact is missing ${marker}`);
}
const themesIndex = researchHtml.indexOf('id="themes"');
const impactIndex = researchHtml.indexOf('id="public-impact"');
const recognitionIndex = researchHtml.indexOf('id="recognition"');
const publicationsIndex = researchHtml.indexOf('id="research-index"');
if (themesIndex < 0 || impactIndex < themesIndex || recognitionIndex < impactIndex || publicationsIndex < recognitionIndex) violations.push("dist/research/index.html: expected themes → public impact → recognition → publication index");
if (researchHtml.includes('id="team"') || researchHtml.includes("research-team__grid")) violations.push("dist/research/index.html: complete team biographies belong only on the about page");
for (const forbidden of ["METR", "合作伙伴", "白泽参与", "女娲实验室参与", "参与签署", "参与形成", "参与起草"]) {
  if (publicImpactSection.includes(forbidden)) violations.push(`dist/research/index.html: public impact must not claim participation or partnership: ${forbidden}`);
}

const recognitionSection = researchHtml.match(/<section id="recognition"[\s\S]*?<section id="research-index"/)?.[0] ?? "";
const recognitionCount = recognitionSection.match(/<article\b/g)?.length ?? 0;
if (recognitionCount !== 6) violations.push(`dist/research/index.html: recognition must contain exactly six entries, found ${recognitionCount}`);
for (const forbidden of ["潘旭东", "戴嘉润", "洪赓", "Awarded to", "个人荣誉", "研究团队荣誉"]) if (recognitionSection.includes(forbidden)) violations.push(`dist/research/index.html: recognition must not expose attribution: ${forbidden}`);

for (const marker of [
  "/assets/research/self-replication-figure-1.png",
  "/assets/research/thought-aligner-figure-1.png",
  "Figure 1 · PDF p.3",
  "Figure 1 · PDF p.2",
  "MirrorGuard: Toward Secure Computer-Use Agents via Simulation-to-Real Reasoning Correction",
  "https://github.com/WhitzardAgent/MirrorGuard",
]) if (!researchHtml.includes(marker)) violations.push(`dist/research/index.html: missing verified research visual marker ${marker}`);
const infrastructureSection = researchHtml.match(/<section id="infrastructure"[\s\S]*?<section id="themes"/)?.[0] ?? "";
for (const marker of ["AgentCyberRange", "AutoControl Arena", "查看论文"]) if (!infrastructureSection.includes(marker)) violations.push(`dist/research/index.html: missing research infrastructure marker ${marker}`);
if (infrastructureSection.includes("CyberGym") || (infrastructureSection.match(/<article\b/g) ?? []).length !== 2) violations.push("dist/research/index.html: infrastructure must contain exactly AgentCyberRange and AutoControl Arena");
if ((researchHtml.match(/<details class="research-year"/g) ?? []).length !== 9) violations.push("dist/research/index.html: publication index must render nine native year groups");

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
  ["dist/agentguard/index.html", agentGuardZh, ["保护对象", "覆盖智能体行动的完整上下文", "全系统传播与追踪", "看见风险如何穿过智能体系统", "统一安全影响引擎", "细粒度管控行为链、思维链和数据链", "客户数据外发", "长期 Memory 写入", "Shell 与生产提交", "数据流", "授权流", "动作影响", "从策略配置到审计闭环", "执行模拟", "融入现有安全体系", "补充智能体运行时上下文", "IAM", "DLP", "API Gateway", "SIEM"]],
  ["dist/en/agentguard/index.html", agentGuardEn, ["Cover the complete context of agent action", "SYSTEM-WIDE PROPAGATION", "See risk move through the agent system", "UNIFIED SECURITY INFLUENCE ENGINE", "Control behavior, reasoning, and data chains", "Customer data egress", "Long-term memory write", "Shell and production commit", "Data flow", "Authorization flow", "Action effect", "From policy to audit.", "Run simulation", "WORKS WITH YOUR SECURITY STACK", "Add agent-aware runtime context", "IAM", "DLP", "API Gateway", "SIEM"]],
];
for (const [file, content, required] of agentGuardRequirements) {
  for (const marker of required) if (!content.includes(marker)) violations.push(`${file}: missing AgentGuard V3.6 marker: ${marker}`);
  for (const legacy of ["retrieve_doc", "send_email_to", "admin@example.com", "alice@example.com"]) {
    if (content.includes(legacy)) violations.push(`${file}: legacy two-node product demo must not remain: ${legacy}`);
  }
}
for (const file of ["dist/solutions/index.html", "dist/en/solutions/index.html"]) {
  const content = withoutEmbeddedCode(await readFile(file, "utf8"));
  for (const productDetail of ["LLM Before", "LLM After", "Tool Before", "Tool After", "DSL", "risk-simulator", "统一安全影响引擎", "UNIFIED SECURITY INFLUENCE ENGINE"]) {
    if (content.includes(productDetail)) violations.push(`${file}: use-cases page must not duplicate AgentGuard implementation detail: ${productDetail}`);
  }
}
const enterpriseScenarioSource = await readFile("src/data/agentguardEnterpriseScenarios.ts", "utf8");
for (const rule of ["chain-redact-pii-on-http-post", "chain-deny-llm-output-to-shell", "trace-deny-unfiltered-to-exec", "ex4-human-check"]) {
  if (!enterpriseScenarioSource.includes(rule)) violations.push(`AgentGuard V3.3 scenario data: missing verified Community rule: ${rule}`);
}
const storySource = await readFile("src/data/agentguardStory.ts", "utf8");
for (const marker of ["customer-egress", "memory-write", "production-commit", "REDACT", "RECHECK", "SWITCH_TO_SANDBOX", "REQUIRE_APPROVAL", "DIRECT", "SEMANTIC", "CONTEXTUAL", "DECLASSIFICATION"]) {
  if (!storySource.includes(marker)) violations.push(`AgentGuard V3.6 story model: missing ${marker}`);
}
for (const legacy of ["<div class=\"site-container platform-stack\"", "<section class=\"three-chain"]) {
  if (homeHtml.includes(legacy)) violations.push(`dist/index.html: legacy homepage product narrative must not remain: ${legacy}`);
}
for (const [file, destination] of [["dist/nuwa/index.html", "/research"], ["dist/en/nuwa/index.html", "/en/research"], ["dist/NVWA-Project/index.html", "/en/research"]]) {
  const content = await readFile(file, "utf8");
  if (!content.includes(`http-equiv="refresh" content="0;url=${destination}"`)) {
    violations.push(`${file}: legacy NUWA route must redirect to ${destination}`);
  }
}
const sitemapXml = await readFile("dist/sitemap-0.xml", "utf8");
for (const legacyUrl of ["https://whitzard.tech/nuwa/", "https://whitzard.tech/en/nuwa/", "https://whitzard.tech/NVWA-Project/"]) {
  if (sitemapXml.includes(`<loc>${legacyUrl}</loc>`)) violations.push(`dist/sitemap-0.xml: legacy redirect must not be indexed: ${legacyUrl}`);
}

// V3.11 page ownership: complete modules and proof assets have one canonical destination.
const ownershipPages = Object.fromEntries(await Promise.all(coreRoutes.map(async (route) => [route || "home", withoutEmbeddedCode(await readFile(join("dist", route, "index.html"), "utf8"))])));
for (const visual of ["/assets/research/self-replication-figure-1.png", "/assets/research/autocontrol-arena-figure-2.png", "/assets/research/thought-aligner-figure-1.png"]) {
  for (const [route, html] of Object.entries(ownershipPages)) if (route !== "research" && html.includes(visual)) violations.push(`dist/${route}/index.html: research figure ${visual} belongs only on the research page`);
}
for (const [route, html] of Object.entries(ownershipPages)) {
  if (route !== "agentguard" && html.includes("/assets/agentguard/dashboard.png")) violations.push(`dist/${route}/index.html: AgentGuard Dashboard belongs only on the product page`);
  if (route !== "about" && html.includes("team-advisor-link")) violations.push(`dist/${route}/index.html: complete academic biographies belong only on the about page`);
}
if (aboutHtml.includes("brand-architecture") || aboutHtml.includes("智能体运行时安全控制层")) violations.push("dist/about/index.html: product architecture belongs on the AgentGuard page");

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
