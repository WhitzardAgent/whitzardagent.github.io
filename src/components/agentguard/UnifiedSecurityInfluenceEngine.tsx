import { useState, type KeyboardEvent } from "react";
import { localize, storyPageCopy, unifiedAnalysisFacets, type FlowMode } from "../../data/agentguardStory";

type Props = { locale: "zh" | "en"; density?: "compact" | "full" };
const symbols: Record<FlowMode, string> = { data: "●", authorization: "◆", effect: "■", combined: "AG" };
const decisions = ["ALLOW", "REDACT", "RECHECK", "SANDBOX", "APPROVAL", "DENY"];

const track = (event: string) => (window as Window & { umami?: { track: (name: string) => void } }).umami?.track(event);

export default function UnifiedSecurityInfluenceEngine({ locale, density = "full" }: Props) {
  const copy = storyPageCopy[locale].engine;
  const [mode, setMode] = useState<FlowMode>("combined");
  const facet = unifiedAnalysisFacets.find((item) => item.kind === mode)!;

  const selectMode = (next: FlowMode) => {
    setMode(next);
    track("home-flow-mode");
  };
  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? unifiedAnalysisFacets.length - 1 : event.key === "ArrowRight" ? (index + 1) % unifiedAnalysisFacets.length : (index - 1 + unifiedAnalysisFacets.length) % unifiedAnalysisFacets.length;
    const next = unifiedAnalysisFacets[nextIndex].kind;
    selectMode(next);
    requestAnimationFrame(() => document.getElementById(`flow-mode-${next}`)?.focus());
  };

  return (
    <div className={`unified-engine density-${density} mode-${mode}`}>
      <div className="unified-engine__tabs" role="tablist" aria-label={copy.title}>
        {unifiedAnalysisFacets.map((item, index) => <button id={`flow-mode-${item.kind}`} type="button" role="tab" aria-selected={item.kind === mode} tabIndex={item.kind === mode ? 0 : -1} key={item.kind} onClick={() => selectMode(item.kind)} onKeyDown={(event) => move(event, index)}><b aria-hidden="true">{symbols[item.kind]}</b><span>{localize(item.label, locale)}</span></button>)}
      </div>

      <div className="unified-engine__stage" role="tabpanel" aria-live="polite">
        <div className="unified-engine__inputs">
          {unifiedAnalysisFacets.slice(0, 3).map((item) => <article key={item.kind} className={`is-${item.kind} ${mode === item.kind || mode === "combined" ? "is-active" : ""}`}>
            <header><b aria-hidden="true">{symbols[item.kind]}</b><strong>{localize(item.label, locale)}</strong></header>
            <div>{item.tracks.map((entry) => <span key={entry.zh}>{localize(entry, locale)}</span>)}</div>
            <i aria-hidden="true"><em /></i>
          </article>)}
        </div>

        <div className="unified-engine__core" aria-label={copy.core}>
          <span>AgentGuard</span>
          <strong>Unified Security<br />Influence Engine</strong>
          <div aria-hidden="true"><i /><i /><i /></div>
          <small>{locale === "zh" ? "上下文联合求值" : "Contextual joint evaluation"}</small>
        </div>

        <div className="unified-engine__decision">
          <span>{copy.result}</span>
          <div>{decisions.map((decision) => <b key={decision} className={decision === "REDACT" ? "is-current" : ""}>{decision}</b>)}</div>
        </div>
      </div>

      <div className="unified-engine__explanation">
        <article><span>{copy.tracks}</span><p>{facet.tracks.map((item) => localize(item, locale)).join(" · ")}</p></article>
        <article><span>{copy.distinction}</span><p>{localize(facet.distinction, locale)}</p></article>
        <article className="is-contribution"><span>{copy.contribution}</span><p>{localize(facet.decisionContribution, locale)}</p></article>
      </div>

      {density === "full" && <details className="unified-engine__evidence"><summary>{copy.evidence}<span aria-hidden="true">＋</span></summary><p>{copy.evidenceBody}</p><code>DIRECT · SEMANTIC · CONTEXTUAL · DECLASSIFICATION</code></details>}
    </div>
  );
}
