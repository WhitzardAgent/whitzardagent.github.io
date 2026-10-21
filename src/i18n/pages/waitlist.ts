import type { Locale } from "../config";

export type WaitlistCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  steps: [string, string];
  fields: {
    name: string;
    email: string;
    organization: string;
    role: string;
    interest: string;
    environment: string;
    useCase: string;
    stage: string;
    timeline: string;
    notes: string;
    consent: string;
  };
  options: {
    interests: string[];
    stages: string[];
    timelines: string[];
  };
  next: string;
  back: string;
  submit: string;
  submitting: string;
  required: string;
  invalidEmail: string;
  success: string;
  failure: string;
  unavailableTitle: string;
  unavailableBody: string;
  emailFallback: string;
  privacyNote: string;
};

export const waitlistCopy: Record<Locale, WaitlistCopy> = {
  zh: {
    meta: {
      title: "加入心愿单 — 白泽（Whitzard）",
      description: "加入白泽产品心愿单，提交团队信息、智能体环境与安全需求。",
    },
    eyebrow: "产品接入",
    title: "加入心愿单",
    lead: "提交团队信息与智能体安全需求，获取产品接入及后续测试安排。",
    steps: ["团队信息", "需求与计划"],
    fields: {
      name: "姓名",
      email: "工作邮箱",
      organization: "组织名称",
      role: "职务",
      interest: "主要关注",
      environment: "智能体或框架环境",
      useCase: "应用场景",
      stage: "当前阶段",
      timeline: "计划接入时间",
      notes: "补充说明（可选）",
      consent: "我同意白泽为处理本次申请和后续沟通而使用以上信息。",
    },
    options: {
      interests: ["AgentGuard", "WhitzardGateway", "模型服务", "AgentGuard 与模型服务"],
      stages: ["调研与验证", "原型开发", "内部试点", "生产环境"],
      timelines: ["尽快", "1–3 个月", "3–6 个月", "6 个月以后", "暂未确定"],
    },
    next: "继续",
    back: "返回",
    submit: "提交申请",
    submitting: "正在提交…",
    required: "请填写此项",
    invalidEmail: "请输入有效的工作邮箱",
    success: "申请已收到，后续将通过工作邮箱联系。",
    failure: "暂时无法提交，请稍后重试或通过邮箱联系我们。",
    unavailableTitle: "通过邮箱申请接入",
    unavailableBody: "在线提交暂不可用。请通过邮箱发送产品需求与联系方式，后续将通过邮箱沟通接入安排。",
    emailFallback: "通过邮箱联系",
    privacyNote: "表单只用于产品接入评估；分析事件不会包含姓名、邮箱或填写内容。",
  },
  en: {
    meta: {
      title: "Join the waitlist — Whitzard",
      description: "Join the Whitzard product waitlist and tell us about your team, agent environment, and security needs.",
    },
    eyebrow: "Product access",
    title: "Join the waitlist",
    lead: "Share your team details and agent-security requirements so we can review product access and testing arrangements.",
    steps: ["Team details", "Needs and timing"],
    fields: {
      name: "Name",
      email: "Work email",
      organization: "Organization",
      role: "Role",
      interest: "Primary interest",
      environment: "Agent or framework environment",
      useCase: "Intended use case",
      stage: "Current stage",
      timeline: "Expected timeline",
      notes: "Additional context (optional)",
      consent: "I agree that Whitzard may use this information to review this request and contact me about product access.",
    },
    options: {
      interests: ["AgentGuard", "WhitzardGateway", "Model Services", "AgentGuard and Model Services"],
      stages: ["Research and evaluation", "Prototype", "Internal pilot", "Production"],
      timelines: ["As soon as possible", "1–3 months", "3–6 months", "More than 6 months", "Not decided"],
    },
    next: "Continue",
    back: "Back",
    submit: "Submit request",
    submitting: "Submitting…",
    required: "This field is required",
    invalidEmail: "Enter a valid work email",
    success: "Your request has been received. We will contact you at the work email provided.",
    failure: "We could not submit your request. Try again later or contact us by email.",
    unavailableTitle: "Request access by email",
    unavailableBody: "Online submission is currently unavailable. Email us your product requirements and contact details so we can discuss access.",
    emailFallback: "Contact us by email",
    privacyNote: "This form is used only to assess product access. Analytics events never include names, email addresses, or field contents.",
  },
};
