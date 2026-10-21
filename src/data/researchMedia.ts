export type ResearchMediaRecord = {
  id: string;
  name: string;
  url: string;
  logo?: string;
  sourceUrl: string;
  platform?: string;
  verified: string;
};

/** Reporting about the self-replication research, never commercial endorsements. */
export const selfReplicationMedia: ResearchMediaRecord[] = [
  { id: "wired", name: "WIRED", url: "https://www.wired.com/story/ai-agents-could-act-like-computer-viruses-and-worms/", sourceUrl: "https://www.wired.com/story/ai-agents-could-act-like-computer-viruses-and-worms/", verified: "2026-10-21" },
  { id: "deeptech", name: "DeepTech 深科技", url: "https://www.sohu.com/a/857964130_354973", sourceUrl: "https://www.sohu.com/a/857964130_354973", platform: "搜狐号 / Sohu", verified: "2026-10-21" },
  { id: "livescience", name: "Live Science", logo: "/assets/research/media/livescience.jpeg", url: "https://www.livescience.com/technology/artificial-intelligence/ai-can-now-replicate-itself-a-milestone-that-has-experts-terrified", sourceUrl: "https://self-replica.github.io/", verified: "2026-10-21" },
  { id: "forbes", name: "Forbes", logo: "/assets/research/media/forbes.svg", url: "https://www.forbes.com/sites/mikeosullivan/2025/02/01/deepseek-marks-the-end-of-the-first-phase-of-the-ai-investment-boom/", sourceUrl: "https://self-replica.github.io/", verified: "2026-10-21" },
  { id: "independent", name: "The Independent", logo: "/assets/research/media/independent.png", url: "https://www.independent.co.uk/tech/ai-red-line-b2690075.html", sourceUrl: "https://self-replica.github.io/", verified: "2026-10-21" },
];
