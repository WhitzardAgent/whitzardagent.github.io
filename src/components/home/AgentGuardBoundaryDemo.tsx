import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  resolveEnterpriseScenario,
  type BoundaryFlowCopy,
  type EnterpriseScenarioLabCopy,
  type ScenarioId,
} from "../../data/agentguardEnterpriseScenarios";

type Props = { copy: BoundaryFlowCopy; scenarioCopy: EnterpriseScenarioLabCopy };

const defaultsFor = (copy: EnterpriseScenarioLabCopy, id: ScenarioId) => {
  const scenario = copy.scenarios.find((item) => item.id === id)!;
  return Object.fromEntries(scenario.controls.map((control) => [control.id, control.defaultValue]));
};

export default function AgentGuardBoundaryDemo({ copy, scenarioCopy }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | null>(null);
  const [scenarioId, setScenarioId] = useState<ScenarioId>("renewal-analysis");
  const scenario = scenarioCopy.scenarios.find((item) => item.id === scenarioId)!;
  const flow = copy.scenarios.find((item) => item.id === scenarioId)!;
  const resolved = useMemo(() => resolveEnterpriseScenario(scenario, defaultsFor(scenarioCopy, scenarioId)), [scenario, scenarioCopy, scenarioId]);
  const finalCursor = resolved.nodes.length - 1;
  const [cursor, setCursor] = useState(finalCursor);
  const [running, setRunning] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const current = resolved.nodes[Math.min(cursor, finalCursor)];

  const stopTimer = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const play = () => {
    stopTimer();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCursor(finalCursor);
      setRunning(false);
      setHasPlayed(true);
      return;
    }
    setCursor(0);
    setRunning(true);
    setHasPlayed(true);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root || hasPlayed) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        play();
        observer.disconnect();
      }
    }, { threshold: 0.42 });
    observer.observe(root);
    return () => observer.disconnect();
  }, [hasPlayed, finalCursor]);

  useEffect(() => {
    if (!running) return;
    if (cursor >= finalCursor) {
      setRunning(false);
      return;
    }
    timerRef.current = window.setTimeout(() => setCursor((value) => Math.min(value + 1, finalCursor)), 720);
    return stopTimer;
  }, [cursor, finalCursor, running]);

  useEffect(() => stopTimer, []);

  const selectScenario = (id: ScenarioId) => {
    stopTimer();
    setScenarioId(id);
    const next = scenarioCopy.scenarios.find((item) => item.id === id)!;
    setCursor(next.nodes.length - 1);
    setRunning(false);
    setHasPlayed(true);
  };

  const moveScenario = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? scenarioCopy.scenarios.length - 1 : event.key === "ArrowRight" ? (index + 1) % scenarioCopy.scenarios.length : (index - 1 + scenarioCopy.scenarios.length) % scenarioCopy.scenarios.length;
    selectScenario(scenarioCopy.scenarios[nextIndex].id);
    requestAnimationFrame(() => document.getElementById(`boundary-tab-${scenarioCopy.scenarios[nextIndex].id}`)?.focus());
  };

  const activeTrackIndex = Math.min(cursor + 1, flow.tracks[0].states.length - 1);

  return (
    <section ref={rootRef} className="boundary-demo" aria-label={copy.ariaLabel} data-running={running ? "true" : "false"}>
      <header className="boundary-demo__brand">
        <div><b>AG</b><span><strong>AgentGuard</strong><small>Interaction Boundary Runtime</small></span></div>
        <em><i aria-hidden="true" />{copy.liveLabel}</em>
      </header>

      <div className="boundary-demo__tabs" role="tablist" aria-label={copy.ariaLabel}>
        {scenarioCopy.scenarios.map((item, index) => <button id={`boundary-tab-${item.id}`} key={item.id} type="button" role="tab" aria-selected={item.id === scenarioId} tabIndex={item.id === scenarioId ? 0 : -1} onClick={() => selectScenario(item.id)} onKeyDown={(event) => moveScenario(event, index)}><span>0{index + 1}</span>{item.label}</button>)}
      </div>

      <div className="boundary-demo__body" role="tabpanel" aria-live="polite">
        <div className="boundary-demo__goal"><span>{scenarioCopy.requestLabel}</span><p>{flow.goal}</p></div>

        <div className="boundary-demo__trace" style={{ "--node-count": resolved.nodes.length } as CSSProperties}>
          <div className="boundary-demo__runtime"><span>{copy.runtimeLabel}</span><i style={{ "--progress": `${(cursor / finalCursor) * 100}%` } as CSSProperties} /></div>
          <ol>
            {resolved.nodes.map((node, index) => <li key={node.id} className={index < cursor ? "is-complete" : index === cursor ? "is-active" : "is-waiting"}><button type="button" onClick={() => { stopTimer(); setRunning(false); setCursor(index); }} aria-label={`${node.stage}: ${node.tool}`}><i aria-hidden="true" /><span>{node.stage}</span><small>{node.tool}</small></button></li>)}
          </ol>
        </div>

        <div className="boundary-demo__tracks" aria-label={copy.trackingLabel}>
          <div className="boundary-demo__tracks-head"><span>{copy.trackingLabel}</span><strong>{flow.tracking}</strong></div>
          {flow.tracks.map((track) => <div className={`boundary-track boundary-track--${track.kind}`} key={track.kind}><span className={`boundary-track__shape is-${track.shape}`} aria-hidden="true" /><div><strong>{track.label}</strong><small>{track.description}</small></div><div className="boundary-track__rail"><i style={{ "--progress": `${(activeTrackIndex / (track.states.length - 1)) * 100}%` } as CSSProperties} /><b style={{ left: `${(activeTrackIndex / (track.states.length - 1)) * 100}%` }} aria-hidden="true" /></div><em>{track.states[activeTrackIndex]}</em></div>)}
        </div>

        <div className="boundary-demo__gate">
          <div><span>{copy.gateLabel}</span><strong>{current?.boundary}</strong><small>{current ? scenarioCopy.phaseLabels[current.phase] : ""}</small></div>
          <b className={`decision-${current?.decision.toLowerCase().replaceAll("_", "-")}`}>{current ? scenarioCopy.decisionLabels[current.decision] : ""}</b>
        </div>

        <div className="boundary-demo__summary">
          <article className="is-conflict"><span>{copy.conflictLabel}</span><p>{flow.conflict}</p></article>
          <article className="is-protection"><span>{copy.protectionLabel}</span><p>{flow.protection}</p></article>
        </div>
        <div className="boundary-demo__result"><span>{copy.resultLabel}</span><div>{flow.result.map((item) => <strong key={item}>{item}</strong>)}</div></div>

        <details className="boundary-demo__evidence">
          <summary>{copy.evidenceLabel}<span aria-hidden="true">＋</span></summary>
          <dl>
            <div><dt>{scenarioCopy.phaseLabel}</dt><dd>{current ? scenarioCopy.phaseLabels[current.phase] : ""}</dd></div>
            <div><dt>{scenarioCopy.labelsLabel}</dt><dd>{current ? Array.from(new Set([...current.inputLabels, ...current.outputLabels])).join(" · ") : ""}</dd></div>
            <div><dt>{scenarioCopy.policyLabel}</dt><dd><code>{current?.policies.map((item) => item.ruleId).join(" · ")}</code></dd></div>
            <div><dt>{scenarioCopy.priorityLabel}</dt><dd><code>{current ? scenarioCopy.decisionLabels[current.decision] : ""} · {flow.propagation}</code></dd></div>
          </dl>
        </details>

        <div className="boundary-demo__controls"><button type="button" onClick={() => running ? setRunning(false) : cursor < finalCursor ? setRunning(true) : play()}>{running ? copy.pause : cursor < finalCursor ? copy.resume : copy.replay}</button></div>
      </div>
    </section>
  );
}
