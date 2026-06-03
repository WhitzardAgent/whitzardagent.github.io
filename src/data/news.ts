export type NewsItem = {
  title: string;
  date: string;
  type: "Research" | "Company" | "Ecosystem" | "Event" | "Media" | "Update";
  summary?: string;
  url?: string;
  source?: string;
  featured?: boolean;
};

export const newsItems: NewsItem[] = [
  {
    title: "The Science of Frontier AI Risk Evaluation",
    date: "2026-01-15",
    type: "Research",
    url: "https://nuwasafety.substack.com/p/science-of-frontier-ai-risk-evaluation",
    source: "Nuwa Substack",
    summary:
      "Nuwa's first public research essay on making frontier AI risk evaluation more scientific, evidence-based, and operational.",
    featured: true,
  },
  {
    title: "Nuwa Frontier AI Safety Lab Launch",
    date: "2025-11-01",
    type: "Company",
    summary:
      "Nuwa Frontier AI Safety Lab is launched as the research lab supported by Whitzard.",
    featured: true,
  },
  {
    title: "WhitzardAgent Open Ecosystem",
    date: "2025-12-01",
    type: "Ecosystem",
    url: "https://github.com/WhitzardAgent",
    summary:
      "WhitzardAgent hosts open-source tools and datasets for AI safety evaluation, agent safety, and runtime protection.",
  },
];
