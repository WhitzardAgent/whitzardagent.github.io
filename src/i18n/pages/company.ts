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
      objective: string;
      boundary: string;
      outcome: string;
    }>;
    explorer: { objective: string; boundary: string; outcome: string; ariaLabel: string };
    valueEyebrow: string;
    valueTitle: string;
    valueBody: string;
    primary: string;
    secondary: string;
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
        title: "Use Cases — Whitzard",
        description:
          "Secure enterprise AI agent deployment across development, operations, data access, and high-impact workflows.",
      },
      eyebrow: "ENTERPRISE AGENT USE CASES",
      title: "Let enterprise agents act autonomously, safely.",
      lead: "Set runtime boundaries for permissions, data, and external actions without sacrificing business value.",
      explorer: { objective: "Business objective", boundary: "Critical boundary", outcome: "Controlled outcome", ariaLabel: "Enterprise agent use cases" },
      valueEyebrow: "SECURE AUTONOMY",
      valueTitle: "Autonomy creates value inside a clear boundary",
      valueBody: "AgentGuard Enterprise turns workflow boundaries into enforceable runtime control.",
      primary: "Assess a use case",
      secondary: "Explore AgentGuard Enterprise",
      scenarios: [
        {
          index: "01",
          title: "Data and knowledge agents",
          objective: "Enterprise search, reporting, and customer data processing.",
          boundary: "Data provenance, access rights, derived content, and external destinations.",
          outcome: "Keep automation efficient while controlling sensitive data by source and destination.",
        },
        {
          index: "02",
          title: "Development and operations agents",
          objective: "Code changes, shell commands, filesystem, and cloud operations.",
          boundary: "Execution rights, network scope, change impact, and human approval.",
          outcome: "Routine work proceeds autonomously; high-impact changes require approval.",
        },
        {
          index: "03",
          title: "External-action agents",
          objective: "Email, HTTP, browser, CRM, and notification tools.",
          boundary: "Delegated identity, recipients, destination domains, and irreversible actions.",
          outcome: "External actions execute only within authorized identity and destination scope.",
        },
        {
          index: "04",
          title: "Multi-agent platforms",
          objective: "Agent collaboration, shared tools, and distributed runtime.",
          boundary: "Identity propagation, shared privileges, compound paths, and policy consistency.",
          outcome: "Cross-agent behavior receives unified control and audit.",
        },
      ],
      journeyTitle: "Deployment path",
      journey: ["Select workflow", "Define boundary", "Connect AgentGuard", "Verify continuously"],
      cta: "Assess a use case",
    },
    company: {
      meta: {
        title: "Company — Whitzard",
        description:
          "Whitzard builds AI agent security infrastructure, powered by AgentGuard, NUWA Lab research, and the WhitzardAgent open ecosystem.",
      },
      eyebrow: "WHITZARD · 白泽",
      title: "Building security infrastructure for the agentic AI era",
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
          href: "/en/research",
        },
        {
          name: "WhitzardAgent",
          role: "Open ecosystem",
          body: "Public models, tools, data, and evaluation infrastructure.",
          href: "/en/open-ecosystem",
        },
      ],
      principlesTitle: "Team vision",
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
          title: "Public safety goods",
          body: "Build verifiable, reusable models, tools, data, and evaluation infrastructure.",
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
        title: "应用场景 — 白泽（Whitzard）",
        description:
          "面向数据、开发、外部行动和多智能体协作的企业智能体应用场景。",
      },
      eyebrow: "企业智能体应用场景",
      title: "让企业智能体安全自主执行",
      lead: "以运行时边界控制权限、数据与外部行动，释放智能体的业务价值",
      explorer: { objective: "业务目标", boundary: "关键边界", outcome: "受控结果", ariaLabel: "企业智能体应用场景" },
      valueEyebrow: "安全自主",
      valueTitle: "清晰边界释放自主价值",
      valueBody: "AgentGuard Enterprise 将业务边界转化为可执行的运行时控制。",
      primary: "评估应用场景",
      secondary: "了解 AgentGuard Enterprise",
      scenarios: [
        {
          index: "01",
          title: "数据与知识智能体",
          objective: "企业检索、报告生成、客户数据处理",
          boundary: "数据来源、访问权限、衍生内容与外发目标",
          outcome: "保持自动化效率，敏感数据按来源和去向受控",
        },
        {
          index: "02",
          title: "开发与运维智能体",
          objective: "代码修改、Shell、文件系统与云资源操作",
          boundary: "执行权限、网络范围、变更影响与人工审批",
          outcome: "常规任务自主执行，高影响变更进入审批",
        },
        {
          index: "03",
          title: "外部行动智能体",
          objective: "邮件、HTTP、浏览器、CRM 与通知工具",
          boundary: "委托身份、收件人、目标域与不可逆操作",
          outcome: "外部行动仅在授权身份与目标范围内执行",
        },
        {
          index: "04",
          title: "多智能体平台",
          objective: "智能体协作、共享工具与跨节点运行",
          boundary: "身份传播、共享权限、组合链路与策略一致性",
          outcome: "跨智能体行为获得统一控制与审计",
        },
      ],
      journeyTitle: "落地路径",
      journey: ["选择工作流", "建立边界", "接入 AgentGuard", "持续验证"],
      cta: "评估应用场景",
    },
    company: {
      meta: {
        title: "关于我们 — 白泽（Whitzard）",
        description:
          "白泽（Whitzard）打造AI智能体时代的安全基础设施，由 AgentGuard、女娲实验室研究引擎与 WhitzardAgent 开放生态共同支撑。",
      },
      eyebrow: "白泽（Whitzard）",
      title: "打造AI智能体时代的安全基础设施",
      lead: "白泽（Whitzard）连接 AgentGuard、女娲实验室与开放技术生态。",
      architecture: [
        {
          name: "白泽（Whitzard）",
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
          name: "女娲实验室",
          role: "前沿安全研究引擎",
          body: "定义风险、建设评测证据并推动安全模型的研究引擎。",
          href: "/research",
        },
        {
          name: "WhitzardAgent",
          role: "开放生态",
          body: "开放模型、工具、数据与评测基础设施。",
          href: "/open-ecosystem",
        },
      ],
      principlesTitle: "团队愿景",
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
          title: "公共安全产品",
          body: "持续建设可验证、可复用的模型、工具、数据与评测基础设施。",
        },
      ],
      teamTitle: "创始与研究团队",
      teamLead:
        "认识连接智能体安全工程、前沿安全研究与真实网络安全实践的团队。",
    },
    contact: {
      meta: {
        title: "预约演示 — 白泽（Whitzard）",
        description:
          "与白泽（Whitzard）讨论 AgentGuard、企业智能体安全、私有化部署、研究或开源合作。",
      },
      eyebrow: "预约产品演示",
      title: "预约 AgentGuard 演示",
      lead: "提交技术栈、关键权限与部署边界，获取针对性演示。",
      primary: "邮件联系白泽（Whitzard）",
      emailLabel: "商务与合作",
      paths: [
        {
          title: "企业产品演示",
          body: "将 AgentGuard 映射到智能体技术栈、运行时风险、私有化部署与安全运营。",
          subject: "预约 AgentGuard 产品演示",
        },
        {
          title: "女娲实验室研究合作",
          body: "围绕前沿风险评测、智能体安全、安全模型与公开证据展开合作。",
          subject: "女娲实验室研究合作",
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
      response: "邮件将由本地客户端直接发送至白泽（Whitzard）联系邮箱。",
    },
  },
};
