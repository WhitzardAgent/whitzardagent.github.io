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
    visionTitle: "Safety evaluation and enhancement",
    visionBody: "Whitzard's model services translate NUWA research on frontier AI risk into model capabilities for evaluating safety and strengthening runtime safeguards in agent systems.",
    serviceTypes: [
      { title: "Safety evaluation models", body: "Models and tools for evaluating safety properties of other AI systems — reasoning integrity, intent, and behavior risk." },
      { title: "Safety-enhanced models", body: "Lightweight models for reasoning alignment, intent checking, and runtime protection in agent systems." },
    ],
    sourceEyebrow: "Model development",
    sourceTitle: "Model provenance",
    sourceLead: "Model documentation distinguishes original development, fine-tuning, and third-party hosting.",
    sourceTypes: [
      { title: "Self-developed", body: "Models built by Whitzard and NUWA from research on frontier AI risk and safety." },
      { title: "Fine-tuned", body: "Open or partner models adapted with Whitzard's safety data and methods. The base model and fine-tuning approach will be documented." },
      { title: "Hosted", body: "Third-party models offered through Whitzard's infrastructure, with clear attribution to the original provider." },
    ],
    accessEyebrow: "Access",
    accessTitle: "Request access",
    accessBody: "Share your use case, agent environment, and deployment requirements. Our team will help identify the right evaluation or safety model for your workflow.",
    updatesEyebrow: "Updates",
    updatesTitle: "Research and product updates",
    updatesBody: "Follow NUWA's research or join the waitlist for model service updates.",
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
    visionTitle: "安全评测与增强",
    visionBody: "白泽的模型服务将女娲实验室在前沿 AI 风险方面的研究转化为模型能力，用于评测其他 AI 系统的安全性，并在智能体系统中增强运行时安全。",
    serviceTypes: [
      { title: "安全评测模型", body: "用于评估其他 AI 系统安全属性的模型与工具——推理完整性、意图与行为风险。" },
      { title: "安全增强模型", body: "在智能体系统中提供推理校准、意图检查与运行时防护的轻量模型。" },
    ],
    sourceEyebrow: "研发与适配",
    sourceTitle: "模型来源",
    sourceLead: "模型资料区分自研、微调与第三方托管，并说明来源及适配方法。",
    sourceTypes: [
      { title: "自研", body: "由白泽和女娲实验室基于前沿 AI 风险与安全研究构建的模型。" },
      { title: "微调", body: "使用白泽的安全数据和方法适配的开放或合作伙伴模型。基座模型与微调方法将明确记录。" },
      { title: "托管", body: "通过白泽基础设施提供的第三方模型，明确标注原始提供方。" },
    ],
    accessEyebrow: "接入方式",
    accessTitle: "申请接入",
    accessBody: "提供使用场景、智能体环境与部署要求。我们将协助评估适合工作流的安全评测与安全增强模型。",
    updatesEyebrow: "获取更新",
    updatesTitle: "研究与产品动态",
    updatesBody: "订阅女娲实验室研究通讯，或加入心愿单获取模型服务进展。",
    researchUpdatesLabel: "研究更新",
    researchUpdatesCta: "在 Substack 订阅",
    serviceUpdatesLabel: "模型服务更新",
    serviceUpdatesCta: "加入心愿单",
    docsEyebrow: "文档与资源",
    docsTitle: "文档与资源",
    docsBody: "在 GitHub 与 Hugging Face 查看评测工具、安全模型及相关技术资料。",
  },
};
