import { useEffect, useMemo, useState } from "react";
import type { ResearchAsset } from "../../data/generated/researchAssets";

type Locale = "en" | "zh";
type Copy = {
  filters: {
    searchLabel: string;
    searchPlaceholder: string;
    topicLabel: string;
    yearLabel: string;
    memberLabel: string;
    allTopics: string;
    allYears: string;
    allMembers: string;
    reset: string;
    noResults: string;
  };
  linkLabels: Record<"paper" | "pdf" | "code" | "project", string>;
  source: string;
};
type Theme = { key: string; title: string };
type Member = { key: string; title: string };

type FilterState = { q: string; topic: string; year: string; member: string };
const emptyFilters: FilterState = { q: "", topic: "", year: "", member: "" };

function readFilters(): FilterState {
  if (typeof window === "undefined") return emptyFilters;
  const params = new URLSearchParams(window.location.search);
  return { q: params.get("q") ?? "", topic: params.get("topic") ?? "", year: params.get("year") ?? "", member: params.get("member") ?? "" };
}

export default function ResearchExplorer({ assets, locale, copy, themes, members }: { assets: ResearchAsset[]; locale: Locale; copy: Copy; themes: Theme[]; members: Member[] }) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  useEffect(() => {
    setFilters(readFilters());
    const onPopState = () => setFilters(readFilters());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const years = useMemo(() => [...new Set(assets.map((item) => item.year))].sort((a, b) => b - a), [assets]);
  const typeLabel: Record<ResearchAsset["publicationType"], string> = locale === "zh"
    ? { conference: "会议论文", journal: "期刊论文", preprint: "预印本", report: "报告", position: "立场论文" }
    : { conference: "Conference", journal: "Journal", preprint: "Preprint", report: "Report", position: "Position paper" };
  const filtered = useMemo(() => {
    const query = filters.q.trim().toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en");
    return assets.filter((item) => {
      if (filters.topic && item.category !== filters.topic) return false;
      if (filters.year && item.year !== Number(filters.year)) return false;
      if (filters.member && !item.memberSlugs.includes(filters.member as ResearchAsset["memberSlugs"][number])) return false;
      if (!query) return true;
      const haystack = [item.title, ...item.authors, item.venue, ...item.topics[locale], item.summary[locale]].join(" ").toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en");
      return haystack.includes(query);
    });
  }, [assets, filters, locale]);

  const groups = useMemo(() => {
    const grouped = new Map<number, ResearchAsset[]>();
    for (const item of filtered) grouped.set(item.year, [...(grouped.get(item.year) ?? []), item]);
    return [...grouped.entries()].sort(([a], [b]) => b - a);
  }, [filtered]);
  const hasFilters = Boolean(filters.q || filters.topic || filters.year || filters.member);

  const commit = (next: FilterState, mode: "push" | "replace" = "push") => {
    setFilters(next);
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(next)) value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    window.history[mode === "push" ? "pushState" : "replaceState"]({}, "", `${url.pathname}${url.search}${url.hash}`);
  };
  const set = (key: keyof FilterState, value: string, mode: "push" | "replace" = "push") => commit({ ...filters, [key]: value }, mode);

  return (
    <div className="research-explorer">
      <form className="research-filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="research-filters__search">
          <span>{copy.filters.searchLabel}</span>
          <input type="search" value={filters.q} placeholder={copy.filters.searchPlaceholder} onChange={(event) => set("q", event.target.value, "replace")} />
        </label>
        <label>
          <span>{copy.filters.topicLabel}</span>
          <select value={filters.topic} onChange={(event) => set("topic", event.target.value)}>
            <option value="">{copy.filters.allTopics}</option>
            {themes.map((theme) => <option key={theme.key} value={theme.key}>{theme.title}</option>)}
          </select>
        </label>
        <label>
          <span>{copy.filters.yearLabel}</span>
          <select value={filters.year} onChange={(event) => set("year", event.target.value)}>
            <option value="">{copy.filters.allYears}</option>
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </label>
        <label>
          <span>{copy.filters.memberLabel}</span>
          <select value={filters.member} onChange={(event) => set("member", event.target.value)}>
            <option value="">{copy.filters.allMembers}</option>
            {members.map((member) => <option key={member.key} value={member.key}>{member.title}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => commit(emptyFilters)} disabled={!filters.q && !filters.topic && !filters.year && !filters.member}>{copy.filters.reset}</button>
      </form>

      <p className="research-count" aria-live="polite">{filtered.length} {locale === "zh" ? "项成果" : filtered.length === 1 ? "result" : "results"}</p>
      {groups.length === 0 ? <p className="research-empty">{copy.filters.noResults}</p> : groups.map(([year, items], groupIndex) => (
        <details className="research-year" key={`${year}-${hasFilters ? "filtered" : "default"}`} open={hasFilters || groupIndex === 0}>
          <summary id={`research-year-${year}`}><strong>{year}</strong><span>{items.length} {locale === "zh" ? "项成果" : items.length === 1 ? "work" : "works"}</span><i aria-hidden="true">＋</i></summary>
          <div aria-labelledby={`research-year-${year}`}>
            {items.map((item) => (
              <article className="research-entry" id={item.slug} key={item.slug}>
                <div className="research-entry__meta"><span>{item.venue}</span>{item.pages && <span>{item.pages}</span>}<span>{typeLabel[item.publicationType]}</span></div>
                <h4>{item.title}</h4>
                <p className="research-entry__authors">{item.authors.join(" · ")}</p>
                <p>{item.summary[locale]}</p>
                <div className="research-entry__footer">
                  <ul aria-label={locale === "zh" ? "研究主题" : "Research topics"}>{item.topics[locale].map((topic) => <li key={topic}>{topic}</li>)}</ul>
                  <div>{item.links.map((link) => <a key={`${link.kind}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">{copy.linkLabels[link.kind]} ↗</a>)}<a href={item.sourceUrls[0]} target="_blank" rel="noreferrer">{copy.source} ↗</a></div>
                </div>
              </article>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
