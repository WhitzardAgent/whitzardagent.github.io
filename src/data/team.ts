export interface TeamMember {
  name: string;
  role: string;
  affiliation: "whitzard" | "nuwa";
  category: "founding" | "research" | "engineering" | "advisor" | "partner";
  bio: string;
  links?: { label: string; url: string }[];
  photo?: string;
}

export const team: TeamMember[] = [
  {
    name: "Dr. Jiarun Dai",
    role: "CEO",
    affiliation: "whitzard",
    category: "founding",
    bio: "Dr. Jiarun Dai is the CEO of Whitzard and an Assistant Professor at Fudan University. He is a cybersecurity expert and former captain of the Fudan Baize CTF team, with deep experience in binary analysis, vulnerability discovery, and exploitation. He received both his Ph.D. and B.Sc. from Fudan University under the supervision of Prof. Min Yang.",
    links: [
      { label: "Homepage", url: "https://djrrr.github.io/" },
      { label: "Google Scholar", url: "https://scholar.google.com/citations?user=YH1Y454AAAAJ" },
    ],
  },
  {
    name: "Dr. Xudong Pan",
    role: "CTO",
    affiliation: "whitzard",
    category: "founding",
    bio: "Dr. Xudong Pan is the CTO of Whitzard and an Assistant Professor (Xuemin Fellow) at Fudan University, as well as a PhD Advisor at the Shanghai Innovation Institute. His work focuses on AI safety, model safety, AI system security, and frontier AI risk evaluation. He received both his Ph.D. and B.Sc. from Fudan University under the supervision of Prof. Min Yang.",
    links: [
      { label: "Homepage", url: "https://ravensanstete.github.io/" },
      { label: "Google Scholar", url: "https://scholar.google.com/citations?user=Unl69CYAAAAJ" },
      { label: "GitHub", url: "https://github.com/ravenSanstete" },
    ],
  },
  {
    name: "Dr. Geng Hong",
    role: "Strategic Bridge / Research Partner",
    affiliation: "whitzard",
    category: "partner",
    bio: "Dr. Geng Hong is an Assistant Professor at Fudan University and a strategic bridge and research partner for Whitzard and Nuwa. His work spans cybercrime, penetration testing, cybersecurity ecosystem research, and in-the-wild security studies, bringing practical security insight into AI safety evaluation and governance.",
    links: [
      { label: "Homepage", url: "https://ghong.site/" },
    ],
  },
];
