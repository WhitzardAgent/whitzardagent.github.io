export type LocalizedText = { en: string; zh: string };

export type AcademicAdvisor = {
  prefix: LocalizedText;
  name: LocalizedText;
  url: string;
};

export interface TeamMember {
  name: LocalizedText;
  role: LocalizedText;
  affiliation: "whitzard" | "nuwa";
  category: "founding" | "research" | "engineering" | "advisor" | "partner";
  bio: LocalizedText;
  advisor?: AcademicAdvisor;
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
      en: "Whitzard CEO and Associate Research Professor at Fudan University, researching binary analysis, vulnerability discovery, and exploitation. Former captain of the Fudan Baize CTF team.",
      zh: "白泽（Whitzard）CEO、复旦大学副研究员，研究二进制分析、漏洞挖掘与利用。曾任复旦白泽战队队长。",
    },
    advisor: {
      prefix: { en: "He received his PhD from Fudan University under the supervision of ", zh: "博士毕业于复旦大学，师从" },
      name: { en: "Prof. Min Yang", zh: "杨珉教授" },
      url: "https://min-yang-fudan.github.io/",
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
      en: "Whitzard CTO, Associate Research Professor at Fudan University, and PhD advisor at the Shanghai Innovation Institute, researching AI safety, model safety, systems security, and frontier-risk evaluation.",
      zh: "白泽（Whitzard）CTO、复旦大学副研究员、上海创智学院博士生导师，研究 AI 安全、模型安全、系统安全与前沿风险评测。",
    },
    advisor: {
      prefix: { en: "He received his PhD from Fudan University under the supervision of ", zh: "博士毕业于复旦大学，师从" },
      name: { en: "Prof. Min Yang", zh: "杨珉教授" },
      url: "https://min-yang-fudan.github.io/",
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
      en: "Assistant Research Professor at Fudan University researching cybercrime, privacy, and in-the-wild security, collaborating with Whitzard and NUWA Lab.",
      zh: "复旦大学助理研究员，研究网络犯罪、隐私与真实世界安全，为白泽（Whitzard）与女娲实验室提供研究协作。",
    },
    advisor: {
      prefix: { en: "He received his PhD from Fudan University under the supervision of ", zh: "博士毕业于复旦大学，师从" },
      name: { en: "Prof. Min Yang", zh: "杨珉教授" },
      url: "https://min-yang-fudan.github.io/",
    },
    links: [{ label: linkLabels.homepage, url: "https://ghong.site/" }],
  },
];
