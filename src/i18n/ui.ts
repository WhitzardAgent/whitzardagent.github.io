import type { Locale } from "./config";

export type UiCopy = {
  nav: Array<{ href: string; label: string }>;
  demo: string;
  menuOpen: string;
  menuClose: string;
  languageLabel: string;
  skip: string;
  footer: {
    positioning: string;
    platform: string;
    company: string;
    resources: string;
    legalLine: string;
    researchLine: string;
  };
};

export const ui: Record<Locale, UiCopy> = {
  en: {
    nav: [
      { href: "/agentguard", label: "Platform" },
      { href: "/solutions", label: "Use Cases" },
      { href: "/research", label: "NUWA Lab" },
      { href: "/open-ecosystem", label: "Open Source" },
      { href: "/about", label: "About Us" },
    ],
    demo: "Book a Demo",
    menuOpen: "Open navigation",
    menuClose: "Close navigation",
    languageLabel: "Switch language",
    skip: "Skip to content",
    footer: {
      positioning: "AI agent security infrastructure for secure autonomy.",
      platform: "Platform",
      company: "About Us",
      resources: "Research & open source",
      legalLine: "Secure autonomy, by design.",
      researchLine: "NUWA Lab is the frontier safety research engine behind Whitzard.",
    },
  },
  zh: {
    nav: [
      { href: "/agentguard", label: "AgentGuard" },
      { href: "/solutions", label: "应用场景" },
      { href: "/research", label: "女娲实验室" },
      { href: "/open-ecosystem", label: "开源生态" },
      { href: "/about", label: "关于我们" },
    ],
    demo: "预约演示",
    menuOpen: "打开导航",
    menuClose: "关闭导航",
    languageLabel: "切换语言",
    skip: "跳至正文",
    footer: {
      positioning: "面向企业智能体的安全基础设施，让自主性在可信边界内释放。",
      platform: "产品",
      company: "公司",
      resources: "研究与开源",
      legalLine: "守其边界，行其智能。",
      researchLine: "女娲实验室是白泽（Whitzard）背后的前沿安全研究引擎。",
    },
  },
};
