import type { Locale } from "./config";

export type NavChild = { href: string; label: string };
export type NavIconName = "products" | "research" | "ecosystem" | "about";
export type NavItem = { href: string; label: string; icon: NavIconName; children?: NavChild[] };

export type UiCopy = {
  nav: NavItem[];
  console: string;
  primaryCta: string;
  menuOpen: string;
  menuClose: string;
  languageLabel: string;
  skip: string;
  footer: {
    positioning: string;
    products: string;
    nuwa: string;
    ecosystem: string;
    company: string;
    legalLine: string;
    researchLine: string;
  };
};

export const ui: Record<Locale, UiCopy> = {
  en: {
    nav: [
      {
        href: "#",
        label: "Products",
        icon: "products",
        children: [
          { href: "/agentguard", label: "AgentGuard" },
          { href: "/models", label: "Model Services" },
          { href: "/solutions", label: "Use Cases" },
        ],
      },
      {
        href: "/nuwa",
        label: "Frontier Research",
        icon: "research",
        children: [
          { href: "/nuwa", label: "NUWA" },
          { href: "/nuwa/research", label: "Research" },
          { href: "/nuwa/blog", label: "Research Blog" },
          { href: "/nuwa/whitzard-index", label: "Whitzard Index" },
        ],
      },
      { href: "/open-ecosystem", label: "Open Ecosystem", icon: "ecosystem" },
      { href: "/about", label: "About", icon: "about" },
    ],
    console: "Console",
    primaryCta: "Join the waitlist",
    menuOpen: "Open navigation",
    menuClose: "Close navigation",
    languageLabel: "Switch language",
    skip: "Skip to content",
    footer: {
      positioning: "Building security infrastructure for the agentic AI era.",
      products: "Products",
      nuwa: "Frontier Research",
      ecosystem: "Open Ecosystem",
      company: "Company",
      legalLine: "Secure autonomy, by design.",
      researchLine: "NUWA provides shared risk evidence and public goods for global AI governance.",
    },
  },
  zh: {
    nav: [
      {
        href: "#",
        label: "核心产品",
        icon: "products",
        children: [
          { href: "/agentguard", label: "AgentGuard" },
          { href: "/models", label: "模型服务" },
          { href: "/solutions", label: "应用场景" },
        ],
      },
      {
        href: "/nuwa",
        label: "前沿研究",
        icon: "research",
        children: [
          { href: "/nuwa", label: "女娲实验室" },
          { href: "/nuwa/research", label: "研究成果" },
          { href: "/nuwa/blog", label: "Research Blog" },
          { href: "/nuwa/whitzard-index", label: "白泽指数" },
        ],
      },
      { href: "/open-ecosystem", label: "开放生态", icon: "ecosystem" },
      { href: "/about", label: "关于我们", icon: "about" },
    ],
    console: "登录控制台",
    primaryCta: "加入心愿单",
    menuOpen: "打开导航",
    menuClose: "关闭导航",
    languageLabel: "切换语言",
    skip: "跳至正文",
    footer: {
      positioning: "打造智能体时代的安全基础设施。",
      products: "产品",
      nuwa: "前沿研究",
      ecosystem: "开放生态",
      company: "公司",
      legalLine: "守其边界，行其智能。",
      researchLine: "女娲实验室为全球 AI 治理提供风险证据与公共产品。",
    },
  },
};
