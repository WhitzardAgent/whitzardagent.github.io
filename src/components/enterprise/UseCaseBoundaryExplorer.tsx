import { useEffect, useState } from "react";
import type { CompanyCopy } from "../../i18n/pages/company";

type Scenario = CompanyCopy["solutions"]["scenarios"][number];
type Labels = CompanyCopy["solutions"]["explorer"];

export default function UseCaseBoundaryExplorer({ scenarios, labels }: { scenarios: Scenario[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 701px)");
    const update = () => setDesktop(media.matches);
    update();
    setEnhanced(true);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const interactive = enhanced && desktop;
  const select = (index: number) => setActive(index);
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? scenarios.length - 1 : event.key === "ArrowRight" ? (index + 1) % scenarios.length : (index - 1 + scenarios.length) % scenarios.length;
    select(next);
    document.getElementById(`use-case-tab-${next}`)?.focus();
  };

  return (
    <section className="use-case-explorer" aria-label={labels.ariaLabel}>
      {interactive && <div className="use-case-explorer__tabs" role="tablist" aria-label={labels.ariaLabel}>
        {scenarios.map((item, index) => (
          <button
            id={`use-case-tab-${index}`}
            key={item.index}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`use-case-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span>{item.index}</span>{item.title}
          </button>
        ))}
      </div>}
      {scenarios.map((scenario, index) => <section className="use-case-explorer__panel" key={scenario.index} id={`use-case-panel-${index}`} hidden={interactive && index !== active} role={interactive ? "tabpanel" : undefined} aria-labelledby={interactive ? `use-case-tab-${index}` : `use-case-heading-${index}`} tabIndex={interactive ? 0 : undefined}>
      {!interactive && <h2 id={`use-case-heading-${index}`}>{scenario.title}</h2>}
      <dl className="use-case-explorer__content">
        <div><dt>{labels.tasks}</dt><dd>{scenario.tasks}</dd></div>
        <div><dt>{labels.securityDimensions}</dt><dd><ul className="security-dimensions">{scenario.securityDimensions.map(dimension => <li key={dimension}>{dimension}</li>)}</ul></dd></div>
        <div><dt>{labels.value}</dt><dd>{scenario.value}</dd></div>
      </dl>
      </section>)}
    </section>
  );
}
