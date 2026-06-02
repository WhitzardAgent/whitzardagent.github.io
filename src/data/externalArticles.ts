export type ExternalArticle = {
  title: string;
  source: string;
  url: string;
  type: string;
  year?: string;
  summary?: string;
  tags?: string[];
};

export const externalArticles: ExternalArticle[] = [
  {
    title: "The Science of Frontier AI Risk Evaluation",
    source: "Nuwa Substack",
    url: "https://nuwasafety.substack.com/p/science-of-frontier-ai-risk-evaluation",
    type: "External · Substack",
    year: "2026",
    summary:
      "Nuwa essay on making frontier AI risk evaluation more scientific, evidence-based, and operational.",
    tags: ["Frontier AI Risk", "Evaluation", "Methodology"],
  },
];
