import type { Locale } from "../config";
export type ResearchCopy = {
  nuwa: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    lead: string;
    statementEyebrow: string;
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
    nav: { themes: string; featured: string; impact: string; index: string; recognition: string };
    areas: Array<{ key: string; title: string; body: string; cta: string }>;
    featured: string;
    featuredLead: string;
    all: string;
    source: string;
    filters: { searchLabel: string; searchPlaceholder: string; topicLabel: string; yearLabel: string; memberLabel: string; allTopics: string; allYears: string; allMembers: string; reset: string; noResults: string };
    linkLabels: { paper: string; pdf: string; code: string; project: string };
    recognitionEyebrow: string;
    recognitionTitle: string;
    teamEyebrow: string;
    teamTitle: string;
    teamLead: string;
    homepage: string;
    viewResearch: string;
    collaborationTitle: string;
    collaborationBody: string;
    collaborationCta: string;
  };
  ecosystem: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    lead: string;
    github: string;
    hf: string;
    coreEyebrow: string;
    coreTitle: string;
    coreLead: string;
    directoryTitle: string;
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
      statementEyebrow: "LAB VISION",
      statement: "Shared Risk Evidence and Public Goods for the World",
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
          "NUWA Lab research on frontier AI risk, agent safety, systems security, cybersecurity, and privacy.",
      },
      eyebrow: "NUWA LAB · RESEARCH",
      title: "Define risk. Build safety with evidence.",
      lead: "Frontier AI risk, agent safety, systems security, cybersecurity, and privacy.",
      nav: { themes: "Research themes", featured: "Featured work", impact: "Public impact", index: "All research", recognition: "Recognition" },
      areas: [
        { key: "frontier-risk-control", title: "Frontier risk & AI control", body: "Measure autonomy, deception, proliferation, and control integrity.", cta: "View this theme" },
        { key: "agent-model-safety", title: "Agent & model safety", body: "Protect reasoning, behavior, generative models, and human–AI trust.", cta: "View this theme" },
        { key: "software-system-security", title: "Software, systems & agent security", body: "Find vulnerabilities across agents, software, firmware, and cloud systems.", cta: "View this theme" },
        { key: "cybersecurity-privacy", title: "Cybersecurity, privacy & real-world risk", body: "Study cybercrime, privacy leakage, abuse ecosystems, and emerging threats.", cta: "View this theme" },
        { key: "trustworthy-ml", title: "Trustworthy ML & model security", body: "Study robustness, backdoors, watermarks, poisoning, and model trust.", cta: "View this theme" },
        { key: "ai-systems-methods", title: "AI systems & learning methods", body: "Complete the publication record across learning systems and methods.", cta: "View this theme" },
      ],
      featured: "Featured research",
      featuredLead: "Five research programs defining frontier risk and practical control.",
      all: "Research index",
      source: "Original source",
      filters: { searchLabel: "Search", searchPlaceholder: "Search title, author, or topic", topicLabel: "Theme", yearLabel: "Year", memberLabel: "Member", allTopics: "All themes", allYears: "All years", allMembers: "All members", reset: "Reset", noResults: "No research matches these filters." },
      linkLabels: { paper: "Paper", pdf: "PDF", code: "Code", project: "Project" },
      recognitionEyebrow: "RECOGNITION",
      recognitionTitle: "Honours and recognition",
      teamEyebrow: "RESEARCH CAPABILITY",
      teamTitle: "Research leadership",
      teamLead: "Two founders and a strategic research partner spanning AI safety, systems security, cybercrime, and privacy.",
      homepage: "Homepage",
      viewResearch: "View research",
      collaborationTitle: "Research collaboration",
      collaborationBody: "Collaborate on frontier-risk evaluation, agent safety, systems security, cybersecurity, and privacy.",
      collaborationCta: "Contact research",
    },
    ecosystem: {
      meta: {
        title: "Whitzard Open Ecosystem — WhitzardAgent",
        description:
          "Open models, tools, data, and evaluation infrastructure from WhitzardAgent.",
      },
      eyebrow: "WHITZARDAGENT",
      title: "Whitzard Open Ecosystem",
      lead: "Open models, tools, data, and evaluation infrastructure.",
      github: "GitHub organization",
      hf: "Hugging Face",
      coreEyebrow: "CORE CAPABILITIES",
      coreTitle: "Four open foundations",
      coreLead: "Agent development, safety evaluation, thought correction, and behavior-chain auditing.",
      directoryTitle: "Complete project directory",
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
        title: "女娲实验室 — 白泽（Whitzard）前沿安全研究引擎",
        description:
          "女娲实验室研究前沿 AI 风险、建设评测证据，并将研究转化为安全模型和产品能力。",
      },
      eyebrow: "女娲实验室",
      title: "研究前沿风险，构建可控智能",
      lead: "聚焦前沿风险评测、智能体安全、AI 控制与运行时安全。",
      statementEyebrow: "实验室愿景",
      statement: "为全球AI治理分享风险实证与公共产品",
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
      translationBody: "女娲实验室建设风险定义、评测方法与安全智能，AgentGuard 将这些能力带入智能体运行环境。",
      translationCta: "了解 AgentGuard",
      collaborationTitle: "与女娲实验室合作",
      collaborationBody: "围绕前沿风险评测、智能体安全、AI 控制与开放技术证据开展交流与合作。",
      collaborationCta: "联系研究合作",
      teamCta: "认识团队",
    },
    research: {
      meta: {
        title: "研究成果 — 女娲实验室",
        description:
          "女娲实验室关于前沿 AI 风险、智能体安全、系统安全、网络安全与隐私的研究成果。",
      },
      eyebrow: "女娲实验室 · 研究",
      title: "以研究定义风险，以证据构建安全",
      lead: "聚焦前沿 AI 风险、智能体安全、系统安全与网络安全",
      nav: { themes: "研究主题", featured: "代表成果", impact: "公共影响", index: "全部成果", recognition: "荣誉与认可" },
      areas: [
        { key: "frontier-risk-control", title: "前沿风险与 AI 控制", body: "评测自主性、欺骗、扩散与控制完整性。", cta: "查看主题研究" },
        { key: "agent-model-safety", title: "智能体与模型安全", body: "保护推理、行为、生成模型与人机信任。", cta: "查看主题研究" },
        { key: "software-system-security", title: "软件、系统与智能体安全", body: "发现智能体、软件、固件与云系统漏洞。", cta: "查看主题研究" },
        { key: "cybersecurity-privacy", title: "网络安全、隐私与真实风险", body: "研究网络犯罪、隐私泄露、滥用生态与新型威胁。", cta: "查看主题研究" },
        { key: "trustworthy-ml", title: "可信机器学习与模型安全", body: "研究鲁棒性、后门、水印、投毒与模型可信。", cta: "查看主题研究" },
        { key: "ai-systems-methods", title: "AI 系统与学习方法", body: "完整呈现学习系统与方法方向的公开成果。", cta: "查看主题研究" },
      ],
      featured: "旗舰成果",
      featuredLead: "五项代表性工作，连接前沿风险、智能体防护与系统安全。",
      all: "成果索引",
      source: "原文",
      filters: { searchLabel: "搜索", searchPlaceholder: "搜索标题、作者或主题", topicLabel: "主题", yearLabel: "年份", memberLabel: "成员", allTopics: "全部主题", allYears: "全部年份", allMembers: "全部成员", reset: "重置", noResults: "没有符合条件的研究成果" },
      linkLabels: { paper: "论文", pdf: "PDF", code: "代码", project: "项目" },
      recognitionEyebrow: "荣誉与认可",
      recognitionTitle: "经公开来源核验的荣誉",
      teamEyebrow: "研究力量",
      teamTitle: "跨越 AI 与系统安全",
      teamLead: "两位联合创始人与一位战略研究合作伙伴，覆盖前沿 AI、系统安全、网络犯罪与隐私。",
      homepage: "个人主页",
      viewResearch: "查看研究",
      collaborationTitle: "研究合作",
      collaborationBody: "围绕前沿风险评测、智能体安全、系统安全、网络安全与隐私开展合作。",
      collaborationCta: "联系研究合作",
    },
    ecosystem: {
      meta: {
        title: "白泽开放生态 — WhitzardAgent",
        description: "WhitzardAgent 开放模型、工具、数据和评测基础设施。",
      },
      eyebrow: "WHITZARDAGENT",
      title: "白泽开放生态",
      lead: "开放智能体框架、安全评测、模型与数据基础设施。",
      github: "GitHub 组织",
      hf: "Hugging Face",
      coreEyebrow: "核心能力",
      coreTitle: "四项开放技术基础",
      coreLead: "覆盖智能体开发、安全评测、思维矫正与行为链审计。",
      directoryTitle: "完整项目目录",
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
