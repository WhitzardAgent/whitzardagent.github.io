export type LocalizedText = { en: string; zh: string };

export type ResearchRecognition = {
  year: number;
  title: LocalizedText;
  venueNote?: LocalizedText;
  sourceUrl: string;
};

export const researchRecognitions: ResearchRecognition[] = [
  {
    year: 2026,
    title: { en: "Best Paper Award · NDSS", zh: "NDSS 最佳论文奖" },
    venueNote: { en: "Top-tier cybersecurity conference", zh: "顶级网络安全会议" },
    sourceUrl: "https://www.ndss-symposium.org/ndss-program/symposium-2026/",
  },
  {
    year: 2025,
    title: { en: "Falling Walls Science Breakthroughs Shortlist", zh: "德国跨界创新科学突破提名奖" },
    venueNote: { en: "International interdisciplinary science breakthrough selection", zh: "国际跨学科科学突破评选" },
    sourceUrl: "https://falling-walls.com/science-summit/shortlist-2025",
  },
  {
    year: 2025,
    title: { en: "Distinguished Paper Award · NDSS", zh: "NDSS 最佳论文奖" },
    venueNote: { en: "Top-tier cybersecurity conference", zh: "顶级网络安全会议" },
    sourceUrl: "https://www.ndss-symposium.org/ndss2025/",
  },
  {
    year: 2024,
    title: { en: "Distinguished Paper Award · ACM SIGSOFT", zh: "ACM SIGSOFT 杰出论文奖" },
    venueNote: { en: "Top-tier software-engineering conference", zh: "顶级软件工程会议" },
    sourceUrl: "https://cs.fudan.edu.cn/7b/9f/c24256a687007/page.htm",
  },
  {
    year: 2023,
    title: { en: "WAIC Yunfan Prize", zh: "世界人工智能大会云帆奖" },
    sourceUrl: "https://ravensanstete.github.io/en/",
  },
  {
    year: 2023,
    title: { en: "Distinguished Paper Award · USENIX Security Symposium", zh: "USENIX Security Symposium 杰出论文奖" },
    venueNote: { en: "Top-tier cybersecurity conference", zh: "顶级网络安全会议" },
    sourceUrl: "https://www.usenix.org/conference/usenixsecurity23/technical-sessions",
  },
];
