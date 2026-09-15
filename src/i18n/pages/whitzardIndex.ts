import type { Locale } from "../config";

export type WhitzardIndexCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  subtitle: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  evidence: {
    tabsLabel: string;
    scopeLabel: string;
    findingLabel: string;
    limitationLabel: string;
    sourceLabel: string;
    publishedLabel: string;
    verifiedLabel: string;
  };
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  positioningEyebrow: string;
  positioningTitle: string;
  positioningItems: Array<{ title: string; body: string }>;
  dimensionsEyebrow: string;
  dimensionsTitle: string;
  dimensionsLead: string;
  dimensionsDisclaimer: string;
  methodEyebrow: string;
  methodTitle: string;
  methodLead: string;
  methodItems: Array<{ title: string; body: string }>;
  methodDisclaimer: string;
  versionEyebrow: string;
  versionTitle: string;
  versionEmpty: string;
  collaborationTitle: string;
  collaborationBody: string;
  collaborationCta: string;
};

export const whitzardIndexCopy: Record<Locale, WhitzardIndexCopy> = {
  en: {
    meta: {
      title: "Whitzard Index — NUWA",
      description: "The Whitzard Index is NUWA's long-term project for observing and comparing frontier AI risk across models and systems.",
    },
    eyebrow: "WHITZARD INDEX · NUWA",
    title: "Track frontier AI risk over time",
    subtitle: "A longitudinal evidence system for frontier AI risk",
    lead: "Whitzard Index organizes evaluation results into longitudinal, comparable, and citable evidence across models and agent systems.",
    primaryCta: "Explore published evidence",
    secondaryCta: "Read the methodology",
    evidence: {
      tabsLabel: "Published evaluation evidence",
      scopeLabel: "Evaluation scope",
      findingLabel: "Finding",
      limitationLabel: "Interpretation boundary",
      sourceLabel: "Original source",
      publishedLabel: "Published",
      verifiedLabel: "Last verified",
    },
    aboutEyebrow: "About the index",
    aboutTitle: "Multidimensional risk evidence, not a single safety score",
    aboutBody: "Whitzard Index preserves the meaning, scope, and uncertainty of each risk dimension. Published evidence can be followed over time, while results produced by different methods remain visibly separated rather than being collapsed into a misleading overall ranking.",
    positioningEyebrow: "Positioning",
    positioningTitle: "Principles for credible risk evidence",
    positioningItems: [
      { title: "Multidimensional evidence", body: "Risk dimensions retain their individual meaning instead of being collapsed into an unjustified total score." },
      { title: "Separated comparisons", body: "Raw-system results and protected-system results are reported separately with clear labels and configuration context." },
      { title: "Reproducible records", body: "Each evaluation carries a method version, system configuration, date, and evidence source." },
      { title: "Bounded conclusions", body: "Findings remain scoped to the systems, environments, permissions, and metrics that were actually tested." },
    ],
    dimensionsEyebrow: "Proposed framework",
    dimensionsTitle: "Proposed risk dimensions",
    dimensionsLead: "The following dimensions describe the categories of risk the Whitzard Index plans to track. These are proposed directions, not a finalized method.",
    dimensionsDisclaimer: "These dimensions are proposed and subject to change. They are not a published or approved evaluation method.",
    methodEyebrow: "Methodology",
    methodTitle: "Evidence record design",
    methodLead: "The information each Whitzard Index record must preserve for results to remain interpretable and citable.",
    methodItems: [
      { title: "Evaluation subject", body: "The exact model or agent system, version, and evaluation date." },
      { title: "Runtime configuration", body: "Agent scaffold, tool permissions, resource budgets, and other conditions that can change the result." },
      { title: "Risk dimension", body: "The specific behavior or capability measured, with its unit and interpretation direction." },
      { title: "Method version", body: "The method used to produce the result and the changes that affect comparability over time." },
      { title: "Evidence source", body: "The original paper, project, or dataset that supports the published observation." },
      { title: "Uncertainty", body: "Known limits, missing coverage, and the boundary beyond which a conclusion should not be generalized." },
    ],
    methodDisclaimer: "Any published result must identify its method version and preserve uncertainty rather than imply broader coverage.",
    versionEyebrow: "Version history",
    versionTitle: "Versions and changes",
    versionEmpty: "No versions have been published yet. When evaluation data is confirmed and released, version records and method change notes will appear here.",
    collaborationTitle: "Whitzard Index collaboration",
    collaborationBody: "For inquiries about the Whitzard Index — methodology, data contribution, or research collaboration — contact NUWA.",
    collaborationCta: "Contact NUWA",
  },
  zh: {
    meta: {
      title: "白泽指数 — 女娲实验室",
      description: "白泽指数是女娲实验室持续观测和比较前沿 AI 风险的研究数据项目。",
    },
    eyebrow: "白泽指数 · 女娲实验室",
    title: "持续观测前沿 AI 风险",
    subtitle: "面向前沿 AI 风险的长期证据系统",
    lead: "白泽指数将分散的评测结果整理为可比较、可复核、可引用的长期风险记录。",
    primaryCta: "查看已发表证据",
    secondaryCta: "阅读方法说明",
    evidence: {
      tabsLabel: "已发表评测证据",
      scopeLabel: "评测范围",
      findingLabel: "证据结论",
      limitationLabel: "解释边界",
      sourceLabel: "原始来源",
      publishedLabel: "发表日期",
      verifiedLabel: "最近核验",
    },
    aboutEyebrow: "关于白泽指数",
    aboutTitle: "多维风险证据，而非单一安全总分",
    aboutBody: "白泽指数保留每个风险维度的含义、评测范围与不确定性，使公开证据能够被持续追踪；不同方法产生的结果会清晰分开，不被压缩成容易误导的综合排名。",
    positioningEyebrow: "定位",
    positioningTitle: "可信风险证据的基本原则",
    positioningItems: [
      { title: "保留多维证据", body: "不同风险维度保持各自含义，不在缺乏论证时折叠为单一总分。" },
      { title: "区分对照条件", body: "原始系统与受保护系统的结果分开报告，并清晰标注运行配置。" },
      { title: "形成可复核记录", body: "每项评测记录方法版本、系统配置、日期与证据来源。" },
      { title: "限定结论边界", body: "研究结论严格对应实际测试的系统、环境、权限与指标。" },
    ],
    dimensionsEyebrow: "拟议框架",
    dimensionsTitle: "拟议风险维度",
    dimensionsLead: "以下维度描述白泽指数计划追踪的风险类别。这些是拟议方向，不是最终确定的方法。",
    dimensionsDisclaimer: "这些维度为拟议方案，可能调整。它们不是已发布或已批准的评测方法。",
    methodEyebrow: "方法说明",
    methodTitle: "证据记录设计",
    methodLead: "每条白泽指数记录需要保留的关键信息，使结果保持可解释、可比较与可引用。",
    methodItems: [
      { title: "评测对象", body: "记录模型或智能体系统的准确名称、版本与评测日期。" },
      { title: "运行配置", body: "记录智能体脚手架、工具权限、资源预算及其他会改变结果的条件。" },
      { title: "风险维度", body: "明确实际测量的行为或能力、指标单位及其解释方向。" },
      { title: "方法版本", body: "标注结果所依据的方法，以及影响纵向可比性的方法变更。" },
      { title: "证据来源", body: "链接支撑该项观察的原始论文、项目或数据集。" },
      { title: "不确定性", body: "说明已知限制、未覆盖范围以及结论不应被外推的边界。" },
    ],
    methodDisclaimer: "任何公开结果都应明确方法版本并保留不确定性，避免暗示超出测试范围的覆盖。",
    versionEyebrow: "版本记录",
    versionTitle: "版本与变更",
    versionEmpty: "尚未发布任何版本。当评测数据确认并发布后，版本记录与方法变更说明将出现在这里。",
    collaborationTitle: "白泽指数合作",
    collaborationBody: "如有关于白泽指数的问题——方法、数据贡献或研究合作——请联系女娲实验室。",
    collaborationCta: "联系女娲实验室",
  },
};
