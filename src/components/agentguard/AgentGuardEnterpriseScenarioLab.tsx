import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  decisionPriority,
  resolveEnterpriseScenario,
  type BoundaryFlowCopy,
  type EnterpriseScenarioLabCopy,
  type ResolvedTraceNode,
  type ScenarioId,
} from "../../data/agentguardEnterpriseScenarios";

type Props = { copy: EnterpriseScenarioLabCopy; flowCopy: BoundaryFlowCopy };
type RunState = "running" | "completed" | "paused" | "blocked" | "rejected";

const defaultsFor = (copy: EnterpriseScenarioLabCopy, scenarioId: ScenarioId) => {
  const scenario = copy.scenarios.find((item) => item.id === scenarioId)!;
  return Object.fromEntries(scenario.controls.map((control) => [control.id, control.defaultValue]));
};

export default function AgentGuardEnterpriseScenarioLab({ copy, flowCopy }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);
  const reducedMotion = useRef(false);
  const [scenarioId, setScenarioId] = useState<ScenarioId>(copy.scenarios[0].id);
  const scenario = copy.scenarios.find((item) => item.id === scenarioId)!;
  const flow = flowCopy.scenarios.find((item) => item.id === scenarioId)!;
  const [controls, setControls] = useState<Record<string, string>>(() => defaultsFor(copy, scenarioId));
  const resolved = useMemo(() => resolveEnterpriseScenario(scenario, controls), [scenario, controls]);
  const [selectedId, setSelectedId] = useState(scenario.defaultFocus);
  const [cursor, setCursor] = useState(resolved.stopIndex);
  const [runState, setRunState] = useState<RunState>(resolved.status);
  const [approval, setApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [hasRun, setHasRun] = useState(false);

  const startRun = () => {
    setHasRun(true);
    setApproval("pending");
    setCursor(-1);
    setSelectedId(resolved.nodes[0].id);
    setRunState("running");
  };

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current || playedRef.current || !rootRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        playedRef.current = true;
        startRun();
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (runState !== "running") return;
    const next = cursor + 1;
    if (next >= resolved.nodes.length) {
      setRunState("completed");
      return;
    }
    const node = resolved.nodes[next];
    const finishStep = () => {
      setCursor(next);
      setSelectedId(node.id);
      if (node.decision === "DENY") setRunState("blocked");
      else if (node.decision === "HUMAN_CHECK" && approval !== "approved") setRunState("paused");
      else if (next === resolved.nodes.length - 1) setRunState("completed");
    };
    if (reducedMotion.current) finishStep();
    else {
      const timer = window.setTimeout(finishStep, 520);
      return () => window.clearTimeout(timer);
    }
  }, [approval, cursor, resolved.nodes, runState]);

  const reset = (nextScenarioId = scenarioId, nextControls = controls) => {
    const nextScenario = copy.scenarios.find((item) => item.id === nextScenarioId)!;
    const nextResolved = resolveEnterpriseScenario(nextScenario, nextControls);
    setCursor(nextResolved.stopIndex);
    setRunState(nextResolved.status);
    setApproval("pending");
    setHasRun(false);
    setSelectedId(nextResolved.nodes[nextResolved.stopIndex]?.id ?? nextScenario.defaultFocus);
  };

  const selectScenario = (nextId: ScenarioId) => {
    const nextControls = defaultsFor(copy, nextId);
    setScenarioId(nextId);
    setControls(nextControls);
    playedRef.current = true;
    reset(nextId, nextControls);
  };

  const moveScenario = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? copy.scenarios.length - 1 : event.key === "ArrowRight" ? (index + 1) % copy.scenarios.length : (index - 1 + copy.scenarios.length) % copy.scenarios.length;
    selectScenario(copy.scenarios[nextIndex].id);
    window.requestAnimationFrame(() => document.querySelectorAll<HTMLButtonElement>(".ag-lab__scenarios [role=tab]")[nextIndex]?.focus());
  };

  const updateControl = (controlId: string, value: string) => {
    const nextControls = { ...controls, [controlId]: value };
    setControls(nextControls);
    playedRef.current = true;
    reset(scenarioId, nextControls);
  };

  const selected = resolved.nodes.find((node) => node.id === selectedId) ?? resolved.nodes[Math.max(0, cursor)] ?? resolved.nodes[0];
  const trackIndex = Math.min(Math.max(cursor + 1, 0), flow.tracks[0].states.length - 1);
  const statusLabel = runState === "running" ? copy.stateLabels.waiting : runState === "rejected" ? copy.stateLabels.rejected : copy.stateLabels[runState];
  const actionLabel = runState === "running" ? flowCopy.pause : cursor < resolved.nodes.length - 1 ? flowCopy.resume : hasRun ? copy.replay : copy.run;

  return (
    <div ref={rootRef} className="ag-lab" aria-label={copy.ariaLabel} data-running={runState === "running" ? "true" : "false"}>
      <div className="ag-lab__topbar">
        <div className="ag-lab__identity"><b>AG</b><span><strong>AgentGuard</strong><small>Interaction Boundary Runtime</small></span></div>
        <div className={`ag-lab__status is-${runState}`} aria-live="polite"><i />{flowCopy.liveLabel} · {statusLabel}</div>
      </div>

      <div className="ag-lab__scenarios" role="tablist" aria-label={copy.ariaLabel}>
        {copy.scenarios.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={item.id === scenarioId} tabIndex={item.id === scenarioId ? 0 : -1} onClick={() => selectScenario(item.id)} onKeyDown={(event) => moveScenario(event, index)}><span>0{index + 1}</span>{item.label}</button>)}
      </div>

      <div className="ag-lab__brief">
        <div><span>{copy.requestLabel}</span><p>{scenario.request}</p></div>
        <button type="button" onClick={() => runState === "running" ? setRunState("paused") : cursor < resolved.nodes.length - 1 ? setRunState("running") : startRun()}>{actionLabel}<span aria-hidden="true">↗</span></button>
      </div>

      <fieldset className="ag-lab__controls">
        <legend>{copy.controlsLabel}</legend>
        {scenario.controls.map((control) => <label key={control.id}><span>{control.label}</span><select value={controls[control.id]} onChange={(event) => updateControl(control.id, event.target.value)}>{control.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>)}
      </fieldset>

      <div className="ag-lab__workspace">
        <main className="ag-lab__trace" aria-label={copy.traceLabel}>
          <div className="ag-lab__trace-head"><span>{copy.traceLabel}</span><small>{scenario.principal}</small></div>
          <div className="ag-lab__runtime-band"><span>{flowCopy.runtimeLabel}</span><i style={{ "--progress": `${Math.max(0, cursor) / Math.max(1, resolved.nodes.length - 1) * 100}%` } as CSSProperties} /></div>
          <ol className="ag-lab__timeline" style={{ "--node-count": resolved.nodes.length } as CSSProperties}>
            {resolved.nodes.map((node, index) => {
              const state = index < cursor ? "complete" : index === cursor ? runState === "blocked" || runState === "rejected" ? "blocked" : runState === "paused" ? "paused" : "active" : "waiting";
              return <li key={node.id}><TraceNode node={node} selected={node.id === selected.id} executionState={state} decisionLabel={copy.decisionLabels[node.decision]} onSelect={() => { playedRef.current = true; setRunState(runState === "running" ? "paused" : runState); setSelectedId(node.id); setCursor(index); }} /></li>;
            })}
          </ol>

          <div className="ag-lab__tracks">
            <header><span>{flowCopy.trackingLabel}</span><strong>{flow.tracking}</strong></header>
            {flow.tracks.map((track) => <div className={`ag-lab-track is-${track.kind}`} key={track.kind}><span className={`ag-lab-track__shape is-${track.shape}`} aria-hidden="true" /><div><strong>{track.label}</strong><small>{track.description}</small></div><i><b style={{ width: `${trackIndex / (track.states.length - 1) * 100}%` }} /><em style={{ left: `${trackIndex / (track.states.length - 1) * 100}%` }} /></i><p>{track.states[trackIndex]}</p></div>)}
          </div>

          <div className="ag-lab__gate"><div><b>AG</b><span><small>{flowCopy.gateLabel}</small><strong>AgentGuard · {selected.boundary}</strong></span></div><em className={`decision-${selected.decision.toLowerCase().replaceAll("_", "-")}`}>{copy.decisionLabels[selected.decision]}</em></div>
        </main>

        <Inspector copy={copy} flowCopy={flowCopy} flow={flow} node={selected} principal={scenario.principal} approval={approval} runState={runState} onApprove={() => { setApproval("approved"); setRunState("running"); }} onReject={() => { setApproval("rejected"); setRunState("rejected"); }} />
      </div>
    </div>
  );
}

function TraceNode({ node, selected, executionState, decisionLabel, onSelect }: { node: ResolvedTraceNode; selected: boolean; executionState: string; decisionLabel: string; onSelect: () => void }) {
  return <button type="button" className={`ag-lab-node decision-${node.decision.toLowerCase().replaceAll("_", "-")} state-${executionState}`} aria-pressed={selected} onClick={onSelect}><i aria-hidden="true" /><span>{node.stage}</span><strong>{node.tool}</strong><small>{decisionLabel}</small></button>;
}

function Inspector({ copy, flowCopy, flow, node, principal, approval, runState, onApprove, onReject }: { copy: EnterpriseScenarioLabCopy; flowCopy: BoundaryFlowCopy; flow: BoundaryFlowCopy["scenarios"][number]; node: ResolvedTraceNode; principal: string; approval: string; runState: RunState; onApprove: () => void; onReject: () => void }) {
  const rank = decisionPriority.indexOf(node.decision) + 1;
  const approvalNode = node.decision === "HUMAN_CHECK";
  return (
    <aside className="ag-lab__inspector" aria-label={copy.inspectorLabel}>
      <header><div><b>AG</b><span><small>{copy.inspectorLabel}</small><strong>AgentGuard</strong></span></div><em className={`decision-${node.decision.toLowerCase().replaceAll("_", "-")}`}>{copy.decisionLabels[node.decision]}</em></header>
      <div className="ag-lab__business">
        <article><span>{flowCopy.trackingLabel}</span><p>{flow.tracking}</p></article>
        <article className="is-conflict"><span>{flowCopy.conflictLabel}</span><p>{flow.conflict}</p></article>
        <article className="is-protection"><span>{flowCopy.protectionLabel}</span><p>{flow.protection}</p></article>
        <article className="is-result"><span>{flowCopy.resultLabel}</span><p>{flow.result.join(" · ")}</p></article>
      </div>
      <details className="ag-lab__technical">
        <summary>{flowCopy.evidenceLabel}<span aria-hidden="true">＋</span></summary>
        <dl className="ag-lab__facts"><div><dt>{copy.principalLabel}</dt><dd>{principal}</dd></div><div><dt>{copy.phaseLabel}</dt><dd>{copy.phaseLabels[node.phase]}</dd></div><div><dt>{copy.boundaryLabel}</dt><dd>{node.boundary}</dd></div><div><dt>{copy.priorityLabel}</dt><dd>P{rank} · {decisionPriority.slice(0, rank).map((item) => copy.decisionLabels[item]).join(" → ")}</dd></div></dl>
        <div className="ag-lab__io"><div><span>{copy.inputLabel}</span><p>{node.input}</p></div><div><span>{copy.outputLabel}</span><p>{node.output}</p></div></div>
        <div className="ag-lab__labels"><span>{copy.labelsLabel}</span><div>{Array.from(new Set([...node.inputLabels, ...node.outputLabels])).map((label) => <small key={label}>{label}</small>)}</div></div>
        <div className="ag-lab__policies"><span>{copy.policyLabel}</span>{node.policies.map((item) => <article key={item.ruleId}><div><code>{item.ruleId}</code><em>{copy.sourceLabels[item.source]}</em></div><p>{item.reason}</p><b>{copy.decisionLabels[item.decision]}</b></article>)}</div>
        {node.payloadBefore && <div className="ag-lab__payload"><span>{copy.payloadLabel}</span><del>{node.payloadBefore}</del><ins>{node.payloadAfter}</ins></div>}
        <div className="ag-lab__obligations"><span>{copy.obligationsLabel}</span><div>{node.obligations.map((item) => <code key={item}>{item}</code>)}</div></div>
      </details>
      {approvalNode && <div className="ag-lab__approval"><p>{approval === "approved" ? copy.approvedNotice : approval === "rejected" || runState === "rejected" ? copy.rejectedNotice : copy.stateLabels.paused}</p><div><button type="button" onClick={onApprove} disabled={approval === "approved"}>{copy.approve}</button><button type="button" onClick={onReject} disabled={approval === "rejected"}>{copy.reject}</button></div></div>}
    </aside>
  );
}
