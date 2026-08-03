import { useEffect, useMemo, useRef, useState } from "react";
import type { ResearchAsset } from "../../data/generated/researchAssets";

type Locale = "en" | "zh";
type Copy = {
  filters: {
    searchLabel: string;
    searchPlaceholder: string;
    topicLabel: string;
    yearLabel: string;
    allTopics: string;
    allYears: string;
    reset: string;
    noResults: string;
  };
  linkLabels: Record<"paper" | "pdf" | "code" | "project", string>;
  source: string;
};
type Theme = { key: string; title: string };

type FilterState = { q: string; topic: string; year: string };
const emptyFilters: FilterState = { q: "", topic: "", year: "" };

function readFilters(): FilterState {
  if (typeof window === "undefined") return emptyFilters;
  const params = new URLSearchParams(window.location.search);
  return { q: params.get("q") ?? "", topic: params.get("topic") ?? "", year: params.get("year") ?? "" };
}

export default function ResearchExplorer({ assets, locale, copy, themes }: { assets: ResearchAsset[]; locale: Locale; copy: Copy; themes: Theme[] }) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const mounted = useRef(false);

  useEffect(() => {
    setFilters(readFilters());
    const onPopState = () => setFilters(readFilters());
    window.addEventListener("popstate", onPopState);
    mounted.current = true;
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!mounted.current) return;
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(filters)) value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [filters]);

  const years = useMemo(() => [...new Set(assets.map((item) => item.year))].sort((a, b) => b - a), [assets]);
  const filtered = useMemo(() => {
    const query = filters.q.trim().toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en");
    return assets.filter((item) => {
      if (filters.topic && item.category !== filters.topic) return false;
      if (filters.year && item.year !== Number(filters.year)) return false;
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

  const set = (key: keyof FilterState, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="research-explorer">
      <form className="research-filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="research-filters__search">
          <span>{copy.filters.searchLabel}</span>
          <input type="search" value={filters.q} placeholder={copy.filters.searchPlaceholder} onChange={(event) => set("q", event.target.value)} />
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
        <button type="button" onClick={() => setFilters(emptyFilters)} disabled={!filters.q && !filters.topic && !filters.year}>{copy.filters.reset}</button>
      </form>

      <p className="research-count" aria-live="polite">{filtered.length} {locale === "zh" ? "项成果" : filtered.length === 1 ? "result" : "results"}</p>
      {groups.length === 0 ? <p className="research-empty">{copy.filters.noResults}</p> : groups.map(([year, items]) => (
        <section className="research-year" key={year} aria-labelledby={`research-year-${year}`}>
          <h3 id={`research-year-${year}`}>{year}</h3>
          <div>
            {items.map((item) => (
              <article className="research-entry" id={item.slug} key={item.slug}>
                <div className="research-entry__meta"><span>{item.venue}</span><span>{item.publicationType}</span></div>
                <h4>{item.title}</h4>
                <p className="research-entry__authors">{item.authors.join(" · ")}</p>
                <p>{item.summary[locale]}</p>
                <div className="research-entry__footer">
                  <ul aria-label={locale === "zh" ? "研究主题" : "Research topics"}>{item.topics[locale].map((topic) => <li key={topic}>{topic}</li>)}</ul>
                  <div>{item.links.map((link) => <a key={`${link.kind}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">{copy.linkLabels[link.kind]} ↗</a>)}<a href={item.sourceUrl} target="_blank" rel="noreferrer">{copy.source} ↗</a></div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
