import { useEffect, useMemo, useState } from "react";
import type { ResearchAsset } from "../../data/generated/researchAssets";
import type { ResearchVisual } from "../../data/researchVisuals";
import type { ResearchCopy } from "../../i18n/pages/research";
import type { Locale } from "../../i18n/config";
import { buildResearchTags, emptyResearchFilters, matchesResearch, matchesResearchBlog, researchKind, readResearchFilters, tagsForResearch, writeResearchFilterParams, type ResearchFilterState, type ResearchTag, type ResearchBlogCard, type ResearchKind } from "../../lib/researchFilters";

type Props = {
  assets: ResearchAsset[];
  visuals: ResearchVisual[];
  blogs: ResearchBlogCard[];
  locale: Locale;
  copy: Pick<ResearchCopy["research"], "filters" | "linkLabels" | "source" | "kinds">;
  themes: Array<{ key: string; title: string }>;
  members: Array<{ key: string; title: string }>;
};

export default function ResearchExplorer({ assets, visuals, blogs, locale, copy, themes, members }: Props) {
  const [filters, setFilters] = useState<ResearchFilterState>(emptyResearchFilters);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const sync = () => setFilters(readResearchFilters(window.location.search));
    sync();
    setHydrated(true);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const scopedAssets = useMemo(() => assets.filter(asset => !filters.kind || researchKind(asset) === filters.kind), [assets, filters.kind]);
  const scopedBlogs = useMemo(() => blogs.filter(() => !filters.kind || filters.kind === "blogs"), [blogs, filters.kind]);
  const tags = useMemo(() => buildResearchTags(scopedAssets, scopedBlogs), [scopedAssets, scopedBlogs]);
  const images = useMemo(() => new Map(visuals.map(visual => [visual.researchSlug, visual])), [visuals]);
  const years = useMemo(() => [...new Set([...scopedAssets.map(item => item.year), ...scopedBlogs.map(item => item.year)])].sort((a, b) => b - a), [scopedAssets, scopedBlogs]);
  const filtered = useMemo(() => assets.filter(item => matchesResearch(item, filters, locale)), [assets, filters, locale]);
  const groups = useMemo(() => years.map(year => [year, filtered.filter(item => item.year === year)] as const).filter(([, items]) => items.length), [years, filtered]);
  const filteredBlogs = useMemo(() => blogs.filter(blog => matchesResearchBlog(blog, filters, locale, assets.find(asset => asset.slug === blog.researchSlug))), [blogs, assets, filters, locale]);
  const resultCount = filtered.length + filteredBlogs.length;
  const hasFilters = Boolean(filters.q || filters.topic || filters.year || filters.member || filters.tags.length);
  const commit = (next: ResearchFilterState, replace = false) => {
    setFilters(next);
    const query = writeResearchFilterParams(window.location.search, next);
    // Preserve Astro's route index and scroll state for Back/Forward navigation.
    window.history[replace ? "replaceState" : "pushState"]({ ...window.history.state, scrollX: window.scrollX, scrollY: window.scrollY }, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  };
  const toggleTag = (id: string) => commit({ ...filters, tags: filters.tags.includes(id) ? filters.tags.filter(tag => tag !== id) : [...filters.tags, id] });
  const accessibleTagLabel = (prefix: string, label: string) => `${prefix}${locale === "zh" ? "：" : ": "}${label}`;
  const badge = (tag: ResearchTag, counted = false) => <button key={tag.id} type="button" className="research-tag" disabled={!hydrated} aria-pressed={filters.tags.includes(tag.id)} aria-label={accessibleTagLabel(copy.filters.filterByTag, tag[locale])} onClick={() => toggleTag(tag.id)}>{tag[locale]}{counted && <span aria-hidden="true">{tag.count}</span>}</button>;
  const kinds: Array<{ id: ResearchKind; label: string }> = [{ id: "", label: copy.kinds.all }, { id: "publication", label: "Publication" }, { id: "technical-report", label: "Technical Report" }, { id: "blogs", label: "Blogs" }];

  return <div className="research-explorer">
    <div className="research-kind-filter" role="group" aria-label={copy.kinds.label}>{kinds.map(kind => <button type="button" key={kind.id} disabled={!hydrated} aria-pressed={(filters.kind ?? "") === kind.id} onClick={() => commit({ ...emptyResearchFilters, kind: kind.id })}>{kind.label}</button>)}</div>
    <form className="research-filters" role="search" onSubmit={event => event.preventDefault()}>
      <label className="research-filters__search"><span>{copy.filters.searchLabel}</span><input type="search" value={filters.q} placeholder={copy.filters.searchPlaceholder} onChange={event => commit({ ...filters, q: event.target.value }, true)} /></label>
      <label><span>{copy.filters.topicLabel}</span><select value={filters.topic} onChange={event => commit({ ...filters, topic: event.target.value })}><option value="">{copy.filters.allTopics}</option>{themes.map(theme => <option key={theme.key} value={theme.key}>{theme.title}</option>)}</select></label>
      <label><span>{copy.filters.yearLabel}</span><select value={filters.year} onChange={event => commit({ ...filters, year: event.target.value })}><option value="">{copy.filters.allYears}</option>{years.map(year => <option key={year} value={year}>{year}</option>)}</select></label>
      <label><span>{copy.filters.memberLabel}</span><select value={filters.member} onChange={event => commit({ ...filters, member: event.target.value })}><option value="">{copy.filters.allMembers}</option>{members.map(member => <option key={member.key} value={member.key}>{member.title}</option>)}</select></label>
      <button type="button" onClick={() => commit({ ...emptyResearchFilters, kind: filters.kind })} disabled={!hasFilters}>{copy.filters.reset}</button>
    </form>
    <fieldset className="research-tags"><legend>{copy.filters.tagLabel}</legend>
      <div>{tags.slice(0, 8).map(tag => badge(tag, true))}</div>
      <details><summary>{copy.filters.allTags} <span aria-hidden="true">＋</span></summary><div>{tags.map(tag => badge(tag, true))}</div></details>
      <p>{copy.filters.tagHint}</p>
    </fieldset>
    {filters.tags.length > 0 && <div className="research-selected-tags" aria-label={copy.filters.tagLabel}>{filters.tags.map(id => <button type="button" className="research-tag is-selected" key={id} aria-label={accessibleTagLabel(copy.filters.removeTag, tags.find(tag => tag.id === id)?.[locale] ?? id)} onClick={() => toggleTag(id)}>{tags.find(tag => tag.id === id)?.[locale] ?? id} <span aria-hidden="true">×</span></button>)}</div>}
    <p className="research-count" role="status">{resultCount} {copy.filters.results}</p>
    {resultCount === 0 ? <p className="research-empty">{copy.filters.noResults}</p> : groups.map(([year, items]) => <section className="research-year-group" key={year} aria-labelledby={`research-year-${year}`}>
      <h3 id={`research-year-${year}`}>{year}<span>{items.length} {copy.filters.results}</span></h3>
      <div className="research-card-grid">{items.map(item => {
        const visual = images.get(item.slug);
        const thumbnail = visual?.thumbnailPath ?? visual?.assetPath.replace(".png", "-640.webp");
        const visualSources = visual && (visual.width ?? 1280) > 640
          ? `${thumbnail} 640w, ${visual.assetPath.replace(".png", ".webp")} ${visual.width ?? 1280}w`
          : undefined;
        const paper = item.links.find(link => link.kind === "paper") ?? item.links[0];
        return <article className={`research-card${visual ? " has-visual" : ""}`} data-research-kind={researchKind(item)} id={item.slug} key={item.slug}>
          {visual ? <a className="research-card__teaser" href={visual.sourcePdfUrl} target="_blank" rel="noreferrer" aria-label={`${item.title} · ${copy.filters.figureSource}`}><img src={thumbnail} srcSet={visualSources} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 980px) calc((100vw - 72px) / 2), 640px" width={visual.width ?? 1280} height={visual.height ?? 720} alt={visual.alt[locale]} loading="lazy" decoding="async" /></a> : <div className="research-card__teaser research-card__teaser--brand"><img src="/assets/research/nuwa-brand-cover-640.webp" srcSet="/assets/research/nuwa-brand-cover-640.webp 640w, /assets/research/nuwa-brand-cover.webp 1536w" sizes="(max-width: 700px) calc(100vw - 40px), 640px" width="1536" height="512" alt={locale === "zh" ? "女娲前沿 AI 安全实验室品牌封面（非论文主图）" : "NUWA Frontier AI Safety Lab brand cover (not a paper figure)"} loading="lazy" decoding="async" /></div>}
          <div className="research-card__body">
            <div className="research-card__meta"><span>{item.year}</span><span>{item.venue}</span><span>{copy.filters.typeLabels[item.publicationType]}</span></div>
            <h4><a href={paper.url} target="_blank" rel="noreferrer">{item.title}</a></h4>
            <p className="research-card__summary">{item.summary[locale]}</p>
            <p className="research-card__authors">{item.authors.join(" · ")}</p>
            <div className="research-card__tags" aria-label={copy.filters.tagLabel}>{tagsForResearch(item).map(tag => badge(tag))}</div>
            <div className="research-card__links">{item.links.map(link => <a key={`${link.kind}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">{copy.linkLabels[link.kind]} <span aria-hidden="true">↗</span></a>)}<a href={item.sourceUrls[0]} target="_blank" rel="noreferrer">{copy.source} <span aria-hidden="true">↗</span></a></div>
            {visual && <small className="research-card__credit"><a href={visual.sourcePdfUrl} target="_blank" rel="noreferrer">{visual.figureLabel} · PDF p.{visual.page}</a></small>}
          </div>
        </article>;
      })}</div>
    </section>)}
    {filteredBlogs.length > 0 && <section id="research-blog" className="research-year-group" aria-labelledby="research-blogs-title"><h3 id="research-blogs-title">Blogs<span>{filteredBlogs.length} {copy.filters.results}</span></h3><div className="research-card-grid">{filteredBlogs.map(blog => <article className="research-card research-card--blog" data-research-kind="blogs" key={blog.id}>
      <div className="research-card__teaser research-card__teaser--brand"><img src="/assets/research/nuwa-brand-cover-640.webp" srcSet="/assets/research/nuwa-brand-cover-640.webp 640w, /assets/research/nuwa-brand-cover.webp 1536w" sizes="(max-width: 700px) calc(100vw - 40px), 640px" width="1536" height="512" alt={copy.kinds.brandCover} loading="lazy" decoding="async" /></div>
      <div className="research-card__body"><div className="research-card__meta">{blog.date ? <time dateTime={blog.date}>{blog.date}</time> : <span>{blog.year}</span>}<span>{blog.source}</span><span>Blog</span></div><h4><a href={blog.url} target={blog.external ? "_blank" : undefined} rel={blog.external ? "noreferrer" : undefined}>{blog.title}</a></h4><p className="research-card__summary">{blog.summary}</p>{blog.authors.length > 0 && <p className="research-card__authors">{blog.authors.join(" · ")}</p>}<div className="research-card__tags" aria-label={copy.filters.tagLabel}>{blog.tags.map(tag => badge(tag))}</div><div className="research-card__links"><a href={blog.url} target={blog.external ? "_blank" : undefined} rel={blog.external ? "noreferrer" : undefined}>{copy.kinds.readBlog} <span aria-hidden="true">{blog.external ? "↗" : "→"}</span></a></div></div>
    </article>)}</div></section>}
  </div>;
}
