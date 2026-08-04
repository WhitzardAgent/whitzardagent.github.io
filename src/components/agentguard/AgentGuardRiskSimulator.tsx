import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { agentGuardStoryScenarios, localize, storyPageCopy, type StoryScenarioId } from "../../data/agentguardStory";

type Props = { locale: "zh" | "en"; density?: "compact" | "full" };
type RunState = "idle" | "running" | "paused" | "approved" | "rejected" | "completed";
const decisionLabel: Record<string, { zh: string; en: string }> = {
  ALLOW: { zh: "放行", en: "Allow" }, REDACT: { zh: "脱敏", en: "Redact" }, RECHECK: { zh: "复检", en: "Recheck" }, SWITCH_TO_SANDBOX: { zh: "切换沙箱", en: "Sandbox" }, REQUIRE_APPROVAL: { zh: "等待审批", en: "Approval" }, DENY: { zh: "阻断", en: "Deny" },
};

const track = (event: string) => (window as Window & { umami?: { track: (name: string) => void } }).umami?.track(event);

export default function AgentGuardRiskSimulator({ locale, density = "full" }: Props) {
  const copy = storyPageCopy[locale].simulator;
  const timerRef = useRef<number | null>(null);
  const [scenarioId, setScenarioId] = useState<StoryScenarioId>("customer-egress");
  const scenario = agentGuardStoryScenarios.find((item) => item.id === scenarioId)!;
  const [cursor, setCursor] = useState(scenario.steps.length - 1);
  const [selectedId, setSelectedId] = useState(scenario.steps[scenario.steps.length - 1].id);
  const [runState, setRunState] = useState<RunState>("idle");
  const selected = scenario.steps.find((step) => step.id === selectedId) ?? scenario.steps[Math.max(0, cursor)];

  const stopTimer = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };
  useEffect(() => () => stopTimer(), []);
  useEffect(() => {
    if (runState !== "running") return;
    if (cursor >= scenario.steps.length - 1) {
      const last = scenario.steps[scenario.steps.length - 1];
      setRunState(last.intervention === "REQUIRE_APPROVAL" ? "paused" : "completed");
      return;
    }
    timerRef.current = window.setTimeout(() => {
      const next = cursor + 1;
      setCursor(next);
      setSelectedId(scenario.steps[next].id);
      if (scenario.steps[next].intervention === "REQUIRE_APPROVAL") setRunState("paused");
    }, 760);
    return stopTimer;
  }, [cursor, runState, scenario]);

  const run = () => {
    stopTimer();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCursor(scenario.steps.length - 1);
      setSelectedId(scenario.steps[scenario.steps.length - 1].id);
      setRunState(scenario.steps.at(-1)?.intervention === "REQUIRE_APPROVAL" ? "paused" : "completed");
      return;
    }
    setCursor(-1);
    setSelectedId(scenario.steps[0].id);
    setRunState("running");
  };
  const selectScenario = (id: StoryScenarioId) => {
    stopTimer();
    const next = agentGuardStoryScenarios.find((item) => item.id === id)!;
    setScenarioId(id);
    setCursor(next.steps.length - 1);
    setSelectedId(next.steps[next.steps.length - 1].id);
    setRunState("idle");
    track("home-risk-scenario");
  };
  const moveScenario = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? agentGuardStoryScenarios.length - 1 : event.key === "ArrowRight" ? (index + 1) % agentGuardStoryScenarios.length : (index - 1 + agentGuardStoryScenarios.length) % agentGuardStoryScenarios.length;
    selectScenario(agentGuardStoryScenarios[nextIndex].id);
    requestAnimationFrame(() => document.getElementById(`risk-tab-${agentGuardStoryScenarios[nextIndex].id}`)?.focus());
  };

  const runningLabel = runState === "running" ? copy.pause : runState === "idle" ? copy.run : copy.replay;
  const isApproval = selected.intervention === "REQUIRE_APPROVAL" && runState !== "approved" && runState !== "rejected";

  return (
    <div className={`risk-simulator density-${density}`} data-state={runState}>
      <header className="risk-simulator__bar">
        <div className="ag-runtime-mark"><b>AG</b><span><strong>AgentGuard</strong><small>Runtime Intervention Simulator</small></span></div>
        <em><i aria-hidden="true" />{locale === "zh" ? "确定性前端模拟" : "Deterministic simulation"}</em>
      </header>
      <div className="risk-simulator__tabs" role="tablist" aria-label={copy.title}>
        {agentGuardStoryScenarios.map((item, index) => <button id={`risk-tab-${item.id}`} type="button" role="tab" aria-selected={item.id === scenarioId} tabIndex={item.id === scenarioId ? 0 : -1} key={item.id} onClick={() => selectScenario(item.id)} onKeyDown={(event) => moveScenario(event, index)}><span>0{index + 1}</span>{localize(item.label, locale)}</button>)}
      </div>

      <div className="risk-simulator__brief" role="tabpanel">
        <div><span>{copy.request}</span><strong>{localize(scenario.request, locale)}</strong><small>{copy.path} · {localize(scenario.path, locale)}</small></div>
        <button type="button" onClick={() => runState === "running" ? setRunState("idle") : run()}>{runningLabel}<span aria-hidden="true">↗</span></button>
      </div>

      <div className="risk-simulator__workspace">
        <main className="risk-simulator__trace">
          <div className="risk-simulator__runtime"><span>AgentGuard Interaction Boundary Runtime</span><i style={{ width: `${Math.max(0, cursor + 1) / scenario.steps.length * 100}%` }} /></div>
          <ol>
            {scenario.steps.map((step, index) => <li key={step.id} className={index < cursor ? "is-complete" : index === cursor ? "is-current" : index > cursor ? "is-waiting" : ""}>
              <button type="button" aria-pressed={selected.id === step.id} onClick={() => { stopTimer(); setRunState("idle"); setCursor(index); setSelectedId(step.id); }}>
                <i aria-hidden="true" />
                <span>{step.system[locale]}</span>
                <strong>{step.label[locale]}</strong>
                <small className={`intervention-${step.intervention.toLowerCase()}`}>{decisionLabel[step.intervention][locale]}</small>
              </button>
            </li>)}
          </ol>
          <div className="risk-simulator__flows">
            {(["data", "authorization", "effect"] as const).map((kind) => <span key={kind} className={`is-${kind} ${selected.flowKinds.includes(kind) ? "is-active" : ""}`}><b aria-hidden="true">{kind === "data" ? "●" : kind === "authorization" ? "◆" : "■"}</b>{kind === "data" ? locale === "zh" ? "数据流" : "Data" : kind === "authorization" ? locale === "zh" ? "授权流" : "Authorization" : locale === "zh" ? "动作影响" : "Action effect"}</span>)}
          </div>
        </main>

        <aside className="risk-simulator__inspector" aria-live="polite">
          <header><span>{selected.system[locale]}</span><strong>{selected.label[locale]}</strong><em className={`intervention-${selected.intervention.toLowerCase()}`}>{decisionLabel[selected.intervention][locale]}</em></header>
          <div className="risk-simulator__business">
            <article className="is-risk"><span>{copy.risk}</span><p>{localize(scenario.risk, locale)}</p></article>
            <article className="is-action"><span>{copy.action}</span><p>{selected.explanation[locale]}</p></article>
            <article className="is-outcome"><span>{copy.outcome}</span><p>{scenario.result.map((item) => item[locale]).join(" · ")}</p></article>
          </div>
          {selected.before && <div className="risk-simulator__diff"><div><span>{copy.before}</span><del>{selected.before[locale]}</del></div><div><span>{copy.after}</span><ins>{selected.after?.[locale]}</ins></div></div>}
          {density === "full" && <details onToggle={(event) => { if (event.currentTarget.open) track("agentguard-technical-details"); }}><summary>{copy.evidence}<span aria-hidden="true">＋</span></summary><dl><div><dt>{locale === "zh" ? "当前状态" : "Current state"}</dt><dd>{selected.state[locale]}</dd></div><div><dt>{locale === "zh" ? "控制阶段" : "Control phase"}</dt><dd>{selected.technical[locale]}</dd></div><div><dt>{locale === "zh" ? "传播类型" : "Propagation"}</dt><dd>{selected.flowKinds.join(" · ").toUpperCase()}</dd></div></dl></details>}
          {isApproval && <div className="risk-simulator__approval"><p>{copy.waiting}</p><div><button type="button" onClick={() => setRunState("approved")}>{copy.approve}</button><button type="button" onClick={() => setRunState("rejected")}>{copy.reject}</button></div></div>}
          {runState === "approved" && <p className="risk-simulator__notice is-approved">{copy.approved}</p>}
          {runState === "rejected" && <p className="risk-simulator__notice is-rejected">{copy.rejected}</p>}
        </aside>
      </div>
    </div>
  );
}
