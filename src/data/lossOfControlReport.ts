import type { ResearchAsset } from "./generated/researchAssets";
import { localizedPath, type Locale } from "../i18n/config";

export const reportPath = "/nuwa/research/loss-of-control/";
export const reportDate = "2026-11-25";
export const reportAuthors = ["Changyi Li", "Yun Chen", "Yiyang Zhang", "Wenqi Zhang", "Changyue Jiang", "Yihe Fan", "Xudong Pan", "Jiarun Dai", "Min Yang"];
export const reportTitle = {
  zh: "理解前沿 AI 系统的失控风险",
  en: "Understanding Loss-of-Control Risk in Frontier AI Systems",
};
export const reportSummary = {
  zh: "女娲实验室独立评测五款前沿开放权重模型，并核查单次运行，比较最终得分、实际行动及运行配置。",
  en: "NUWA Lab independently evaluates five frontier open-weight models, reviewing individual runs to compare scores, observed actions and agent setups.",
};
// Date of the named release, with the release channel identified where it matters.
export const reportModels = [
  { name: "MiMo-V2.6-Flash", date: "2026-09-21", source: "https://mimo.mi.com/docs/en-US/updates/feature/studio", label: { zh: "发布", en: "Released" } },
  { name: "GLM-5.3", date: "2026-08-14", source: "https://www.nist.gov/news-events/news/2026/09/caisis-assessment-zais-glm-53-cyber-capabilities", label: { zh: "首发", en: "Initial release" } },
  { name: "DeepSeek-V4.1-Flash-1017", date: "2026-10-17", source: "https://api-docs.deepseek.com/updates/#date-2026-10-17", label: { zh: "版本发布", en: "Version released" } },
  { name: "Mistral-Large-4-1T-A52B", date: "2026-10-29", source: "https://mistral.ai/news/mistral-large-4-oss/", label: { zh: "权重发布", en: "Weights released" } },
  { name: "Muse-Spark-Open-816B-A42B", date: "2026-10-15", source: "https://dev.meta.ai/resources/blog/build-with-muse-spark-open", label: { zh: "权重发布", en: "Weights released" } },
];

type Publication = { pdf: string; date: string; pages: Record<string, number> };
export function getReportPublication(): Publication | null {
  return {
    pdf: "/nuwa/research/LoCEval_NUWA_20261125.pdf",
    date: "2026-11-25",
    pages: {
      "figure-1": 6, "figure-3": 10, "figure-4": 11,
      "figure-7": 14, "figure-8": 16, "figure-9": 16,
      "figure-11": 17, "figure-12": 18, "figure-16": 21,
      "figure-17": 22, "figure-27": 30, "figure-29": 32,
      "figure-30": 33, "figure-33": 46,
    },
  };
}

export const reportTrajectoriesUrl: string | null = null;

export function lossOfControlResearchAsset(locale: Locale): ResearchAsset {
  const href = localizedPath(reportPath, locale);
  const pdf = getReportPublication()?.pdf;
  return {
    slug: "nuwa-loss-of-control-report",
    title: reportTitle[locale],
    authors: reportAuthors,
    year: 2026,
    venue: "NUWA Frontier AI Safety Lab",
    category: "frontier-risk-control",
    publicationType: "report",
    topics: { zh: ["失控风险", "前沿 AI 风险评测"], en: ["Loss of control", "Frontier AI risk evaluation"] },
    summary: reportSummary,
    links: [{ kind: "paper", url: href }, ...(pdf ? [{ kind: "pdf" as const, url: pdf }] : [])],
    sourceUrls: [href],
    memberSlugs: ["jiarun-dai", "xudong-pan"],
    lastVerified: reportDate,
  };
}
