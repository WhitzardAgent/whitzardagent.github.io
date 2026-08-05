import type { Locale } from "../i18n/config";

export type LocalizedText = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type PublicImpactRecord = {
  id: "shanghai-consensus" | "singapore-consensus" | "gbt-45654";
  kind: "scientific-consensus" | "research-agenda" | "national-standard";
  year: number;
  location?: LocalizedText;
  title: LocalizedText;
  officialTitle?: LocalizedText;
  summary: LocalizedText;
  metrics: Array<{ value: string; label: LocalizedText }>;
  topics: LocalizedList;
  contextLabel?: LocalizedText;
  contextItems?: string[];
  sourceUrls: string[];
  lastVerified: string;
};

const text = (zh: string, en: string): LocalizedText => ({ zh, en });
const list = (zh: string[], en: string[]): LocalizedList => ({ zh, en });

export const publicImpactRecords: PublicImpactRecord[] = [
  {
    id: "shanghai-consensus",
    kind: "scientific-consensus",
    year: 2025,
    location: text("上海", "Shanghai"),
    title: text("AI 安全上海共识", "Shanghai AI Safety Consensus"),
    officialTitle: text(
      "确保高级人工智能系统的对齐与人类控制，以保障人类福祉共识声明",
      "Consensus Statement on Ensuring Alignment and Human Control of Advanced AI Systems to Safeguard Human Flourishing",
    ),
    summary: text(
      "围绕高级人工智能系统的对齐、人类控制、安全保障与可验证行为红线形成国际科学共识。",
      "An international scientific consensus on alignment, human control, safety assurance, and verifiable behavioural red lines for advanced AI.",
    ),
    metrics: [
      { value: "2025", label: text("发布年份", "Published") },
      { value: "Shanghai", label: text("共识地点", "Location") },
      { value: "03", label: text("核心议题", "Core themes") },
    ],
    topics: list(["对齐", "人类控制", "可验证行为红线"], ["Alignment", "Human control", "Verifiable red lines"]),
    contextLabel: text("国际签署者包括", "Global signatories include"),
    contextItems: ["Geoffrey Hinton", "Yoshua Bengio", "Stuart Russell", "Andrew Yao", "Sam Bowman", "Max Tegmark"],
    sourceUrls: ["https://idais.ai/dialogue/idais-shanghai/"],
    lastVerified: "2026-08-05",
  },
  {
    id: "singapore-consensus",
    kind: "research-agenda",
    year: 2026,
    location: text("新加坡", "Singapore"),
    title: text("AI 安全新加坡研究优先级共识", "Singapore Consensus on Global AI Safety Research Priorities"),
    officialTitle: text(
      "2026 AI 安全新加坡全球研究优先级共识",
      "The 2026 Singapore Consensus on Global AI Safety Research Priorities",
    ),
    summary: text(
      "汇聚前沿模型开发机构、政府安全研究机构、学术界与社会组织，共同定义紧迫的 AI 安全研究问题。",
      "A global agenda for urgent AI safety research shaped by contributors from frontier developers, government safety institutes, academia, and civil society.",
    ),
    metrics: [
      { value: "100+", label: text("全球贡献者", "Contributors") },
      { value: "13", label: text("覆盖国家", "Countries") },
      { value: "04", label: text("研究优先级", "Priority areas") },
    ],
    topics: list(["风险评估", "安全开发", "运行控制", "社会韧性"], ["Risk assessment", "Safe development", "Control", "Societal resilience"]),
    contextLabel: text("贡献者所在机构包括", "Contributor affiliations include"),
    contextItems: ["OpenAI", "Anthropic", "Google DeepMind", "Meta", "Microsoft", "UK AI Security Institute", "EU AI Office", "CAICT", "IMDA"],
    sourceUrls: ["https://aisafetypriorities.org/"],
    lastVerified: "2026-08-05",
  },
  {
    id: "gbt-45654",
    kind: "national-standard",
    year: 2025,
    location: text("中国", "China"),
    title: text("GB/T 45654—2025", "GB/T 45654—2025"),
    officialTitle: text(
      "网络安全技术 生成式人工智能服务安全基本要求",
      "Cybersecurity technology—Basic security requirements for generative artificial intelligence service",
    ),
    summary: text(
      "将训练数据、模型安全、服务安全措施与安全评估方法转化为生成式人工智能服务的国家级安全基线。",
      "A national baseline for training-data security, model security, service safeguards, and security assessment of generative AI services.",
    ),
    metrics: [
      { value: "现行", label: text("标准状态", "In force") },
      { value: "2025.04.25", label: text("发布日期", "Published") },
      { value: "2025.11.01", label: text("实施日期", "Effective") },
    ],
    topics: list(["训练数据", "模型安全", "安全措施", "安全评估"], ["Training data", "Model security", "Safeguards", "Security assessment"]),
    contextLabel: text("主要起草单位包括", "Drafting organisations include"),
    contextItems: ["复旦大学", "百度", "阿里云", "华为云", "科大讯飞", "DeepSeek", "面壁智能", "零一万物", "MiniMax"],
    sourceUrls: [
      "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=F67D3F376E0A0A0FF5317FB36B32A30A",
      "https://std.samr.gov.cn/gb/search/gbDetailed?id=33D40F1160BF5D92E06397BE0A0A5B93",
    ],
    lastVerified: "2026-08-05",
  },
];

export const publicImpactCopy = {
  zh: {
    section: { eyebrow: "研究与公共影响", title: "研究与公共影响", body: "关注与研究方向相关的国际共识、研究议程和国家安全标准", source: "官方来源" },
  },
  en: {
    section: { eyebrow: "RESEARCH & PUBLIC IMPACT", title: "Research and public impact", body: "International consensus, research agendas, and national security standards connected to our research themes.", source: "Official source" },
  },
} satisfies Record<Locale, unknown>;

if (publicImpactRecords.length !== 3) throw new Error("Public impact requires exactly three verified records");
for (const record of publicImpactRecords) {
  if (!record.title.zh || !record.title.en || !record.summary.zh || !record.summary.en) throw new Error(`${record.id} requires complete bilingual copy`);
  if (!record.sourceUrls.length || !record.lastVerified) throw new Error(`${record.id} requires sources and a verification date`);
}
