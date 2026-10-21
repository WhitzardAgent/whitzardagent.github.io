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
    statementEyebrow: "Research scope",
    statement: "Frontier AI risk research and governance",
    missionEyebrow: "Research focus",
    missionTitle: "Core questions",
    missionBody: "We study risks arising from autonomous AI systems and develop evidence-based methods for evaluation, governance, and control.",
    roles: [
      { title: "Frontier risk analysis", body: "Study autonomy, deception, scheming, loss of control, and emerging agent behavior that becomes possible as capabilities grow." },
      { title: "Evaluation evidence", body: "Develop executable environments, benchmarks, methodologies, and public research records that make frontier risk observable and comparable." },
      { title: "Safety models", body: "Turn risk understanding into lightweight models for reasoning, intent, trust, and runtime defense." },
      { title: "Runtime control", body: "Use research evidence to inform AgentGuard policies and operational feedback to refine evaluations." },
    ],
    researchEyebrow: "Featured research",
    researchTitle: "Selected research",
    researchLead: "Selected research programs defining frontier risk and practical control.",
    researchCta: "View all research",
    indexEyebrow: "NUWA Index",
    indexTitle: "Frontier AI risk monitoring",
    indexBody: "NUWA Index is a research data project for tracking frontier AI risk across models and systems. It does not assign an overall safety score.",
    indexCta: "Learn about the NUWA Index",
    infraEyebrow: "Research infrastructure",
    infraTitle: "Evaluation infrastructure & benchmarks",
    infraLead: "Public evaluation environments and benchmarks that make agent cybersecurity capability observable.",
    infraSource: "Official site",
    allResearchEyebrow: "Complete research",
    allResearchTitle: "Research archive",
    allResearchBody: "Browse the complete publication record across frontier AI risk, agent safety, systems security, cybersecurity, and privacy — 86 research works with full filtering and search.",
    allResearchCta: "Browse all research",
    collaborationTitle: "Research collaboration",
    collaborationBody: "Connect with us on frontier-risk evaluation, agent safety, AI control, and open technical evidence.",
    collaborationCta: "Contact NUWA",
    teamCta: "Meet the team",
  },
  zh: {
    meta: {
      title: "女娲实验室 — 白泽（Whitzard）",
      description: "女娲实验室开展前沿 AI 风险研究与治理，构建可复现的评测证据、研究方法与公共产品。",
    },
    eyebrow: "女娲实验室",
    title: "为全球 AI 治理提供风险证据与公共产品",
    lead: "女娲实验室开展前沿 AI 风险研究与治理，通过可复现证据、评测方法和公共产品支持共同的安全决策。",
    statementEyebrow: "研究范围",
    statement: "前沿 AI 风险研究与治理",
    missionEyebrow: "研究范围",
    missionTitle: "核心问题",
    missionBody: "研究自主 AI 系统的风险形成机制，以及基于可复现证据的评测、治理与控制方法。",
    roles: [
      { title: "前沿风险识别", body: "研究自主性、欺骗、隐蔽谋划、失控与随能力增长而持续出现的智能体行为风险。" },
      { title: "评测证据", body: "开发可执行环境、基准、方法论与公开研究记录，让前沿风险可观测、可比较。" },
      { title: "安全模型", body: "将风险理解转化为推理、意图、信任与运行时防护的轻量安全模型。" },
      { title: "运行时控制", body: "将研究证据用于 AgentGuard 防护策略，并以运行反馈完善评测方法。" },
    ],
    researchEyebrow: "精选研究",
    researchTitle: "代表成果",
    researchLead: "连接前沿风险、智能体防护与系统安全的代表性工作。",
    researchCta: "查看全部研究",
    indexEyebrow: "NUWA Index",
    indexTitle: "对前沿 AI 风险的长期观测",
    indexBody: "NUWA Index 是女娲实验室用于追踪模型与系统前沿风险的研究数据项目，不提供单一安全总分。",
    indexCta: "了解 NUWA Index",
    infraEyebrow: "研究基础设施",
    infraTitle: "评测基础设施与基准",
    infraLead: "以公开评测环境与基准，让智能体网络安全能力得到持续观测与验证。",
    infraSource: "项目官网",
    allResearchEyebrow: "完整成果",
    allResearchTitle: "研究成果库",
    allResearchBody: "浏览前沿 AI 风险、智能体安全、系统安全、网络安全与隐私的完整成果记录——86 项研究成果，支持全文搜索与多维筛选。",
    allResearchCta: "浏览全部研究",
    collaborationTitle: "研究合作",
    collaborationBody: "围绕前沿风险评测、智能体安全、AI 控制与开放技术证据开展交流与合作。",
    collaborationCta: "联系研究合作",
    teamCta: "查看创始团队",
  },
};
