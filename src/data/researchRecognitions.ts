export type LocalizedText = { en: string; zh: string };

export type ResearchRecognition = {
  year: number;
  title: LocalizedText;
  attribution: LocalizedText;
  relatedResearchSlug?: string;
  sourceUrl: string;
};

export const researchRecognitions: ResearchRecognition[] = [
  { year: 2026, title: { en: "Xuemin Scholar", zh: "徐敏学者" }, attribution: { en: "Awarded to Xudong Pan", zh: "潘旭东个人荣誉" }, sourceUrl: "https://ravensanstete.github.io/en/" },
  { year: 2026, title: { en: "NDSS Best Paper Award", zh: "NDSS 最佳论文奖" }, attribution: { en: "One Email, Many Faces — research team recognition", zh: "《One Email, Many Faces》研究团队荣誉" }, relatedResearchSlug: "one-email-many-faces-a-deep-dive-into-identity-confusion-in-email-aliases", sourceUrl: "https://ghong.site/" },
  { year: 2024, title: { en: "Shanghai Chenguang Program", zh: "上海市晨光计划" }, attribution: { en: "Awarded to Xudong Pan", zh: "潘旭东个人荣誉" }, sourceUrl: "https://ravensanstete.github.io/en/" },
  { year: 2024, title: { en: "Shanghai Technical Invention Award — First Prize", zh: "上海市技术发明奖一等奖" }, attribution: { en: "Research team recognition; Geng Hong and Jiarun Dai named as contributors", zh: "研究团队荣誉，洪赓、戴嘉润为完成人" }, sourceUrl: "https://newsroom.fudan.edu.cn/_s3/2025/0826/c234a146480/page.psp" },
  { year: 2023, title: { en: "WAIC Yunfan Award", zh: "世界人工智能大会云帆奖" }, attribution: { en: "Awarded to Xudong Pan", zh: "潘旭东个人荣誉" }, sourceUrl: "https://ravensanstete.github.io/en/" },
  { year: 2023, title: { en: "ACM SIGSAC China Distinguished Doctoral Dissertation Award", zh: "ACM SIGSAC 中国优秀博士论文奖" }, attribution: { en: "Awarded to Xudong Pan", zh: "潘旭东个人荣誉" }, sourceUrl: "https://ravensanstete.github.io/en/" },
  { year: 2020, title: { en: "WAIC Youth Outstanding Paper Nomination", zh: "世界人工智能大会青年优秀论文提名" }, attribution: { en: "Privacy Risks of General-Purpose Language Models — paper recognition", zh: "《Privacy Risks of General-Purpose Language Models》论文荣誉" }, relatedResearchSlug: "privacy-risks-of-general-purpose-language-models", sourceUrl: "https://ravensanstete.github.io/en/publications/" },
];
