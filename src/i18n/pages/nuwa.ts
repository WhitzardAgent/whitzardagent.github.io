import type { Locale } from "../config";

export type NuwaOverviewCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  statementEyebrow: string;
  statement: string;
  missionEyebrow: string;
  missionTitle: string;
  missionBody: string;
  roles: Array<{ title: string; body: string }>;
  researchEyebrow: string;
  researchTitle: string;
  researchLead: string;
  researchCta: string;
  indexEyebrow: string;
  indexTitle: string;
  indexBody: string;
  indexCta: string;
  infraEyebrow: string;
  infraTitle: string;
  infraLead: string;
  infraSource: string;
  allResearchEyebrow: string;
  allResearchTitle: string;
  allResearchBody: string;
  allResearchCta: string;
  collaborationTitle: string;
  collaborationBody: string;
  collaborationCta: string;
  teamCta: string;
};

export const nuwaOverviewCopy: Record<Locale, NuwaOverviewCopy> = {
  en: {
    meta: {
      title: "NUWA Frontier AI Safety Lab — Whitzard",
      description: "NUWA Frontier AI Safety Lab studies frontier AI risk, builds evaluation evidence, and translates research into practical safety technology.",
    },
    eyebrow: "NUWA · FRONTIER AI SAFETY LAB",
    title: "Shared Risk Evidence and Public Goods for the World",
    lead: "NUWA Frontier AI Safety Lab advances frontier AI risk research and governance through reproducible evidence, evaluation methods, and public goods.",
    statementEyebrow: "Research mandate",
    statement: "Frontier AI risk research and governance",
    missionEyebrow: "Research mission",
    missionTitle: "What questions does NUWA work on?",
    missionBody: "We study how increasingly autonomous AI systems create new risks — and how to measure, govern, and control those risks through reproducible evidence and open methods.",
    roles: [
      { title: "Define frontier risk", body: "Study autonomy, deception, scheming, loss of control, and emerging agent behavior that becomes possible as capabilities grow." },
      { title: "Build evaluation evidence", body: "Develop executable environments, benchmarks, methodologies, and public research records that make frontier risk observable and comparable." },
      { title: "Advance safety models", body: "Turn risk understanding into lightweight models for reasoning, intent, trust, and runtime defense." },
      { title: "Inform real-world control", body: "Feed evidence into AgentGuard and learn from deployment feedback through a clear research-to-product boundary." },
    ],
    researchEyebrow: "Featured research",
    researchTitle: "Representative findings",
    researchLead: "Selected research programs defining frontier risk and practical control.",
    researchCta: "View all research",
    indexEyebrow: "Whitzard Index",
    indexTitle: "A long-term observation of frontier AI risk",
    indexBody: "The Whitzard Index is NUWA's project for continuously tracking and comparing frontier AI risk across models and systems. It is not a safety leaderboard, and it does not claim which product is best; it is a research data program for understanding how risk evolves.",
    indexCta: "Learn about the Whitzard Index",
    infraEyebrow: "Research infrastructure",
    infraTitle: "Evaluation infrastructure & benchmarks",
    infraLead: "Public evaluation environments and benchmarks that make agent cybersecurity capability observable.",
    infraSource: "Official site",
    allResearchEyebrow: "Complete research",
    allResearchTitle: "Full research record",
    allResearchBody: "Browse the complete publication record across frontier AI risk, agent safety, systems security, cybersecurity, and privacy — 86 research works with full filtering and search.",
    allResearchCta: "Browse all research",
    collaborationTitle: "Work with NUWA",
    collaborationBody: "Connect with us on frontier-risk evaluation, agent safety, AI control, and open technical evidence.",
    collaborationCta: "Start a research conversation",
    teamCta: "Meet the team",
  },
  zh: {
    meta: {
      title: "女娲实验室 — 白泽（Whitzard）",
      description: "女娲实验室是白泽背后的前沿 AI 安全研究实验室，研究前沿 AI 风险、建设评测证据，并将研究转化为可部署的安全技术。",
    },
    eyebrow: "女娲实验室",
    title: "为全球 AI 治理提供风险证据与公共产品",
    lead: "女娲实验室开展前沿 AI 风险研究与治理，通过可复现证据、评测方法和公共产品支持共同的安全决策。",
    statementEyebrow: "研究工作",
    statement: "前沿 AI 风险研究与治理",
    missionEyebrow: "研究使命",
    missionTitle: "女娲实验室在研究什么问题？",
    missionBody: "我们研究日益自主的 AI 系统如何产生新的风险，以及如何通过可复现的证据和开放方法来测量、治理和控制这些风险。",
    roles: [
      { title: "定义前沿风险", body: "研究自主性、欺骗、隐蔽谋划、失控与随能力增长而持续出现的智能体行为风险。" },
      { title: "建设评测证据", body: "开发可执行环境、基准、方法论与公开研究记录，让前沿风险可观测、可比较。" },
      { title: "推动安全模型", body: "将风险理解转化为推理、意图、信任与运行时防护的轻量安全模型。" },
      { title: "支持真实控制", body: "将证据输入 AgentGuard，并从部署反馈中学习，同时保持研究角色清晰。" },
    ],
    researchEyebrow: "精选研究",
    researchTitle: "代表性发现",
    researchLead: "连接前沿风险、智能体防护与系统安全的代表性工作。",
    researchCta: "查看全部研究",
    indexEyebrow: "白泽指数",
    indexTitle: "对前沿 AI 风险的长期观测",
    indexBody: "白泽指数是女娲实验室持续追踪和比较前沿 AI 风险的研究数据项目。它不是安全性排行榜，也不宣称哪个产品最好；它用于理解风险如何随系统能力演变。",
    indexCta: "了解白泽指数",
    infraEyebrow: "研究基础设施",
    infraTitle: "评测基础设施与基准",
    infraLead: "以公开评测环境与基准，让智能体网络安全能力得到持续观测与验证。",
    infraSource: "项目官网",
    allResearchEyebrow: "完整成果",
    allResearchTitle: "完整研究成果库",
    allResearchBody: "浏览前沿 AI 风险、智能体安全、系统安全、网络安全与隐私的完整成果记录——86 项研究成果，支持全文搜索与多维筛选。",
    allResearchCta: "浏览全部研究",
    collaborationTitle: "与女娲实验室合作",
    collaborationBody: "围绕前沿风险评测、智能体安全、AI 控制与开放技术证据开展交流与合作。",
    collaborationCta: "联系研究合作",
    teamCta: "认识团队",
  },
};
