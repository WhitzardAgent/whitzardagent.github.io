export interface TeamMember {
  name: string;
  role: string;
  affiliation: "whitzard" | "nuwa";
  category: "founding" | "research" | "engineering" | "advisor";
  bio: string;
  links?: { label: string; url: string }[];
  photo?: string;
}

export const team: TeamMember[] = [
  {
    name: "Jiarun Dai",
    role: "CEO",
    affiliation: "whitzard",
    category: "founding",
    bio: "Assistant Professor, School of Computer Science, Fudan University. Co-founder of the Fudan-Whitzard CTF team. Research in vulnerability detection, firmware fuzzing, web security, and LLM agent security.",
    links: [
      { label: "Homepage", url: "https://djrrr.github.io/" },
      { label: "Google Scholar", url: "https://scholar.google.com/citations?user=YH1Y454AAAAJ" },
    ],
  },
  {
    name: "Xudong Pan",
    role: "CTO",
    affiliation: "whitzard",
    category: "founding",
    bio: "Assistant Professor, School of Computer Science, Fudan University & PhD Advisor, Shanghai Innovation Institute. Research in frontier AI risk, agentic AI safety, and AI governance. Making AI progress safer for human society via technological innovation.",
    links: [
      { label: "Homepage", url: "https://ravensanstete.github.io/" },
      { label: "Google Scholar", url: "https://scholar.google.com/citations?user=Unl69CYAAAAJ" },
      { label: "GitHub", url: "https://github.com/ravenSanstete" },
    ],
  },
];
