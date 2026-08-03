import { useEffect, useRef, useState } from "react";
import type { RuntimeConsoleCopy } from "../../i18n/pages/runtime-console";

type Props = { copy: RuntimeConsoleCopy; density?: "compact" | "full" };
type Approval = "pending" | "approved" | "rejected";

const phaseDelays = [220, 850, 1500, 2250, 3050, 3900];

export default function AgentGuardRuntimeConsole({ copy, density = "full" }: Props) {
  const timers = useRef<number[]>([]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState(6);
  const [selectedStep, setSelectedStep] = useState(0);
  const [approval, setApproval] = useState<Approval>("pending");
  const scenario = copy.scenarios[scenarioIndex];

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const run = () => {
    clearTimers();
    setApproval("pending");
    setSelectedStep(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase(6);
      return;
    }
    setPhase(0);
    phaseDelays.forEach((delay, index) => {
      timers.current.push(window.setTimeout(() => setPhase(index + 1), delay));
    });
  };

  useEffect(() => {
    run();
    return clearTimers;
    // Run once after hydration; scenario changes are handled explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioIndex]);

  const selectScenario = (index: number) => {
    setScenarioIndex(index);
  };

  const handleTabKeys = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = event.key === "ArrowRight"
      ? (index + 1) % copy.scenarios.length
      : (index - 1 + copy.scenarios.length) % copy.scenarios.length;
    setScenarioIndex(next);
    document.getElementById(`ag-scenario-${density}-${next}`)?.focus();
  };

  const approvalDecision = approval === "approved" ? "ALLOW WITH AUDIT" : approval === "rejected" ? "DENY" : scenario.decision;
  const approvalResolution = approval === "approved" ? copy.approved : approval === "rejected" ? copy.rejected : scenario.resolution;
  const activeStep = scenario.steps[Math.min(selectedStep, scenario.steps.length - 1)];

  return (
    <section className={`ag-console ag-console--${density}`} aria-label={copy.ariaLabel} data-family={scenario.decisionFamily}>
      <header className="ag-console__topbar">
        <div><i aria-hidden="true" /><strong>AgentGuard</strong><span>{copy.demoLabel}</span></div>
        <div><span>{scenario.framework}</span><button type="button" onClick={run}>{copy.replay} ↻</button></div>
      </header>

      <div className="ag-console__tabs" role="tablist" aria-label={copy.ariaLabel}>
        {copy.scenarios.map((item, index) => (
          <button
            id={`ag-scenario-${density}-${index}`}
            key={item.id}
            type="button"
            role="tab"
            aria-selected={scenarioIndex === index}
            aria-controls={`ag-panel-${density}-${index}`}
            tabIndex={scenarioIndex === index ? 0 : -1}
            onClick={() => selectScenario(index)}
            onKeyDown={(event) => handleTabKeys(event, index)}
          >
            <span>0{index + 1}</span>{item.tab}
          </button>
        ))}
      </div>

      <div id={`ag-panel-${density}-${scenarioIndex}`} className="ag-console__panel" role="tabpanel" aria-labelledby={`ag-scenario-${density}-${scenarioIndex}`}>
        <div className="ag-console__workspace">
          <div className="ag-console__request">
            <span>{copy.requestLabel}</span>
            <p>{scenario.request}</p>
          </div>
          <div className="ag-console__principal">
            <span>{copy.principalLabel}</span>
            <strong>{scenario.principal.name}</strong>
            <small>{copy.trustLabel} {scenario.principal.trust}</small>
            <div>{scenario.principal.scopes.map((scope) => <code key={scope}>{scope}</code>)}</div>
          </div>

          <ol className="ag-console__trace">
            {scenario.steps.map((step, index) => (
              <li key={step.name} className={`${phase >= index + 2 ? "is-reached" : ""} ${step.tone === "risk" ? "is-risk" : ""}`}>
                <button type="button" onClick={() => setSelectedStep(index)} aria-pressed={selectedStep === index} title={`${copy.inspect}: ${step.name}`}>
                  <span>0{index + 1}</span><strong>{step.name}</strong><small>{step.detail}</small>
                </button>
                {index < scenario.steps.length - 1 && <i aria-hidden="true"><b /></i>}
              </li>
            ))}
          </ol>

          {density === "full" && (
            <div className="ag-console__event-detail">
              <span>{activeStep.phase}</span><strong>{activeStep.name}</strong><p>{activeStep.detail}</p>
            </div>
          )}
        </div>

        <aside className="ag-console__inspector">
          <section className={phase >= 4 ? "is-visible" : ""}>
            <span>{copy.evidenceLabel}</span>
            <ul>{scenario.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
          </section>
          <section className={`ag-console__engine ${phase >= 5 ? "is-visible" : ""}`}>
            <span>{copy.policyLabel}</span>
            <div><b>DSL</b><i>×</i><b>SAFETY MODEL</b></div>
            {scenario.policies.map((policy) => <code key={policy}>{policy}</code>)}
          </section>
          <section className={`ag-console__decision ${phase >= 6 ? "is-visible" : ""}`}>
            <span>{copy.decisionLabel}</span>
            <strong>{approvalDecision}</strong>
            <p><small>{copy.finalLabel}</small>{approvalResolution}</p>
            {scenario.id === "approval" && approval === "pending" && phase >= 6 && (
              <div><button type="button" onClick={() => setApproval("approved")}>{copy.approveOnce}</button><button type="button" onClick={() => setApproval("rejected")}>{copy.reject}</button></div>
            )}
          </section>
        </aside>
      </div>

      <footer className="ag-console__footer">
        <div><span>{copy.protectedLabel}</span>{copy.phases.map((item) => <small key={item}>{item}</small>)}</div>
        <div aria-label={copy.decisions.join(", ")}>{copy.decisions.map((item) => <small key={item} className={approvalDecision.includes(item) || scenario.decision === item ? "is-active" : ""}>{item}</small>)}</div>
      </footer>
    </section>
  );
}
