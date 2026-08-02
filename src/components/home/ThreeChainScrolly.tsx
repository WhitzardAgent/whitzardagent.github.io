import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeCopy } from "../../i18n/pages/home";

export default function ThreeChainScrolly({ copy }: { copy: HomeCopy["chains"] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!root.current || !matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-chain-panel]");
      panels.forEach((panel, index) => ScrollTrigger.create({
        trigger: panel, start: "top center", end: "bottom center", onEnter: () => setActive(index), onEnterBack: () => setActive(index),
      }));
    }, root);
    return () => ctx.revert();
  }, []);
  return <section ref={root} className="three-chain section">
    <div className="site-container three-chain__head"><p className="eyebrow">{copy.eyebrow}</p><h2 className="section-title">{copy.title}</h2><p>{copy.intro}</p></div>
    <div className="site-container three-chain__grid">
      <div className="chain-visual" aria-hidden="true">
        <div className="chain-visual__axis" />
        {copy.items.map((item, index) => <div key={item.short} className={`chain-orbit chain-orbit--${index + 1} ${active === index ? "is-active" : ""}`}><span>{item.short}</span></div>)}
        <div className="chain-visual__core">AgentGuard<small>Runtime Intelligence</small></div>
      </div>
      <div className="chain-panels">
        {copy.items.map((item, index) => <article key={item.title} data-chain-panel className={active === index ? "is-active" : ""}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}
        <div className="chain-fusion"><p>{copy.fusion}</p><div>{copy.decisions.map((item) => <span key={item}>{item}</span>)}</div></div>
      </div>
    </div>
  </section>;
}
