import type { Locale } from "../i18n/config";

export const products = [
  {
    id: "whitzardaudit", name: "WhitzardAudit", href: "/#product-whitzardaudit",
    label: { zh: "智能代码安全审计平台", en: "AI code security auditing" },
    role: { zh: "代码安全", en: "Code security" },
    headline: { zh: "把代码风险，追溯到具体依据", en: "Trace code risks to the evidence" },
    value: { zh: "查看审计任务与风险列表，沿漏洞定位、关键发现和修复建议，审阅每一项代码安全问题。", en: "Review audit tasks and findings, with vulnerability locations, supporting evidence, and remediation guidance." },
    capabilities: { zh: ["代码风险审计", "漏洞定位", "修复建议"], en: ["Code auditing", "Vulnerability findings", "Remediation guidance"] },
    image: "audit", caption: { zh: "审计工作台", en: "Audit workspace" },
    icon: "M7 5 1 12l6 7m10-14 6 7-6 7M14 3l-4 18",
  },
  {
    id: "whitzardgateway", name: "WhitzardGateway", href: "/#product-whitzardgateway",
    label: { zh: "智能体安全网关", en: "Agent security gateway" },
    role: { zh: "安全接入", en: "Secure access" },
    headline: { zh: "在统一入口，配置清晰的防护", en: "Set safeguards at a shared gateway" },
    value: { zh: "集中管理智能体接入、模型访问与防护插件，并通过请求记录查看安全检查和处置依据。", en: "Manage agent access, model permissions, and protection plugins, then inspect security checks and decisions in request records." },
    capabilities: { zh: ["智能体接入", "权限与防护", "请求审计"], en: ["Agent access", "Access policies", "Request audit"] },
    image: "gateway", caption: { zh: "Overview 工作台 · 最近 30 天的保留数据", en: "Overview workspace · Retained data from the last 30 days" },
    icon: "M9 3v18m6-18v18M2 8h19m-4-4 4 4-4 4M22 16H3m4-4-4 4 4 4",
  },
  {
    id: "agentguard", name: "AgentGuard", href: "/#product-agentguard",
    label: { zh: "智能体安全运营平台", en: "Agent security operations platform" },
    role: { zh: "安全运营", en: "Agent operations" },
    headline: { zh: "把运行边界，落实为具体策略", en: "Turn runtime boundaries into policy" },
    value: { zh: "围绕智能体管理工具标签、运行规则、Skill 与 MCP 资源，为安全运营提供统一的工作空间。", en: "Bring tool labels, runtime policies, skills, and MCP resources into a shared workspace for agent security operations." },
    capabilities: { zh: ["运行策略", "工具治理", "Skill / MCP"], en: ["Runtime policies", "Tool governance", "Skills / MCP"] },
    image: "operations", caption: { zh: "智能体运行仪表盘", en: "Agent runtime dashboard" },
    icon: "M3 4h18v13H3zM8 21h8m-4-4v4M6 12l3-4 4 5 4-4",
  },
  {
    id: "whitzardeval", name: "WhitzardEval", href: "/#product-whitzardeval",
    label: { zh: "智能体安全评测平台", en: "Agent security evaluation platform" },
    role: { zh: "安全评测", en: "Security evaluation" },
    headline: { zh: "从风险分布，深入到每条证据", en: "Follow evaluation findings to the evidence" },
    value: { zh: "配置评测对象与测试范围，在报告中查看风险覆盖、逐用例响应和判定依据，支持问题复核。", en: "Define evaluation targets and scope, then review risk coverage, individual responses, and the evidence behind each assessment." },
    capabilities: { zh: ["评测配置", "风险报告", "逐用例证据"], en: ["Evaluation setup", "Risk reports", "Case-level evidence"] },
    image: "evaluation", caption: { zh: "评测任务与结果总览 · 控制台现用品牌 ActVerity（安行可鉴）", en: "Evaluation tasks and results · Console currently branded ActVerity" },
    icon: "M5 4h14v17H5zM8 9l1 1 2-2m2 1h3M8 15l1 1 2-2m2 1h3",
  },
] as const;

export type Product = typeof products[number];

export function productNavigation(locale: Locale) {
  return products.map(product => ({ href: product.href, label: product.name, description: product.label[locale], iconPath: product.icon }));
}
