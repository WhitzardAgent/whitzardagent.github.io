import type { Locale } from "../config";
export type ResearchCopy = {
  nuwa: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    lead: string;
    statement: string;
    roles: Array<{ title: string; body: string }>;
    researchTitle: string;
    researchBody: string;
    cta: string;
    evidenceEyebrow: string;
    translationTitle: string;
    translationBody: string;
    translationCta: string;
    collaborationTitle: string;
    collaborationBody: string;
    collaborationCta: string;
    teamCta: string;
  };
  research: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    lead: string;
    areas: Array<{ title: string; body: string }>;
    featured: string;
    all: string;
    source: string;
  };
  ecosystem: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    lead: string;
    github: string;
    hf: string;
    categories: Array<{ key: string; title: string; body: string }>;
    status: string;
  };
};
export const researchCopy: Record<Locale, ResearchCopy> = {
  en: {
    nuwa: {
      meta: {
        title: "NUWA Lab — The Research Engine Behind Whitzard",
        description:
          "NUWA Lab studies frontier AI risk, builds evaluation evidence, and turns research into safety models and product capabilities.",
      },
      eyebrow: "NUWA LAB · 女娲实验室",
      title: "Research frontier risk. Build control.",
      lead: "Study frontier-risk evaluation, agent safety, AI control, and runtime security.",
      statement:
        "Research discovers the risk. Product controls it in the real world.",
      roles: [
        {
          title: "Define frontier risk",
          body: "Study autonomy, deception, scheming, loss of control, and emerging agent behavior.",
        },
        {
          title: "Build evaluation evidence",
          body: "Develop executable environments, benchmarks, methodologies, and public research records.",
        },
        {
          title: "Advance safety models",
          body: "Turn risk understanding into lightweight models for reasoning, intent, trust, and runtime defense.",
        },
        {
          title: "Inform real-world control",
          body: "Feed evidence into AgentGuard and learn from deployment feedback while preserving research independence.",
        },
      ],
      researchTitle: "Selected public research",
      researchBody:
        "Selected papers, evaluations, and technical reports on frontier AI risk and controllable agent systems.",
      cta: "View all research",
      evidenceEyebrow: "FEATURED RESEARCH",
      translationTitle: "From frontier-risk evidence to runtime control.",
      translationBody: "NUWA Lab develops risk definitions, evaluation methods, and safety intelligence. AgentGuard carries that work into the systems where agents use tools, identities, and data.",
      translationCta: "Explore AgentGuard",
      collaborationTitle: "Work with NUWA Lab",
      collaborationBody: "Connect with us on frontier-risk evaluation, agent safety, AI control, and open technical evidence.",
      collaborationCta: "Start a research conversation",
      teamCta: "Meet the team",
    },
    research: {
      meta: {
        title: "Research — NUWA Lab",
        description:
          "Public research from NUWA Lab on frontier AI risk evaluation, agent safety, AI control, and runtime security.",
      },
      eyebrow: "NUWA RESEARCH",
      title: "Frontier AI safety research.",
      lead: "Research questions, methods, results, and source links.",
      areas: [
        {
          title: "Frontier risk",
          body: "Autonomy, deception, scheming, self-replication, and loss-of-control.",
        },
        {
          title: "Agent safety",
          body: "Reasoning alignment, behavioral safety, guardrails, and runtime intervention.",
        },
        {
          title: "Evaluation",
          body: "Executable evidence, benchmarks, methodology, and evaluation integrity.",
        },
        {
          title: "AI control",
          body: "Oversight, controllability, governance evidence, and security boundaries.",
        },
      ],
      featured: "Featured research",
      all: "All research",
      source: "Original source",
    },
    ecosystem: {
      meta: {
        title: "Open Ecosystem — WhitzardAgent",
        description:
          "Open models, tools, data, and evaluation infrastructure from WhitzardAgent.",
      },
      eyebrow: "WHITZARDAGENT",
      title: "Open security technology.",
      lead: "Open models, tools, data, and evaluation infrastructure.",
      github: "GitHub organization",
      hf: "Hugging Face",
      status: "Open project",
      categories: [
        {
          key: "runtime",
          title: "Runtime Security",
          body: "Controls, defenses, and containment for agents in action.",
        },
        {
          key: "models",
          title: "Safety Models",
          body: "Lightweight models for thought alignment, intent, trust, and reasoning safety.",
        },
        {
          key: "evaluation",
          title: "Evaluation",
          body: "Evaluation frameworks, benchmarks, and penetration-testing infrastructure.",
        },
        {
          key: "infrastructure",
          title: "Agent Infrastructure",
          body: "Frameworks, representations, simulators, and agent system building blocks.",
        },
        {
          key: "cyber",
          title: "Cybersecurity",
          body: "Cyber agents, training pipelines, repositories, and datasets.",
        },
      ],
    },
  },
  zh: {
    nuwa: {
      meta: {
        title: "NUWA Lab — Whitzard 背后的前沿安全研究引擎",
        description:
          "NUWA Lab 研究前沿 AI 风险、建设评测证据，并将研究转化为安全模型和产品能力。",
      },
      eyebrow: "NUWA LAB · 女娲实验室",
      title: "研究前沿风险，构建可控智能",
      lead: "聚焦前沿风险评测、智能体安全、AI 控制与运行时安全。",
      statement: "研究定义风险，产品在真实世界中控制风险。",
      roles: [
        {
          title: "定义前沿风险",
          body: "研究自主性、欺骗、算计、失控与持续出现的智能体行为风险。",
        },
        {
          title: "建设评测证据",
          body: "开发可执行环境、基准、方法论与公开研究记录。",
        },
        {
          title: "推动安全模型",
          body: "将风险理解转化为推理、意图、信任与运行时防护的轻量安全模型。",
        },
        {
          title: "支持真实控制",
          body: "将证据输入 AgentGuard，并从部署反馈中学习，同时保持研究角色清晰。",
        },
      ],
      researchTitle: "精选公开研究",
      researchBody:
        "聚焦前沿 AI 风险与可控智能体系统的精选论文、评测与技术报告。",
      cta: "查看全部研究",
      evidenceEyebrow: "精选研究",
      translationTitle: "从风险证据到运行时控制",
      translationBody: "NUWA Lab 建设风险定义、评测方法与安全智能，AgentGuard 将这些能力带入智能体使用工具、身份和数据的真实系统。",
      translationCta: "了解 AgentGuard",
      collaborationTitle: "与 NUWA Lab 合作",
      collaborationBody: "围绕前沿风险评测、智能体安全、AI 控制与开放技术证据开展交流与合作。",
      collaborationCta: "联系研究合作",
      teamCta: "认识团队",
    },
    research: {
      meta: {
        title: "研究成果 — NUWA Lab",
        description:
          "NUWA Lab 关于前沿 AI 风险评测、智能体安全、AI 控制与运行时安全的公开研究。",
      },
      eyebrow: "NUWA 研究",
      title: "前沿 AI 安全研究",
      lead: "研究问题、方法、成果与原文入口。",
      areas: [
        { title: "前沿风险", body: "自主性、欺骗、算计、自我复制与失控风险。" },
        { title: "智能体安全", body: "推理校准、行为安全、护栏与运行时干预。" },
        { title: "安全评测", body: "可执行证据、基准、方法论与评测完整性。" },
        { title: "AI 控制", body: "监督、可控性、治理证据与安全边界。" },
      ],
      featured: "精选研究",
      all: "全部研究",
      source: "公开来源",
    },
    ecosystem: {
      meta: {
        title: "开放生态 — WhitzardAgent",
        description: "WhitzardAgent 开放模型、工具、数据和评测基础设施。",
      },
      eyebrow: "WHITZARDAGENT",
      title: "开放安全技术生态",
      lead: "开放模型、工具、数据与评测基础设施。",
      github: "GitHub 组织",
      hf: "Hugging Face",
      status: "开放项目",
      categories: [
        {
          key: "runtime",
          title: "运行时安全",
          body: "面向智能体真实行动过程的控制、防护与隔离能力。",
        },
        {
          key: "models",
          title: "安全模型",
          body: "用于思维校准、意图、信任与推理安全的轻量模型。",
        },
        {
          key: "evaluation",
          title: "安全评测",
          body: "评测框架、基准与渗透测试基础设施。",
        },
        {
          key: "infrastructure",
          title: "智能体基础设施",
          body: "框架、中间表示、模拟器与智能体系统基础组件。",
        },
        {
          key: "cyber",
          title: "网络安全",
          body: "网络安全智能体、训练流程、代码仓库与数据集。",
        },
      ],
    },
  },
};
