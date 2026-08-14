import type { Locale } from "../i18n/config";
import { localizedPath } from "../i18n/config";

export type NewsType = "Research" | "Company" | "Ecosystem" | "Event" | "Media" | "Update";
export type LocalizedText = Record<Locale, string>;

export type NewsItem = {
  title: LocalizedText;
  date: string;
  type: NewsType;
  summary?: LocalizedText;
  /** External URL - card links directly to this URL. */
  url?: string;
  /** Slug for internal detail page at /news/[slug]. Used when url is not set. */
  slug?: string;
  /** Full body content for internal detail pages. */
  body?: LocalizedText;
  source?: LocalizedText;
  sourceLanguage?: Locale;
  featured?: boolean;
};

export const newsTypeLabels: Record<Locale, Record<NewsType, string>> = {
  en: {
    Research: "Research",
    Company: "Company update",
    Ecosystem: "Open ecosystem",
    Event: "Event",
    Media: "Media",
    Update: "Update",
  },
  zh: {
    Research: "研究",
    Company: "公司动态",
    Ecosystem: "开源生态",
    Event: "活动",
    Media: "媒体",
    Update: "更新",
  },
};

export const newsItems: NewsItem[] = [
  {
    title: {
      en: "Fudan Baize ranks second globally and first among universities in AI attack-defense",
      zh: "AI攻防全球第二、高校第一！复旦白泽以“效能美学”跻身世界第一梯队",
    },
    date: "2026-08-14",
    type: "Media",
    url: "https://mp.weixin.qq.com/s/0F7mcRuwgNTNyCOtlYORaw",
    source: {
      en: "Fudan Baize WeChat official account",
      zh: "复旦白泽战队微信公众号",
    },
    sourceLanguage: "zh",
    summary: {
      en: "A Chinese report notes that Fudan Baize's Whitzard agent reached a 91.2% success rate on CyberGym, ranking second globally and first among universities.",
      zh: "报道显示，国际 AI 安全基准 CyberGym 最新榜单中，复旦白泽智能体 Whitzard 以 91.2% 成功率位列全球第二、高校第一。",
    },
  },
  {
    title: {
      en: "The Science of Frontier AI Risk Evaluation",
      zh: "前沿 AI 风险评测的科学方法",
    },
    date: "2026-01-15",
    type: "Research",
    url: "https://nuwasafety.substack.com/p/science-of-frontier-ai-risk-evaluation",
    source: {
      en: "NUWA Substack",
      zh: "NUWA Substack",
    },
    sourceLanguage: "en",
    summary: {
      en: "NUWA Lab's first public research essay on making frontier AI risk evaluation more scientific, evidence-based, and operational.",
      zh: "女娲实验室首篇公开研究文章，讨论如何让前沿 AI 风险评测更科学、可验证并可落地。",
    },
    featured: true,
  },
  {
    title: {
      en: "WhitzardAgent Open Ecosystem",
      zh: "白泽开放生态",
    },
    date: "2025-12-01",
    type: "Ecosystem",
    url: "https://github.com/WhitzardAgent",
    source: {
      en: "GitHub",
      zh: "GitHub",
    },
    sourceLanguage: "en",
    summary: {
      en: "WhitzardAgent hosts open-source tools and datasets for AI safety evaluation, agent safety, and runtime protection.",
      zh: "WhitzardAgent 承载 AI 安全评测、智能体安全与运行时保护相关的开源工具和数据。",
    },
  },
  {
    title: {
      en: "NUWA Lab Launch",
      zh: "女娲实验室发布",
    },
    date: "2025-11-01",
    type: "Company",
    slug: "nuwa-lab-launch",
    source: {
      en: "Whitzard",
      zh: "白泽（Whitzard）",
    },
    sourceLanguage: "en",
    summary: {
      en: "NUWA Lab is launched as the frontier safety research lab supported by Whitzard.",
      zh: "女娲实验室作为白泽（Whitzard）背后的前沿安全研究引擎正式发布。",
    },
    body: {
      en: "NUWA Lab is officially launched as the research lab supported by Whitzard. NUWA focuses on transparent, third-party, open infrastructure and benchmarks for frontier AI safety evaluation and governance.\n\nThe lab studies frontier AI risks including autonomy risks, deception, scheming, and loss-of-control, while developing open evaluation frameworks, benchmarks, technical notes, and governance evidence for safe and controllable AI.",
      zh: "女娲实验室作为白泽（Whitzard）支持的研究引擎正式发布。女娲实验室关注透明、第三方、开放的前沿 AI 安全评测与治理基础设施。\n\n实验室研究自主性风险、欺骗、谋划与失控等前沿 AI 风险，并建设开放评测框架、基准、技术笔记和治理证据，服务安全可控的 AI 发展。",
    },
    featured: true,
  },
];

export const sortedNewsItems = [...newsItems].sort((a, b) => b.date.localeCompare(a.date));

export function getNewsLink(item: NewsItem, locale: Locale): string | undefined {
  if (item.url) return item.url;
  if (item.slug) return localizedPath(`/news/${item.slug}`, locale);
  return undefined;
}

export function isExternalNewsLink(item: NewsItem): boolean {
  return Boolean(item.url);
}

export function getNewsSourceLabel(item: NewsItem, locale: Locale): string | undefined {
  const source = item.source?.[locale];
  if (!source) return undefined;
  if (locale === "en" && item.sourceLanguage === "zh") return `${source} · Chinese source`;
  return source;
}
