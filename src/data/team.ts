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
      en: "Whitzard CEO and Fudan University assistant professor, researching binary analysis, vulnerability discovery, and exploitation. Former captain of Fudan Baize CTF team.",
      zh: "Whitzard CEO、复旦大学青年研究员，研究二进制分析、漏洞挖掘与利用。曾任复旦白泽战队队长。",
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
      en: "Whitzard CTO, Fudan University assistant professor, and Shanghai Innovation Institute PhD advisor, researching AI safety, system security, and frontier-risk evaluation.",
      zh: "Whitzard CTO、复旦大学青年研究员、上海创智学院博士生导师，研究 AI 安全、模型安全、系统安全与前沿风险评测。",
    },
    links: [
      { label: linkLabels.homepage, url: "https://ravensanstete.github.io/" },
      { label: linkLabels.scholar, url: "https://scholar.google.com/citations?user=Unl69CYAAAAJ" },
      { label: linkLabels.github, url: "https://github.com/ravenSanstete" },
    ],
  },
  {
    name: { en: "Dr. Geng Hong", zh: "洪赓" },
    role: { en: "Strategic & Research Partner", zh: "战略与研究合作" },
    affiliation: "whitzard",
    category: "partner",
    bio: {
      en: "Fudan University assistant professor researching cybercrime, penetration testing, security ecosystems, and in-the-wild security, collaborating with Whitzard and NUWA Lab.",
      zh: "复旦大学青年研究员，研究网络犯罪、隐私与真实世界安全，为 Whitzard 与女娲实验室提供研究协作。",
    },
    links: [{ label: linkLabels.homepage, url: "https://ghong.site/" }],
  },
];
