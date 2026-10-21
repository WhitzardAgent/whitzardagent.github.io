import type { Locale } from "../config";

type Capability = { title: string; body: string };
export type GatewayCopy = {
  meta: { title: string; description: string };
  product: { label: string; title: string; titleSegments?: string[]; body: string; features: string[]; cta: string };
  eyebrow: string;
  primary: string;
  secondary: string;
  screenshot: { caption: string; alt: string; original: string };
  capabilitiesTitle: string;
  capabilities: Capability[];
  scenariosTitle: string;
  scenarios: Capability[];
  access: { title: string; body: string; roadmap: string };
};

// Evidence: WhitzardGateway 0.9.5 changelog and model/protection/cost handbooks.
// The screenshot is owner-provided. SaaS is the owner's future direction, not an availability claim.
export const gatewayCopy: Record<Locale, GatewayCopy> = {
  zh: {
    meta: { title: "WhitzardGateway — 智能体安全网关 · 白泽", description: "WhitzardGateway 统一接入模型服务，管理团队权限与运行防护，追踪智能体行为、Token 用量及参考费用。" },
    product: {
      label: "WhitzardGateway", title: "高效、安全的下一代智能体网关",
      titleSegments: ["高效、安全的", "下一代智能体网关"],
      body: "统一接入模型服务，管理团队权限与运行防护，追踪智能体行为、Token 用量及参考费用。",
      features: ["模型统一接入", "团队权限与运行防护", "行为追踪与用量管理"], cta: "了解 WhitzardGateway",
    },
    eyebrow: "智能体安全网关", primary: "加入心愿单", secondary: "联系团队",
    screenshot: { caption: "WhitzardGateway 登录界面", alt: "WhitzardGateway 中文登录界面：品牌介绍与管理员登录入口", original: "查看原图" },
    capabilitiesTitle: "核心能力",
    capabilities: [
      { title: "模型统一接入", body: "集中配置模型服务与连接，将智能体客户端接入团队管理的模型入口。按已支持的客户端、协议与模型配置组织接入。" },
      { title: "权限与运行防护", body: "为智能体配置独立访问凭证与权限策略，在请求、模型输出及工具行为边界实施安全检查，管理防护规则与配置版本。" },
      { title: "行为与用量记录", body: "查看运行轨迹、防护记录和 Token 用量，追溯相关行为与费用依据。参考费用保留价格与估算口径，不等同于实际账单。" },
    ],
    scenariosTitle: "团队使用场景",
    scenarios: [
      { title: "统一管理接入", body: "为团队使用的智能体配置模型连接与独立访问凭证，集中管理可用模型和接入权限。" },
      { title: "落实访问策略", body: "围绕团队成员与智能体的工作范围配置模型和工具权限，结合运行防护检查潜在风险。" },
      { title: "追踪运行与用量", body: "查看智能体运行记录和防护结果，核对 Token 用量与参考费用，为运营管理提供依据。" },
    ],
    access: { title: "产品接入", body: "联系团队，讨论部署环境、模型连接与管理需求。", roadmap: "我们计划面向中小企业提供 SaaS 服务。加入心愿单，获取后续产品与测试安排。" },
  },
  en: {
    meta: { title: "WhitzardGateway — Secure AI Agent Gateway · Whitzard", description: "Connect agents to model services, apply team access policies and runtime safeguards, and track activity, token usage, and estimated costs." },
    product: {
      label: "WhitzardGateway", title: "A secure, efficient gateway for AI agents",
      body: "Connect agents to model services, apply team access policies and runtime safeguards, and track activity, token usage, and estimated costs.",
      features: ["Unified model access", "Access policies and runtime safeguards", "Activity and usage tracking"], cta: "Explore WhitzardGateway",
    },
    eyebrow: "AI agent security gateway", primary: "Join the waitlist", secondary: "Contact the team",
    screenshot: { caption: "WhitzardGateway sign-in interface · Shown in Chinese", alt: "WhitzardGateway sign-in interface in Chinese, with product introduction and administrator sign-in", original: "View original image" },
    capabilitiesTitle: "Core capabilities",
    capabilities: [
      { title: "Unified model access", body: "Configure model services and connections centrally, giving agent clients a team-managed entry point. Connect using supported client, protocol, and model configurations." },
      { title: "Access and runtime safeguards", body: "Assign individual agent credentials and access policies. Apply security checks at request, model-output, and tool boundaries, with versioned rules and configuration." },
      { title: "Activity and usage records", body: "Review execution traces, protection records, and token usage alongside their supporting evidence. Cost estimates retain pricing and estimation context; they are not invoices." },
    ],
    scenariosTitle: "Built for team workflows",
    scenarios: [
      { title: "Manage agent access", body: "Configure model connections and individual credentials for your team's agents, with centrally managed model access and permissions." },
      { title: "Apply team policies", body: "Set model and tool permissions around each member's and agent's scope of work, with runtime checks for potential risks." },
      { title: "Review activity and usage", body: "Inspect run histories and protection outcomes, then review token usage and estimated costs to inform operational decisions." },
    ],
    access: { title: "Product access", body: "Talk with the team about deployment, model connections, and your management requirements.", roadmap: "A SaaS service for small and midsize businesses is planned. Join the waitlist for product updates and testing opportunities." },
  },
};
