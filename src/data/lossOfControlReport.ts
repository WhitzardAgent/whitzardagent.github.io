import type { ResearchAsset } from "./generated/researchAssets";
import { localizedPath, type Locale } from "../i18n/config";

export const reportPath = "/nuwa/research/loss-of-control/";
export const reportDate = "2026-11-25";
export const reportAuthors = ["Changyi Li", "Yun Chen", "Yiyang Zhang", "Wenqi Zhang", "Changyue Jiang", "Xudong Pan", "Jiarun Dai", "Min Yang"];
export const reportTitle = {
  zh: "理解前沿 AI 系统的失控风险",
  en: "Understanding Loss-of-Control Risk in Frontier AI Systems",
};
export const reportSummary = {
  zh: "本报告评测五款前沿开放权重模型在五个维度上的失控风险。",
  en: "This report assesses five dimensions of loss-of-control risk in five frontier open-weight models.",
};
export const reportModels = ["MiMo-V2.6-Flash", "GLM-5.3", "DeepSeek-V4.1-Flash-1017", "Mistral-Large-4-1T-A52B", "Muse-Spark-Open-816B-A42B"];

// The introduction is published separately. Register the PDF when its public edition is ready.
type Publication = { pdf: string; date: string; pages: Record<string, number> };
export function getReportPublication(): Publication | null {
  return null;
}

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
