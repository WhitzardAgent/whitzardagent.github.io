import { useState } from "react";

type Scenario = { index: string; title: string; objective: string; boundary: string; outcome: string };
type Labels = { objective: string; boundary: string; outcome: string; ariaLabel: string };

export default function UseCaseBoundaryExplorer({ scenarios, labels }: { scenarios: Scenario[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const scenario = scenarios[active];
  const select = (index: number) => setActive(index);
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? (index + 1) % scenarios.length : (index - 1 + scenarios.length) % scenarios.length;
    select(next);
    document.getElementById(`use-case-tab-${next}`)?.focus();
  };

  return (
    <section className="use-case-explorer" aria-label={labels.ariaLabel}>
      <div className="use-case-explorer__tabs" role="tablist" aria-label={labels.ariaLabel}>
        {scenarios.map((item, index) => (
          <button
            id={`use-case-tab-${index}`}
            key={item.index}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls="use-case-panel"
            tabIndex={index === active ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span>{item.index}</span>{item.title}
          </button>
        ))}
      </div>
      <div id="use-case-panel" className="use-case-explorer__flow" role="tabpanel" aria-labelledby={`use-case-tab-${active}`}>
        <article><span>{labels.objective}</span><p>{scenario.objective}</p></article>
        <i aria-hidden="true">→</i>
        <article className="is-boundary"><span>{labels.boundary}</span><p>{scenario.boundary}</p></article>
        <i aria-hidden="true">→</i>
        <article className="is-outcome"><span>{labels.outcome}</span><p>{scenario.outcome}</p></article>
      </div>
    </section>
  );
}
