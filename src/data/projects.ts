export interface Project {
  name: string;
  category: string;
  description: string;
  status: "Flagship" | "Core" | "Supporting";
  github?: string;
  capability: string;
}

export const projects: Project[] = [
  {
    name: "AgentGuard",
    category: "Runtime Security",
    description: "Zero-trust access control for AI agent tool calls.",
    status: "Flagship",
    github: "https://github.com/WhitzardAgent/AgentGuard",
    capability: "Runtime Safety",
  },
  {
    name: "Snowl",
    category: "Evaluation",
    description: "AI safety evaluation and benchmark infrastructure.",
    status: "Core",
    capability: "Evaluation",
  },
  {
    name: "Qise",
    category: "Runtime Defense",
    description: "Runtime safety framework for AI agents.",
    status: "Core",
    capability: "Runtime Defense",
  },
  {
    name: "QitOS",
    category: "Agent Framework",
    description: "Agent system development framework.",
    status: "Core",
    capability: "Agent Framework",
  },
  {
    name: "AI Risk Radar",
    category: "Risk Monitoring",
    description: "Frontier AI risk signal monitoring.",
    status: "Supporting",
    capability: "Risk Monitoring",
  },
];
