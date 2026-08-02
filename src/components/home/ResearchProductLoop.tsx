import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeCopy } from "../../i18n/pages/home";

export default function ResearchProductLoop({ copy }: { copy: HomeCopy["loop"] }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => gsap.fromTo(".loop-path", { strokeDashoffset: 900 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 55%", scrub: 1 } }), root);
    return () => ctx.revert();
  }, []);
  return <section ref={root} className="research-loop section">
    <div className="site-container research-loop__grid"><div><p className="eyebrow">{copy.eyebrow}</p><h2 className="section-title serif">{copy.title}</h2><p>{copy.statement}</p></div>
      <div className="loop-map"><svg viewBox="0 0 520 410" aria-hidden="true"><path className="loop-path-bg" d="M110 205 C110 86 218 48 310 78 C408 110 448 218 390 304 C332 390 190 377 126 286"/><path className="loop-path" d="M110 205 C110 86 218 48 310 78 C408 110 448 218 390 304 C332 390 190 377 126 286"/></svg>{copy.nodes.map((node, i) => <span key={node} className={`loop-node loop-node--${i + 1}`}>{node}</span>)}</div>
    </div>
  </section>;
}
