import type { Locale } from "../i18n/config";

export type DemoDecision = "ALLOW" | "ALLOW_WITH_AUDIT" | "REDACT" | "DEGRADE" | "HUMAN_CHECK" | "LLM_CHECK" | "DENY";
export type PolicySource = "community" | "enterprise-example";
export type ScenarioId = "renewal-analysis" | "incident-response" | "vendor-payment";
export type TraceLane = "enterprise-data" | "agent-runtime" | "external-action";
export type TracePhase = "llm-before" | "llm-after" | "tool-before" | "tool-after";

export type ScenarioOption = { id: string; label: string };
export type ScenarioControl = { id: string; label: string; options: ScenarioOption[]; defaultValue: string };
export type PolicyMatch = {
  ruleId: string;
  source: PolicySource;
  decision: DemoDecision;
  reason: string;
};
export type EnterpriseTraceNode = {
  id: string;
  lane: TraceLane;
  stage: string;
  tool: string;
  phase: TracePhase;
  input: string;
  output: string;
  inputLabels: string[];
  outputLabels: string[];
  boundary: string;
};
export type EnterpriseScenario = {
  id: ScenarioId;
  label: string;
  request: string;
  principal: string;
  controls: ScenarioControl[];
  nodes: EnterpriseTraceNode[];
  defaultFocus: string;
};
export type ResolvedTraceNode = EnterpriseTraceNode & {
  decision: DemoDecision;
  policies: PolicyMatch[];
  obligations: string[];
  payloadBefore?: string;
  payloadAfter?: string;
};
export type ResolvedScenario = {
  nodes: ResolvedTraceNode[];
  status: "completed" | "paused" | "blocked";
  stopIndex: number;
  auditObligations: string[];
};
export type EnterpriseScenarioLabCopy = {
  ariaLabel: string;
  requestLabel: string;
  controlsLabel: string;
  traceLabel: string;
  inspectorLabel: string;
  principalLabel: string;
  phaseLabel: string;
  inputLabel: string;
  outputLabel: string;
  labelsLabel: string;
  boundaryLabel: string;
  policyLabel: string;
  priorityLabel: string;
  payloadLabel: string;
  obligationsLabel: string;
  sourceLabels: Record<PolicySource, string>;
  laneLabels: Record<TraceLane, string>;
  phaseLabels: Record<TracePhase, string>;
  decisionLabels: Record<DemoDecision, string>;
  stateLabels: { planned: string; completed: string; paused: string; blocked: string; waiting: string; approved: string; rejected: string };
  run: string;
  replay: string;
  approve: string;
  reject: string;
  approvedNotice: string;
  rejectedNotice: string;
  scenarios: EnterpriseScenario[];
};

const zh: EnterpriseScenarioLabCopy = {
  ariaLabel: "AgentGuard 企业工作流控制实验台",
  requestLabel: "业务请求",
  controlsLabel: "模拟条件",
  traceLabel: "跨系统执行轨迹",
  inspectorLabel: "节点检查器",
  principalLabel: "执行主体",
  phaseLabel: "控制阶段",
  inputLabel: "输入",
  outputLabel: "输出",
  labelsLabel: "数据标签",
  boundaryLabel: "系统边界",
  policyLabel: "命中策略",
  priorityLabel: "处置优先级",
  payloadLabel: "载荷变化",
  obligationsLabel: "审计与审批",
  sourceLabels: { community: "公开规则", "enterprise-example": "企业策略示例" },
  laneLabels: { "enterprise-data": "企业数据", "agent-runtime": "智能体处理", "external-action": "外部行动" },
  phaseLabels: { "llm-before": "LLM 调用前", "llm-after": "LLM 调用后", "tool-before": "工具调用前", "tool-after": "工具调用后" },
  decisionLabels: { ALLOW: "允许", ALLOW_WITH_AUDIT: "允许并审计", REDACT: "脱敏", DEGRADE: "降级", HUMAN_CHECK: "人工审批", LLM_CHECK: "模型复核", DENY: "阻断" },
  stateLabels: { planned: "预检完成", completed: "执行完成", paused: "等待审批", blocked: "流程终止", waiting: "等待执行", approved: "已批准一次", rejected: "已拒绝" },
  run: "执行模拟",
  replay: "重新执行",
  approve: "批准一次",
  reject: "拒绝",
  approvedNotice: "审批通过，流程从暂停节点继续",
  rejectedNotice: "审批拒绝，后续外部行动已终止",
  scenarios: [
    {
      id: "renewal-analysis",
      label: "客户续约分析",
      request: "汇总华东区重点客户的续约风险，更新内部 CRM，并将管理摘要发送给获批外部顾问",
      principal: "运营分析智能体",
      defaultFocus: "crm-update",
      controls: [
        { id: "identity", label: "执行身份", defaultValue: "standard", options: [{ id: "standard", label: "标准运营智能体" }, { id: "trusted", label: "高信任运营智能体" }] },
        { id: "data", label: "数据范围", defaultValue: "pii", options: [{ id: "aggregate", label: "聚合指标" }, { id: "pii", label: "客户 PII" }, { id: "finance", label: "合同与财务字段" }] },
        { id: "destination", label: "目标边界", defaultValue: "approved", options: [{ id: "internal", label: "内部 CRM" }, { id: "approved", label: "获批外部顾问" }, { id: "unapproved", label: "未授权外部目标" }] },
      ],
      nodes: [
        { id: "crm-search", lane: "enterprise-data", stage: "客户范围", tool: "crm.search", phase: "tool-before", input: "区域、客户层级、续约周期", output: "授权客户集合", inputLabels: ["internal", "customer-scope"], outputLabels: ["customer-record"], boundary: "CRM 只读域" },
        { id: "contract-read", lane: "enterprise-data", stage: "合同读取", tool: "contract.read", phase: "tool-after", input: "客户标识与字段许可", output: "合同期限、金额与条款", inputLabels: ["customer-record"], outputLabels: ["confidential", "financial"], boundary: "合同数据域" },
        { id: "knowledge-search", lane: "enterprise-data", stage: "服务证据", tool: "knowledge.search", phase: "tool-after", input: "客户与服务主题", output: "工单与交付摘要", inputLabels: ["internal"], outputLabels: ["internal", "derived"], boundary: "企业知识库" },
        { id: "llm-respond", lane: "agent-runtime", stage: "风险分析", tool: "llm.respond", phase: "llm-after", input: "合同、工单与客户字段", output: "续约风险解释", inputLabels: ["confidential", "derived"], outputLabels: ["derived", "sensitive-lineage"], boundary: "AgentGuard LLM Hook" },
        { id: "report-generate", lane: "agent-runtime", stage: "摘要生成", tool: "report.generate", phase: "tool-after", input: "续约风险解释", output: "管理摘要与客户级依据", inputLabels: ["sensitive-lineage"], outputLabels: ["report", "pii-derived"], boundary: "智能体工作区" },
        { id: "crm-update", lane: "enterprise-data", stage: "记录更新", tool: "crm.update", phase: "tool-before", input: "续约标签与管理摘要", output: "CRM 变更记录", inputLabels: ["report", "write"], outputLabels: ["audit-record"], boundary: "CRM 写入域" },
        { id: "http-post", lane: "external-action", stage: "顾问外发", tool: "http.post", phase: "tool-before", input: "管理摘要与目标域", output: "受控外发载荷", inputLabels: ["pii-derived", "external"], outputLabels: ["redacted", "audited"], boundary: "企业外发网关" },
      ],
    },
    {
      id: "incident-response",
      label: "生产事故响应",
      request: "依据高优先级工单定位异常、生成修复方案，并在审批后发布生产变更",
      principal: "生产运维智能体",
      defaultFocus: "shell-exec",
      controls: [{ id: "ticket", label: "工单来源", defaultValue: "trusted", options: [{ id: "trusted", label: "可信内部工单" }, { id: "injected", label: "含注入的外部工单" }] }],
      nodes: [
        { id: "ticket-read", lane: "enterprise-data", stage: "工单读取", tool: "ticket.read", phase: "tool-after", input: "事故编号与处置范围", output: "症状、服务与上下文", inputLabels: ["ticket"], outputLabels: ["task-context"], boundary: "工单系统" },
        { id: "browser-fetch", lane: "external-action", stage: "外部证据", tool: "browser.fetch", phase: "tool-after", input: "工单引用链接", output: "网页诊断信息", inputLabels: ["url"], outputLabels: ["untrusted"], boundary: "浏览器隔离区" },
        { id: "logs-query", lane: "enterprise-data", stage: "日志查询", tool: "logs.query", phase: "tool-before", input: "服务、时间窗与字段范围", output: "脱敏错误轨迹", inputLabels: ["internal", "readonly"], outputLabels: ["operational"], boundary: "可观测数据域" },
        { id: "repo-read", lane: "enterprise-data", stage: "代码定位", tool: "repo.read", phase: "tool-after", input: "受影响服务与版本", output: "相关代码与配置", inputLabels: ["internal", "source-code"], outputLabels: ["confidential"], boundary: "代码仓库只读域" },
        { id: "incident-llm", lane: "agent-runtime", stage: "根因研判", tool: "llm.respond", phase: "llm-after", input: "工单、网页、日志与代码", output: "根因与修复计划", inputLabels: ["untrusted", "confidential"], outputLabels: ["derived", "action-plan"], boundary: "AgentGuard LLM Hook" },
        { id: "file-write", lane: "agent-runtime", stage: "补丁生成", tool: "file.write", phase: "tool-before", input: "修复计划与目标文件", output: "隔离工作区补丁", inputLabels: ["action-plan", "write"], outputLabels: ["patch", "preview-only"], boundary: "隔离工作区" },
        { id: "shell-exec", lane: "agent-runtime", stage: "命令预检", tool: "shell.exec", phase: "tool-before", input: "测试与变更命令", output: "预览或阻断结果", inputLabels: ["llm-output", "exec"], outputLabels: ["preview"], boundary: "命令执行边界" },
        { id: "deploy-apply", lane: "external-action", stage: "生产发布", tool: "deploy.apply", phase: "tool-before", input: "已验证补丁与发布范围", output: "审批后的生产变更", inputLabels: ["high-impact", "production"], outputLabels: ["deployment-audit"], boundary: "生产变更边界" },
      ],
    },
    {
      id: "vendor-payment",
      label: "供应商付款核验",
      request: "核验待付发票、供应商主数据与收款账户，更新 ERP 并提交付款审批",
      principal: "财务运营智能体",
      defaultFocus: "send-money",
      controls: [{ id: "account", label: "账户核验", defaultValue: "matched", options: [{ id: "matched", label: "主数据一致" }, { id: "changed", label: "发票账户发生变更" }] }],
      nodes: [
        { id: "mail-read", lane: "external-action", stage: "邮件接收", tool: "mail.read", phase: "tool-after", input: "供应商付款邮箱", output: "邮件正文与附件", inputLabels: ["external", "untrusted"], outputLabels: ["invoice-source"], boundary: "企业邮件网关" },
        { id: "invoice-extract", lane: "agent-runtime", stage: "发票解析", tool: "invoice.extract", phase: "tool-after", input: "发票附件", output: "金额、订单与收款账户", inputLabels: ["invoice-source"], outputLabels: ["financial", "bank-account"], boundary: "文档解析区" },
        { id: "vendor-lookup", lane: "enterprise-data", stage: "供应商核验", tool: "vendor.lookup", phase: "tool-before", input: "供应商编号", output: "审批状态与主数据", inputLabels: ["vendor-id"], outputLabels: ["master-data"], boundary: "供应商主数据域" },
        { id: "bank-compare", lane: "agent-runtime", stage: "账户比对", tool: "bank_account.compare", phase: "tool-after", input: "发票账户与主数据账户", output: "一致性结论", inputLabels: ["bank-account", "master-data"], outputLabels: ["verified-payment-data"], boundary: "财务验证区" },
        { id: "erp-write", lane: "enterprise-data", stage: "凭证写入", tool: "erp.write", phase: "tool-before", input: "已验证发票与订单", output: "待审批付款凭证", inputLabels: ["financial", "write"], outputLabels: ["audit-record"], boundary: "ERP 写入域" },
        { id: "send-money", lane: "external-action", stage: "付款提交", tool: "send_money", phase: "tool-before", input: "金额、账户与委托身份", output: "审批后的付款指令", inputLabels: ["financial", "irreversible"], outputLabels: ["payment-audit"], boundary: "资金操作边界" },
        { id: "payment-mail", lane: "external-action", stage: "结果通知", tool: "mail.send", phase: "tool-before", input: "付款状态与供应商地址", output: "受控通知", inputLabels: ["external", "payment-status"], outputLabels: ["audited"], boundary: "企业邮件网关" },
      ],
    },
  ],
};

const en: EnterpriseScenarioLabCopy = {
  ariaLabel: "AgentGuard enterprise workflow control lab",
  requestLabel: "Business request", controlsLabel: "Simulation controls", traceLabel: "Cross-system execution trace", inspectorLabel: "Node inspector",
  principalLabel: "Principal", phaseLabel: "Control phase", inputLabel: "Input", outputLabel: "Output", labelsLabel: "Data labels", boundaryLabel: "Boundary", policyLabel: "Matched policies", priorityLabel: "Decision priority", payloadLabel: "Payload change", obligationsLabel: "Audit and approval",
  sourceLabels: { community: "Community rule", "enterprise-example": "Enterprise policy example" },
  laneLabels: { "enterprise-data": "Enterprise data", "agent-runtime": "Agent runtime", "external-action": "External action" },
  phaseLabels: { "llm-before": "Before LLM", "llm-after": "After LLM", "tool-before": "Before tool", "tool-after": "After tool" },
  decisionLabels: { ALLOW: "Allow", ALLOW_WITH_AUDIT: "Allow with audit", REDACT: "Redact", DEGRADE: "Degrade", HUMAN_CHECK: "Human check", LLM_CHECK: "LLM check", DENY: "Deny" },
  stateLabels: { planned: "Preflight complete", completed: "Completed", paused: "Awaiting approval", blocked: "Terminated", waiting: "Waiting", approved: "Approved once", rejected: "Rejected" },
  run: "Run simulation", replay: "Replay", approve: "Approve once", reject: "Reject", approvedNotice: "Approved. Execution resumed from the paused node.", rejectedNotice: "Rejected. Subsequent external actions were terminated.",
  scenarios: [
    {
      id: "renewal-analysis", label: "Renewal analysis", request: "Summarize renewal risk for priority East China accounts, update the internal CRM, and send an executive brief to an approved external adviser.", principal: "Revenue operations agent", defaultFocus: "crm-update",
      controls: [
        { id: "identity", label: "Execution identity", defaultValue: "standard", options: [{ id: "standard", label: "Standard operations agent" }, { id: "trusted", label: "High-trust operations agent" }] },
        { id: "data", label: "Data scope", defaultValue: "pii", options: [{ id: "aggregate", label: "Aggregate metrics" }, { id: "pii", label: "Customer PII" }, { id: "finance", label: "Contract and financial fields" }] },
        { id: "destination", label: "Destination", defaultValue: "approved", options: [{ id: "internal", label: "Internal CRM" }, { id: "approved", label: "Approved external adviser" }, { id: "unapproved", label: "Unauthorized external target" }] },
      ],
      nodes: [
        { id: "crm-search", lane: "enterprise-data", stage: "Account scope", tool: "crm.search", phase: "tool-before", input: "Region, account tier, renewal period", output: "Authorized account set", inputLabels: ["internal", "customer-scope"], outputLabels: ["customer-record"], boundary: "CRM read domain" },
        { id: "contract-read", lane: "enterprise-data", stage: "Contract read", tool: "contract.read", phase: "tool-after", input: "Account IDs and field permission", output: "Terms, value, and clauses", inputLabels: ["customer-record"], outputLabels: ["confidential", "financial"], boundary: "Contract data domain" },
        { id: "knowledge-search", lane: "enterprise-data", stage: "Service evidence", tool: "knowledge.search", phase: "tool-after", input: "Account and service topics", output: "Ticket and delivery summary", inputLabels: ["internal"], outputLabels: ["internal", "derived"], boundary: "Enterprise knowledge base" },
        { id: "llm-respond", lane: "agent-runtime", stage: "Risk analysis", tool: "llm.respond", phase: "llm-after", input: "Contracts, tickets, customer fields", output: "Renewal risk rationale", inputLabels: ["confidential", "derived"], outputLabels: ["derived", "sensitive-lineage"], boundary: "AgentGuard LLM hook" },
        { id: "report-generate", lane: "agent-runtime", stage: "Brief generation", tool: "report.generate", phase: "tool-after", input: "Renewal risk rationale", output: "Executive brief and evidence", inputLabels: ["sensitive-lineage"], outputLabels: ["report", "pii-derived"], boundary: "Agent workspace" },
        { id: "crm-update", lane: "enterprise-data", stage: "Record update", tool: "crm.update", phase: "tool-before", input: "Renewal tags and brief", output: "CRM change record", inputLabels: ["report", "write"], outputLabels: ["audit-record"], boundary: "CRM write domain" },
        { id: "http-post", lane: "external-action", stage: "Adviser delivery", tool: "http.post", phase: "tool-before", input: "Brief and destination domain", output: "Controlled egress payload", inputLabels: ["pii-derived", "external"], outputLabels: ["redacted", "audited"], boundary: "Enterprise egress gateway" },
      ],
    },
    {
      id: "incident-response", label: "Production incident", request: "Diagnose a high-priority incident, prepare a remediation, and deploy the production change after approval.", principal: "Production operations agent", defaultFocus: "shell-exec",
      controls: [{ id: "ticket", label: "Ticket source", defaultValue: "trusted", options: [{ id: "trusted", label: "Trusted internal ticket" }, { id: "injected", label: "Injected external ticket" }] }],
      nodes: [
        { id: "ticket-read", lane: "enterprise-data", stage: "Ticket intake", tool: "ticket.read", phase: "tool-after", input: "Incident ID and scope", output: "Symptoms, service, and context", inputLabels: ["ticket"], outputLabels: ["task-context"], boundary: "Ticketing system" },
        { id: "browser-fetch", lane: "external-action", stage: "External evidence", tool: "browser.fetch", phase: "tool-after", input: "Ticket reference URL", output: "Web diagnostic content", inputLabels: ["url"], outputLabels: ["untrusted"], boundary: "Browser isolation" },
        { id: "logs-query", lane: "enterprise-data", stage: "Log query", tool: "logs.query", phase: "tool-before", input: "Service, time window, field scope", output: "Redacted error trace", inputLabels: ["internal", "readonly"], outputLabels: ["operational"], boundary: "Observability data domain" },
        { id: "repo-read", lane: "enterprise-data", stage: "Code location", tool: "repo.read", phase: "tool-after", input: "Affected service and version", output: "Relevant code and configuration", inputLabels: ["internal", "source-code"], outputLabels: ["confidential"], boundary: "Repository read domain" },
        { id: "incident-llm", lane: "agent-runtime", stage: "Root-cause analysis", tool: "llm.respond", phase: "llm-after", input: "Ticket, web, logs, and code", output: "Root cause and remediation plan", inputLabels: ["untrusted", "confidential"], outputLabels: ["derived", "action-plan"], boundary: "AgentGuard LLM hook" },
        { id: "file-write", lane: "agent-runtime", stage: "Patch generation", tool: "file.write", phase: "tool-before", input: "Plan and target files", output: "Isolated workspace patch", inputLabels: ["action-plan", "write"], outputLabels: ["patch", "preview-only"], boundary: "Isolated workspace" },
        { id: "shell-exec", lane: "agent-runtime", stage: "Command preflight", tool: "shell.exec", phase: "tool-before", input: "Test and change commands", output: "Preview or denial", inputLabels: ["llm-output", "exec"], outputLabels: ["preview"], boundary: "Command execution boundary" },
        { id: "deploy-apply", lane: "external-action", stage: "Production deploy", tool: "deploy.apply", phase: "tool-before", input: "Verified patch and deployment scope", output: "Approved production change", inputLabels: ["high-impact", "production"], outputLabels: ["deployment-audit"], boundary: "Production change boundary" },
      ],
    },
    {
      id: "vendor-payment", label: "Vendor payment", request: "Verify an invoice, vendor master data, and the beneficiary account before updating ERP and submitting payment approval.", principal: "Finance operations agent", defaultFocus: "send-money",
      controls: [{ id: "account", label: "Account verification", defaultValue: "matched", options: [{ id: "matched", label: "Master data matches" }, { id: "changed", label: "Invoice account changed" }] }],
      nodes: [
        { id: "mail-read", lane: "external-action", stage: "Mail intake", tool: "mail.read", phase: "tool-after", input: "Vendor payment mailbox", output: "Message and attachment", inputLabels: ["external", "untrusted"], outputLabels: ["invoice-source"], boundary: "Enterprise mail gateway" },
        { id: "invoice-extract", lane: "agent-runtime", stage: "Invoice extraction", tool: "invoice.extract", phase: "tool-after", input: "Invoice attachment", output: "Amount, order, beneficiary", inputLabels: ["invoice-source"], outputLabels: ["financial", "bank-account"], boundary: "Document processing zone" },
        { id: "vendor-lookup", lane: "enterprise-data", stage: "Vendor verification", tool: "vendor.lookup", phase: "tool-before", input: "Vendor ID", output: "Approval state and master data", inputLabels: ["vendor-id"], outputLabels: ["master-data"], boundary: "Vendor master-data domain" },
        { id: "bank-compare", lane: "agent-runtime", stage: "Account comparison", tool: "bank_account.compare", phase: "tool-after", input: "Invoice and master accounts", output: "Consistency result", inputLabels: ["bank-account", "master-data"], outputLabels: ["verified-payment-data"], boundary: "Finance verification zone" },
        { id: "erp-write", lane: "enterprise-data", stage: "Voucher write", tool: "erp.write", phase: "tool-before", input: "Verified invoice and order", output: "Pending payment voucher", inputLabels: ["financial", "write"], outputLabels: ["audit-record"], boundary: "ERP write domain" },
        { id: "send-money", lane: "external-action", stage: "Payment submit", tool: "send_money", phase: "tool-before", input: "Amount, account, delegated identity", output: "Approved payment instruction", inputLabels: ["financial", "irreversible"], outputLabels: ["payment-audit"], boundary: "Funds-movement boundary" },
        { id: "payment-mail", lane: "external-action", stage: "Result notice", tool: "mail.send", phase: "tool-before", input: "Payment state and vendor address", output: "Controlled notification", inputLabels: ["external", "payment-status"], outputLabels: ["audited"], boundary: "Enterprise mail gateway" },
      ],
    },
  ],
};

export const enterpriseScenarioLabCopy: Record<Locale, EnterpriseScenarioLabCopy> = { zh, en };

const policy = (ruleId: string, source: PolicySource, decision: DemoDecision, reason: string): PolicyMatch => ({ ruleId, source, decision, reason });
const base = (node: EnterpriseTraceNode): ResolvedTraceNode => ({ ...node, decision: "ALLOW_WITH_AUDIT", policies: [], obligations: ["TRACE", "AUDIT"] });

export function resolveEnterpriseScenario(scenario: EnterpriseScenario, controls: Record<string, string>): ResolvedScenario {
  const isZh = /[\u3400-\u9fff]/.test(scenario.request);
  const tr = (zhText: string, enText: string) => isZh ? zhText : enText;
  const nodes = scenario.nodes.map(base);
  if (scenario.id === "renewal-analysis") {
    const identity = controls.identity ?? "standard";
    const data = controls.data ?? "pii";
    const destination = controls.destination ?? "approved";
    const crm = nodes.find((node) => node.id === "crm-update")!;
    const egress = nodes.find((node) => node.id === "http-post")!;
    if (identity === "standard") {
      crm.decision = "HUMAN_CHECK";
      crm.policies = [policy("review-db-write-low-trust", "community", "HUMAN_CHECK", tr("标准信任主体写入数据库前必须进入人工审批。", "A standard-trust principal requires review before a database write."))];
      crm.obligations = ["TRACE", "APPROVAL_RECORD"];
    } else {
      crm.policies = [policy("enterprise-crm-write-scope", "enterprise-example", "ALLOW_WITH_AUDIT", tr("高信任主体仅可写入获批的续约字段。", "The trusted principal is restricted to approved renewal fields."))];
    }
    const sensitive = data !== "aggregate";
    if (destination === "unapproved") {
      egress.decision = "DENY";
      egress.policies = [policy("chain-deny-sensitive-data-exfil", "community", "DENY", tr("敏感数据血缘不得越过未授权外部边界。", "Sensitive lineage cannot cross an unauthorized external boundary.")), policy("enterprise-adviser-domain-allowlist", "enterprise-example", "DENY", tr("目标不在获批顾问域名范围内。", "The target is outside the approved adviser domain set."))];
      egress.obligations = ["TRACE", "DENIAL_AUDIT"];
    } else if (destination === "approved" && sensitive) {
      egress.decision = "REDACT";
      egress.policies = [policy("chain-redact-pii-on-http-post", "community", "REDACT", tr("PII 衍生字段须在 HTTP 外发前移除。", "PII-derived fields must be removed before HTTP egress.")), policy("enterprise-adviser-domain-allowlist", "enterprise-example", "ALLOW_WITH_AUDIT", tr("该顾问域仅获批接收脱敏后的管理摘要。", "The adviser destination is approved for a redacted management brief."))];
      egress.payloadBefore = data === "finance" ? "account_name · contact · contract_value · margin · renewal_reason" : "account_name · contact · email · renewal_score · renewal_reason";
      egress.payloadAfter = "account_segment · renewal_band · aggregated_reason · recommended_action";
      egress.obligations = ["REDACT", "AUDIT", "DESTINATION_LOG"];
    } else if (destination === "approved" && identity === "standard") {
      egress.decision = "HUMAN_CHECK";
      egress.policies = [policy("enterprise-aggregate-external-review", "enterprise-example", "HUMAN_CHECK", tr("标准信任主体执行外发需要一次性审批。", "A standard principal needs one-time approval for external delivery."))];
    } else {
      egress.policies = [policy("enterprise-internal-or-aggregate-egress", "enterprise-example", "ALLOW_WITH_AUDIT", tr("载荷与目标均处于获批范围内。", "The payload and destination remain within the approved scope."))];
    }
  }
  if (scenario.id === "incident-response") {
    const injected = (controls.ticket ?? "trusted") === "injected";
    const browser = nodes.find((node) => node.id === "browser-fetch")!;
    const llm = nodes.find((node) => node.id === "incident-llm")!;
    const file = nodes.find((node) => node.id === "file-write")!;
    const shell = nodes.find((node) => node.id === "shell-exec")!;
    const deploy = nodes.find((node) => node.id === "deploy-apply")!;
    browser.policies = [policy("enterprise-untrusted-source-label", "enterprise-example", "ALLOW_WITH_AUDIT", tr("外部诊断内容在后续轨迹中持续保留不可信来源标签。", "External diagnostic content retains an untrusted provenance label."))];
    llm.decision = "LLM_CHECK";
    llm.policies = [policy("enterprise-incident-goal-alignment", "enterprise-example", "LLM_CHECK", tr("修复方案须与获批事故目标进行语义复核。", "The remediation plan is checked against the approved incident objective."))];
    file.decision = "DEGRADE";
    file.policies = [policy("enterprise-change-preview-only", "enterprise-example", "DEGRADE", tr("补丁仅可写入隔离预览工作区。", "The patch is confined to an isolated preview workspace."))];
    file.obligations = ["TRACE", "DIFF_AUDIT", "PREVIEW_ONLY"];
    if (injected) {
      shell.decision = "DENY";
      shell.policies = [policy("trace-deny-unfiltered-to-exec", "community", "DENY", tr("不可信内容未经过有效过滤便到达执行端。", "Untrusted content reached an execution sink without an accepted filtering step.")), policy("chain-deny-llm-output-to-shell", "community", "DENY", tr("该轨迹中的 LLM 衍生输出不得进入 Shell。", "LLM-derived output cannot execute through Shell in this trace."))];
      shell.obligations = ["TRACE", "DENIAL_AUDIT", "SOURCE_PROVENANCE"];
    } else {
      shell.decision = "DEGRADE";
      shell.policies = [policy("enterprise-shell-preview", "enterprise-example", "DEGRADE", tr("命令被降级为不产生变更的预览。", "Commands are converted to a non-mutating preview."))];
      deploy.decision = "HUMAN_CHECK";
      deploy.policies = [policy("enterprise-production-change-approval", "enterprise-example", "HUMAN_CHECK", tr("生产发布属于高影响且难以撤销的行动。", "Production deployment is a high-impact irreversible action."))];
      deploy.obligations = ["TRACE", "APPROVAL_RECORD", "CHANGE_TICKET"];
    }
  }
  if (scenario.id === "vendor-payment") {
    const changed = (controls.account ?? "matched") === "changed";
    const compare = nodes.find((node) => node.id === "bank-compare")!;
    const erp = nodes.find((node) => node.id === "erp-write")!;
    const payment = nodes.find((node) => node.id === "send-money")!;
    compare.policies = [policy("enterprise-vendor-master-data-match", "enterprise-example", changed ? "DENY" : "ALLOW_WITH_AUDIT", changed ? tr("外部发票账户与获批供应商主数据不一致。", "The external invoice account differs from the approved vendor master record.") : tr("收款账户与获批供应商主数据一致。", "The beneficiary account matches the approved vendor master record."))];
    if (changed) {
      compare.decision = "DENY";
      compare.obligations = ["TRACE", "DENIAL_AUDIT", "VENDOR_REVIEW"];
    } else {
      erp.policies = [policy("enterprise-verified-invoice-write", "enterprise-example", "ALLOW_WITH_AUDIT", tr("仅已核验的发票字段可写入待审批 ERP 凭证。", "Only verified invoice fields may enter the pending ERP voucher."))];
      payment.decision = "HUMAN_CHECK";
      payment.policies = [policy("ex4-human-check", "community", "HUMAN_CHECK", tr("资金操作执行前必须获得明确的人工批准。", "Funds movement requires explicit human approval before execution."))];
      payment.obligations = ["TRACE", "APPROVAL_RECORD", "PAYMENT_AUDIT"];
    }
  }
  for (const node of nodes) {
    if (!node.policies.length) node.policies = [policy("trace-audit-runtime-path", "enterprise-example", node.decision, tr("行动保持在声明的任务与系统边界内。", "The action remains within its declared task and system boundary."))];
  }
  const stopIndex = nodes.findIndex((node) => node.decision === "DENY" || node.decision === "HUMAN_CHECK");
  const stop = stopIndex < 0 ? nodes.length - 1 : stopIndex;
  return { nodes, stopIndex: stop, status: stopIndex < 0 ? "completed" : nodes[stop].decision === "DENY" ? "blocked" : "paused", auditObligations: Array.from(new Set(nodes.flatMap((node) => node.obligations))) };
}

const priorities: DemoDecision[] = ["DENY", "HUMAN_CHECK", "LLM_CHECK", "DEGRADE", "REDACT", "ALLOW_WITH_AUDIT", "ALLOW"];
export const decisionPriority = priorities;

for (const localeCopy of Object.values(enterpriseScenarioLabCopy)) {
  for (const scenario of localeCopy.scenarios) {
    if (scenario.nodes.length < 7) throw new Error(`${scenario.id} must include at least seven trace nodes`);
    if (new Set(scenario.nodes.map((node) => node.lane)).size < 2) throw new Error(`${scenario.id} must cross at least two system lanes`);
    const defaults = Object.fromEntries(scenario.controls.map((control) => [control.id, control.defaultValue]));
    if (new Set(resolveEnterpriseScenario(scenario, defaults).nodes.map((node) => node.decision)).size < 2) throw new Error(`${scenario.id} must expose at least two decisions`);
  }
}
