import type { Locale } from "../i18n/config";

type LocalizedText = Record<Locale, string>;

export type ResearchVisual = {
  researchSlug: string;
  assetPath: string;
  sourcePdfUrl: string;
  figureLabel: string;
  page: number;
  caption: LocalizedText;
  alt: LocalizedText;
};

export const researchVisuals: ResearchVisual[] = [
  {
    researchSlug: "large-language-model-powered-ai-systems-achieve-self-replication-with-no-human-i",
    assetPath: "/assets/research/self-replication-figure-1.png",
    sourcePdfUrl: "https://arxiv.org/pdf/2503.17378",
    figureLabel: "Figure 1",
    page: 3,
    caption: {
      zh: "自我复制、环境适应与抗关闭测试构成可执行的前沿风险证据链",
      en: "Executable tests connect self-replication, adaptation, and shutdown-survival evidence.",
    },
    alt: {
      zh: "论文 Figure 1，展示 AI 系统自我复制、环境适应和抗关闭测试场景",
      en: "Figure 1 showing AI-system self-replication, adaptation, and shutdown-survival test scenarios",
    },
  },
  {
    researchSlug: "autocontrol-arena-synthesizing-executable-test-environments-for-frontier-ai-risk",
    assetPath: "/assets/research/autocontrol-arena-figure-2.png",
    sourcePdfUrl: "https://arxiv.org/pdf/2603.07427",
    figureLabel: "Figure 2",
    page: 3,
    caption: {
      zh: "由 Architect 与 Coder 合成可执行环境，再对目标智能体进行监测与评估",
      en: "Architect and Coder agents synthesize executable environments for monitored frontier-risk evaluation.",
    },
    alt: {
      zh: "论文 Figure 2，展示 Architect、Coder、可执行环境、目标智能体与 Monitor 的评测流程",
      en: "Figure 2 showing Architect, Coder, executable environments, target agents, and monitoring",
    },
  },
  {
    researchSlug: "think-twice-before-you-act-enhancing-agent-behavioral-safety-with-thought-correc",
    assetPath: "/assets/research/thought-aligner-figure-1.png",
    sourcePdfUrl: "https://arxiv.org/pdf/2505.11063",
    figureLabel: "Figure 1",
    page: 2,
    caption: {
      zh: "Thought-Aligner 在危险行动发生前修正推理路径，并保留任务能力",
      en: "Thought-Aligner corrects unsafe reasoning before action while preserving task utility.",
    },
    alt: {
      zh: "论文 Figure 1，对比危险行为轨迹与 Thought-Aligner 修正后的安全轨迹",
      en: "Figure 1 comparing an unsafe action trajectory with a Thought-Aligner-corrected trajectory",
    },
  },
];

if (researchVisuals.length !== 3 || new Set(researchVisuals.map((item) => item.researchSlug)).size !== 3) {
  throw new Error("Research visuals require three unique verified figures");
}
