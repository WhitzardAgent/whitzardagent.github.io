import type { Locale } from "../config";

export type DevelopersCopy = {
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
  frameworkEyebrow: string;
  frameworkTitle: string;
  frameworkLead: string;
  frameworkDisclaimer: string;
  consoleEyebrow: string;
  consoleTitle: string;
  consoleBody: string;
  consolePoints: string[];
  consoleContactLabel: string;
  consoleContactCta: string;
  docsEyebrow: string;
  docsTitle: string;
  docsBody: string;
  communityEyebrow: string;
  communityTitle: string;
  communityLead: string;
};

export const developersCopy: Record<Locale, DevelopersCopy> = {
  en: {
    meta: {
      title: "Open Ecosystem — Whitzard",
      description: "Whitzard's open ecosystem brings together open-source projects, framework compatibility, and shared technical resources.",
    },
    eyebrow: "Open Ecosystem",
    title: "Open Ecosystem",
    lead: "Open-source projects, framework compatibility, and shared resources for safer agent systems.",
    github: "GitHub organization",
    hf: "Hugging Face",
    coreEyebrow: "Core capabilities",
    coreTitle: "Four open foundations",
    coreLead: "Agent development, safety evaluation, thought correction, and behavior-chain auditing.",
    directoryTitle: "Complete project directory",
    categories: [
      { key: "runtime", title: "Runtime Security", body: "Controls, defenses, and containment for agents in action." },
      { key: "models", title: "Safety Models", body: "Lightweight models for thought alignment, intent, trust, and reasoning safety." },
      { key: "evaluation", title: "Evaluation", body: "Evaluation frameworks, benchmarks, and penetration-testing infrastructure." },
      { key: "infrastructure", title: "Agent Infrastructure", body: "Frameworks, representations, simulators, and agent system building blocks." },
      { key: "cyber", title: "Cybersecurity", body: "Cyber agents, training pipelines, repositories, and datasets." },
    ],
    status: "Open project",
    frameworkEyebrow: "Framework compatibility",
    frameworkTitle: "Supported agent frameworks",
    frameworkLead: "AgentGuard provides adapters for the following agent development frameworks.",
    frameworkDisclaimer: "Their appearance indicates adapter compatibility, not partnership or endorsement.",
    consoleEyebrow: "Console",
    consoleTitle: "Whitzard Console",
    consoleBody: "The Whitzard Console will be the unified entry point for all Whitzard services. After entering the console, you access specific products — AgentGuard or model services — within their respective contexts. The console is not yet available.",
    consolePoints: [
      "The console is the unified entry point for Whitzard services.",
      "It is branded as Whitzard Console, not tied to a single product.",
      "No login form, registration, or authentication is available yet.",
      "When the console launches, a real URL will be published here.",
    ],
    consoleContactLabel: "Need product support now?",
    consoleContactCta: "Contact us",
    docsEyebrow: "Documentation",
    docsTitle: "Documentation & resources",
    docsBody: "Explore Whitzard's open-source projects on GitHub and models on Hugging Face, with source-linked technical context for each project.",
    communityEyebrow: "Community",
    communityTitle: "Connect with us",
    communityLead: "Follow our research, join the open ecosystem, and reach out for collaboration.",
  },
  zh: {
    meta: {
      title: "开放生态 — 白泽（Whitzard）",
      description: "白泽开放生态汇集开源项目、框架兼容能力与共享技术资源。",
    },
    eyebrow: "开放生态",
    title: "开放生态",
    lead: "汇集开源项目、框架兼容能力与智能体安全共享资源。",
    github: "GitHub 组织",
    hf: "Hugging Face",
    coreEyebrow: "核心能力",
    coreTitle: "四项开放技术基础",
    coreLead: "覆盖智能体开发、安全评测、思维矫正与行为链审计。",
    directoryTitle: "完整项目目录",
    categories: [
      { key: "runtime", title: "运行时安全", body: "面向智能体真实行动过程的控制、防护与隔离能力。" },
      { key: "models", title: "安全模型", body: "用于思维校准、意图、信任与推理安全的轻量模型。" },
      { key: "evaluation", title: "安全评测", body: "评测框架、基准与渗透测试基础设施。" },
      { key: "infrastructure", title: "智能体基础设施", body: "框架、中间表示、模拟器与智能体系统基础组件。" },
      { key: "cyber", title: "网络安全", body: "网络安全智能体、训练流程、代码仓库与数据集。" },
    ],
    status: "开放项目",
    frameworkEyebrow: "框架兼容",
    frameworkTitle: "支持的智能体框架",
    frameworkLead: "AgentGuard 为以下智能体开发框架提供适配器。",
    frameworkDisclaimer: "它们的出现表示适配兼容，不代表合作或背书关系。",
    consoleEyebrow: "控制台",
    consoleTitle: "白泽控制台",
    consoleBody: "白泽控制台将是所有白泽服务的统一进入方式。进入控制台后，在各自产品上下文中访问具体产品——AgentGuard 或模型服务。控制台尚未上线。",
    consolePoints: [
      "控制台是白泽服务的统一进入方式。",
      "品牌为白泽控制台，不绑定单一产品。",
      "当前没有登录表单、注册或认证功能。",
      "控制台上线后，真实的控制台地址将发布在这里。",
    ],
    consoleContactLabel: "现在需要产品支持？",
    consoleContactCta: "联系我们",
    docsEyebrow: "文档与资源",
    docsTitle: "文档与资源",
    docsBody: "在 GitHub 上探索白泽的开源项目，在 Hugging Face 上查看模型，并通过可核实来源了解每个项目。",
    communityEyebrow: "社区",
    communityTitle: "联系我们",
    communityLead: "关注研究动态，加入开放生态，或与我们探讨合作。",
  },
};
