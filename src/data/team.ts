export type LocalizedText = { en: string; zh: string };

export interface TeamMember {
  name: LocalizedText;
  role: LocalizedText;
  affiliation: "whitzard" | "nuwa";
  category: "founding" | "research" | "engineering" | "advisor" | "partner";
  bio: LocalizedText;
  links?: { label: LocalizedText; url: string }[];
  photo?: string;
}

const linkLabels = {
  homepage: { en: "Homepage", zh: "个人主页" },
  scholar: { en: "Google Scholar", zh: "学术主页" },
  github: { en: "GitHub", zh: "GitHub" },
};

export const team: TeamMember[] = [
  {
    name: { en: "Dr. Jiarun Dai", zh: "戴嘉润" },
    role: { en: "CEO", zh: "CEO" },
    affiliation: "whitzard",
    category: "founding",
    bio: {
      en: "CEO of Whitzard and Associate Research Professor at Fudan University. His research focuses on binary analysis, vulnerability discovery, and exploitation. He holds a PhD from Fudan University and previously captained the Fudan Baize CTF team.",
      zh: "白泽（Whitzard）CEO、复旦大学副研究员，研究二进制分析、漏洞挖掘与利用。博士毕业于复旦大学，曾任复旦白泽战队队长。",
    },
    links: [
      { label: linkLabels.homepage, url: "https://djrrr.github.io/" },
      { label: linkLabels.scholar, url: "https://scholar.google.com/citations?user=YH1Y454AAAAJ" },
    ],
  },
  {
    name: { en: "Dr. Xudong Pan", zh: "潘旭东" },
    role: { en: "CTO", zh: "CTO" },
    affiliation: "whitzard",
    category: "founding",
    bio: {
      en: "CTO of Whitzard, Associate Research Professor at Fudan University, and PhD advisor at the Shanghai Innovation Institute. His research covers AI safety, model safety, systems security, and frontier-risk evaluation. He holds a PhD from Fudan University.",
      zh: "白泽（Whitzard）CTO、复旦大学副研究员、上海创智学院博士生导师，研究 AI 安全、模型安全、系统安全与前沿风险评测。博士毕业于复旦大学。",
    },
    links: [
      { label: linkLabels.homepage, url: "https://ravensanstete.github.io/" },
      { label: linkLabels.scholar, url: "https://scholar.google.com/citations?user=Unl69CYAAAAJ" },
      { label: linkLabels.github, url: "https://github.com/ravenSanstete" },
    ],
  },
];
