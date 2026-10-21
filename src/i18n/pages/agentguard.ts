import type { Locale } from "../config";

export type AgentGuardCopy = {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; body: string; primary: string; secondary: string; imageAlt: string; imageCaption: string };
  editions: {
    eyebrow: string;
    title: string;
    body: string;
    community: { name: string; label: string; body: string; features: string[]; cta: string };
    enterprise: { name: string; label: string; body: string; features: string[]; cta: string };
  };
  runtime: { eyebrow: string; title: string; body: string };
  controls: { title: string; body: string; items: Array<{ id: string; title: string; body: string }> };
  demo: {
    play: string;
    steps: string[];
    viewerEyebrow: string; viewerTitle: string; viewerBody: string;
    viewerLabel: string; communityBadge: string; openOriginal: string;
    surfaces: Array<{ id: "runtime" | "audit" | "policy" | "generation" | "video"; label: string; title: string; body: string; alt: string }>;
  };
  mechanisms: { eyebrow: string; title: string; items: Array<{ title: string; body: string; detail: string }> };
  deployment: { eyebrow: string; title: string; body: string; nodes: string[]; modes: Array<{ title: string; body: string }> };
  evidence: { eyebrow: string; title: string; items: Array<{ title: string; body: string; label: string; href: string }> };
  cta: { title: string; body: string; primary: string; github: string };
};

export const agentguardCopy: Record<Locale, AgentGuardCopy> = {
  zh: {
    controls: {
      title: "行动边界控制", body: "围绕智能体与模型、工具和数据的交互，配置策略并保留审计依据。",
      items: [
        { id: "system-map", title: "控制位置", body: "在模型与工具执行前后接入安全检查，结合任务上下文识别需要控制的交互边界。" },
        { id: "engine", title: "策略配置", body: "按业务需求配置安全规则与处置方式，管理模型输出、工具使用和数据流转的约束。" },
        { id: "runtime", title: "审计记录", body: "查看运行轨迹、规则命中与处置记录，为问题排查和策略复核提供依据。" },
      ],
    },
    meta: { title: "AgentGuard — 智能体运行时安全控制", description: "AgentGuard 在 LLM、工具、身份与数据边界执行运行时安全策略。" },
    hero: {
      eyebrow: "AGENTGUARD ENTERPRISE",
      title: "智能体运行时安全控制层",
      body: "在 LLM 与工具执行前后识别风险，并执行脱敏、降级、审批或阻断。",
      primary: "加入心愿单",
      secondary: "查看社区版",
      imageAlt: "AgentGuard 运行时控制台，显示流量、审批与审计记录",
      imageCaption: "策略、审批与审计",
    },
    editions: {
      eyebrow: "产品版本",
      title: "社区版与企业版",
      body: "社区版提供开放的运行时安全基础；企业版面向组织级部署与持续安全运营。",
      community: {
        name: "AgentGuard Community",
        label: "开源社区版 · GPLv3",
        body: "面向开发者与研究社区的自主管理版本。",
        features: ["公开框架适配", "四类运行时 Hook", "DSL 策略规则", "可视化配置", "运行轨迹审计", "插件扩展"],
        cta: "查看社区版",
      },
      enterprise: {
        name: "AgentGuard Enterprise",
        label: "企业部署",
        body: "面向组织级部署、集成与持续安全运营。",
        features: ["私有化部署支持", "集中策略与审计集成", "定制适配器", "定制安全策略与模型", "持续验证与技术支持"],
        cta: "加入心愿单",
      },
    },
    runtime: { eyebrow: "AGENTGUARD 交互边界运行时", title: "行动边界控制", body: "持续追踪数据、授权与行动影响，在风险转化为真实后果前执行最小必要控制" },
    demo: {
      play: "播放官方演示",
      steps: ["读取机密文档。", "保留跨工具上下文。", "校验收件人、文档与信任等级。", "放行管理员路径，阻断其他路径。"],
      viewerEyebrow: "社区版公开界面",
      viewerTitle: "策略、审批与审计",
      viewerBody: "展示运行流量、策略配置、审批与审计；企业版在此基础上提供部署与集成支持",
      viewerLabel: "AgentGuard 社区版公开界面",
      communityBadge: "社区版公开界面",
      openOriginal: "查看原图",
      surfaces: [
        { id: "runtime", label: "运行监控", title: "运行流量与决策", body: "按会话查看工具调用、处置结果与策略命中。", alt: "AgentGuard 社区版运行监控界面" },
        { id: "audit", label: "审批与审计", title: "审批、规则与原始事件", body: "关联待审批任务、命中规则和可追溯事件详情。", alt: "AgentGuard 社区版审批与审计界面" },
        { id: "policy", label: "策略配置", title: "结构化规则配置", body: "通过引导式控件配置条件，并同步预览 DSL。", alt: "AgentGuard 社区版可视化策略配置界面" },
        { id: "generation", label: "策略生成", title: "从安全意图生成规则", body: "将自然语言安全意图转换为可审查、可发布的规则。", alt: "AgentGuard 社区版策略生成界面" },
        { id: "video", label: "官方演示", title: "社区版完整操作流程", body: "查看运行监控、策略配置与审计流程。", alt: "AgentGuard 社区版官方演示" },
      ],
    },
    mechanisms: {
      eyebrow: "核心机制",
      title: "轨迹分析与风险处置",
      items: [
        { title: "全链建模", body: "关联推理、工具、身份与数据来源。", detail: "Reasoning · Behavior · Data" },
        { title: "规则与模型研判", body: "确定性规则与安全模型共同判断。", detail: "DSL × Safety Model" },
        { title: "精细处置", body: "按风险选择脱敏、降级、审批或阻断。", detail: "Sanitize · Degrade · Approve · Deny" },
      ],
    },
    deployment: {
      eyebrow: "接入与部署",
      title: "信任边界内的安全部署",
      body: "通过 Hook、Sidecar 或 Gateway 接入，策略与证据可留在企业环境。",
      nodes: ["智能体框架", "SDK · Sidecar · Gateway", "AgentGuard Runtime", "模型 · 工具 · MCP · 数据", "私有控制面"],
      modes: [
        { title: "应用内嵌", body: "Hook 提供完整运行时上下文。" },
        { title: "基础设施执行", body: "Gateway 统一控制工具与数据边界。" },
        { title: "私有化运营", body: "策略、轨迹与证据留在企业环境。" },
      ],
    },
    evidence: {
      eyebrow: "可核实证据",
      title: "代码、模型与研究",
      items: [
        { title: "AgentGuard Community", body: "面向开发者和研究社区的开源运行时安全基础。", label: "社区版 · GitHub", href: "https://github.com/WhitzardAgent/AgentGuard" },
        { title: "安全模型", body: "推理校准、意图与推理安全模型。", label: "开源生态", href: "/open-ecosystem" },
        { title: "女娲实验室研究", body: "前沿风险、智能体安全与 AI 控制研究。", label: "研究成果", href: "/nuwa/research" },
      ],
    },
    cta: { title: "为智能体运行环境建立控制边界", body: "说明技术栈、关键权限与部署约束，加入产品心愿单。", primary: "加入心愿单", github: "查看社区版" },
  },
  en: {
    controls: {
      title: "Action boundary control", body: "Configure policies and retain audit evidence across agent interactions with models, tools, and data.",
      items: [
        { id: "system-map", title: "Control points", body: "Apply security checks before and after model and tool execution, using task context to identify the interaction boundaries that need controls." },
        { id: "engine", title: "Policy configuration", body: "Configure security rules and responses around business requirements, with constraints on model output, tool use, and data flows." },
        { id: "runtime", title: "Audit records", body: "Review execution traces, rule matches, and control decisions to support investigation and policy review." },
      ],
    },
    meta: { title: "AgentGuard — Runtime Security for AI Agents", description: "AgentGuard enforces runtime policy across LLM, tool, identity, and data boundaries." },
    hero: {
      eyebrow: "AGENTGUARD ENTERPRISE",
      title: "Runtime security for AI agents",
      body: "Apply security policies before and after model inference and tool calls, with sanitization, restricted execution, approval, or blocking.",
      primary: "Join the waitlist",
      secondary: "View Community Edition",
      imageAlt: "AgentGuard runtime console showing traffic, approvals, and audit records",
      imageCaption: "Policy, approval, and audit",
    },
    editions: {
      eyebrow: "EDITIONS",
      title: "Community and Enterprise editions",
      body: "Community provides the open runtime-security foundation. Enterprise supports organization-wide deployment and continuous security operations.",
      community: {
        name: "AgentGuard Community",
        label: "Open source · GPLv3",
        body: "A self-managed edition for developers and researchers.",
        features: ["Public framework adapters", "Four runtime hooks", "DSL policy rules", "Visual configuration", "Runtime audit", "Plugin extensions"],
        cta: "View Community Edition",
      },
      enterprise: {
        name: "AgentGuard Enterprise",
        label: "Enterprise deployment",
        body: "For organization-wide deployment, integration, and continuous security operations.",
        features: ["Private deployment support", "Central policy and audit integration", "Custom adapters", "Custom policies and safety models", "Continuous validation and technical support"],
        cta: "Join the waitlist",
      },
    },
    runtime: { eyebrow: "AGENTGUARD INTERACTION BOUNDARY RUNTIME", title: "Action boundary control", body: "Track data, authorization, and action impact continuously, then apply the minimum necessary control before risk becomes real-world impact." },
    demo: {
      play: "Play official demo",
      steps: ["Retrieve the confidential document.", "Retain cross-tool context.", "Check recipient, document, and trust.", "Allow the admin path; deny the other path."],
      viewerEyebrow: "COMMUNITY EDITION",
      viewerTitle: "Policy, approval, and audit",
      viewerBody: "See runtime traffic, policy configuration, approval, and audit. Enterprise adds deployment and integration support.",
      viewerLabel: "AgentGuard Community Edition interface",
      communityBadge: "Community Edition interface",
      openOriginal: "View original",
      surfaces: [
        { id: "runtime", label: "Runtime", title: "Runtime traffic and decisions", body: "Inspect tool calls, policy matches, and decisions by session.", alt: "AgentGuard Community runtime monitoring interface" },
        { id: "audit", label: "Approval & audit", title: "Approvals, rules, and raw events", body: "Connect pending approvals, matched rules, and traceable event details.", alt: "AgentGuard Community approval and audit interface" },
        { id: "policy", label: "Policy editor", title: "Structured policy configuration", body: "Configure conditions through guided controls while previewing the DSL.", alt: "AgentGuard Community visual policy editor" },
        { id: "generation", label: "Policy generation", title: "Generate policy from security intent", body: "Convert natural-language security intent into reviewable policy.", alt: "AgentGuard Community policy generation interface" },
        { id: "video", label: "Official demo", title: "Complete Community workflow", body: "Follow runtime monitoring, policy configuration, and audit.", alt: "AgentGuard Community official demo" },
      ],
    },
    mechanisms: {
      eyebrow: "CORE MECHANISM",
      title: "Analysis and response",
      items: [
        { title: "Full-chain context", body: "Connect reasoning, tools, identity, and provenance.", detail: "Reasoning · Behavior · Data" },
        { title: "Policy and model analysis", body: "Combine deterministic rules with safety models.", detail: "DSL × Safety Model" },
        { title: "Precise response", body: "Sanitize, degrade, approve, or deny by risk.", detail: "Sanitize · Degrade · Approve · Deny" },
      ],
    },
    deployment: {
      eyebrow: "INTEGRATION & DEPLOYMENT",
      title: "Controls within the trust boundary",
      body: "Connect through hooks, sidecars, or gateways. Keep policy and evidence private.",
      nodes: ["Agent frameworks", "SDK · Sidecar · Gateway", "AgentGuard Runtime", "Models · Tools · MCP · Data", "Private Control Plane"],
      modes: [
        { title: "Application embedded", body: "Hooks preserve full runtime context." },
        { title: "Infrastructure enforced", body: "Gateways centralize tool and data control." },
        { title: "Privately operated", body: "Keep policy, traces, and evidence private." },
      ],
    },
    evidence: {
      eyebrow: "VERIFIABLE EVIDENCE",
      title: "Code, models, and research",
      items: [
        { title: "AgentGuard Community", body: "The open runtime-security foundation for developers and researchers.", label: "Community · GitHub", href: "https://github.com/WhitzardAgent/AgentGuard" },
        { title: "Safety models", body: "Models for reasoning alignment, intent analysis, and reasoning safety.", label: "Ecosystem", href: "/open-ecosystem" },
        { title: "NUWA research", body: "Frontier risk, agent safety, and AI control.", label: "Research", href: "/nuwa/research" },
      ],
    },
    cta: { title: "Integrate runtime security", body: "Share your stack, critical permissions, and deployment constraints through the product waitlist.", primary: "Join the waitlist", github: "Community Edition" },
  },
};
