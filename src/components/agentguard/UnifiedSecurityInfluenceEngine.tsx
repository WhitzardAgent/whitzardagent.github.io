import { useState, type KeyboardEvent } from "react";
import { localize, storyPageCopy, unifiedAnalysisFacets, type FlowMode } from "../../data/agentguardStory";

type Props = { locale: "zh" | "en"; density?: "compact" | "full" };
const symbols: Record<FlowMode, string> = { data: "●", authorization: "◆", effect: "■", combined: "AG" };
const decisions = ["ALLOW", "REDACT", "RECHECK", "SANDBOX", "APPROVAL", "DENY"];
const compactDecisions = { zh: ["放行", "脱敏", "复检", "沙箱", "审批", "阻断"], en: decisions };

const compactFacets = [
    { kind: "effect" as FlowMode, label: { zh: "行为链", en: "Behavior chain" }, tracks: [{ zh: "工具调用", en: "Tool calls" }, { zh: "行动组合", en: "Action sequences" }, { zh: "高影响后果", en: "High-impact outcomes" }], distinction: { zh: "单次合法调用组合后仍可能越界", en: "Individually valid calls can combine into unsafe behavior" }, decisionContribution: { zh: "判断行动组合、可逆性与真实影响", en: "Evaluate action composition, reversibility, and real impact" } },
    { kind: "authorization" as FlowMode, label: { zh: "思维链", en: "Reasoning chain" }, tracks: [{ zh: "任务意图", en: "Task intent" }, { zh: "目标变化", en: "Goal changes" }, { zh: "危险推理", en: "Unsafe reasoning" }], distinction: { zh: "模型输出合理，不代表任务目标始终安全", en: "Plausible model output does not guarantee a safe objective" }, decisionContribution: { zh: "识别目标漂移与行动前的危险推理", en: "Detect goal drift and unsafe reasoning before action" } },
    { kind: "data" as FlowMode, label: { zh: "数据链", en: "Data chain" }, tracks: [{ zh: "数据来源", en: "Provenance" }, { zh: "加工血缘", en: "Derived lineage" }, { zh: "允许流向", en: "Allowed destinations" }], distinction: { zh: "模型加工不会自动消除数据属性", en: "Model transformation does not erase data properties" }, decisionContribution: { zh: "判断数据能否进入模型、Memory 或目标系统", en: "Determine whether data may enter a model, memory, or destination" } },
    { kind: "combined" as FlowMode, label: { zh: "联合判断", en: "Joint analysis" }, tracks: [{ zh: "行为后果", en: "Behavior impact" }, { zh: "任务意图", en: "Task intent" }, { zh: "数据血缘", en: "Data lineage" }], distinction: { zh: "真实风险来自三条链的交汇", en: "Real risk emerges where the three chains converge" }, decisionContribution: { zh: "输出放行、修复、复检、沙箱、审批或阻断", en: "Produce allow, repair, recheck, sandbox, approval, or denial" } },
];

const track = (event: string) => (window as Window & { umami?: { track: (name: string) => void } }).umami?.track(event);

export default function UnifiedSecurityInfluenceEngine({ locale, density = "full" }: Props) {
  const copy = storyPageCopy[locale].engine;
  const [mode, setMode] = useState<FlowMode>("combined");
  const facets = density === "compact" ? compactFacets : unifiedAnalysisFacets;
  const facet = facets.find((item) => item.kind === mode)!;

  const selectMode = (next: FlowMode) => {
    setMode(next);
    track("home-flow-mode");
  };
  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? facets.length - 1 : event.key === "ArrowRight" ? (index + 1) % facets.length : (index - 1 + facets.length) % facets.length;
    const next = facets[nextIndex].kind;
    selectMode(next);
    requestAnimationFrame(() => document.getElementById(`flow-mode-${next}`)?.focus());
  };

  return (
    <div className={`unified-engine density-${density} mode-${mode}`}>
      <div className="unified-engine__tabs" role="tablist" aria-label={copy.title}>
        {facets.map((item, index) => <button id={`flow-mode-${item.kind}`} type="button" role="tab" aria-selected={item.kind === mode} tabIndex={item.kind === mode ? 0 : -1} key={item.kind} onClick={() => selectMode(item.kind)} onKeyDown={(event) => move(event, index)}><b aria-hidden="true">{symbols[item.kind]}</b><span>{localize(item.label, locale)}</span></button>)}
      </div>

      <div className="unified-engine__stage" role="tabpanel" aria-live="polite">
        <div className="unified-engine__inputs">
          {facets.slice(0, 3).map((item) => <article key={item.kind} className={`is-${item.kind} ${mode === item.kind || mode === "combined" ? "is-active" : ""}`}>
            <header><b aria-hidden="true">{symbols[item.kind]}</b><strong>{localize(item.label, locale)}</strong></header>
            <div>{item.tracks.map((entry) => <span key={entry.zh}>{localize(entry, locale)}</span>)}</div>
            <i aria-hidden="true"><em /></i>
          </article>)}
        </div>

        <div className="unified-engine__core" aria-label={copy.core}>
          <span>AgentGuard</span>
          <strong>{density === "compact" && locale === "zh" ? <>智能分析<br />核心</> : <>Unified Security<br />Influence Engine</>}</strong>
          <div aria-hidden="true"><i /><i /><i /></div>
          <small>{locale === "zh" ? "上下文联合求值" : "Contextual joint evaluation"}</small>
        </div>

        <div className="unified-engine__decision">
          <span>{copy.result}</span>
          <div>{(density === "compact" ? compactDecisions[locale] : decisions).map((decision, index) => <b key={decision} className={index === 1 ? "is-current" : ""}>{decision}</b>)}</div>
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
