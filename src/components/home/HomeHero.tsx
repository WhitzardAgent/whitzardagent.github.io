import { motion, useReducedMotion } from "framer-motion";
import type { HomeCopy } from "../../i18n/pages/home";

type Props = { copy: HomeCopy["hero"]; locale: "en" | "zh" };
const nodes = ["Intent", "Reasoning", "Tool", "Data", "Action"];
const decisions = ["Allow", "Correct", "Approve", "Redact", "Limit", "Block"];

export default function HomeHero({ copy, locale }: Props) {
  const reduce = useReducedMotion();
  return (
    <section className="home-hero">
      <div className="site-container home-hero__grid">
        <motion.div className="home-hero__copy" initial={false} animate={{ y: 0 }}>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="home-hero__description">{copy.description}</p>
          <div className="home-hero__actions">
            <a className="button button--primary" href={locale === "zh" ? "/contact" : "/en/contact"}>{copy.primary}</a>
            <a className="button button--secondary" href={locale === "zh" ? "/agentguard#demo" : "/en/agentguard#demo"}>{copy.secondary}<span aria-hidden="true">↗</span></a>
          </div>
        </motion.div>
        <motion.div className="runtime-trace" initial={reduce ? false : { opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .16, ease: [.22, 1, .36, 1] }} aria-label={copy.visualLabel}>
          <div className="runtime-trace__head"><span>{copy.visualLabel}</span><span className="runtime-trace__live"><i /> AgentGuard</span></div>
          <div className="runtime-trace__canvas">
            <svg viewBox="0 0 620 238" aria-hidden="true">
              <path className="trace-line trace-line--base" d="M60 116 H560" />
              <motion.path className="trace-line trace-line--signal" d="M60 116 H560" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3.8, ease: "linear" }} />
              <path className="trace-line trace-line--risk" d="M185 116 C236 116 232 57 286 57" />
              <motion.path className="trace-line trace-line--corrected" d="M185 116 C236 116 232 57 286 57 C340 57 330 116 376 116" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.1, ease: "easeOut" }} />
            </svg>
            <ol className="runtime-trace__nodes">
              {nodes.map((node, i) => <li key={node} className={node === "Reasoning" ? "is-risk" : ""}><span className="runtime-node__dot" /><span>{node}</span><small>{String(i + 1).padStart(2, "0")}</small></li>)}
            </ol>
            <motion.div className="runtime-trace__risk" initial={reduce ? false : { opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, duration: .18 }}><span>!</span>{copy.risk}</motion.div>
            <motion.div className="runtime-trace__decision" initial={reduce ? false : { opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.7, duration: .18 }}><small>AgentGuard</small><strong>{copy.decision}</strong></motion.div>
          </div>
          <div className="runtime-trace__footer"><span>{copy.outcome}</span><div>{decisions.map((item) => <small key={item} className={item === "Correct" ? "is-current" : ""}>{item}</small>)}</div></div>
        </motion.div>
      </div>
    </section>
  );
}
