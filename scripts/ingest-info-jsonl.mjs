import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const infoDir = join(root, "public", "assets", "info");
const outDir = join(root, "src", "data", "generated");

mkdirSync(outDir, { recursive: true });

// --- Research assets ---
const researchFile = join(infoDir, "ai_safety_research_assets_metadata.jsonl");
const researchLines = readFileSync(researchFile, "utf-8")
  .trim()
  .split("\n")
  .filter(Boolean);

const researchCategories = new Set([
  "frontier-risk-control",
  "agent-model-safety",
  "software-system-security",
  "cybersecurity-privacy",
]);

const categoryByTitle = new Map([
  ["One Step from Silicon Life: Autonomous AI Agents Capable of Uncontrolled Self-Proliferation", "frontier-risk-control"],
  ["AutoControl Arena: Synthesizing Executable Test Environments for Frontier AI Risk Evaluation", "frontier-risk-control"],
  ["Think Twice Before You Act: Enhancing Agent Behavioral Safety with Thought Correction", "agent-model-safety"],
  ["MirrorGuard: Toward Secure Computer-Use Agents via Simulation-to-Real Reasoning Correction", "agent-model-safety"],
  ["Make Agent Defeat Agent: Automatic Detection of Taint-Style Vulnerabilities in LLM-based Agents", "software-system-security"],
]);

const featuredRankByTitle = new Map([
  ["One Step from Silicon Life: Autonomous AI Agents Capable of Uncontrolled Self-Proliferation", 1],
  ["AutoControl Arena: Synthesizing Executable Test Environments for Frontier AI Risk Evaluation", 2],
  ["Think Twice Before You Act: Enhancing Agent Behavioral Safety with Thought Correction", 3],
  ["MirrorGuard: Toward Secure Computer-Use Agents via Simulation-to-Real Reasoning Correction", 4],
  ["Make Agent Defeat Agent: Automatic Detection of Taint-Style Vulnerabilities in LLM-based Agents", 5],
]);

const inferCategory = (title, topics) => {
  if (categoryByTitle.has(title)) return categoryByTitle.get(title);
  const text = `${title} ${topics.join(" ")}`.toLowerCase();
  if (/frontier|self-replication|self-proliferation|evaluation faking|deception/.test(text)) return "frontier-risk-control";
  if (/agent system security|taint-style|penetration|cybersecurity agent|firmware|fuzz|resource management|software|cloud service/.test(text)) return "software-system-security";
  if (/cybercrime|privacy|email|advertising|search engine|serverless|remote software|criminal/.test(text)) return "cybersecurity-privacy";
  return "agent-model-safety";
};

const sourceForAuthors = (authors) => {
  if (authors.includes("Xudong Pan")) return "https://ravensanstete.github.io/en/publications/";
  if (authors.includes("Jiarun Dai")) return "https://djrrr.github.io/";
  return "https://ghong.site/";
};

const researchAssets = researchLines.map((line, idx) => {
  const raw = JSON.parse(line);

  const title = raw.Title || raw.title || raw.Name || raw.name || `Research ${idx + 1}`;
  const authors = Array.isArray(raw.Authors) ? raw.Authors.map(String) : String(raw.Authors || raw.authors || "").split(",").map((item) => item.trim()).filter(Boolean);
  const year = Number(raw.Year || raw.year);
  const venue = String(raw["Venue / Status"] || raw.venue || raw.status || "");

  const url = raw.URL || raw.url || undefined;
  const pdfUrl = raw["PDF URL"] || raw.pdf_url || raw.pdfUrl || undefined;

  const parseTopic = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return String(value)
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);
  };
  const topicEn = parseTopic(raw.Topic || raw.topic || raw.Tags || raw.tags);
  const topicZh = parseTopic(raw["Topic zh"]);

  const summaryEn =
    raw["One-line summary"] || raw.summary || raw.description || "";
  const summaryZh = raw["One-line summary zh"] || summaryEn;

  const category = raw.Category || inferCategory(title, [...topicEn, ...topicZh]);
  const publicationType = raw["Publication type"] || (/position/i.test(venue) ? "position" : /report/i.test(venue) ? "report" : /preprint/i.test(venue) && !/accepted|security|www|ccs|icml|iclr|ase/i.test(venue) ? "preprint" : "paper");
  const links = [
    ...(url ? [{ kind: "paper", url }] : []),
    ...(pdfUrl && pdfUrl !== url ? [{ kind: "pdf", url: pdfUrl }] : []),
    ...(raw["Code URL"] ? [{ kind: "code", url: raw["Code URL"] }] : []),
    ...(raw["Project URL"] ? [{ kind: "project", url: raw["Project URL"] }] : []),
  ];
  const memberSlugs = [
    ...(authors.includes("Jiarun Dai") ? ["jiarun-dai"] : []),
    ...(authors.includes("Xudong Pan") ? ["xudong-pan"] : []),
    ...(authors.includes("Geng Hong") ? ["geng-hong"] : []),
  ];
  const recognitions = raw.Recognition || raw["Recognition zh"] ? [{ en: raw.Recognition || "", zh: raw["Recognition zh"] || raw.Recognition || "" }] : [];
  const featuredRank = raw["Featured rank"] || featuredRankByTitle.get(title);
  const sourceUrl = raw["Source URL"] || sourceForAuthors(authors);
  const lastVerified = raw["Last verified"] || "2026-08-03";

  // Generate slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return {
    title,
    authors,
    year,
    venue,
    status: raw.Status || undefined,
    category,
    publicationType,
    topics: { en: topicEn, zh: topicZh },
    summary: { en: summaryEn, zh: summaryZh },
    links,
    memberSlugs,
    recognitions,
    featuredRank,
    sourceUrl,
    lastVerified,
    slug,
  };
});

const seenResearch = new Set();
for (const item of researchAssets) {
  const key = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "")}:${item.year}`;
  if (seenResearch.has(key)) throw new Error(`Duplicate research record: ${item.title}`);
  seenResearch.add(key);
  if (!item.title || item.authors.length === 0 || !Number.isInteger(item.year) || !item.venue) throw new Error(`Incomplete research record: ${item.title}`);
  if (!researchCategories.has(item.category)) throw new Error(`Invalid research category: ${item.title}`);
  if (!item.summary.en || !item.summary.zh || item.topics.en.length === 0 || item.topics.zh.length === 0) throw new Error(`Missing localized research copy: ${item.title}`);
  if (item.links.length === 0 || !item.sourceUrl || !item.lastVerified) throw new Error(`Missing source for research record: ${item.title}`);
}
const featuredRanks = researchAssets.map((item) => item.featuredRank).filter(Boolean);
if (new Set(featuredRanks).size !== featuredRanks.length) throw new Error("Featured research ranks must be unique");

// Write research assets
const researchTs = `// Auto-generated by scripts/ingest-info-jsonl.mjs
// DO NOT EDIT MANUALLY — re-run npm run ingest:info to update

export type ResearchAsset = {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  status?: string;
  category: ResearchCategory;
  publicationType: "paper" | "report" | "position" | "preprint";
  topics: LocalizedList;
  summary: LocalizedText;
  links: ResearchLink[];
  memberSlugs: MemberSlug[];
  recognitions: LocalizedText[];
  featuredRank?: number;
  sourceUrl: string;
  lastVerified: string;
  slug: string;
};

export type LocalizedText = { en: string; zh: string };
export type LocalizedList = { en: string[]; zh: string[] };
export type ResearchCategory = "frontier-risk-control" | "agent-model-safety" | "software-system-security" | "cybersecurity-privacy";
export type ResearchLink = { kind: "paper" | "pdf" | "code" | "project"; url: string };
export type MemberSlug = "jiarun-dai" | "xudong-pan" | "geng-hong";

export const researchAssets: ResearchAsset[] = ${JSON.stringify(researchAssets, null, 2)} as const;
`;

writeFileSync(join(outDir, "researchAssets.ts"), researchTs);
console.log(`Generated researchAssets.ts with ${researchAssets.length} entries`);

// --- Open-source assets ---
const osFile = join(infoDir, "whitzardagent_open_assets_metadata.jsonl");
const osLines = readFileSync(osFile, "utf-8")
  .trim()
  .split("\n")
  .filter(Boolean);

const openSourceAssets = osLines
  .map((line, idx) => {
    const raw = JSON.parse(line);

    const name = raw.Name || raw.name || `Project ${idx + 1}`;
    const status = raw.Status || raw.status || undefined;
    const descriptionEn =
      raw["One-line description"] || raw.description || "";
    const descriptionZh = raw["One-line description zh"] || descriptionEn;

    // Parse link object
    let githubUrl = undefined;
    let hfUrl = undefined;
    let websiteUrl = undefined;

    const rawLinks = raw["GitHub / HF / website link"] || raw.links;
    if (rawLinks && typeof rawLinks === "object") {
      githubUrl = rawLinks.GitHub || rawLinks.github || undefined;
      if (Array.isArray(hfUrl)) hfUrl = rawLinks.HF || rawLinks.hf || undefined;
      else hfUrl = rawLinks.HF || rawLinks.hf || undefined;
      websiteUrl = rawLinks.Website || rawLinks.website || undefined;
    } else if (typeof rawLinks === "string") {
      // Fallback: try to parse URLs from a string
      if (rawLinks.includes("github.com")) githubUrl = rawLinks;
    }

    // Also check top-level link fields
    if (!githubUrl && raw.GitHub) githubUrl = raw.GitHub;
    if (!githubUrl && raw.github) githubUrl = raw.github;
    if (!hfUrl && raw.HF) hfUrl = raw.HF;
    if (!hfUrl && raw.HuggingFace) hfUrl = raw.HuggingFace;
    if (!websiteUrl && raw.Website) websiteUrl = raw.Website;

    const visible =
      (raw["Visible or hidden"] || "").toLowerCase() === "visible" ||
      raw.visible === true;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);

    return {
      name,
      status,
      description: { en: descriptionEn, zh: descriptionZh },
      githubUrl,
      hfUrl,
      websiteUrl,
      visible,
      slug,
    };
  })
  .filter((item) => item.visible);

const osTs = `// Auto-generated by scripts/ingest-info-jsonl.mjs
// DO NOT EDIT MANUALLY — re-run npm run ingest:info to update

export type OpenSourceAsset = {
  name: string;
  status?: string;
  description: LocalizedText;
  githubUrl?: string;
  hfUrl?: string | string[];
  websiteUrl?: string;
  visible: boolean;
  slug: string;
};

export type LocalizedText = { en: string; zh: string };

export const openSourceAssets: OpenSourceAsset[] = ${JSON.stringify(openSourceAssets, null, 2)} as const;
`;

writeFileSync(join(outDir, "openSourceAssets.ts"), osTs);
console.log(
  `Generated openSourceAssets.ts with ${openSourceAssets.length} visible entries`
);
