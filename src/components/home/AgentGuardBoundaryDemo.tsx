import { useState } from "react";
import type { HomeCopy } from "../../i18n/pages/home";

type Props = { copy: HomeCopy["boundaryDemo"] };

export default function AgentGuardBoundaryDemo({ copy }: Props) {
  const [active, setActive] = useState(0);
  const scenario = copy.scenarios[active];

  const handleKeys = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? copy.scenarios.length - 1 : event.key === 'ArrowRight' ? (index + 1) % copy.scenarios.length : (index - 1 + copy.scenarios.length) % copy.scenarios.length;
    setActive(next);
    document.getElementById(`boundary-tab-${copy.scenarios[next].id}`)?.focus();
  };

  return (
    <section className="boundary-demo" aria-label={copy.ariaLabel} data-tone={scenario.tone}>
      <header className="boundary-demo__brand">
        <div><i aria-hidden="true" /><strong>AgentGuard</strong><span>Enterprise</span></div>
        <small>{copy.protectedLabel}</small>
      </header>
      <div className="boundary-demo__tabs" role="tablist" aria-label={copy.ariaLabel}>
        {copy.scenarios.map((item, index) => <button id={`boundary-tab-${item.id}`} role="tab" type="button" aria-selected={index === active} aria-controls={`boundary-panel-${item.id}`} tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => handleKeys(event, index)} key={item.id}><span>0{index + 1}</span>{item.tab}</button>)}
      </div>
      <div className="boundary-demo__panel" role="tabpanel" id={`boundary-panel-${scenario.id}`} aria-labelledby={`boundary-tab-${scenario.id}`}>
        <div className="boundary-demo__task"><span>{copy.taskLabel}</span><p>{scenario.task}</p></div>
        <div className="boundary-demo__flow" aria-label={scenario.flow.join(' → ')}>
          {scenario.flow.map((item, index) => <div className={index === 1 ? 'is-agent' : ''} key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < scenario.flow.length - 1 && <i aria-hidden="true">→</i>}</div>)}
          <div className="boundary-demo__rail"><b>AG</b><span>{copy.controlLayer}</span><i aria-hidden="true" /><i aria-hidden="true" /></div>
        </div>
        <div className="boundary-demo__story">
          <article><span>{copy.riskLabel}</span><p>{scenario.risk}</p></article>
          <article className="is-action"><span>{copy.actionLabel}</span><p>{scenario.action}</p></article>
        </div>
        <div className="boundary-demo__outcome"><span>{copy.outcomeLabel}</span><div>{scenario.outcome.map(item => <strong key={item}>{item}</strong>)}</div></div>
        <details className="boundary-demo__evidence">
          <summary>{copy.evidenceLabel}<span aria-hidden="true">＋</span></summary>
          <dl>
            <div><dt>{copy.evidenceFields.phase}</dt><dd>{scenario.evidence.phase}</dd></div>
            <div><dt>{copy.evidenceFields.labels}</dt><dd>{scenario.evidence.labels}</dd></div>
            <div><dt>{copy.evidenceFields.rule}</dt><dd><code>{scenario.evidence.rule}</code></dd></div>
            <div><dt>{copy.evidenceFields.decision}</dt><dd><code>{scenario.evidence.decision}</code></dd></div>
          </dl>
        </details>
      </div>
    </section>
  );
}
