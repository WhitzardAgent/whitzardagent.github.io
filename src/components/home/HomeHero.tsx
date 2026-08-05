import type { HomeCopy } from "../../i18n/pages/home";
import AgentGuardBoundaryFlow from "./AgentGuardBoundaryFlow";

type Props = { copy: HomeCopy["hero"]; locale: "en" | "zh" };

export default function HomeHero({ copy, locale }: Props) {
  return (
    <section className="home-hero">
      <div className="site-container home-hero__grid">
        <div className="home-hero__copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="home-hero__description">{copy.description}</p>
          <div className="home-hero__actions">
            <a className="button button--primary" href={locale === "zh" ? "/contact" : "/en/contact"}>{copy.primary}</a>
            <a className="button button--secondary" href={locale === "zh" ? "/agentguard#enterprise" : "/en/agentguard#enterprise"}>{copy.secondary}<span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="home-hero__visual">
          <AgentGuardBoundaryFlow locale={locale} />
        </div>
      </div>
    </section>
  );
}
