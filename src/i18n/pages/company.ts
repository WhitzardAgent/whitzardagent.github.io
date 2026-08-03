import type { Locale } from "../config";
export type CompanyCopy = {
  solutions: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    lead: string;
    scenarios: Array<{
      index: string;
      title: string;
      task: string;
      risk: string;
      controls: string[];
      link: string;
    }>;
    journeyTitle: string;
    journey: string[];
    cta: string;
  };
  company: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    lead: string;
    architecture: Array<{
      name: string;
      role: string;
      body: string;
      href: string;
    }>;
    principlesTitle: string;
    principles: Array<{ title: string; body: string }>;
    teamTitle: string;
    teamLead: string;
  };
  contact: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    lead: string;
    primary: string;
    emailLabel: string;
    paths: Array<{ title: string; body: string; subject: string }>;
    prepareTitle: string;
    prepare: string[];
    response: string;
  };
};
export const companyCopy: Record<Locale, CompanyCopy> = {
  en: {
    solutions: {
      meta: {
        title: "Solutions — Whitzard",
        description:
          "Secure enterprise AI agent deployment across development, operations, data access, and high-impact workflows.",
      },
      eyebrow: "ENTERPRISE SOLUTIONS",
      title: "Secure high-impact agent workflows.",
      lead: "Secure data access, system changes, external actions, and multi-agent operations.",
      scenarios: [
        {
          index: "01",
          title: "Data and knowledge agents",
          task: "Enterprise search, reporting, and customer data processing.",
          risk: "Unauthorized access, sensitive egress, and lost lineage.",
          controls: ["Data lineage", "Redaction", "Scope limits", "Private audit"],
          link: "Data controls",
        },
        {
          index: "02",
          title: "Development and operations agents",
          task: "Code, shell, filesystem, and cloud operations.",
          risk: "Prompt injection, unauthorized execution, and compound chains.",
          controls: ["Dynamic permission", "Approval", "Sandbox", "Network boundary"],
          link: "Runtime controls",
        },
        {
          index: "03",
          title: "External-action agents",
          task: "Email, HTTP, browser, CRM, and notification tools.",
          risk: "Wrong recipients, untrusted domains, and irreversible action.",
          controls: ["Allowlists", "Delegated identity", "Approval", "Audit"],
          link: "Action controls",
        },
        {
          index: "04",
          title: "Multi-agent platforms",
          task: "Agent collaboration, shared tools, and distributed runtime.",
          risk: "Lateral authority, compound paths, and policy drift.",
          controls: ["Control plane", "Dynamic identity", "Cross-agent trace", "Unified response"],
          link: "Deployment",
        },
      ],
      journeyTitle: "Deployment path",
      journey: ["Select workflow", "Define boundary", "Connect AgentGuard", "Verify continuously"],
      cta: "Assess your workflow",
    },
    company: {
      meta: {
        title: "Company — Whitzard",
        description:
          "Whitzard builds AI agent security infrastructure, powered by AgentGuard, NUWA Lab research, and the WhitzardAgent open ecosystem.",
      },
      eyebrow: "WHITZARD · 白泽",
      title: "Building agent security infrastructure.",
      lead: "Whitzard connects AgentGuard, NUWA Lab, and an open technical ecosystem.",
      architecture: [
        {
          name: "Whitzard",
          role: "Company · AI Agent Security Infrastructure",
          body: "The company brand that connects product, research, open engineering, and enterprise deployment.",
          href: "/en/",
        },
        {
          name: "AgentGuard",
          role: "Core enterprise product",
          body: "A unified security control layer across the full agent runtime.",
          href: "/en/agentguard",
        },
        {
          name: "NUWA Lab",
          role: "Frontier safety research engine",
          body: "Research that defines risk, builds evaluation evidence, and advances safety models.",
          href: "/en/nuwa",
        },
        {
          name: "WhitzardAgent",
          role: "Open ecosystem",
          body: "Public models, tools, data, and evaluation infrastructure.",
          href: "/en/open-ecosystem",
        },
      ],
      principlesTitle: "How we work",
      principles: [
        {
          title: "Secure autonomy",
          body: "Protect the value of agent autonomy by giving it a trustworthy operating boundary.",
        },
        {
          title: "Evidence before claims",
          body: "Ground every claim in public sources, evaluations, and deployment evidence.",
        },
        {
          title: "Research into control",
          body: "Translate risk understanding into precise interventions in real systems.",
        },
        {
          title: "Open where useful",
          body: "Make selected models, tools, datasets, and research inspectable and reusable.",
        },
      ],
      teamTitle: "Founding and research team",
      teamLead:
        "Meet the people connecting agent security engineering, frontier safety research, and real-world cybersecurity expertise.",
    },
    contact: {
      meta: {
        title: "Book a Demo — Whitzard",
        description:
          "Talk with Whitzard about AgentGuard, enterprise AI agent security, private deployment, research, or open-source collaboration.",
      },
      eyebrow: "BOOK A DEMO",
      title: "Book an AgentGuard demo.",
      lead: "Share your stack, critical permissions, and deployment boundary for a focused demo.",
      primary: "Email Whitzard",
      emailLabel: "Business and collaboration",
      paths: [
        {
          title: "Enterprise product demo",
          body: "Map AgentGuard to your agent stack, runtime risks, private deployment, and security operations.",
          subject: "AgentGuard product demo",
        },
        {
          title: "NUWA research collaboration",
          body: "Connect on frontier risk evaluation, agent safety, safety models, or public evidence.",
          subject: "NUWA research collaboration",
        },
        {
          title: "Open source & technical exchange",
          body: "Discuss AgentGuard, safety models, evaluation infrastructure, and contributions across the WhitzardAgent ecosystem.",
          subject: "WhitzardAgent open-source collaboration",
        },
      ],
      prepareTitle: "Helpful context to include",
      prepare: [
        "Agent framework and model providers",
        "Tools, APIs, MCP servers, and data sources",
        "Highest-impact actions the agent can take",
        "Deployment and data-residency constraints",
      ],
      response:
        "No form data is sent from this website. Your email opens in your mail client and goes directly to the published Whitzard contact address.",
    },
  },
  zh: {
    solutions: {
      meta: {
        title: "解决方案 — Whitzard",
        description:
          "面向开发、运营、数据访问和高影响业务流程的企业智能体安全解决方案。",
      },
      eyebrow: "企业解决方案",
      title: "高影响智能体的安全落地",
      lead: "覆盖数据访问、系统变更、外部行动与多智能体协作。",
      scenarios: [
        {
          index: "01",
          title: "数据与知识智能体",
          task: "企业检索、报告生成、客户数据处理",
          risk: "越权访问、敏感外流、权限属性丢失",
          controls: ["数据血缘", "脱敏", "范围限制", "私有审计"],
          link: "数据控制",
        },
        {
          index: "02",
          title: "开发与运维智能体",
          task: "代码、Shell、文件系统、云资源操作",
          risk: "提示注入、未授权执行、危险组合链",
          controls: ["动态权限", "人工审批", "沙箱", "网络边界"],
          link: "运行时控制",
        },
        {
          index: "03",
          title: "外部行动智能体",
          task: "邮件、HTTP、浏览器、CRM、通知工具",
          risk: "错误收件人、非允许域、不可逆行动",
          controls: ["允许列表", "委托身份", "审批", "完整审计"],
          link: "行动控制",
        },
        {
          index: "04",
          title: "多智能体平台",
          task: "智能体协作、共享工具、跨节点运行",
          risk: "权限横向扩散、组合链路、策略漂移",
          controls: ["集中控制面", "动态身份", "跨智能体轨迹", "统一响应"],
          link: "部署方式",
        },
      ],
      journeyTitle: "落地路径",
      journey: ["选择工作流", "建立边界", "接入 AgentGuard", "持续验证"],
      cta: "评估你的工作流",
    },
    company: {
      meta: {
        title: "关于我们 — Whitzard",
        description:
          "Whitzard 构建智能体安全基础设施，由 AgentGuard、NUWA Lab 研究引擎与 WhitzardAgent 开放生态共同支撑。",
      },
      eyebrow: "WHITZARD · 白泽",
      title: "构建智能体安全基础设施",
      lead: "Whitzard 连接 AgentGuard、NUWA Lab 与开放技术生态。",
      architecture: [
        {
          name: "Whitzard",
          role: "公司 · 智能体安全基础设施",
          body: "连接产品、研究、开放工程与企业部署的公司品牌。",
          href: "/",
        },
        {
          name: "AgentGuard",
          role: "核心企业产品",
          body: "覆盖智能体完整运行过程的统一安全控制层。",
          href: "/agentguard",
        },
        {
          name: "NUWA Lab",
          role: "前沿安全研究引擎",
          body: "定义风险、建设评测证据并推动安全模型的研究引擎。",
          href: "/nuwa",
        },
        {
          name: "WhitzardAgent",
          role: "开放生态",
          body: "开放模型、工具、数据与评测基础设施。",
          href: "/open-ecosystem",
        },
      ],
      principlesTitle: "我们的工作原则",
      principles: [
        {
          title: "保护自主性",
          body: "通过可信运行边界保护智能体自主性所创造的价值。",
        },
        {
          title: "证据先于主张",
          body: "以公开来源、评测与部署证据支撑每一项主张。",
        },
        {
          title: "研究转化为控制",
          body: "把风险理解转化为真实系统中的精准干预。",
        },
        {
          title: "有选择地开放",
          body: "让部分模型、工具、数据与研究可检查、可复用。",
        },
      ],
      teamTitle: "创始与研究团队",
      teamLead:
        "认识连接智能体安全工程、前沿安全研究与真实网络安全实践的团队。",
    },
    contact: {
      meta: {
        title: "预约演示 — Whitzard",
        description:
          "与 Whitzard 讨论 AgentGuard、企业智能体安全、私有化部署、研究或开源合作。",
      },
      eyebrow: "预约产品演示",
      title: "预约 AgentGuard 演示",
      lead: "提交技术栈、关键权限与部署边界，获取针对性演示。",
      primary: "邮件联系 Whitzard",
      emailLabel: "商务与合作",
      paths: [
        {
          title: "企业产品演示",
          body: "将 AgentGuard 映射到智能体技术栈、运行时风险、私有化部署与安全运营。",
          subject: "预约 AgentGuard 产品演示",
        },
        {
          title: "NUWA 研究合作",
          body: "围绕前沿风险评测、智能体安全、安全模型与公开证据展开合作。",
          subject: "NUWA 研究合作",
        },
        {
          title: "开源与技术交流",
          body: "围绕 AgentGuard、安全模型、评测基础设施与 WhitzardAgent 生态贡献展开交流。",
          subject: "WhitzardAgent 开源合作",
        },
      ],
      prepareTitle: "建议在邮件中提供",
      prepare: [
        "智能体框架与模型提供商",
        "工具、API、MCP 服务与数据源",
        "智能体能够执行的最高影响行动",
        "部署方式与数据驻留要求",
      ],
      response: "邮件将由本地客户端直接发送至 Whitzard 联系邮箱。",
    },
  },
};
