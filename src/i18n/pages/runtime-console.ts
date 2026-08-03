import type { Locale } from "../config";

export type RuntimeDecisionFamily = "allow" | "sanitize" | "align" | "degrade" | "approve" | "deny";

export type RuntimeScenario = {
  id: "data" | "behavior" | "approval";
  tab: string;
  label: string;
  framework: string;
  request: string;
  principal: { name: string; trust: string; scopes: string[] };
  steps: Array<{ name: string; detail: string; phase: string; tone?: "risk" | "safe" }>;
  signals: string[];
  policies: string[];
  decision: string;
  decisionFamily: RuntimeDecisionFamily;
  resolution: string;
};

export type RuntimeConsoleCopy = {
  ariaLabel: string;
  eyebrow: string;
  title: string;
  body: string;
  demoLabel: string;
  supportedLabel: string;
  protectedLabel: string;
  requestLabel: string;
  principalLabel: string;
  trustLabel: string;
  scopeLabel: string;
  evidenceLabel: string;
  policyLabel: string;
  decisionLabel: string;
  finalLabel: string;
  replay: string;
  inspect: string;
  approveOnce: string;
  reject: string;
  approved: string;
  rejected: string;
  decisions: string[];
  phases: string[];
  frameworks: string[];
  scenarios: RuntimeScenario[];
};

export const runtimeConsoleCopy: Record<Locale, RuntimeConsoleCopy> = {
  zh: {
    ariaLabel: "AgentGuard 运行时策略演示",
    eyebrow: "运行时决策",
    title: "完整轨迹，精细处置",
    body: "关联身份、工具与数据流，在行动前执行策略。",
    demoLabel: "策略演示",
    supportedLabel: "已支持接入",
    protectedLabel: "覆盖阶段",
    requestLabel: "用户任务",
    principalLabel: "执行主体",
    trustLabel: "信任",
    scopeLabel: "权限",
    evidenceLabel: "风险证据",
    policyLabel: "命中策略",
    decisionLabel: "处置",
    finalLabel: "结果",
    replay: "重新运行",
    inspect: "查看事件",
    approveOnce: "批准一次",
    reject: "拒绝",
    approved: "已批准并继续执行",
    rejected: "已拒绝，写入未执行",
    decisions: ["ALLOW", "SANITIZE", "ALIGN", "DEGRADE", "APPROVE", "DENY"],
    phases: ["LLM 前", "LLM 后", "工具前", "工具后", "MCP", "数据血缘"],
    frameworks: ["LangChain", "AutoGen", "OpenAI Agents", "LangGraph", "LlamaIndex", "Dify", "OpenClaw"],
    scenarios: [
      {
        id: "data",
        tab: "数据流控制",
        label: "客户续约报告外发",
        framework: "LangGraph",
        request: "汇总高价值客户续约风险，并同步到外部 CRM。",
        principal: { name: "sales-ops-agent", trust: "3", scopes: ["sensitive_export"] },
        steps: [
          { name: "database_query", detail: "读取客户数据 · PII", phase: "TOOL AFTER", tone: "safe" },
          { name: "report.generate", detail: "生成续约摘要", phase: "TOOL AFTER" },
          { name: "http.post", detail: "外部 CRM webhook", phase: "TOOL BEFORE", tone: "risk" },
        ],
        signals: ["PII 数据血缘", "外部数据出口", "字段级脱敏"],
        policies: ["chain-redact-pii-on-http-post"],
        decision: "SANITIZE → ALLOW WITH AUDIT",
        decisionFamily: "sanitize",
        resolution: "脱敏后放行，并写入审计。",
      },
      {
        id: "behavior",
        tab: "行为链阻断",
        label: "外部指令进入 Shell",
        framework: "OpenAI Agents",
        request: "读取外部排障文档，并执行其中的修复命令。",
        principal: { name: "support-agent", trust: "2", scopes: ["read_only"] },
        steps: [
          { name: "browser.fetch", detail: "外部内容 · 不可信", phase: "TOOL AFTER", tone: "risk" },
          { name: "llm.respond", detail: "生成修复计划", phase: "LLM AFTER" },
          { name: "shell.exec", detail: "请求执行命令", phase: "TOOL BEFORE", tone: "risk" },
        ],
        signals: ["不可信输入", "目标漂移", "LLM 输出进入 Shell"],
        policies: ["chain-deny-llm-output-to-shell", "chain-review-goal-drift-with-user-input"],
        decision: "DENY",
        decisionFamily: "deny",
        resolution: "命令未执行，风险轨迹已留存。",
      },
      {
        id: "approval",
        tab: "权限审批",
        label: "生产数据库写入",
        framework: "Dify",
        request: "更新生产数据库中的客户状态，并通知运营团队。",
        principal: { name: "ops-agent", trust: "2", scopes: ["customer_ops"] },
        steps: [
          { name: "database_query", detail: "生产库写入", phase: "TOOL BEFORE", tone: "risk" },
          { name: "slack.post", detail: "通知运营团队", phase: "TOOL BEFORE" },
        ],
        signals: ["生产环境", "低信任写操作", "人工确认"],
        policies: ["review-db-write-low-trust"],
        decision: "HUMAN_CHECK",
        decisionFamily: "approve",
        resolution: "等待授权，原始操作暂停。",
      },
    ],
  },
  en: {
    ariaLabel: "AgentGuard runtime policy demonstration",
    eyebrow: "RUNTIME DECISIONS",
    title: "Full trace. Precise control.",
    body: "Link identity, tools, and data flow before action executes.",
    demoLabel: "POLICY DEMO",
    supportedLabel: "SUPPORTED ADAPTERS",
    protectedLabel: "CONTROL SURFACES",
    requestLabel: "TASK",
    principalLabel: "PRINCIPAL",
    trustLabel: "TRUST",
    scopeLabel: "SCOPES",
    evidenceLabel: "RISK EVIDENCE",
    policyLabel: "MATCHED POLICY",
    decisionLabel: "DECISION",
    finalLabel: "RESULT",
    replay: "Run again",
    inspect: "Inspect event",
    approveOnce: "Approve once",
    reject: "Reject",
    approved: "Approved and resumed",
    rejected: "Rejected; write not executed",
    decisions: ["ALLOW", "SANITIZE", "ALIGN", "DEGRADE", "APPROVE", "DENY"],
    phases: ["BEFORE LLM", "AFTER LLM", "BEFORE TOOL", "AFTER TOOL", "MCP", "DATA LINEAGE"],
    frameworks: ["LangChain", "AutoGen", "OpenAI Agents", "LangGraph", "LlamaIndex", "Dify", "OpenClaw"],
    scenarios: [
      {
        id: "data",
        tab: "Data flow",
        label: "External renewal report",
        framework: "LangGraph",
        request: "Summarize high-value renewal risk and sync it to an external CRM.",
        principal: { name: "sales-ops-agent", trust: "3", scopes: ["sensitive_export"] },
        steps: [
          { name: "database_query", detail: "Customer data · PII", phase: "TOOL AFTER", tone: "safe" },
          { name: "report.generate", detail: "Renewal summary", phase: "TOOL AFTER" },
          { name: "http.post", detail: "External CRM webhook", phase: "TOOL BEFORE", tone: "risk" },
        ],
        signals: ["PII lineage", "External sink", "Field redaction"],
        policies: ["chain-redact-pii-on-http-post"],
        decision: "SANITIZE → ALLOW WITH AUDIT",
        decisionFamily: "sanitize",
        resolution: "Redact, allow, and record the audit event.",
      },
      {
        id: "behavior",
        tab: "Behavior chain",
        label: "External instruction to shell",
        framework: "OpenAI Agents",
        request: "Read an external troubleshooting guide and run its repair command.",
        principal: { name: "support-agent", trust: "2", scopes: ["read_only"] },
        steps: [
          { name: "browser.fetch", detail: "External · untrusted", phase: "TOOL AFTER", tone: "risk" },
          { name: "llm.respond", detail: "Repair plan", phase: "LLM AFTER" },
          { name: "shell.exec", detail: "Command requested", phase: "TOOL BEFORE", tone: "risk" },
        ],
        signals: ["Untrusted input", "Goal drift", "LLM output to shell"],
        policies: ["chain-deny-llm-output-to-shell", "chain-review-goal-drift-with-user-input"],
        decision: "DENY",
        decisionFamily: "deny",
        resolution: "Command blocked; the risk trace remains auditable.",
      },
      {
        id: "approval",
        tab: "Approval",
        label: "Production database write",
        framework: "Dify",
        request: "Update customer status in production and notify operations.",
        principal: { name: "ops-agent", trust: "2", scopes: ["customer_ops"] },
        steps: [
          { name: "database_query", detail: "Production write", phase: "TOOL BEFORE", tone: "risk" },
          { name: "slack.post", detail: "Notify operations", phase: "TOOL BEFORE" },
        ],
        signals: ["Production", "Low-trust write", "Human confirmation"],
        policies: ["review-db-write-low-trust"],
        decision: "HUMAN_CHECK",
        decisionFamily: "approve",
        resolution: "Await approval; the original action is paused.",
      },
    ],
  },
};
