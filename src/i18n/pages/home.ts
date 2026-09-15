import type { Locale } from "../config";

export type HomeCopy = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primary: string;
    secondary: string;
  };
  positioning: {
    eyebrow: string;
    body: string;
    pillars: Array<{ keyword: string; body: string }>;
  };
  system: {
    eyebrow: string;
    title: string;
    body: string;
    cycle: string[];
    feedback: string;
    runtimeEyebrow: string;
    runtimeTitle: string;
    runtimeBody: string;
  };
  highlight: {
    eyebrow: string;
    title: string;
    body: string;
    source: string;
    sourceUrl?: string;
  };
  products: {
    eyebrow: string;
    title: string;
    agentguard: {
      label: string;
      title: string;
      body: string;
      cta: string;
      features: string[];
    };
    models: {
      label: string;
      title: string;
      body: string;
      cta: string;
    };
  };
  research: {
    eyebrow: string;
    title: string;
    body: string;
    questions: string[];
    cta: string;
    indexTitle: string;
    indexBody: string;
    indexCta: string;
  };
  ecosystem: {
    eyebrow: string;
    title: string;
    intro: string;
    directions: string[];
    viewAll: string;
  };
  closing: {
    eyebrow: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
};

export const homeCopy: Record<Locale, HomeCopy> = {
  en: {
    meta: {
      title: "Whitzard — Security Infrastructure for the Agentic AI Era",
      description: "Whitzard builds security infrastructure for the agentic AI era through AgentGuard, Model Services, NUWA research, and an open technical ecosystem.",
    },
    hero: {
      eyebrow: "Whitzard",
      title: "Security infrastructure for the agentic AI era.",
      description: "Whitzard connects runtime safeguards, model services, frontier-risk research, and an open technical ecosystem so AI agents can operate within clear, verifiable boundaries.",
      primary: "Explore AgentGuard",
      secondary: "Explore research",
    },
    positioning: {
      eyebrow: "Who we are",
      body: "Whitzard is a research-driven AI safety company. We connect frontier AI risk research from NUWA with deployable safety technology in AgentGuard, helping teams evaluate and operate increasingly capable AI systems with appropriate safeguards.",
      pillars: [
        { keyword: "Trusted boundaries", body: "Security control must cover the full path from intent to action — not just the endpoint." },
        { keyword: "Verifiable evidence", body: "Every safety claim should be traceable to reproducible evaluation, not asserted." },
        { keyword: "Minimal necessary intervention", body: "Security enables agents to complete tasks, not just block them." },
      ],
    },
    system: {
      eyebrow: "One connected system",
      title: "Research identifies risk. Protection acts on evidence.",
      body: "NUWA and AgentGuard connect frontier-risk research with controls that operate inside real agent workflows.",
      cycle: ["Risk research", "Evaluation evidence", "Protection strategy", "Runtime feedback"],
      feedback: "Evidence moves into protection. Operational signals sharpen the next evaluation.",
      runtimeEyebrow: "Runtime control",
      runtimeTitle: "A boundary that stays with the agent loop.",
      runtimeBody: "Follow one real task from intent to external action, with data, authorization, and action impact checked at every interaction boundary.",
    },
    highlight: {
      eyebrow: "Recent result",
      title: "Fudan Baize ranks second globally in AI attack-defense evaluation",
      body: "On the international AI safety benchmark CyberGym, the Whitzard agent reached a 91.2% success rate, ranking second globally and first among universities. This result reflects the strength of Whitzard's research foundation in agent cybersecurity.",
      source: "Fudan Baize WeChat official account",
      sourceUrl: "https://mp.weixin.qq.com/s/0F7mcRuwgNTNyCOtlYORaw",
    },
    products: {
      eyebrow: "Products & services",
      title: "What we build",
      agentguard: {
        label: "AgentGuard",
        title: "Agent runtime security control layer",
        body: "AgentGuard tracks data, authorization, and action impact continuously — repairing or blocking risk before boundaries are crossed, while letting agents complete their tasks. Available as an open-source community edition and an enterprise deployment.",
        cta: "Learn about AgentGuard",
        features: ["Runtime intelligence across thought, behavior, and data", "Allow / sanitize / align / degrade / approve / deny decisions", "Community edition (open source) and enterprise deployment", "Framework-compatible: LangChain, AutoGen, OpenAI Agents, and more"],
      },
      models: {
        label: "Model Services",
        title: "Safety evaluation and safety-enhanced models",
        body: "Model Services connect frontier-risk research with practical workflows for evaluating model safety and strengthening runtime safeguards.",
        cta: "Learn about model services",
      },
    },
    research: {
      eyebrow: "NUWA",
      title: "Shared Risk Evidence and Public Goods for the World",
      body: "NUWA Frontier AI Safety Lab advances frontier AI risk research and governance through reproducible evidence, evaluation methods, and public goods.",
      questions: [
        "How do we define and measure frontier AI risk — autonomy, deception, loss of control?",
        "How do we build evaluation environments that make agent cybersecurity capability observable?",
        "How do we turn risk understanding into deployable safety models and runtime control?",
      ],
      cta: "Explore NUWA",
      indexTitle: "Whitzard Index",
      indexBody: "A long-term research data project for observing and comparing frontier AI risk across models and systems — not a safety leaderboard.",
      indexCta: "Learn about the Whitzard Index",
    },
    ecosystem: {
      eyebrow: "Open ecosystem",
      title: "Open models, tools, and evaluation infrastructure",
      intro: "WhitzardAgent hosts open-source projects spanning agent development, safety evaluation, thought correction, and behavior-chain auditing.",
      directions: ["Agent development", "Safety evaluation", "Safety models", "Behavior-trace auditing"],
      viewAll: "Explore the open ecosystem",
    },
    closing: {
      eyebrow: "Product access",
      title: "Bring verifiable boundaries to your agent system.",
      body: "Tell us about your environment, current deployment stage, and the security problem you need to solve.",
      primary: "Join the waitlist",
      secondary: "Read the Research Blog",
      tertiary: "Explore the open ecosystem",
    },
  },
  zh: {
    meta: {
      title: "白泽（Whitzard）— 智能体安全基础设施",
      description: "白泽通过 AgentGuard、模型服务、女娲实验室研究与开放技术生态，打造智能体时代的安全基础设施。",
    },
    hero: {
      eyebrow: "白泽 · Whitzard",
      title: "打造智能体时代的安全基础设施",
      description: "白泽连接运行时防护、模型服务、前沿风险研究与开放技术生态，让智能体在清晰、可验证的边界内行动。",
      primary: "了解 AgentGuard",
      secondary: "了解研究",
    },
    positioning: {
      eyebrow: "我们是谁",
      body: "白泽是一家研究驱动的 AI 安全公司。我们将女娲实验室的前沿 AI 风险研究与 AgentGuard 的可部署安全技术结合起来，让更强大的 AI 系统被可靠评测、安全使用。",
      pillars: [
        { keyword: "可信边界", body: "安全控制必须覆盖从意图到行动的完整路径，而不只是终点。" },
        { keyword: "可核实证据", body: "每一个安全主张都应能追溯到可复现的评测，而非仅仅声称。" },
        { keyword: "最小必要干预", body: "安全让智能体完成任务，而不只是阻断它们。" },
      ],
    },
    system: {
      eyebrow: "同一套安全系统",
      title: "研究识别风险，产品在运行中实施控制",
      body: "女娲实验室与 AgentGuard 将前沿风险研究连接到真实智能体工作流中的安全控制。",
      cycle: ["风险研究", "评测证据", "防护策略", "运行反馈"],
      feedback: "证据进入防护体系，运行反馈持续校准下一轮评测。",
      runtimeEyebrow: "运行时控制",
      runtimeTitle: "让安全边界贯穿智能体执行闭环",
      runtimeBody: "沿一项真实任务观察从业务意图到外部行动的完整路径，并在每个交互边界联合检查数据、授权与行动影响。",
    },
    highlight: {
      eyebrow: "近期成果",
      title: "AI 攻防全球第二、高校第一",
      body: "在国际 AI 安全基准 CyberGym 最新榜单中，复旦白泽智能体 Whitzard 以 91.2% 成功率位列全球第二、高校第一。这一结果反映了白泽在智能体网络安全方面的研究基础。",
      source: "复旦白泽战队微信公众号",
      sourceUrl: "https://mp.weixin.qq.com/s/0F7mcRuwgNTNyCOtlYORaw",
    },
    products: {
      eyebrow: "产品与服务",
      title: "我们构建什么",
      agentguard: {
        label: "AgentGuard",
        title: "智能体运行时安全控制层",
        body: "AgentGuard 持续追踪数据、授权与行动影响，在越界前修复或阻断风险，同时让智能体继续完成业务任务。提供开源社区版和企业交付版。",
        cta: "了解 AgentGuard",
        features: ["覆盖思维链、行为链与数据链的运行时智能", "允许 / 脱敏 / 校准 / 降级 / 审批 / 阻断 六种处置", "开源社区版与企业交付版", "兼容 LangChain、AutoGen、OpenAI Agents 等主流框架"],
      },
      models: {
        label: "模型服务",
        title: "安全评测与安全增强模型",
        body: "模型服务连接前沿风险研究与实际工作流，用于模型安全评测与智能体运行时防护增强。",
        cta: "了解模型服务",
      },
    },
    research: {
      eyebrow: "女娲实验室",
      title: "为全球 AI 治理提供风险证据与公共产品",
      body: "女娲实验室开展前沿 AI 风险研究与治理，通过可复现证据、评测方法和公共产品支持共同的安全决策。",
      questions: [
        "如何定义和测量前沿 AI 风险——自主性、欺骗、失控？",
        "如何建设让智能体网络安全能力可观测的评测环境？",
        "如何将风险理解转化为可部署的安全模型和运行时控制？",
      ],
      cta: "探索女娲实验室",
      indexTitle: "白泽指数",
      indexBody: "一个持续观测和比较前沿 AI 风险的研究数据项目，而非安全性排行榜。",
      indexCta: "了解白泽指数",
    },
    ecosystem: {
      eyebrow: "开源生态",
      title: "开放模型、工具与评测基础设施",
      intro: "WhitzardAgent 承载开源项目，覆盖智能体开发、安全评测、思维矫正与行为链审计。",
      directions: ["智能体开发框架", "安全评测基础设施", "安全模型", "行为轨迹审计"],
      viewAll: "探索开放生态",
    },
    closing: {
      eyebrow: "产品访问",
      title: "建立可验证的智能体安全边界",
      body: "告诉我们你的技术环境、当前阶段，以及最需要解决的安全问题。",
      primary: "加入心愿单",
      secondary: "阅读 Research Blog",
      tertiary: "探索开放生态",
    },
  },
};
