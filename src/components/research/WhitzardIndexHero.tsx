import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Locale } from "../../i18n/config";
import type { WhitzardIndexCopy } from "../../i18n/pages/whitzardIndex";
import type { IndexEvidenceRecord } from "../../data/whitzardIndex";

type Props = {
  locale: Locale;
  copy: WhitzardIndexCopy;
  evidence: IndexEvidenceRecord[];
};

const localize = <T extends { zh: string; en: string }>(value: T, locale: Locale) => value[locale];

export default function WhitzardIndexHero({ locale, copy, evidence }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const active = evidence[activeIndex];

  const select = (index: number) => {
    setActiveIndex(index);
    requestAnimationFrame(() => tabsRef.current[index]?.focus());
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const previous = event.key === "ArrowLeft" || event.key === "ArrowUp";
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? evidence.length - 1
        : previous
          ? (index - 1 + evidence.length) % evidence.length
          : (index + 1) % evidence.length;
    select(next);
  };

  return (
    <section className="wi-hero">
      <div className="site-container wi-hero__grid">
        <div className="wi-hero__copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="wi-hero__subtitle">{copy.subtitle}</p>
          <p className="wi-hero__lead">{copy.lead}</p>
          <div className="wi-hero__actions">
            <a className="button button--primary" href="#published-evidence">{copy.primaryCta}</a>
            <a className="button button--secondary" href="#methodology">{copy.secondaryCta}</a>
          </div>
          <dl className="wi-hero__principles" aria-label={locale === "zh" ? "记录原则" : "Record principles"}>
            <div><dt>01</dt><dd>{locale === "zh" ? "保留维度" : "Preserve dimensions"}</dd></div>
            <div><dt>02</dt><dd>{locale === "zh" ? "限定结论" : "Bound conclusions"}</dd></div>
            <div><dt>03</dt><dd>{locale === "zh" ? "引用原始证据" : "Cite original evidence"}</dd></div>
          </dl>
        </div>

        <div id="published-evidence" className="wi-observatory">
          <header className="wi-observatory__header">
            <div><i aria-hidden="true" /><span>{locale === "zh" ? "前沿风险观测仪表" : "FRONTIER RISK OBSERVATORY"}</span></div>
            <small>{locale === "zh" ? "已发表证据 · 非综合排名" : "PUBLISHED EVIDENCE · NOT A COMPOSITE RANKING"}</small>
          </header>

          <div className="wi-observatory__tabs" role="tablist" aria-label={copy.evidence.tabsLabel}>
            {evidence.map((record, index) => (
              <button
                key={record.id}
                ref={(node) => { tabsRef.current[index] = node; }}
                id={`wi-tab-${record.id}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls={`wi-panel-${record.id}`}
                tabIndex={activeIndex === index ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <span>0{index + 1}</span>
                <strong>{record.title}</strong>
                <small>{localize(record.riskDimension, locale)}</small>
              </button>
            ))}
          </div>

          <article
            key={active.id}
            id={`wi-panel-${active.id}`}
            className={`wi-evidence-panel is-${active.visualType}`}
            role="tabpanel"
            aria-labelledby={`wi-tab-${active.id}`}
          >
            <div className="wi-evidence-panel__meta">
              <div><span>{copy.evidence.scopeLabel}</span><ul>{active.evaluationScope.map((item) => <li key={item.en}>{localize(item, locale)}</li>)}</ul></div>
              <div className="wi-evidence-panel__dates">
                <span>{copy.evidence.publishedLabel} <time dateTime={active.publicationDate}>{active.publicationDate}</time></span>
                <span>{copy.evidence.verifiedLabel} <time dateTime={active.lastVerified}>{active.lastVerified}</time></span>
              </div>
            </div>

            <div className="wi-chart" aria-label={`${active.title}: ${active.metrics.map((metric) => `${localize(metric.label, locale)} ${metric.comparator === "greater-than" ? ">" : ""}${metric.value}%`).join(", ")}`}>
              <div className="wi-chart__scale" aria-hidden="true"><span>0</span><span>25</span><span>50</span><span>75</span><span>100%</span></div>
              {active.metrics.map((metric, index) => (
                <div className="wi-chart__row" key={`${metric.subject.en}-${metric.label.en}`}>
                  <div className="wi-chart__label"><strong>{localize(metric.subject, locale)}</strong><span>{localize(metric.label, locale)}</span></div>
                  <div className="wi-chart__track">
                    {active.visualType === "threshold-bands" && <i className="wi-chart__threshold" style={{ "--threshold": `${metric.value}%` } as CSSProperties} aria-hidden="true" />}
                    <b style={{ "--metric": `${metric.value}%`, "--delay": `${index * 110}ms` } as CSSProperties} aria-hidden="true" />
                  </div>
                  <div className="wi-chart__value"><strong>{metric.comparator === "greater-than" ? ">" : ""}{metric.value.toFixed(metric.value % 1 === 0 ? 0 : 2)}%</strong><small>{localize(metric.qualifier, locale)}</small></div>
                </div>
              ))}
            </div>

            <footer className="wi-evidence-panel__footer">
              <div><span>{copy.evidence.findingLabel}</span><p>{localize(active.conclusion, locale)}</p></div>
              <div><span>{copy.evidence.limitationLabel}</span><p>{localize(active.limitation, locale)}</p></div>
              <a href={active.sourceUrl} target="_blank" rel="noreferrer">{copy.evidence.sourceLabel}: {active.sourceLabel} <span aria-hidden="true">↗</span></a>
            </footer>
          </article>

          <noscript>
            <div className="wi-evidence-noscript">
              {evidence.map((record) => <article key={record.id}>
                <h2>{record.title} · {localize(record.riskDimension, locale)}</h2>
                <p>{record.evaluationScope.map((item) => localize(item, locale)).join(" · ")}</p>
                <p>{record.metrics.map((metric) => `${localize(metric.subject, locale)}: ${localize(metric.label, locale)} ${metric.comparator === "greater-than" ? ">" : ""}${metric.value}%`).join("; ")}</p>
                <p>{localize(record.limitation, locale)}</p>
                <a href={record.sourceUrl}>{copy.evidence.sourceLabel}: {record.sourceLabel}</a>
              </article>)}
            </div>
          </noscript>
        </div>
      </div>
    </section>
  );
}
