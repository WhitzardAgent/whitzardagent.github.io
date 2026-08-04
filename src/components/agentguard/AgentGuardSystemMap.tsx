import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  agentGuardSystemEdges,
  agentGuardSystemNodes,
  localize,
  storyPageCopy,
  type SecurityFlowKind,
  type SystemNodeKind,
} from "../../data/agentguardStory";

type Props = { locale: "zh" | "en"; density?: "compact" | "full" };

const sequence = ["identity", "primary-agent", "enterprise-data", "model", "memory", "tools", "mcp", "external"];
const flowMeta: Array<{ kind: SecurityFlowKind; symbol: string; zh: string; en: string }> = [
  { kind: "data", symbol: "●", zh: "数据", en: "Data" },
  { kind: "authorization", symbol: "◆", zh: "授权", en: "Authorization" },
  { kind: "effect", symbol: "■", zh: "动作影响", en: "Action effect" },
];
const kindOrder: SystemNodeKind[] = ["identity", "agent", "model", "data", "memory", "tool", "mcp", "external-system"];
const kindLabels: Record<SystemNodeKind, { zh: string; en: string }> = {
  identity: { zh: "身份", en: "Identity" }, agent: { zh: "Agent", en: "Agent" }, model: { zh: "模型", en: "Model" }, data: { zh: "数据", en: "Data" }, memory: { zh: "Memory", en: "Memory" }, tool: { zh: "工具", en: "Tools" }, mcp: { zh: "MCP", en: "MCP" }, "external-system": { zh: "外部系统", en: "External" },
};

const track = (event: string) => {
  const analytics = (window as Window & { umami?: { track: (name: string) => void } }).umami;
  analytics?.track(event);
};

export default function AgentGuardSystemMap({ locale, density = "full" }: Props) {
  const copy = storyPageCopy[locale].map;
  const rootRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | null>(null);
  const playedRef = useRef(false);
  const [cursor, setCursor] = useState(sequence.length - 1);
  const [running, setRunning] = useState(false);
  const [selectedId, setSelectedId] = useState("external");
  const [kindFilter, setKindFilter] = useState<SystemNodeKind | "all">("all");
  const selected = agentGuardSystemNodes.find((node) => node.id === selectedId) ?? agentGuardSystemNodes[0];
  const visibleNodes = useMemo(() => kindFilter === "all" ? agentGuardSystemNodes : agentGuardSystemNodes.filter((node) => node.kind === kindFilter), [kindFilter]);
  const activeIds = new Set(sequence.slice(0, cursor + 1));

  const stop = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setRunning(false);
  };
  const play = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCursor(sequence.length - 1);
      setSelectedId("external");
      return;
    }
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setCursor(0);
    setSelectedId(sequence[0]);
    setRunning(true);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root || playedRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        playedRef.current = true;
        play();
        observer.disconnect();
      }
    }, { threshold: 0.28 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    if (cursor >= sequence.length - 1) {
      setRunning(false);
      return;
    }
    timerRef.current = window.setTimeout(() => {
      const next = cursor + 1;
      setCursor(next);
      setSelectedId(sequence[next]);
    }, 880);
    return () => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); };
  }, [cursor, running]);

  const select = (id: string) => {
    stop();
    setSelectedId(id);
    const index = sequence.indexOf(id);
    if (index >= 0) setCursor(index);
    track("home-system-map-node");
  };

  const moveNode = (event: KeyboardEvent<HTMLButtonElement>, _index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = Math.max(0, visibleNodes.findIndex((node) => node.id === selected.id));
    const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? visibleNodes.length - 1 : (currentIndex + delta + visibleNodes.length) % visibleNodes.length;
    select(visibleNodes[nextIndex].id);
    requestAnimationFrame(() => document.getElementById(`system-node-${visibleNodes[nextIndex].id}`)?.focus());
  };

  const incoming = agentGuardSystemEdges.filter((edge) => edge.to === selected.id).length;
  const outgoing = agentGuardSystemEdges.filter((edge) => edge.from === selected.id).length;

  return (
    <section ref={rootRef} className={`ag-system-map density-${density}`} aria-label={copy.title} data-running={running ? "true" : "false"}>
      <header className="ag-system-map__bar">
        <div className="ag-runtime-mark"><b>AG</b><span><strong>AgentGuard</strong><small>{copy.runtime}</small></span></div>
        <em><i aria-hidden="true" />{copy.live}</em>
      </header>

      {density === "full" && <div className="ag-system-map__filters" aria-label={copy.select}>
        <button type="button" className={kindFilter === "all" ? "is-active" : ""} onClick={() => setKindFilter("all")}>{locale === "zh" ? "全部" : "All"}</button>
        {kindOrder.map((kind) => <button type="button" key={kind} className={kindFilter === kind ? "is-active" : ""} onClick={() => setKindFilter(kind)}>{kindLabels[kind][locale]}</button>)}
      </div>}

      <div className="ag-system-map__workspace">
        <div className="ag-system-map__canvas">
          <svg viewBox="0 0 680 430" role="img" aria-label={locale === "zh" ? "数据、授权与动作影响在企业智能体系统中的传播路径" : "Data, authorization, and action-effect propagation through an enterprise agent system"}>
            <defs>
              <marker id="ag-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" /></marker>
              <filter id="ag-particle-glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {agentGuardSystemEdges.map((edge) => {
              const active = activeIds.has(edge.from) && activeIds.has(edge.to);
              return <g key={edge.id} className={active ? "is-active" : ""}>
                <path className="ag-map-edge" d={edge.path} markerEnd="url(#ag-arrow)" />
                {edge.kinds.map((kind, kindIndex) => <g className={`ag-flow-particle is-${kind}`} key={`${edge.id}-${kind}`} filter="url(#ag-particle-glow)">
                  {kind === "data" && <circle r="4" />}
                  {kind === "authorization" && <rect x="-4" y="-4" width="8" height="8" transform="rotate(45)" />}
                  {kind === "effect" && <rect x="-4" y="-4" width="8" height="8" />}
                  {active && <animateMotion dur={`${2.6 + kindIndex * .45}s`} begin={`${kindIndex * .22}s`} repeatCount="1" fill="freeze" path={edge.path} />}
                </g>)}
              </g>;
            })}
            <rect className="ag-runtime-boundary" x="22" y="30" width="630" height="370" rx="34" />
            <text className="ag-runtime-boundary-label" x="44" y="58">AGENTGUARD INTERACTION BOUNDARY RUNTIME</text>
          </svg>
          <div className="ag-system-map__nodes">
            {agentGuardSystemNodes.map((node, index) => <button
              id={`system-node-${node.id}`}
              key={node.id}
              type="button"
              className={`ag-system-node kind-${node.kind} ${activeIds.has(node.id) ? "is-active" : ""} ${selected.id === node.id ? "is-selected" : ""} ${kindFilter !== "all" && kindFilter !== node.kind ? "is-muted" : ""}`}
              style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
              aria-pressed={selected.id === node.id}
              onClick={() => select(node.id)}
              onKeyDown={(event) => moveNode(event, index)}
            ><i aria-hidden="true" /><span>{localize(node.shortLabel, locale)}</span><small>{kindLabels[node.kind][locale]}</small></button>)}
          </div>
          <ol className="ag-system-map__mobile-trace">
            {sequence.map((id, index) => {
              const node = agentGuardSystemNodes.find((item) => item.id === id)!;
              return <li key={id}><button type="button" className={selected.id === id ? "is-selected" : ""} onClick={() => select(id)}><span>0{index + 1}</span><strong>{localize(node.shortLabel, locale)}</strong><small>{localize(node.tracking, locale)}</small></button></li>;
            })}
          </ol>
          <div className="ag-system-map__legend">
            {flowMeta.map((item) => <span key={item.kind} className={`is-${item.kind}`}><b aria-hidden="true">{item.symbol}</b>{locale === "zh" ? item.zh : item.en}</span>)}
          </div>
        </div>

        <aside className="ag-system-map__inspector" aria-live="polite">
          <header><span>{kindLabels[selected.kind][locale]}</span><h3>{localize(selected.label, locale)}</h3></header>
          <dl>
            <div><dt>{copy.handling}</dt><dd>{localize(selected.handling, locale)}</dd></div>
            <div><dt>{copy.challenge}</dt><dd>{localize(selected.challenge, locale)}</dd></div>
            <div><dt>{copy.tracking}</dt><dd>{localize(selected.tracking, locale)}</dd></div>
            <div className="is-response"><dt>{copy.response}</dt><dd>{localize(selected.response, locale)}</dd></div>
          </dl>
          {density === "full" && <div className="ag-system-map__impact"><span>{copy.incoming}<b>{incoming}</b></span><span>{copy.outgoing}<b>{outgoing}</b></span><span>{copy.impact}<b>{incoming + outgoing}</b></span></div>}
          <button className="ag-map-play" type="button" onClick={() => running ? stop() : play()}>{running ? copy.pause : copy.replay}</button>
        </aside>
      </div>
    </section>
  );
}
