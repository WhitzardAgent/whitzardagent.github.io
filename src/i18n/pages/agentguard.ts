import type { Locale } from "../config";

export type AgentGuardCopy = {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; body: string; primary: string; secondary: string; imageAlt: string; imageCaption: string };
  runtime: { eyebrow: string; title: string; body: string };
  demo: {
    eyebrow: string; title: string; body: string; play: string;
    dashboardTitle: string; dashboardBody: string; policyTitle: string; policyBody: string;
    generationTitle: string; generationBody: string;
    allowed: { label: string; recipient: string; result: string; reason: string };
    denied: { label: string; recipient: string; result: string; reason: string };
    stepsTitle: string; steps: string[];
  };
  mechanisms: { eyebrow: string; title: string; items: Array<{ title: string; body: string; detail: string }> };
  deployment: { eyebrow: string; title: string; body: string; nodes: string[]; modes: Array<{ title: string; body: string }> };
  evidence: { eyebrow: string; title: string; items: Array<{ title: string; body: string; label: string; href: string }> };
  cta: { title: string; body: string; primary: string; github: string };
};

export const agentguardCopy: Record<Locale, AgentGuardCopy> = {
  zh: {
    meta: { title: "AgentGuard — 智能体运行时安全控制", description: "AgentGuard 在 LLM、工具、身份与数据边界执行运行时安全策略。" },
    hero: {
      eyebrow: "AGENTGUARD · 企业级智能体安全",
      title: "智能体运行时安全控制层",
      body: "在 LLM 与工具执行前后识别风险，并执行脱敏、降级、审批或阻断。",
      primary: "预约演示",
      secondary: "查看源码",
      imageAlt: "AgentGuard 运行时控制台，显示流量、审批与审计记录",
      imageCaption: "策略、审批与审计",
    },
    runtime: { eyebrow: "运行时决策", title: "完整轨迹，精细处置", body: "关联身份、工具与数据流，在行动前执行策略。" },
    demo: {
      eyebrow: "真实产品界面",
      title: "真实策略，真实处置",
      body: "基于公开控制台与跨工具规则，展示读取、校验与阻断。",
      play: "播放官方演示",
      dashboardTitle: "运行时控制台",
      dashboardBody: "流量、审批、规则与审计集中呈现。",
      policyTitle: "可视化策略配置",
      policyBody: "通过结构化控件配置访问与轨迹规则。",
      generationTitle: "策略生成",
      generationBody: "将安全意图转化为可审查策略。",
      allowed: { label: "允许路径", recipient: "admin@example.com", result: "ALLOW", reason: "管理员地址符合机密文档发送规则。" },
      denied: { label: "阻断路径", recipient: "alice@example.com", result: "DENY", reason: "低信任主体不得向非管理员发送机密文档。" },
      stepsTitle: "执行过程",
      steps: ["读取机密文档。", "保留跨工具上下文。", "校验收件人、文档与信任等级。", "放行管理员路径，阻断其他路径。"],
    },
    mechanisms: {
      eyebrow: "核心机制",
      title: "从轨迹到处置",
      items: [
        { title: "全链建模", body: "关联推理、工具、身份与数据来源。", detail: "Thought · Behavior · Data" },
        { title: "协同研判", body: "确定性规则与安全模型共同判断。", detail: "DSL × Safety Model" },
        { title: "精细处置", body: "按风险选择脱敏、降级、审批或阻断。", detail: "Sanitize · Degrade · Approve · Deny" },
      ],
    },
    deployment: {
      eyebrow: "接入与部署",
      title: "控制能力部署在信任边界内",
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
        { title: "AgentGuard", body: "公开的智能体运行时安全项目。", label: "GitHub", href: "https://github.com/WhitzardAgent/AgentGuard" },
        { title: "安全模型", body: "思维校准、意图与推理安全模型。", label: "开源生态", href: "/open-ecosystem" },
        { title: "NUWA 研究", body: "前沿风险、智能体安全与 AI 控制研究。", label: "研究成果", href: "/research" },
      ],
    },
    cta: { title: "为智能体运行环境建立控制边界", body: "评估技术栈、关键权限与部署约束。", primary: "预约演示", github: "查看源码" },
  },
  en: {
    meta: { title: "AgentGuard — Runtime Security for AI Agents", description: "AgentGuard enforces runtime policy across LLM, tool, identity, and data boundaries." },
    hero: {
      eyebrow: "AGENTGUARD · ENTERPRISE AGENT SECURITY",
      title: "Control the full agent runtime.",
      body: "Control risk before and after LLM and tool execution with sanitization, degradation, approval, or denial.",
      primary: "Book a Demo",
      secondary: "View Source",
      imageAlt: "AgentGuard runtime console showing traffic, approvals, and audit records",
      imageCaption: "Policy, approval, and audit",
    },
    runtime: { eyebrow: "RUNTIME DECISIONS", title: "Full trace. Precise control.", body: "Link identity, tools, and data flow before action executes." },
    demo: {
      eyebrow: "PRODUCT SURFACE",
      title: "Real policy. Real decisions.",
      body: "A public console and cross-tool rule show retrieval, validation, and denial.",
      play: "Play official demo",
      dashboardTitle: "Runtime console",
      dashboardBody: "Traffic, approvals, policy, and audit in one view.",
      policyTitle: "Visual policy editor",
      policyBody: "Configure access and trajectory rules with structured controls.",
      generationTitle: "Policy generation",
      generationBody: "Turn security intent into reviewable policy.",
      allowed: { label: "Allowed", recipient: "admin@example.com", result: "ALLOW", reason: "The admin address satisfies the document rule." },
      denied: { label: "Denied", recipient: "alice@example.com", result: "DENY", reason: "A low-trust principal cannot send the document externally." },
      stepsTitle: "Execution",
      steps: ["Retrieve the confidential document.", "Retain cross-tool context.", "Check recipient, document, and trust.", "Allow the admin path; deny the other path."],
    },
    mechanisms: {
      eyebrow: "CORE MECHANISM",
      title: "Trace. Judge. Respond.",
      items: [
        { title: "Full-chain context", body: "Connect reasoning, tools, identity, and provenance.", detail: "Thought · Behavior · Data" },
        { title: "Collaborative judgment", body: "Combine deterministic rules with safety models.", detail: "DSL × Safety Model" },
        { title: "Precise response", body: "Sanitize, degrade, approve, or deny by risk.", detail: "Sanitize · Degrade · Approve · Deny" },
      ],
    },
    deployment: {
      eyebrow: "INTEGRATION & DEPLOYMENT",
      title: "Enforce inside the trust boundary.",
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
      title: "Code, models, research.",
      items: [
        { title: "AgentGuard", body: "The public agent runtime security project.", label: "GitHub", href: "https://github.com/WhitzardAgent/AgentGuard" },
        { title: "Safety models", body: "Thought, intent, and reasoning safety models.", label: "Ecosystem", href: "/en/open-ecosystem" },
        { title: "NUWA research", body: "Frontier risk, agent safety, and AI control.", label: "Research", href: "/en/research" },
      ],
    },
    cta: { title: "Set a control boundary for agent runtime.", body: "Assess the stack, critical permissions, and deployment constraints.", primary: "Book a Demo", github: "View Source" },
  },
};
