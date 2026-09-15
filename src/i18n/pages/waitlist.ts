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
      description: "加入白泽产品心愿单，告诉我们你的团队、智能体环境与安全需求。",
    },
    eyebrow: "产品访问",
    title: "加入心愿单",
    lead: "告诉我们你正在构建什么，以及你最需要解决的智能体安全问题。我们会据此安排后续测试与沟通。",
    steps: ["你的团队", "需求与计划"],
    fields: {
      name: "姓名",
      email: "工作邮箱",
      organization: "组织名称",
      role: "你的角色",
      interest: "主要关注",
      environment: "智能体或框架环境",
      useCase: "计划解决的场景",
      stage: "当前阶段",
      timeline: "期望时间",
      notes: "补充说明（可选）",
      consent: "我同意白泽为处理本次申请和后续沟通而使用以上信息。",
    },
    options: {
      interests: ["AgentGuard", "模型服务", "AgentGuard 与模型服务"],
      stages: ["调研与验证", "原型开发", "内部试点", "生产环境"],
      timelines: ["尽快", "1–3 个月", "3–6 个月", "6 个月以后", "暂未确定"],
    },
    next: "继续",
    back: "返回",
    submit: "提交申请",
    submitting: "正在提交…",
    required: "请填写此项",
    invalidEmail: "请输入有效的工作邮箱",
    success: "申请已收到。我们会通过工作邮箱与你联系。",
    failure: "暂时无法提交，请稍后重试或通过邮箱联系我们。",
    unavailableTitle: "在线提交正在开放中",
    unavailableBody: "当前网站尚未连接经批准的数据接收服务，因此不会假装你的信息已经保存。你可以先通过公开邮箱联系我们。",
    emailFallback: "通过邮箱联系",
    privacyNote: "表单只用于产品访问评估；分析事件不会包含姓名、邮箱或填写内容。",
  },
  en: {
    meta: {
      title: "Join the waitlist — Whitzard",
      description: "Join the Whitzard product waitlist and tell us about your team, agent environment, and security needs.",
    },
    eyebrow: "Product access",
    title: "Join the waitlist",
    lead: "Tell us what you are building and which agent-security problem matters most. We will use this context to plan limited access and follow-up conversations.",
    steps: ["Your team", "Needs and timing"],
    fields: {
      name: "Name",
      email: "Work email",
      organization: "Organization",
      role: "Your role",
      interest: "Primary interest",
      environment: "Agent or framework environment",
      useCase: "Intended use case",
      stage: "Current stage",
      timeline: "Expected timeline",
      notes: "Additional context (optional)",
      consent: "I agree that Whitzard may use this information to review this request and contact me about product access.",
    },
    options: {
      interests: ["AgentGuard", "Model Services", "AgentGuard and Model Services"],
      stages: ["Research and evaluation", "Prototype", "Internal pilot", "Production"],
      timelines: ["As soon as possible", "1–3 months", "3–6 months", "More than 6 months", "Not decided"],
    },
    next: "Continue",
    back: "Back",
    submit: "Submit request",
    submitting: "Submitting…",
    required: "This field is required",
    invalidEmail: "Enter a valid work email",
    success: "Your request has been received. We will follow up by work email.",
    failure: "We could not submit your request. Try again later or contact us by email.",
    unavailableTitle: "Online submission is being introduced",
    unavailableBody: "This site is not yet connected to an approved data destination, so it will not pretend that your information has been stored. You can contact us through the published email address in the meantime.",
    emailFallback: "Contact us by email",
    privacyNote: "This form is used only to assess product access. Analytics events never include names, email addresses, or field contents.",
  },
};
