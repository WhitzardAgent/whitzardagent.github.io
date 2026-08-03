import type { HomeCopy } from "../../i18n/pages/home";
import { supportedFrameworks } from "../../data/supportedFrameworks";
import type { BoundaryFlowCopy, EnterpriseScenarioLabCopy } from "../../data/agentguardEnterpriseScenarios";
import AgentGuardBoundaryDemo from "./AgentGuardBoundaryDemo";

type Props = { copy: HomeCopy["hero"]; flowCopy: BoundaryFlowCopy; scenarioCopy: EnterpriseScenarioLabCopy; locale: "en" | "zh" };

export default function HomeHero({ copy, flowCopy, scenarioCopy, locale }: Props) {
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
          <div className="home-hero__adapters" aria-label={locale === "zh" ? "支持的智能体架构" : "Supported agent frameworks"}>
            <span>{locale === "zh" ? "支持的智能体架构" : "SUPPORTED FRAMEWORKS"}</span>
            <div>{supportedFrameworks.map((framework) => <span className="framework-mark" key={framework.id}><img src={framework.logoPath} alt="" width="28" height="28" /><small>{framework.productLabel}</small></span>)}</div>
          </div>
        </div>
        <AgentGuardBoundaryDemo copy={flowCopy} scenarioCopy={scenarioCopy} />
      </div>
    </section>
  );
}
