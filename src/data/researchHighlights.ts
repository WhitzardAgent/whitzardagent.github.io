import type { Locale } from "../i18n/config";

type Text = Record<Locale, string>;
export type HighlightImage = { src: string; thumbnail: string; width: number; height: number; alt: Text; caption: Text };
export type ResearchHighlight = {
  id: string;
  articlePair: string;
  order: number;
  placements: Array<"home" | "nuwa" | "research" | "news">;
  image: HighlightImage;
  impact: Text;
  organizationLabel: Text;
  projectUrl: string;
  sourceUrl: string;
  sourceLabel: Text;
  snapshot: string;
  organizations: Array<{ id: string; name: string }>;
  compactOrganizations: string[];
  media?: boolean;
};

/** Editorial snapshot from the supplied AgentCyberRange-v1.docx.
 * Impact count updated by the owner on 2026-10-21 to 100+ global research institutions.
 * This newer owner-confirmed count supersedes the document's 50+ logo-wall caption.
 * These are access requests, not a claim of deployment or partnership.
 */
export const researchHighlights: ResearchHighlight[] = [{
  id: "agentcyberrange",
  articlePair: "agentcyberrange-long-horizon",
  order: 1,
  placements: ["home", "nuwa", "research", "news"],
  image: {
    src: "/assets/research/agentcyberrange/attack-flow.webp",
    thumbnail: "/assets/research/agentcyberrange/attack-flow-1280.webp",
    width: 2510, height: 532,
    alt: { zh: "攻击链示例：Confluence 初始利用、凭证发现、GitLab 代码审计与后续漏洞利用", en: "Example attack chain: initial Confluence exploitation, credential discovery, GitLab code auditing, and subsequent exploitation" },
    caption: { zh: "长程任务示例：前一步获得的权限与信息，会改变后续攻击路径。", en: "A long-horizon task: access and information gained in one step shape the next." },
  },
  impact: { zh: "100+ 家全球研究机构申请使用", en: "Access requests from 100+ research institutions worldwide" },
  organizationLabel: { zh: "部分申请使用机构", en: "Selected institutions requesting access" },
  projectUrl: "https://agentcyberrange.io/",
  sourceUrl: "https://mp.weixin.qq.com/s/giumeYfpF0tmQ6CKK5KiCg",
  sourceLabel: { zh: "原始报道", en: "Original report · Chinese" },
  snapshot: "2026-10-21",
  organizations: [
    { id: "alibaba", name: "Alibaba" }, { id: "amazon", name: "Amazon" },
    { id: "bytedance", name: "ByteDance" }, { id: "cisco", name: "Cisco" },
    { id: "columbia", name: "Columbia University" }, { id: "crowdstrike", name: "CrowdStrike" },
    { id: "georgia-tech", name: "Georgia Institute of Technology" }, { id: "deepmind", name: "DeepMind" },
    { id: "johns-hopkins", name: "Johns Hopkins University" }, { id: "jpmorgan", name: "JPMorganChase" },
    { id: "mit", name: "Massachusetts Institute of Technology" }, { id: "microsoft", name: "Microsoft" },
    { id: "moonshot", name: "Moonshot AI" }, { id: "nus", name: "National University of Singapore" },
    { id: "nvidia", name: "NVIDIA" }, { id: "openai", name: "OpenAI" },
    { id: "optiver", name: "Optiver" }, { id: "purdue", name: "Purdue University" },
    { id: "qwen", name: "Qwen" }, { id: "stepfun", name: "StepFun" },
    { id: "tencent", name: "Tencent" }, { id: "oxford", name: "University of Oxford" }, { id: "wiz", name: "Wiz" },
  ],
  compactOrganizations: ["openai", "deepmind", "qwen", "moonshot", "microsoft", "oxford"],
}, {
  id: "self-replication", articlePair: "self-replication-research", order: 2,
  placements: ["home", "nuwa", "research"],
  image: {
    src: "/assets/research/self-replication-figure-1.webp", thumbnail: "/assets/research/self-replication-figure-1-640.webp", width: 1030, height: 1120,
    alt: { zh: "论文原图：自我复制、环境适应与抗关闭测试场景", en: "Original paper figure: self-replication, adaptation, and shutdown-resistance tests" },
    caption: { zh: "受控实验中的自我复制研究；结论需结合任务设置与执行条件理解。", en: "Self-replication in controlled experiments; findings depend on task settings and execution conditions." },
  },
  impact: { zh: "媒体报道", en: "Media coverage" },
  organizationLabel: { zh: "", en: "" }, organizations: [], compactOrganizations: [], media: true,
  projectUrl: "https://self-replica.github.io/", sourceUrl: "https://self-replica.github.io/",
  sourceLabel: { zh: "研究项目站", en: "Research project" }, snapshot: "2026-10-21",
}];
