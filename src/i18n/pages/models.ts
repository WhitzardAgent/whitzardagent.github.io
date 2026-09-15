import type { Locale } from "../config";

export type ModelsCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  visionEyebrow: string;
  visionTitle: string;
  visionBody: string;
  serviceTypes: Array<{ title: string; body: string }>;
  sourceEyebrow: string;
  sourceTitle: string;
  sourceLead: string;
  sourceTypes: Array<{ title: string; body: string }>;
  accessEyebrow: string;
  accessTitle: string;
  accessBody: string;
  updatesEyebrow: string;
  updatesTitle: string;
  updatesBody: string;
  researchUpdatesLabel: string;
  researchUpdatesCta: string;
  serviceUpdatesLabel: string;
  serviceUpdatesCta: string;
  docsEyebrow: string;
  docsTitle: string;
  docsBody: string;
};

export const modelsCopy: Record<Locale, ModelsCopy> = {
  en: {
    meta: {
      title: "Model Services — Whitzard",
      description: "Whitzard Model Services support model safety evaluation and runtime safeguards for AI agent systems.",
    },
    eyebrow: "Model Services",
    title: "Model Services",
    lead: "Model safety evaluation and safety-enhanced capabilities for agent systems.",
    visionEyebrow: "Service scope",
    visionTitle: "Two service lines",
    visionBody: "Whitzard's model services translate NUWA research on frontier AI risk into model capabilities for evaluating safety and strengthening runtime safeguards in agent systems.",
    serviceTypes: [
      { title: "Safety evaluation models", body: "Models and tools for evaluating safety properties of other AI systems — reasoning integrity, intent, and behavior risk." },
      { title: "Safety-enhanced models", body: "Lightweight models that provide thought alignment, intent checking, and runtime defense within agent systems." },
    ],
    sourceEyebrow: "Model provenance",
    sourceTitle: "Where models come from",
    sourceLead: "Whitzard's model services distinguish model sources so users can understand whether a model is self-developed, fine-tuned, or hosted.",
    sourceTypes: [
      { title: "Self-developed", body: "Models built by Whitzard and NUWA from research on frontier AI risk and safety." },
      { title: "Fine-tuned", body: "Open or partner models adapted with Whitzard's safety data and methods. The base model and fine-tuning approach will be documented." },
      { title: "Hosted", body: "Third-party models offered through Whitzard's infrastructure, with clear attribution to the original provider." },
    ],
    accessEyebrow: "Access",
    accessTitle: "Discuss product access",
    accessBody: "Join the waitlist with your intended use case, model or agent environment, deployment stage, and expected timeline. We use that context to evaluate the right product path without publishing unverified pricing, performance, or availability claims.",
    updatesEyebrow: "Stay informed",
    updatesTitle: "Two ways to stay updated",
    updatesBody: "Research updates and model service updates are separate. Choose the one that matches your interest.",
    researchUpdatesLabel: "Research updates",
    researchUpdatesCta: "Subscribe on Substack",
    serviceUpdatesLabel: "Model service updates",
    serviceUpdatesCta: "Join the waitlist",
    docsEyebrow: "Documentation",
    docsTitle: "Documentation & resources",
    docsBody: "Explore Whitzard's open-source projects on GitHub and Hugging Face, including evaluation tools and safety models.",
  },
  zh: {
    meta: {
      title: "模型服务 — 白泽（Whitzard）",
      description: "白泽模型服务面向 AI 智能体系统，提供模型安全评测与运行时防护增强能力。",
    },
    eyebrow: "模型服务",
    title: "模型服务",
    lead: "面向智能体系统的模型安全评测与安全增强能力。",
    visionEyebrow: "服务范围",
    visionTitle: "两类模型服务",
    visionBody: "白泽的模型服务将女娲实验室在前沿 AI 风险方面的研究转化为模型能力，用于评测其他 AI 系统的安全性，并在智能体系统中增强运行时安全。",
    serviceTypes: [
      { title: "安全评测模型", body: "用于评估其他 AI 系统安全属性的模型与工具——推理完整性、意图与行为风险。" },
      { title: "安全增强模型", body: "在智能体系统中提供思维校准、意图检查与运行时防护的轻量模型。" },
    ],
    sourceEyebrow: "模型来源",
    sourceTitle: "模型从哪里来",
    sourceLead: "白泽的模型服务清晰区分模型来源，帮助用户了解模型是自研、微调还是托管。",
    sourceTypes: [
      { title: "自研", body: "由白泽和女娲实验室基于前沿 AI 风险与安全研究构建的模型。" },
      { title: "微调", body: "使用白泽的安全数据和方法适配的开放或合作伙伴模型。基座模型与微调方法将明确记录。" },
      { title: "托管", body: "通过白泽基础设施提供的第三方模型，明确标注原始提供方。" },
    ],
    accessEyebrow: "接入方式",
    accessTitle: "沟通产品访问",
    accessBody: "加入心愿单并说明使用场景、模型或智能体环境、部署阶段与期望时间。我们会根据这些信息评估合适的产品路径，同时不发布未经验证的价格、性能或可用性信息。",
    updatesEyebrow: "获取更新",
    updatesTitle: "两种更新，分别订阅",
    updatesBody: "研究更新和模型服务更新是不同的内容，请根据你的兴趣分别订阅。",
    researchUpdatesLabel: "研究更新",
    researchUpdatesCta: "在 Substack 订阅",
    serviceUpdatesLabel: "模型服务更新",
    serviceUpdatesCta: "加入心愿单",
    docsEyebrow: "文档与资源",
    docsTitle: "文档与资源",
    docsBody: "你可以在 GitHub 与 Hugging Face 上探索白泽的开源项目，包括评测工具和安全模型。",
  },
};
