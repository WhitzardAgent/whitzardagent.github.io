import type { Locale } from "../i18n/config";

export type LocalizedText = { zh: string; en: string };
export type SystemNodeKind = "identity" | "agent" | "model" | "data" | "memory" | "tool" | "mcp" | "external-system";
export type SecurityFlowKind = "data" | "authorization" | "effect";
export type FlowMode = SecurityFlowKind | "combined";
export type RuntimeIntervention = "ALLOW" | "REDACT" | "RECHECK" | "SWITCH_TO_SANDBOX" | "REQUIRE_APPROVAL" | "DENY";
export type StoryScenarioId = "customer-egress" | "memory-write" | "production-commit";

export type SystemNode = {
  id: string;
  kind: SystemNodeKind;
  shortLabel: LocalizedText;
  label: LocalizedText;
  handling: LocalizedText;
  challenge: LocalizedText;
  tracking: LocalizedText;
  response: LocalizedText;
  position: { x: number; y: number };
};

export type SecurityFlowEdge = {
  id: string;
  from: string;
  to: string;
  path: string;
  kinds: SecurityFlowKind[];
  label: LocalizedText;
  activeAt: string[];
};

export type UnifiedAnalysisFacet = {
  kind: FlowMode;
  label: LocalizedText;
  tracks: LocalizedText[];
  distinction: LocalizedText;
  decisionContribution: LocalizedText;
};

export type StoryStep = {
  id: string;
  label: LocalizedText;
  system: LocalizedText;
  flowKinds: SecurityFlowKind[];
  state: LocalizedText;
  intervention: RuntimeIntervention;
  explanation: LocalizedText;
  before?: LocalizedText;
  after?: LocalizedText;
  technical: LocalizedText;
};

export type StoryScenario = {
  id: StoryScenarioId;
  label: LocalizedText;
  request: LocalizedText;
  risk: LocalizedText;
  action: LocalizedText;
  result: LocalizedText[];
  path: LocalizedText;
  steps: StoryStep[];
};

const t = (zh: string, en: string): LocalizedText => ({ zh, en });

export const agentGuardSystemNodes: SystemNode[] = [
  { id: "identity", kind: "identity", shortLabel: t("身份", "Identity"), label: t("用户与委派身份", "User and delegated identity"), handling: t("发起业务任务并授予任务级权限", "Starts a business task and delegates task-scoped authority"), challenge: t("静态身份无法说明本次任务可做什么", "Static identity does not explain what this task may do"), tracking: t("主体、角色、委派范围与有效期", "Principal, role, delegated scope, and expiry"), response: t("生成任务级授权，不允许模型自动扩权", "Issue a task-scoped grant that the model cannot expand"), position: { x: 8, y: 11 } },
  { id: "primary-agent", kind: "agent", shortLabel: t("主智能体", "Primary agent"), label: t("主智能体", "Primary agent"), handling: t("规划任务并协调模型、工具与子智能体", "Plans the task and coordinates models, tools, and subagents"), challenge: t("风险会跨越多个步骤累积，而非出现在单次调用", "Risk accumulates across steps instead of one isolated call"), tracking: t("任务目标、执行轨迹和授权继承", "Task intent, execution trace, and inherited authority"), response: t("持续绑定任务上下文与边界状态", "Keep task context and boundary state attached throughout execution"), position: { x: 29, y: 11 } },
  { id: "subagent", kind: "agent", shortLabel: t("子智能体", "Subagent"), label: t("子智能体与协作节点", "Subagents and collaborators"), handling: t("接收拆分任务并调用共享能力", "Receives delegated work and invokes shared capabilities"), challenge: t("多级委派容易造成权限横向扩散", "Nested delegation can spread authority laterally"), tracking: t("父子关系、委派证明与返回结果", "Parent-child relation, delegation proof, and returned result"), response: t("限制继承范围并验证跨节点信封", "Limit inherited scope and validate cross-node envelopes"), position: { x: 55, y: 11 } },
  { id: "enterprise-data", kind: "data", shortLabel: t("企业数据", "Enterprise data"), label: t("企业数据与知识源", "Enterprise data and knowledge"), handling: t("提供客户、合同与内部知识", "Provides customer, contract, and internal knowledge"), challenge: t("模型生成的新内容仍可能继承敏感血缘", "Model-generated content can retain sensitive lineage"), tracking: t("来源、敏感等级、允许流向与保留策略", "Provenance, classification, allowed destinations, and retention"), response: t("将标签绑定到数据切片并随衍生内容传播", "Attach labels to data slices and propagate them into derivatives"), position: { x: 8, y: 43 } },
  { id: "model", kind: "model", shortLabel: t("大模型", "Model"), label: t("大模型推理", "Model reasoning"), handling: t("总结、转换并生成行动计划", "Summarizes, transforms, and generates action plans"), challenge: t("语义变化会掩盖来源，但不会自动消除风险", "Semantic transformation can obscure provenance without removing risk"), tracking: t("直接、语义和上下文传播关系", "Direct, semantic, and contextual propagation"), response: t("复原衍生关系，保持数据与指令权限", "Recover derivative relationships while preserving data and instruction authority"), position: { x: 37, y: 43 } },
  { id: "memory", kind: "memory", shortLabel: t("Memory", "Memory"), label: t("短期与长期 Memory", "Short- and long-term memory"), handling: t("保存任务状态、知识与后续上下文", "Stores task state, knowledge, and future context"), challenge: t("不可信指令可能被包装为长期可信记忆", "Untrusted instructions can be repackaged as trusted long-term memory"), tracking: t("来源、指令权限、作用域与保留周期", "Provenance, instruction authority, scope, and retention"), response: t("写入前移除主动指令，读取时恢复安全信封", "Strip active instructions before writes and restore security envelopes on reads"), position: { x: 69, y: 43 } },
  { id: "tools", kind: "tool", shortLabel: t("工具", "Tools"), label: t("工具、Shell 与浏览器", "Tools, shell, and browser"), handling: t("读取资源、执行命令并改变系统状态", "Reads resources, executes commands, and changes system state"), challenge: t("单步合法动作组合后可能形成高风险链路", "Individually valid actions can combine into a dangerous chain"), tracking: t("能力、参数、目标环境与动作影响", "Capability, arguments, target environment, and effect"), response: t("在调用前后执行限权、降级、沙箱或阻断", "Limit, degrade, sandbox, or deny around invocation boundaries"), position: { x: 15, y: 75 } },
  { id: "mcp", kind: "mcp", shortLabel: t("MCP", "MCP"), label: t("MCP 与共享工具服务", "MCP and shared tool services"), handling: t("连接外部工具、Schema 与共享能力", "Connects external tools, schemas, and shared capabilities"), challenge: t("未知服务与 Schema 变化会改变真实权限面", "Unknown services and schema changes alter the effective permission surface"), tracking: t("服务身份、端点、工具与 Schema", "Server identity, endpoint, tool, and schema"), response: t("绑定运行时身份，未知 MCP 使用保守边界", "Bind runtime identity and apply conservative boundaries to unknown MCP"), position: { x: 43, y: 75 } },
  { id: "external", kind: "external-system", shortLabel: t("外部系统", "External systems"), label: t("外部 API 与生产系统", "External APIs and production systems"), handling: t("接收外发数据或承载正式业务动作", "Receives outbound data or irreversible business actions"), challenge: t("外发、付款和生产提交会形成真实后果", "Egress, payments, and production commits create real-world consequences"), tracking: t("目标边界、允许域、不可逆性与审计义务", "Destination boundary, allowlist, irreversibility, and audit duties"), response: t("在 Commit Boundary 执行复检、脱敏、审批或拒绝", "Recheck, redact, approve, or deny at the commit boundary"), position: { x: 72, y: 75 } },
];

export const agentGuardSystemEdges: SecurityFlowEdge[] = [
  { id: "identity-agent", from: "identity", to: "primary-agent", path: "M105 72 C150 72 175 72 222 72", kinds: ["authorization"], label: t("任务级委派", "Task delegation"), activeAt: ["identity", "primary-agent"] },
  { id: "agent-subagent", from: "primary-agent", to: "subagent", path: "M278 72 C340 72 385 72 430 72", kinds: ["authorization", "effect"], label: t("范围化委派", "Scoped delegation"), activeAt: ["primary-agent", "subagent"] },
  { id: "data-model", from: "enterprise-data", to: "model", path: "M110 210 C180 210 230 210 292 210", kinds: ["data"], label: t("带血缘的数据", "Lineage-bearing data"), activeAt: ["enterprise-data", "model"] },
  { id: "agent-model", from: "primary-agent", to: "model", path: "M250 96 C250 135 280 165 318 190", kinds: ["authorization", "effect"], label: t("任务上下文", "Task context"), activeAt: ["primary-agent", "model"] },
  { id: "subagent-memory", from: "subagent", to: "memory", path: "M470 96 C500 135 525 165 540 190", kinds: ["data", "authorization"], label: t("跨节点信封", "Cross-node envelope"), activeAt: ["subagent", "memory"] },
  { id: "model-memory", from: "model", to: "memory", path: "M365 210 C420 210 465 210 515 210", kinds: ["data", "effect"], label: t("衍生记忆", "Derived memory"), activeAt: ["model", "memory"] },
  { id: "model-tools", from: "model", to: "tools", path: "M318 235 C265 270 205 310 140 345", kinds: ["data", "effect"], label: t("行动计划", "Action plan"), activeAt: ["model", "tools"] },
  { id: "tools-mcp", from: "tools", to: "mcp", path: "M145 365 C225 365 285 365 350 365", kinds: ["authorization", "effect"], label: t("工具调用", "Tool invocation"), activeAt: ["tools", "mcp"] },
  { id: "memory-external", from: "memory", to: "external", path: "M560 235 C580 275 590 315 590 345", kinds: ["data", "effect"], label: t("上下文与外发", "Context and egress"), activeAt: ["memory", "external"] },
  { id: "mcp-external", from: "mcp", to: "external", path: "M405 365 C465 365 515 365 565 365", kinds: ["data", "authorization", "effect"], label: t("正式提交", "Commit"), activeAt: ["mcp", "external"] },
];

export const unifiedAnalysisFacets: UnifiedAnalysisFacet[] = [
  { kind: "data", label: t("数据流", "Data flow"), tracks: [t("来源", "Provenance"), t("敏感等级", "Classification"), t("允许流向", "Destinations"), t("保留策略", "Retention")], distinction: t("内容经过模型总结后，敏感血缘仍需保留", "Sensitive lineage must survive model transformation"), decisionContribution: t("判断数据是否可进入当前模型、Memory 或目标系统", "Determine whether data may enter the current model, memory, or destination") },
  { kind: "authorization", label: t("授权流", "Authorization flow"), tracks: [t("执行主体", "Principal"), t("能力", "Capability"), t("资源范围", "Scope"), t("委派与有效期", "Delegation and expiry")], distinction: t("身份相同不代表每项任务都拥有相同权限", "The same identity does not imply equal authority for every task"), decisionContribution: t("验证当前行动是否获得明确、范围化且仍有效的授权", "Verify that the action has explicit, scoped, and valid authority") },
  { kind: "effect", label: t("动作影响", "Action effect"), tracks: [t("读取", "Read"), t("创建", "Create"), t("修改", "Modify"), t("执行", "Execute"), t("正式提交", "Commit")], distinction: t("工具名称无法说明一次调用将造成多大影响", "A tool name alone cannot describe the impact of an invocation"), decisionContribution: t("根据可逆性、环境和后果选择最小必要处置", "Choose the minimum necessary control from reversibility, environment, and consequence") },
  { kind: "combined", label: t("联合判断", "Combined decision"), tracks: [t("任务目标", "Task intent"), t("传播血缘", "Propagation lineage"), t("目标边界", "Target boundary"), t("策略约束", "Policy constraints")], distinction: t("风险来自三条流的组合，而非单一标签", "Risk emerges from the combination of three flows, not one label"), decisionContribution: t("输出可解释的放行、修复、复检、沙箱、审批或拒绝", "Produce an explainable allow, repair, recheck, sandbox, approval, or denial") },
];

export const agentGuardStoryScenarios: StoryScenario[] = [
  {
    id: "customer-egress",
    label: t("客户数据外发", "Customer data egress"),
    request: t("生成客户续约分析，并向获批外部顾问发送管理摘要", "Generate a renewal analysis and send a management brief to an approved adviser"),
    risk: t("衍生摘要仍携带客户身份与合同数据血缘", "The derived brief still carries customer identity and contract lineage"),
    action: t("移除受限字段，复检安全载荷后继续外发", "Remove restricted fields, recheck the safe payload, and continue delivery"),
    result: [t("分析继续", "Analysis continues"), t("敏感字段脱敏", "Sensitive fields redacted"), t("外发留痕", "Egress audited")],
    path: t("CRM → 合同数据 → LLM → 报告 → 外部顾问", "CRM → Contract data → LLM → Report → External adviser"),
    steps: [
      { id: "egress-crm", label: t("读取客户记录", "Read customer records"), system: t("CRM", "CRM"), flowKinds: ["data", "authorization"], state: t("客户身份 · C2 · 仅限企业内部", "Customer identity · C2 · Internal only"), intervention: "ALLOW", explanation: t("任务授权允许读取指定客户范围", "The task grant permits reads within the selected account scope"), technical: t("Tool After · DIRECT lineage", "Tool After · DIRECT lineage") },
      { id: "egress-contract", label: t("关联合同字段", "Join contract fields"), system: t("合同系统", "Contract system"), flowKinds: ["data"], state: t("合同金额与条款继承敏感血缘", "Contract values and terms inherit sensitive lineage"), intervention: "ALLOW", explanation: t("敏感数据可在企业边界内参与分析", "Sensitive data may be analyzed inside the enterprise boundary"), technical: t("DataArtifact slices · C2", "DataArtifact slices · C2") },
      { id: "egress-llm", label: t("生成风险结论", "Generate risk findings"), system: t("LLM", "LLM"), flowKinds: ["data", "effect"], state: t("语义变化，敏感血缘保留", "Semantics changed; sensitive lineage retained"), intervention: "RECHECK", explanation: t("模型总结不能自动清除来源和流向限制", "Model summarization cannot erase provenance or destination limits"), technical: t("LLM After · SEMANTIC lineage", "LLM After · SEMANTIC lineage") },
      { id: "egress-report", label: t("生成管理摘要", "Create management brief"), system: t("报告工具", "Report tool"), flowKinds: ["data", "effect"], state: t("客户字段与管理结论共存", "Customer fields coexist with management findings"), intervention: "RECHECK", explanation: t("外发前检查衍生内容中的受限字段", "Check derivative content for restricted fields before egress"), technical: t("Tool After · derived slices", "Tool After · derived slices") },
      { id: "egress-external", label: t("发送外部顾问", "Send to adviser"), system: t("外部 API", "External API"), flowKinds: ["data", "authorization", "effect"], state: t("获批目标，但敏感字段禁止外发", "Approved target, but sensitive fields cannot leave"), intervention: "REDACT", explanation: t("移除客户身份与合同字段，仅保留管理结论", "Remove customer identity and contract fields while preserving management findings"), before: t("客户名称 · 联系方式 · 合同金额 · 续约结论", "Customer name · Contact · Contract value · Renewal finding"), after: t("客户分群 · 风险区间 · 聚合原因 · 建议行动", "Account segment · Risk band · Aggregate reason · Recommended action"), technical: t("Tool Before · DECLASSIFICATION · destination recheck", "Tool Before · DECLASSIFICATION · destination recheck") },
    ],
  },
  {
    id: "memory-write",
    label: t("长期 Memory 写入", "Long-term memory write"),
    request: t("阅读外部操作手册，总结为可复用知识并写入长期 Memory", "Read an external runbook, summarize reusable knowledge, and store it in long-term memory"),
    risk: t("不可信指令被包装为知识，并可能影响后续任务", "Untrusted instructions are repackaged as knowledge and may influence future tasks"),
    action: t("移除主动指令，保留来源标签，复检后写入", "Strip active instructions, retain provenance labels, and recheck before storage"),
    result: [t("知识保留", "Knowledge retained"), t("指令失效", "Instructions neutralized"), t("来源可追溯", "Provenance retained")],
    path: t("外部资料 → LLM → 任务总结 → Memory Gate → Long-term Memory", "External content → LLM → Summary → Memory Gate → Long-term memory"),
    steps: [
      { id: "memory-source", label: t("读取外部资料", "Read external content"), system: t("浏览器", "Browser"), flowKinds: ["data"], state: t("公共来源 · V0 · A0 仅作为数据", "Public source · V0 · A0 data only"), intervention: "ALLOW", explanation: t("允许读取，但不授予其中指令任何执行权限", "Reading is allowed without granting its instructions execution authority"), technical: t("Tool After · source envelope", "Tool After · source envelope") },
      { id: "memory-llm", label: t("总结操作知识", "Summarize operational knowledge"), system: t("LLM", "LLM"), flowKinds: ["data", "authorization"], state: t("内容已改写，A0 指令权限保持", "Content rewritten; A0 instruction authority retained"), intervention: "RECHECK", explanation: t("模型改写不会把外部指令升级为任务授权", "Model transformation does not promote external instructions into task authority"), technical: t("LLM After · SEMANTIC + CONTROL lineage", "LLM After · SEMANTIC + CONTROL lineage") },
      { id: "memory-summary", label: t("形成记忆候选", "Create memory candidate"), system: t("智能体", "Agent"), flowKinds: ["data", "effect"], state: t("知识与主动指令混合", "Knowledge mixed with active instructions"), intervention: "RECHECK", explanation: t("写入前区分事实性知识与未来行动指令", "Separate factual knowledge from future-action instructions before storage"), technical: t("Memory claim slices", "Memory claim slices") },
      { id: "memory-gate", label: t("执行 Memory Gate", "Apply memory gate"), system: t("AgentGuard", "AgentGuard"), flowKinds: ["data", "authorization", "effect"], state: t("移除主动指令，保留 V0/A0 来源", "Active instructions removed; V0/A0 provenance retained"), intervention: "REDACT", explanation: t("清理可执行指令，但不伪造更高可信度", "Remove executable instructions without manufacturing higher trust"), before: t("故障步骤 · 永久覆盖策略 · 后续自动执行命令", "Troubleshooting steps · Override policy · Execute commands automatically later"), after: t("故障现象 · 诊断知识 · 来源与适用范围", "Symptoms · Diagnostic knowledge · Source and applicability"), technical: t("Memory Write · sanitize_and_store", "Memory Write · sanitize_and_store") },
      { id: "memory-store", label: t("写入长期 Memory", "Write long-term memory"), system: t("Memory", "Memory"), flowKinds: ["data", "effect"], state: t("安全信封与内容一同保存", "Security envelope stored with content"), intervention: "ALLOW", explanation: t("后续读取时恢复来源、权限与保留策略", "Future reads restore provenance, authority, and retention policy"), technical: t("Memory envelope · audit hash", "Memory envelope · audit hash") },
    ],
  },
  {
    id: "production-commit",
    label: t("Shell 与生产提交", "Shell and production commit"),
    request: t("定位生产事故、生成修复命令并提交生产变更", "Diagnose a production incident, generate remediation commands, and commit a production change"),
    risk: t("外部指令可能进入 Shell，生产提交具有不可逆影响", "External instructions may reach shell while production commit has irreversible impact"),
    action: t("Shell 切换沙箱预览，生产提交进入一次性审批", "Move shell execution into sandbox preview and require one-time approval for production commit"),
    result: [t("诊断继续", "Diagnosis continues"), t("高影响变更待批", "High-impact change awaits approval"), t("越界执行阻断", "Out-of-bound execution denied")],
    path: t("外部工单 → LLM → Shell → 变更预览 → Production Commit", "External ticket → LLM → Shell → Change preview → Production commit"),
    steps: [
      { id: "commit-ticket", label: t("读取事故工单", "Read incident ticket"), system: t("工单系统", "Ticketing"), flowKinds: ["data", "authorization"], state: t("外部内容 · A0 仅作为数据", "External content · A0 data only"), intervention: "ALLOW", explanation: t("允许用于诊断，不允许成为执行授权", "May inform diagnosis but cannot become execution authority"), technical: t("Tool After · untrusted source", "Tool After · untrusted source") },
      { id: "commit-llm", label: t("生成修复建议", "Generate remediation"), system: t("LLM", "LLM"), flowKinds: ["data", "authorization", "effect"], state: t("模型输出继承外部来源与 A0", "Model output inherits external provenance and A0"), intervention: "RECHECK", explanation: t("检查目标漂移与不可信指令传播", "Check goal drift and untrusted instruction propagation"), technical: t("LLM After · CONTEXTUAL lineage", "LLM After · CONTEXTUAL lineage") },
      { id: "commit-shell", label: t("验证 Shell 命令", "Validate shell command"), system: t("Shell", "Shell"), flowKinds: ["authorization", "effect"], state: t("无生产执行权，动作影响为 EXECUTE", "No production execution grant; effect is EXECUTE"), intervention: "SWITCH_TO_SANDBOX", explanation: t("命令只在隔离环境生成预览，不改变生产状态", "Run only as an isolated preview without changing production state"), before: t("直接执行修复脚本", "Execute remediation script directly"), after: t("沙箱预览 · 变更差异 · 无副作用", "Sandbox preview · Change diff · No side effects"), technical: t("Tool Before · effect downgrade", "Tool Before · effect downgrade") },
      { id: "commit-preview", label: t("审查变更差异", "Review change diff"), system: t("隔离工作区", "Isolated workspace"), flowKinds: ["data", "effect"], state: t("补丁已验证，尚未正式生效", "Patch verified but not committed"), intervention: "RECHECK", explanation: t("将可逆预览与不可逆提交分离", "Separate reversible preview from irreversible commit"), technical: t("Tool After · diff evidence", "Tool After · diff evidence") },
      { id: "commit-production", label: t("提交生产变更", "Commit production change"), system: t("生产系统", "Production"), flowKinds: ["authorization", "effect"], state: t("跨越正式生效边界，需要明确授权", "Crosses the commit boundary and requires explicit authority"), intervention: "REQUIRE_APPROVAL", explanation: t("批准后生成限定范围、单次有效的临时授权", "Approval issues a scoped, one-time temporary grant"), technical: t("Commit Boundary · approval envelope", "Commit Boundary · approval envelope") },
    ],
  },
];

export const storyPageCopy = {
  zh: {
    map: { eyebrow: "全系统传播与追踪", title: "看见风险如何穿过智能体系统", body: "AgentGuard 将数据、授权与动作影响绑定到完整执行轨迹", runtime: "AgentGuard 交互边界运行时", live: "实时保护中", select: "选择保护对象", incoming: "进入节点", outgoing: "离开节点", impact: "潜在影响路径", handling: "当前处理", challenge: "关键难点", tracking: "AgentGuard 追踪", response: "AgentGuard 处理", pause: "暂停", replay: "重播", protected: "保护对象" },
    engine: { eyebrow: "统一安全影响引擎", title: "三流汇合为一个决策", body: "分别理解数据属性、授权范围与动作后果，并在每个交互边界联合判断", tracks: "追踪对象", distinction: "为何独立分析", contribution: "如何形成决策", core: "AgentGuard Unified Security Influence Engine", result: "最小必要处置", evidence: "查看技术依据", evidenceBody: "任务目标、传播血缘、目标边界与策略约束在同一边界状态中求值" },
    simulator: { eyebrow: "运行时安全控制", title: "风险成形前精准介入", body: "模拟真实任务，查看 AgentGuard 如何保留业务能力并控制高影响行动", request: "业务任务", risk: "风险形成", action: "AgentGuard 处置", outcome: "业务结果", path: "执行路径", run: "执行模拟", pause: "暂停", replay: "重新执行", evidence: "查看技术依据", before: "介入前", after: "介入后", approve: "批准一次", reject: "拒绝", approved: "已生成单次范围授权，生产提交继续", rejected: "生产提交已终止，诊断与预览结果保留", waiting: "等待授权负责人审批" },
    challenges: { eyebrow: "企业智能体风险", title: "智能体时代带来全新安全挑战", items: ["缺少统一运行视图", "动态继承高权限", "风险跨多步行动传播", "传统控制缺少任务上下文"], closing: "AgentGuard 将运行时上下文转化为可执行的安全边界" },
    protection: { eyebrow: "保护对象", title: "覆盖智能体行动的完整上下文", items: ["智能体与子智能体", "身份与委派", "数据与 Memory", "工具与 MCP", "外部行动与生产系统"] },
    securityStack: { eyebrow: "融入现有安全体系", title: "补充智能体运行时上下文", body: "AgentGuard 不替代既有安全系统，而是让控制理解一次智能体行动的完整上下文", rows: [["IAM", "静态身份与权限", "任务上下文、委派链与一次性授权"], ["DLP", "内容与外发通道", "衍生数据血缘与多步传播"], ["API Gateway", "单次请求", "请求前的模型、工具与任务轨迹"], ["SIEM", "事件与日志", "判断依据、载荷变化与业务结果"]] },
    demoAgenda: ["映射一项真实智能体工作流", "标记身份、数据与行动边界", "模拟越权、外发或高影响操作", "展示 AgentGuard 处置与审计结果", "讨论接入方式与私有部署"],
  },
  en: {
    map: { eyebrow: "SYSTEM-WIDE PROPAGATION", title: "See risk move through the agent system", body: "AgentGuard binds data, authorization, and action effect to the complete execution trace", runtime: "AgentGuard Interaction Boundary Runtime", live: "Protecting in real time", select: "Select a protected object", incoming: "Incoming", outgoing: "Outgoing", impact: "Potential impact path", handling: "Current role", challenge: "Security challenge", tracking: "AgentGuard tracks", response: "AgentGuard response", pause: "Pause", replay: "Replay", protected: "Protected objects" },
    engine: { eyebrow: "UNIFIED SECURITY INFLUENCE ENGINE", title: "Three flows. One decision.", body: "Understand data properties, authorization scope, and action consequence together at every interaction boundary", tracks: "What it tracks", distinction: "Why it differs", contribution: "How it shapes the decision", core: "AgentGuard Unified Security Influence Engine", result: "Minimum necessary control", evidence: "View technical evidence", evidenceBody: "Task intent, propagation lineage, target boundary, and policy constraints are evaluated in one boundary state" },
    simulator: { eyebrow: "RUNTIME SECURITY CONTROL", title: "Intervene before risk becomes impact", body: "Simulate real tasks and see how AgentGuard preserves business capability while controlling high-impact action", request: "Business task", risk: "Risk formation", action: "AgentGuard response", outcome: "Business outcome", path: "Execution path", run: "Run simulation", pause: "Pause", replay: "Run again", evidence: "View technical evidence", before: "Before", after: "After", approve: "Approve once", reject: "Reject", approved: "A scoped one-time grant was issued and the production commit continued", rejected: "The production commit stopped while diagnosis and preview evidence were retained", waiting: "Waiting for authorized approval" },
    challenges: { eyebrow: "ENTERPRISE AGENT RISK", title: "The agent era creates a new security frontier", items: ["No unified runtime view", "Dynamic high-privilege inheritance", "Risk propagates across multi-step action", "Traditional controls lack task context"], closing: "AgentGuard turns runtime context into enforceable security boundaries" },
    protection: { eyebrow: "PROTECTED OBJECTS", title: "Cover the complete context of agent action", items: ["Agents and subagents", "Identity and delegation", "Data and memory", "Tools and MCP", "External action and production systems"] },
    securityStack: { eyebrow: "WORKS WITH YOUR SECURITY STACK", title: "Add agent-aware runtime context", body: "AgentGuard complements existing security systems with context for the full agent action", rows: [["IAM", "Static identity and permissions", "Task context, delegation chain, and one-time grants"], ["DLP", "Content and egress channels", "Derived-data lineage and multi-step propagation"], ["API Gateway", "Individual requests", "The model, tool, and task trace before each request"], ["SIEM", "Events and logs", "Decision evidence, payload change, and business outcome"]] },
    demoAgenda: ["Map one real agent workflow", "Mark identity, data, and action boundaries", "Simulate privilege, egress, or high-impact risk", "Review AgentGuard response and audit evidence", "Discuss integration and private deployment"],
  },
} satisfies Record<Locale, unknown>;

export const localize = (value: LocalizedText, locale: Locale) => value[locale];

const scenarioNodeIds: Record<StoryScenarioId, string[]> = {
  "customer-egress": ["identity", "primary-agent", "enterprise-data", "model", "tools", "external"],
  "memory-write": ["primary-agent", "model", "memory", "external"],
  "production-commit": ["identity", "primary-agent", "model", "tools", "external"],
};

export function resolveAgentGuardStory(scenarioId: StoryScenarioId) {
  const scenario = agentGuardStoryScenarios.find((item) => item.id === scenarioId);
  if (!scenario) throw new Error(`Unknown AgentGuard story scenario: ${scenarioId}`);
  return {
    scenario,
    systemMapProjection: {
      nodes: agentGuardSystemNodes,
      edges: agentGuardSystemEdges,
      activeNodeIds: scenarioNodeIds[scenarioId],
    },
    analysisEngineProjection: unifiedAnalysisFacets,
    scenarioProjection: scenario.steps,
  };
}

for (const scenario of agentGuardStoryScenarios) {
  if (scenario.steps.length < 4) throw new Error(`${scenario.id} must include at least four runtime steps`);
  if (new Set(scenario.steps.flatMap((step) => step.flowKinds)).size < 3) throw new Error(`${scenario.id} must cover data, authorization, and effect`);
  if (!scenario.steps.some((step) => step.intervention !== "ALLOW")) throw new Error(`${scenario.id} must include an AgentGuard intervention`);
}
