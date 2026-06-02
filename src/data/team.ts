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
  // Founding Team
  {
    name: "Team Member",
    role: "Founder",
    affiliation: "whitzard",
    category: "founding",
    bio: "Team profile coming soon.",
  },
  {
    name: "Team Member",
    role: "Co-Founder",
    affiliation: "nuwa",
    category: "founding",
    bio: "Team profile coming soon.",
  },
  // Research
  {
    name: "Researcher",
    role: "Research Lead",
    affiliation: "nuwa",
    category: "research",
    bio: "Team profile coming soon.",
  },
  {
    name: "Researcher",
    role: "AI Safety Researcher",
    affiliation: "nuwa",
    category: "research",
    bio: "Team profile coming soon.",
  },
  // Engineering
  {
    name: "Engineer",
    role: "Engineering Lead",
    affiliation: "whitzard",
    category: "engineering",
    bio: "Team profile coming soon.",
  },
  // Advisors
  {
    name: "Advisor",
    role: "Scientific Advisor",
    affiliation: "nuwa",
    category: "advisor",
    bio: "Team profile coming soon.",
  },
];
