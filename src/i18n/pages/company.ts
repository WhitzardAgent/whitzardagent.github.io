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
      tasks: string;
      securityDimensions: string[];
      value: string;
      controls: { agentguard: string; gateway: string };
    }>;
    explorer: { tasks: string; securityDimensions: string; value: string; ariaLabel: string };
    controlsTitle: string;
    controlScope: string;
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
          "Security for office productivity, development and operations, computer-use agents, and AI workflows, with controls for data, permissions, tools, and actions.",
      },
      eyebrow: "ENTERPRISE AGENT USE CASES",
      title: "Security for enterprise agent workflows",
      lead: "Bring data protection, access policies, and action controls into everyday agent workflows.",
      explorer: { tasks: "Typical tasks", securityDimensions: "Security dimensions", value: "Business value", ariaLabel: "Enterprise agent use cases" },
      controlsTitle: "Controls by use case",
      controlScope: "Available controls depend on the connected clients, tools, and observable interactions. Browser, desktop, and mobile describe the application scope; product support is assessed for the intended integration.",
      valueEyebrow: "SECURE AUTONOMY",
      valueTitle: "Security across access and execution",
      valueBody: "AgentGuard provides runtime policies and audit records. WhitzardGateway brings together model access, team permissions, runtime safeguards, and usage management.",
      primary: "Assess a use case",
      secondary: "Explore AgentGuard Enterprise",
      scenarios: [
        {
          index: "01",
          title: "Office productivity",
          tasks: "Knowledge search, document processing, email, and collaboration.",
          securityDimensions: ["Data protection", "Access permissions", "Prompt injection defenses", "Outbound data controls"],
          value: "Apply data and access boundaries as information is retrieved and shared, reducing the risk of sensitive data exposure and unauthorized access.",
          controls: { agentguard: "Apply policies to retrieved content, tool calls, and outbound data, retaining records for review.", gateway: "Manage model access and agent credentials centrally, with request safeguards and activity and usage records." },
        },
        {
          index: "02",
          title: "Development & operations",
          tasks: "Code changes, command execution, environment configuration, and resource management.",
          securityDimensions: ["Code and credential protection", "Command permissions", "Change controls", "Activity auditing"],
          value: "Constrain high-risk commands and production changes so automated operations remain controlled and traceable.",
          controls: { agentguard: "Configure policies and approval requirements at command and tool boundaries, retaining change and decision records.", gateway: "Manage access to supported model services and client configurations, with runtime protection and traceable usage." },
        },
        {
          index: "03",
          title: "Computer-use agents",
          tasks: "Navigation, data entry, and business tasks in browsers, desktop software, and mobile apps.",
          securityDimensions: ["Defenses against malicious UI instructions", "Sensitive information protection", "Action scope controls", "Critical submission controls"],
          value: "Set boundaries for autonomous interface actions to reduce mistakes, unauthorized operations, and unintended submissions.",
          controls: { agentguard: "Apply policies to observable model and tool interactions, with checks around sensitive actions and records for review.", gateway: "Manage connected agents' model access, credentials, and protection policies, and review gateway-visible activity." },
        },
        {
          index: "04",
          title: "AI workflows",
          tasks: "Knowledge-base Q&A, tool orchestration, and cross-system processes on workflow platforms such as Dify.",
          securityDimensions: ["Data flow protection", "Node permissions", "Tool invocation controls", "Workflow auditing"],
          value: "Apply security requirements to workflow nodes and cross-system calls, supporting consistent management and investigation.",
          controls: { agentguard: "Apply runtime policies to model and tool interactions within a workflow, with context and records for investigation.", gateway: "Centralize model connections and access policies for connected workflows, with protection, activity, and usage records." },
        },
      ],
      journeyTitle: "Deployment path",
      journey: ["Select a use case", "Define security requirements", "Plan product integration", "Validate the controls"],
      cta: "Assess a use case",
    },
    company: {
      meta: {
        title: "About Us — Whitzard",
        description:
          "Whitzard builds security infrastructure for the agentic AI era through AgentGuard, NUWA research, and the open ecosystem.",
      },
      eyebrow: "WHITZARD · 白泽",
      title: "Security infrastructure for the agentic AI era",
      lead: "Whitzard combines runtime control through AgentGuard, frontier-risk evidence through NUWA, and reusable safety technology through its open ecosystem.",
      architecture: [
        {
          name: "Whitzard",
          role: "Company brand · AI Agent Security Infrastructure",
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
          name: "NUWA",
          role: "Frontier AI safety research",
          body: "Research that defines risk, builds evaluation evidence, and advances safety models.",
          href: "/en/nuwa/research",
        },
        {
          name: "Whitzard Open Ecosystem",
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
      teamTitle: "Founders",
      teamLead:
        "Founded by Jiarun Dai and Xudong Pan, with expertise in systems security and AI safety.",
    },
    contact: {
      meta: {
        title: "Contact Whitzard",
        description:
          "Talk with Whitzard about AgentGuard, WhitzardGateway, team deployment, research, or open-source collaboration.",
      },
      eyebrow: "CONTACT",
      title: "Product and research enquiries",
      lead: "Discuss your agent architecture, security requirements, and deployment constraints.",
      primary: "Email Whitzard",
      emailLabel: "Business and collaboration",
      paths: [
        {
          title: "Product access",
          body: "Discuss AgentGuard or WhitzardGateway, your agent stack, security requirements, and team deployment.",
          subject: "Whitzard product enquiry",
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
      prepareTitle: "Technical requirements",
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
          "面向通用办公、开发运维、GUI 智能体与 AI 工作流，围绕数据、权限、工具和行动提供安全控制。",
      },
      eyebrow: "企业智能体应用场景",
      title: "企业智能体安全应用",
      lead: "将数据保护、权限管理与行动控制融入智能体业务流程。",
      explorer: { tasks: "典型任务", securityDimensions: "安全维度", value: "应用价值", ariaLabel: "企业智能体应用场景" },
      controlsTitle: "场景与安全控制",
      controlScope: "具体控制范围取决于所接入的客户端、工具及可观测交互。浏览器、桌面与移动端描述应用范围，产品支持按实际接入方案确认。",
      valueEyebrow: "安全自主",
      valueTitle: "从统一接入到运行控制",
      valueBody: "AgentGuard 提供运行时策略与审计记录；WhitzardGateway 连接模型接入、团队权限、运行防护与用量管理。",
      primary: "评估应用场景",
      secondary: "了解 AgentGuard Enterprise",
      scenarios: [
        {
          index: "01",
          title: "通用办公",
          tasks: "知识检索、文档处理、邮件与协作",
          securityDimensions: ["数据保护", "访问权限", "提示注入防护", "外发控制"],
          value: "在知识访问与信息流转中落实数据和权限边界，降低敏感信息泄露与越权访问风险。",
          controls: { agentguard: "围绕检索内容、工具调用与对外发送配置运行时策略，保留处置与审计依据。", gateway: "统一管理模型接入与智能体访问凭证，结合请求防护查看行为记录与用量。" },
        },
        {
          index: "02",
          title: "开发运维",
          tasks: "代码修改、命令执行、环境配置与资源管理",
          securityDimensions: ["代码与凭证保护", "命令权限", "变更控制", "操作审计"],
          value: "约束高风险命令与生产变更，使自动化操作可控、可追溯。",
          controls: { agentguard: "在命令与工具交互边界配置策略及审批要求，记录变更与处置依据。", gateway: "按支持的模型服务与客户端配置管理接入权限，结合运行防护追踪使用情况。" },
        },
        {
          index: "03",
          title: "GUI 智能体",
          tasks: "浏览器、桌面及移动应用中的导航、录入与业务操作",
          securityDimensions: ["界面指令干扰防护", "敏感信息保护", "操作范围控制", "关键提交控制"],
          value: "为跨界面的自主操作建立边界，降低误操作、越权及非预期提交风险。",
          controls: { agentguard: "围绕可观测的模型与工具交互配置策略，对敏感操作设置检查并保留审计记录。", gateway: "管理所接入智能体的模型访问、凭证与防护策略，查看网关可观测的行为记录。" },
        },
        {
          index: "04",
          title: "AI 工作流",
          tasks: "知识库问答、工具编排与跨系统流程，涵盖 Dify 等工作流平台",
          securityDimensions: ["数据流转保护", "节点权限", "工具调用控制", "流程审计"],
          value: "将安全要求落实到流程节点与跨系统调用，支持统一管理和问题追溯。",
          controls: { agentguard: "在流程中的模型与工具交互处实施运行时策略，结合上下文与记录排查风险。", gateway: "集中配置所接入工作流的模型连接与访问策略，记录防护、行为及用量信息。" },
        },
      ],
      journeyTitle: "落地路径",
      journey: ["选择应用场景", "明确安全要求", "制定接入方案", "验证控制效果"],
      cta: "评估应用场景",
    },
    company: {
      meta: {
        title: "关于我们 — 白泽（Whitzard）",
        description:
          "白泽（Whitzard）打造智能体时代的安全基础设施，由 AgentGuard、女娲实验室与开放生态共同支撑。",
      },
      eyebrow: "白泽（Whitzard）",
      title: "打造智能体时代的安全基础设施",
      lead: "白泽以 AgentGuard 建立智能体运行时控制，以女娲实验室建设前沿风险证据，并通过开放生态推动可复用的安全技术。",
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
          role: "前沿 AI 风险研究",
          body: "定义风险、建设评测证据并推动安全模型的研究引擎。",
          href: "/nuwa/research",
        },
        {
          name: "白泽开放生态",
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
      teamTitle: "创始团队",
      teamLead:
        "由戴嘉润、潘旭东共同创立，研究与工程背景涵盖系统安全与 AI 安全。",
    },
    contact: {
      meta: {
        title: "联系白泽 — 白泽（Whitzard）",
        description:
          "与白泽讨论 AgentGuard、WhitzardGateway、团队部署、研究或开源合作。",
      },
      eyebrow: "联系团队",
      title: "产品咨询与研究合作",
      lead: "介绍技术环境、管理需求与部署要求，讨论产品接入或研究合作。",
      primary: "邮件联系白泽（Whitzard）",
      emailLabel: "商务与合作",
      paths: [
        {
          title: "产品接入",
          body: "围绕 AgentGuard 或 WhitzardGateway，讨论智能体技术栈、安全需求与团队部署。",
          subject: "白泽产品咨询",
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
      prepareTitle: "技术需求",
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
