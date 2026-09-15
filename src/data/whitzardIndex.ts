/**
 * Whitzard Index data structures and types.
 *
 * The Whitzard Index is NUWA's long-term project for observing and
 * comparing frontier AI risk across models and systems.
 *
 * Formal index entries remain separate from published evaluation evidence.
 * Evidence records below preserve each source's own scope, method, and caveats;
 * they are not normalized into a composite score or cross-study ranking.
 *
 * Test data must only be used in development, testing, or clearly
 * isolated preview environments — never in production rankings,
 * search indexes, or external-facing screenshots presented as real data.
 */

export type IndexDirection = "higher-is-safer" | "lower-is-safer";

export type IndexDimension = {
  id: string;
  label: { zh: string; en: string };
  description: { zh: string; en: string };
  unit: string;
  direction: IndexDirection;
};

export type IndexEntry = {
  modelId: string;
  modelName: string;
  modelVersion: string;
  evaluationDate: string; // ISO 8601 date
  methodVersion: string;
  configuration: {
    framework?: string;
    toolPermissions?: string;
    budget?: string;
  };
  scores: Record<string, number | null>; // dimensionId → score; null = not evaluated
  source: string;
};

export type IndexVersion = {
  version: string;
  date: string;
  summary: { zh: string; en: string };
  methodChanges?: { zh: string; en: string };
};

export type LocalizedIndexText = { zh: string; en: string };

export type IndexEvidenceMetric = {
  label: LocalizedIndexText;
  value: number;
  unit: "%";
  comparator?: "exact" | "greater-than";
  subject: LocalizedIndexText;
  qualifier: LocalizedIndexText;
};

export type IndexEvidenceRecord = {
  id: "agentcyberrange" | "self-replication" | "open-deception";
  title: string;
  riskDimension: LocalizedIndexText;
  evaluationScope: LocalizedIndexText[];
  metrics: IndexEvidenceMetric[];
  publicationDate: string;
  sourceUrl: string;
  sourceLabel: string;
  lastVerified: string;
  visualType: "paired-bars" | "trial-rates" | "threshold-bands";
  conclusion: LocalizedIndexText;
  limitation: LocalizedIndexText;
};

/**
 * Published evidence shown in the observatory hero. These records retain the
 * language and boundary of their original sources and are not index entries.
 */
export const indexPublishedEvidence: IndexEvidenceRecord[] = [
  {
    id: "agentcyberrange",
    title: "AgentCyberRange",
    riskDimension: { zh: "自主网络攻防能力", en: "Autonomous cyber capability" },
    evaluationScope: [
      { zh: "110 个真实 Web 漏洞", en: "110 real-world web vulnerabilities" },
      { zh: "8 套企业网络环境", en: "8 enterprise network environments" },
      { zh: "156 台内部主机", en: "156 internal hosts" },
    ],
    metrics: [
      {
        label: { zh: "Web 漏洞利用成功率", en: "Web exploitation success" },
        value: 34.53,
        unit: "%",
        subject: { zh: "GPT-5.6 Sol + Codex (0.144.1)", en: "GPT-5.6 Sol + Codex (0.144.1)" },
        qualifier: { zh: "最新已核实组合", en: "Latest verified configuration" },
      },
      {
        label: { zh: "后渗透成功率", en: "Post-exploitation success" },
        value: 74.1,
        unit: "%",
        subject: { zh: "GPT-5.6 Sol + Codex (0.144.1)", en: "GPT-5.6 Sol + Codex (0.144.1)" },
        qualifier: { zh: "最新已核实组合", en: "Latest verified configuration" },
      },
    ],
    publicationDate: "2026-07-11",
    sourceUrl: "https://agentcyberrange.io/",
    sourceLabel: "AgentCyberRange",
    lastVerified: "2026-09-15",
    visualType: "paired-bars",
    conclusion: {
      zh: "同一智能体配置在 Web 漏洞利用与企业网络后渗透任务中呈现不同的能力水平。",
      en: "The same agent configuration shows materially different capability across web exploitation and enterprise post-exploitation tasks.",
    },
    limitation: {
      zh: "结果仅对应所列模型、Codex 版本、任务集合与提交日期，不代表一般网络攻击成功概率。",
      en: "Results apply only to the listed model, Codex version, task set, and submission date; they are not a general probability of cyberattack success.",
    },
  },
  {
    id: "self-replication",
    title: "Self-Replication",
    riskDimension: { zh: "自主复制能力", en: "Autonomous replication capability" },
    evaluationScope: [
      { zh: "两个受测开源权重系统", en: "2 evaluated open-weight systems" },
      { zh: "受控实验环境", en: "Controlled experimental setting" },
      { zh: "论文报告的试验成功率", en: "Trial success rates reported by the paper" },
    ],
    metrics: [
      {
        label: { zh: "报告成功率", en: "Reported success rate" },
        value: 50,
        unit: "%",
        subject: { zh: "Llama 3.1 70B Instruct", en: "Llama 3.1 70B Instruct" },
        qualifier: { zh: "论文报告的受控实验结果", en: "Paper-reported controlled experiment" },
      },
      {
        label: { zh: "报告成功率", en: "Reported success rate" },
        value: 90,
        unit: "%",
        subject: { zh: "Qwen 2.5 72B Instruct", en: "Qwen 2.5 72B Instruct" },
        qualifier: { zh: "论文报告的受控实验结果", en: "Paper-reported controlled experiment" },
      },
    ],
    publicationDate: "2024-12-09",
    sourceUrl: "https://arxiv.org/abs/2412.12140",
    sourceLabel: "arXiv:2412.12140",
    lastVerified: "2026-09-15",
    visualType: "trial-rates",
    conclusion: {
      zh: "论文报告两个受测系统在其受控任务设置中均完成了部分或多数自主复制试验。",
      en: "The paper reports that both evaluated systems completed some or most autonomous-replication trials in its controlled task setup.",
    },
    limitation: {
      zh: "这些比例是特定论文设置中的试验结果，不应外推为现实部署中的复制概率或总体风险水平。",
      en: "These rates are experimental outcomes under the paper's specific setup and must not be extrapolated to real-world replication probability or overall risk.",
    },
  },
  {
    id: "open-deception",
    title: "OpenDeception",
    riskDimension: { zh: "策略性欺骗行为", en: "Strategic deceptive behavior" },
    evaluationScope: [
      { zh: "50 个开放式情境", en: "50 open-ended scenarios" },
      { zh: "11 个主流大语言模型", en: "11 mainstream LLMs" },
      { zh: "开放式交互评测", en: "Open-ended interactive evaluation" },
    ],
    metrics: [
      {
        label: { zh: "欺骗意图比例", en: "Deceptive-intent ratio" },
        value: 80,
        unit: "%",
        comparator: "greater-than",
        subject: { zh: "论文总体报告", en: "Aggregate paper finding" },
        qualifier: { zh: "阈值结论", en: "Threshold finding" },
      },
      {
        label: { zh: "欺骗成功率", en: "Deception success rate" },
        value: 50,
        unit: "%",
        comparator: "greater-than",
        subject: { zh: "论文总体报告", en: "Aggregate paper finding" },
        qualifier: { zh: "阈值结论", en: "Threshold finding" },
      },
    ],
    publicationDate: "2025-04-18",
    sourceUrl: "https://arxiv.org/abs/2504.13707",
    sourceLabel: "arXiv:2504.13707",
    lastVerified: "2026-09-15",
    visualType: "threshold-bands",
    conclusion: {
      zh: "论文在开放式情境中观察到广泛的欺骗意图，并报告超过一半的欺骗尝试取得成功。",
      en: "The paper observes widespread deceptive intent in open-ended scenarios and reports that more than half of deception attempts succeeded.",
    },
    limitation: {
      zh: "该结果是跨模型、跨情境的论文级阈值描述，不构成单一模型排名，也不代表所有使用场景。",
      en: "This is a paper-level threshold statement across models and scenarios; it is neither a single-model ranking nor representative of every deployment context.",
    },
  },
];

/**
 * Proposed risk dimensions — subject to change.
 * These are NOT an approved evaluation method.
 */
export const whitzardIndexDimensions: IndexDimension[] = [];

/**
 * No evaluation entries exist yet.
 * When confirmed data is available, entries will be added here.
 */
export const whitzardIndexEntries: IndexEntry[] = [];

/**
 * No method version has been approved yet.
 */
export const whitzardIndexMethodVersion: string = "";

/**
 * No versions have been published yet.
 */
export const whitzardIndexVersions: IndexVersion[] = [];

/**
 * Runtime assertion: the public index must not contain fabricated data.
 */
if (whitzardIndexEntries.length > 0 && import.meta.env.PROD) {
  throw new Error("Whitzard Index entries must be confirmed before production deployment.");
}
