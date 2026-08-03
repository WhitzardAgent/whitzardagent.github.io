import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  decisionPriority,
  resolveEnterpriseScenario,
  type EnterpriseScenarioLabCopy,
  type ResolvedTraceNode,
  type ScenarioId,
} from "../../data/agentguardEnterpriseScenarios";

type Props = { copy: EnterpriseScenarioLabCopy };
type RunState = "running" | "completed" | "paused" | "blocked" | "rejected";

const defaultsFor = (copy: EnterpriseScenarioLabCopy, scenarioId: ScenarioId) => {
  const scenario = copy.scenarios.find((item) => item.id === scenarioId)!;
  return Object.fromEntries(scenario.controls.map((control) => [control.id, control.defaultValue]));
};

export default function AgentGuardEnterpriseScenarioLab({ copy }: Props) {
  const [scenarioId, setScenarioId] = useState<ScenarioId>(copy.scenarios[0].id);
  const scenario = copy.scenarios.find((item) => item.id === scenarioId)!;
  const [controls, setControls] = useState<Record<string, string>>(() => defaultsFor(copy, scenarioId));
  const resolved = useMemo(() => resolveEnterpriseScenario(scenario, controls), [scenario, controls]);
  const [selectedId, setSelectedId] = useState(scenario.defaultFocus);
  const [cursor, setCursor] = useState(resolved.stopIndex);
  const [runState, setRunState] = useState<RunState>(resolved.status);
  const [approval, setApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [hasRun, setHasRun] = useState(false);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    if (prefersReducedMotion.current) finishStep();
    else {
      const timer = window.setTimeout(finishStep, 360);
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
    setSelectedId(nextResolved.status === "blocked" ? nextResolved.nodes[nextResolved.stopIndex].id : nextScenario.defaultFocus);
  };

  const selectScenario = (nextId: ScenarioId) => {
    const nextControls = defaultsFor(copy, nextId);
    setScenarioId(nextId);
    setControls(nextControls);
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
    reset(scenarioId, nextControls);
  };

  const run = () => {
    setHasRun(true);
    setApproval("pending");
    setCursor(-1);
    setSelectedId(resolved.nodes[0].id);
    setRunState("running");
  };

  const approve = () => {
    setApproval("approved");
    setRunState("running");
  };

  const reject = () => {
    setApproval("rejected");
    setRunState("rejected");
  };

  const selected = resolved.nodes.find((node) => node.id === selectedId) ?? resolved.nodes[0];
  const runLabel = runState === "running" ? copy.stateLabels.waiting : hasRun ? copy.replay : copy.run;
  const statusLabel = runState === "running" ? copy.stateLabels.waiting : runState === "rejected" ? copy.stateLabels.rejected : copy.stateLabels[runState];

  return (
    <div className="ag-lab" aria-label={copy.ariaLabel}>
      <div className="ag-lab__topbar">
        <div className="ag-lab__scenarios" role="tablist" aria-label={copy.ariaLabel}>
          {copy.scenarios.map((item, index) => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === scenarioId} tabIndex={item.id === scenarioId ? 0 : -1} onClick={() => selectScenario(item.id)} onKeyDown={(event) => moveScenario(event, index)}>
              <span>{String(copy.scenarios.indexOf(item) + 1).padStart(2, "0")}</span>{item.label}
            </button>
          ))}
        </div>
        <div className={`ag-lab__status is-${runState}`} aria-live="polite"><i />{statusLabel}</div>
      </div>

      <div className="ag-lab__brief">
        <div><span>{copy.requestLabel}</span><p>{scenario.request}</p></div>
        <div className="ag-lab__actions"><button type="button" onClick={run} disabled={runState === "running"}>{runLabel}<span aria-hidden="true">↗</span></button></div>
      </div>

      <fieldset className="ag-lab__controls">
        <legend>{copy.controlsLabel}</legend>
        {scenario.controls.map((control) => (
          <label key={control.id}><span>{control.label}</span><select value={controls[control.id]} onChange={(event) => updateControl(control.id, event.target.value)}>{control.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
        ))}
      </fieldset>

      <div className="ag-lab__workspace">
        <div className="ag-lab__trace" aria-label={copy.traceLabel}>
          <div className="ag-lab__trace-head"><span>{copy.traceLabel}</span><small>{scenario.principal}</small></div>
          <div className="ag-lab__lanes">
            {(["enterprise-data", "agent-runtime", "external-action"] as const).map((lane) => {
              const laneNodes = resolved.nodes.map((node, index) => ({ node, index })).filter(({ node }) => node.lane === lane);
              return (
                <section key={lane} className={`ag-lab__lane lane-${lane}`}>
                  <h3>{copy.laneLabels[lane]}</h3>
                  <div>
                    {laneNodes.map(({ node, index }) => {
                      const executionState = index < cursor ? "complete" : index === cursor ? runState === "blocked" || runState === "rejected" ? "blocked" : runState === "paused" ? "paused" : "active" : "waiting";
                      return <TraceNode key={node.id} node={node} column={index + 1} selected={node.id === selected.id} executionState={executionState} decisionLabel={copy.decisionLabels[node.decision]} onSelect={() => setSelectedId(node.id)} />;
                    })}
                  </div>
                </section>
              );
            })}
          </div>
          <ol className="ag-lab__sequence" aria-label={copy.traceLabel}>{resolved.nodes.map((node, index) => <li key={node.id} className={node.id === selected.id ? "is-selected" : ""}><button type="button" onClick={() => setSelectedId(node.id)}><span>{String(index + 1).padStart(2, "0")}</span>{node.tool}</button></li>)}</ol>
        </div>

        <Inspector copy={copy} node={selected} principal={scenario.principal} approval={approval} runState={runState} onApprove={approve} onReject={reject} />
      </div>
    </div>
  );
}

function TraceNode({ node, column, selected, executionState, decisionLabel, onSelect }: { node: ResolvedTraceNode; column: number; selected: boolean; executionState: string; decisionLabel: string; onSelect: () => void }) {
  return (
    <button type="button" style={{ gridColumn: column }} className={`ag-lab-node decision-${node.decision.toLowerCase().replaceAll("_", "-")} state-${executionState}`} aria-pressed={selected} onClick={onSelect}>
      <span>{node.stage}</span><strong>{node.tool}</strong><small>{decisionLabel}</small>
    </button>
  );
}

function Inspector({ copy, node, principal, approval, runState, onApprove, onReject }: { copy: EnterpriseScenarioLabCopy; node: ResolvedTraceNode; principal: string; approval: string; runState: RunState; onApprove: () => void; onReject: () => void }) {
  const rank = decisionPriority.indexOf(node.decision) + 1;
  const approvalNode = node.decision === "HUMAN_CHECK";
  return (
    <aside className="ag-lab__inspector" aria-label={copy.inspectorLabel}>
      <header><div><span>{copy.inspectorLabel}</span><strong>{node.tool}</strong></div><b className={`decision-${node.decision.toLowerCase().replaceAll("_", "-")}`}>{copy.decisionLabels[node.decision]}</b></header>
      <dl className="ag-lab__facts">
        <div><dt>{copy.principalLabel}</dt><dd>{principal}</dd></div>
        <div><dt>{copy.phaseLabel}</dt><dd>{copy.phaseLabels[node.phase]}</dd></div>
        <div><dt>{copy.boundaryLabel}</dt><dd>{node.boundary}</dd></div>
        <div><dt>{copy.priorityLabel}</dt><dd><span className="ag-lab__priority">P{rank}</span>{decisionPriority.slice(0, rank).map((item) => copy.decisionLabels[item]).join(" → ")}</dd></div>
      </dl>
      <div className="ag-lab__io"><div><span>{copy.inputLabel}</span><p>{node.input}</p></div><div><span>{copy.outputLabel}</span><p>{node.output}</p></div></div>
      <div className="ag-lab__labels"><span>{copy.labelsLabel}</span><div>{Array.from(new Set([...node.inputLabels, ...node.outputLabels])).map((label) => <small key={label}>{label}</small>)}</div></div>
      <div className="ag-lab__policies"><span>{copy.policyLabel}</span>{node.policies.map((item) => <article key={item.ruleId}><div><code>{item.ruleId}</code><em>{copy.sourceLabels[item.source]}</em></div><p>{item.reason}</p><b>{copy.decisionLabels[item.decision]}</b></article>)}</div>
      {node.payloadBefore && <div className="ag-lab__payload"><span>{copy.payloadLabel}</span><del>{node.payloadBefore}</del><ins>{node.payloadAfter}</ins></div>}
      <div className="ag-lab__obligations"><span>{copy.obligationsLabel}</span><div>{node.obligations.map((item) => <code key={item}>{item}</code>)}</div></div>
      {approvalNode && <div className="ag-lab__approval"><p>{approval === "approved" ? copy.approvedNotice : approval === "rejected" || runState === "rejected" ? copy.rejectedNotice : copy.stateLabels.paused}</p><div><button type="button" onClick={onApprove} disabled={approval === "approved"}>{copy.approve}</button><button type="button" onClick={onReject} disabled={approval === "rejected"}>{copy.reject}</button></div></div>}
    </aside>
  );
}
