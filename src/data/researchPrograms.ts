import type { ResearchCategory } from "./generated/researchAssets";

export type ResearchProgramId =
  | "frontier-ai-risk-control"
  | "agent-model-safety"
  | "risk-evaluation-governance";

export type ResearchProgram = {
  id: ResearchProgramId;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  terms: { zh: string[]; en: string[] };
  archiveCategories: ResearchCategory[];
};

export const researchPrograms: ResearchProgram[] = [
  {
    id: "frontier-ai-risk-control",
    title: { zh: "前沿 AI 风险与控制", en: "Frontier AI Risk and Control" },
    description: {
      zh: "研究能力更强、更具自主性的 AI 系统可能形成的风险，以及可验证的控制方法。",
      en: "Study risks from increasingly capable and autonomous AI systems and develop verifiable approaches to control.",
    },
    terms: { zh: ["自主性", "欺骗", "隐蔽谋划", "失控风险"], en: ["Autonomy", "Deception", "Scheming", "Loss of control"] },
    archiveCategories: ["frontier-risk-control"],
  },
  {
    id: "agent-model-safety",
    title: { zh: "智能体与模型安全", en: "Agent and Model Safety" },
    description: {
      zh: "研究推理、行动、工具使用、模型行为与人机信任中的系统性安全问题。",
      en: "Study systemic safety questions in reasoning, action, tool use, model behavior, and human–AI trust.",
    },
    terms: { zh: ["智能体行为", "模型安全", "工具调用", "可信交互"], en: ["Agent behavior", "Model safety", "Tool use", "Trustworthy interaction"] },
    archiveCategories: ["agent-model-safety", "software-system-security", "trustworthy-ml"],
  },
  {
    id: "risk-evaluation-governance",
    title: { zh: "风险评测与治理方法", en: "Risk Evaluation and Governance Methods" },
    description: {
      zh: "建设可执行、可复现的评测环境，研究如何将证据用于风险评估与治理决策。",
      en: "Build executable, reproducible evaluations and study how evidence should inform risk assessment and governance decisions.",
    },
    terms: { zh: ["能力评测", "风险评估", "评测环境", "治理方法"], en: ["Capability evaluation", "Risk assessment", "Evaluation environments", "Governance methods"] },
    archiveCategories: ["cybersecurity-privacy", "ai-systems-methods"],
  },
];
