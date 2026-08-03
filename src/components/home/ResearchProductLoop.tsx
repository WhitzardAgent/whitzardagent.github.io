import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeCopy } from "../../i18n/pages/home";

export default function ResearchProductLoop({
  copy,
  locale,
}: {
  copy: HomeCopy["loop"];
  locale: "en" | "zh";
}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 68%" },
      });
      timeline
        .fromTo(
          ".loop-engine__panel",
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.18,
            ease: "power2.out",
          },
        )
        .fromTo(
          ".loop-flow__track",
          { scaleY: 0 },
          { scaleY: 1, duration: 0.65, stagger: 0.12, ease: "power2.out" },
          "-=.42",
        )
        .fromTo(
          ".loop-engine__feedback",
          { opacity: 0 },
          { opacity: 1, duration: 0.45 },
          "-=.2",
        );
    }, root);
    return () => ctx.revert();
  }, []);
  const researchHref = locale === "zh" ? "/nuwa" : "/en/nuwa";
  const productHref = locale === "zh" ? "/agentguard" : "/en/agentguard";
  return (
    <section ref={root} className="research-loop section">
      <div className="site-container">
        <header className="loop-engine__head">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="section-title">{copy.title}</h2>
          <p>{copy.statement}</p>
        </header>
        <div className="loop-engine">
          <article className="loop-engine__panel loop-engine__panel--lab">
            <div className="loop-engine__identity">
              <img
                src="/assets/logo/nvwa_logo.png"
                width="88"
                height="88"
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <div>
                <span>RESEARCH ENGINE</span>
                <h3>{copy.lab.name}</h3>
                <p>{copy.lab.role}</p>
              </div>
            </div>
            <ul>
              {copy.lab.items.map((item, index) => (
                <li key={item}>
                  <span>0{index + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href={researchHref}>
              {copy.lab.link} <span aria-hidden="true">→</span>
            </a>
          </article>

          <div
            className="loop-flow"
            role="img"
            aria-label={`${copy.bridge.down}. ${copy.bridge.up}.`}
          >
            <div className="loop-flow__lane loop-flow__lane--down">
              <i className="loop-flow__track" aria-hidden="true"></i>
              <span aria-hidden="true">↓</span>
              <p>{copy.bridge.down}</p>
            </div>
            <div className="loop-flow__core">
              <strong>NUWA</strong>
              <span>↕</span>
              <strong>AgentGuard</strong>
            </div>
            <div className="loop-flow__lane loop-flow__lane--up">
              <i className="loop-flow__track" aria-hidden="true"></i>
              <span aria-hidden="true">↑</span>
              <p>{copy.bridge.up}</p>
            </div>
          </div>

          <article className="loop-engine__panel loop-engine__panel--product">
            <div className="loop-engine__identity">
              <img
                src="/assets/logo/whitzard_logo.png"
                width="88"
                height="88"
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <div>
                <span>PRODUCT LINE</span>
                <h3>{copy.product.name}</h3>
                <p>{copy.product.role}</p>
              </div>
            </div>
            <ul>
              {copy.product.items.map((item, index) => (
                <li key={item}>
                  <span>0{index + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href={productHref}>
              {copy.product.link} <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
        <p className="loop-engine__feedback">{copy.feedback}</p>
      </div>
    </section>
  );
}
