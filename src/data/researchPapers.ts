export type ResearchPaper = {
  id: string;
  title: string;
  type: "paper" | "report" | "position-paper" | "technical-note" | "framework";
  status?: string;
  venue?: string;
  year?: string;
  authors?: string;
  url: string;
  secondaryUrl?: string;
  topic: string[];
  summary: string;
  featured?: boolean;
};

export const researchPapers: ResearchPaper[] = [
  {
    id: "self-replication-frontier-ai",
    title: "Self-Replication and Frontier AI Risk Evaluation",
    type: "paper",
    status: "Research paper",
    year: "To be verified",
    url: "https://arxiv.org/pdf/2412.12140",
    secondaryUrl: "https://arxiv.org/abs/2503.17378",
    topic: ["Frontier AI Risk", "Self-Replication", "Evaluation"],
    summary: "Research related to AI self-replication and frontier AI risk evaluation. Metadata to be verified.",
    featured: true,
  },
  {
    id: "self-proliferation",
    title: "Self-Proliferation in AI Systems",
    type: "paper",
    status: "Research paper",
    year: "To be verified",
    url: "https://ghong.site/papers/self_proliferation.pdf",
    topic: ["Frontier AI Risk", "Self-Proliferation", "Autonomy"],
    summary: "Research related to self-proliferation risks in AI systems. Metadata to be verified.",
    featured: true,
  },
  {
    id: "frontier-risk-paper-2509-09207",
    title: "Frontier AI Risk Research",
    type: "paper",
    status: "Research paper",
    year: "To be verified",
    url: "https://arxiv.org/pdf/2509.09207",
    topic: ["Frontier AI Risk", "Evaluation"],
    summary: "Research paper related to frontier AI risk evaluation. Metadata to be updated.",
    featured: false,
  },
  {
    id: "frontier-risk-paper-2605-26195",
    title: "Frontier AI Safety Research",
    type: "paper",
    status: "Research paper",
    year: "To be verified",
    url: "https://arxiv.org/pdf/2605.26195",
    topic: ["Frontier AI Safety", "Evaluation"],
    summary: "Research paper related to frontier AI safety. Metadata to be updated.",
    featured: false,
  },
  {
    id: "agent-safety-paper-2505-17815",
    title: "Agent Safety Research",
    type: "paper",
    status: "Research paper",
    year: "To be verified",
    url: "https://arxiv.org/abs/2505.17815",
    topic: ["Agent Safety", "Evaluation"],
    summary: "Research paper related to agent safety or AI safety evaluation. Metadata to be updated.",
    featured: false,
  },
  {
    id: "icml26-paper-2504-13707",
    title: "ICML'26 Research Paper",
    type: "paper",
    status: "ICML'26",
    venue: "ICML'26",
    year: "2026",
    url: "https://arxiv.org/pdf/2504.13707v1",
    topic: ["AI Safety", "Evaluation"],
    summary: "ICML'26 paper related to AI safety. Metadata to be updated.",
    featured: true,
  },
  {
    id: "icml26-paper-2603-07427",
    title: "ICML'26 Research Paper",
    type: "paper",
    status: "ICML'26",
    venue: "ICML'26",
    year: "2026",
    url: "https://arxiv.org/abs/2603.07427",
    topic: ["AI Safety", "Agent Safety"],
    summary: "ICML'26 paper related to AI safety or agent safety. Metadata to be updated.",
    featured: true,
  },
  {
    id: "deceptive-ai-developers-position-paper",
    title: "Preparing for AI Systems That Deceive Developers",
    type: "position-paper",
    status: "ICML'26 position paper",
    venue: "ICML'26",
    year: "2026",
    url: "https://saif.org/research/position-preparing-for-ai-systems-that-deceive-developers/",
    topic: ["Deception", "Frontier AI Risk", "AI Control"],
    summary: "Position paper on preparing for AI systems that deceive developers.",
    featured: true,
  },
  {
    id: "science-of-frontier-ai-risk-evaluation",
    title: "The Science of Frontier AI Risk Evaluation",
    type: "technical-note",
    status: "Nuwa Substack",
    year: "2026",
    url: "https://nuwasafety.substack.com/p/science-of-frontier-ai-risk-evaluation",
    topic: ["Frontier AI Risk", "Evaluation", "Methodology"],
    summary: "Nuwa essay on making frontier AI risk evaluation more scientific, evidence-based, and operational.",
    featured: true,
  },
];
