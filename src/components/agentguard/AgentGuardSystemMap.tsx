import { useMemo, useState, type KeyboardEvent } from "react";
import {
  agentGuardSystemEdges,
  agentGuardSystemNodes,
  localize,
  storyPageCopy,
  type SecurityFlowKind,
  type SystemNodeKind,
} from "../../data/agentguardStory";

type Props = { locale: "zh" | "en"; density?: "compact" | "full" };
type Point = { x: number; y: number };
type DisplayEdge = { id: string; from: string; to: string; points: Point[]; kind: SecurityFlowKind; phase: number };

const VIEWBOX = { width: 1000, height: 560 };
const compactIds = ["identity", "enterprise-data", "primary-agent", "model", "memory", "tools", "external"];
const fullIds = ["identity", "enterprise-data", "primary-agent", "subagent", "model", "memory", "tools", "mcp", "external"];
const compactLayout: Record<string, Point> = {
  identity: { x: 125, y: 105 }, "enterprise-data": { x: 125, y: 350 }, "primary-agent": { x: 375, y: 205 },
  model: { x: 575, y: 205 }, memory: { x: 575, y: 390 }, tools: { x: 790, y: 205 }, external: { x: 875, y: 390 },
};
const fullLayout: Record<string, Point> = {
  identity: { x: 105, y: 105 }, "enterprise-data": { x: 105, y: 350 }, "primary-agent": { x: 325, y: 105 },
  subagent: { x: 555, y: 105 }, model: { x: 325, y: 350 }, memory: { x: 555, y: 350 },
  tools: { x: 765, y: 105 }, mcp: { x: 765, y: 350 }, external: { x: 915, y: 350 },
};
const compactEdges: DisplayEdge[] = [
  { id: "identity-agent", from: "identity", to: "primary-agent", points: [{ x: 125, y: 105 }, { x: 250, y: 105 }, { x: 250, y: 205 }, { x: 375, y: 205 }], kind: "authorization", phase: 0 },
  { id: "data-agent", from: "enterprise-data", to: "primary-agent", points: [{ x: 125, y: 350 }, { x: 250, y: 350 }, { x: 250, y: 205 }, { x: 375, y: 205 }], kind: "data", phase: 1 },
  { id: "agent-model", from: "primary-agent", to: "model", points: [{ x: 375, y: 205 }, { x: 575, y: 205 }], kind: "authorization", phase: 2 },
  { id: "model-memory", from: "model", to: "memory", points: [{ x: 575, y: 205 }, { x: 575, y: 390 }], kind: "data", phase: 3 },
  { id: "model-tools", from: "model", to: "tools", points: [{ x: 575, y: 205 }, { x: 790, y: 205 }], kind: "effect", phase: 3 },
  { id: "tools-external", from: "tools", to: "external", points: [{ x: 790, y: 205 }, { x: 875, y: 205 }, { x: 875, y: 390 }], kind: "effect", phase: 4 },
];
const fullEdges: DisplayEdge[] = [
  { id: "identity-agent", from: "identity", to: "primary-agent", points: [{ x: 105, y: 105 }, { x: 325, y: 105 }], kind: "authorization", phase: 0 },
  { id: "data-model", from: "enterprise-data", to: "model", points: [{ x: 105, y: 350 }, { x: 325, y: 350 }], kind: "data", phase: 1 },
  { id: "agent-subagent", from: "primary-agent", to: "subagent", points: [{ x: 325, y: 105 }, { x: 555, y: 105 }], kind: "authorization", phase: 1 },
  { id: "agent-model", from: "primary-agent", to: "model", points: [{ x: 325, y: 105 }, { x: 325, y: 350 }], kind: "effect", phase: 2 },
  { id: "subagent-memory", from: "subagent", to: "memory", points: [{ x: 555, y: 105 }, { x: 555, y: 350 }], kind: "data", phase: 2 },
  { id: "model-memory", from: "model", to: "memory", points: [{ x: 325, y: 350 }, { x: 555, y: 350 }], kind: "data", phase: 3 },
  { id: "subagent-tools", from: "subagent", to: "tools", points: [{ x: 555, y: 105 }, { x: 765, y: 105 }], kind: "effect", phase: 3 },
  { id: "memory-mcp", from: "memory", to: "mcp", points: [{ x: 555, y: 350 }, { x: 765, y: 350 }], kind: "data", phase: 4 },
  { id: "tools-external", from: "tools", to: "external", points: [{ x: 765, y: 105 }, { x: 915, y: 105 }, { x: 915, y: 350 }], kind: "effect", phase: 4 },
  { id: "mcp-external", from: "mcp", to: "external", points: [{ x: 765, y: 350 }, { x: 915, y: 350 }], kind: "authorization", phase: 5 },
];
const flowMeta: Array<{ kind: SecurityFlowKind; symbol: string; zh: string; en: string }> = [
  { kind: "data", symbol: "●", zh: "数据", en: "Data" }, { kind: "authorization", symbol: "◆", zh: "授权", en: "Authorization" }, { kind: "effect", symbol: "■", zh: "动作影响", en: "Action effect" },
];
const kindOrder: SystemNodeKind[] = ["identity", "agent", "model", "data", "memory", "tool", "mcp", "external-system"];
const kindLabels: Record<SystemNodeKind, { zh: string; en: string }> = {
  identity: { zh: "身份", en: "Identity" }, agent: { zh: "智能体", en: "Agent" }, model: { zh: "模型", en: "Model" }, data: { zh: "数据", en: "Data" }, memory: { zh: "Memory", en: "Memory" }, tool: { zh: "工具与 MCP", en: "Tools & MCP" }, mcp: { zh: "MCP", en: "MCP" }, "external-system": { zh: "外部系统", en: "External" },
};
const pathFromPoints = (points: Point[]) => points.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join(" ");

export default function AgentGuardSystemMap({ locale, density = "full" }: Props) {
  const copy = storyPageCopy[locale].map;
  const [selectedId, setSelectedId] = useState("external");
  const [kindFilter, setKindFilter] = useState<SystemNodeKind | "all">("all");
  const ids = density === "compact" ? compactIds : fullIds;
  const layout = density === "compact" ? compactLayout : fullLayout;
  const edges = density === "compact" ? compactEdges : fullEdges;
  const nodes = useMemo(() => agentGuardSystemNodes.filter((node) => ids.includes(node.id)), [density]);
  const visibleNodes = useMemo(() => kindFilter === "all" ? nodes : nodes.filter((node) => node.kind === kindFilter), [nodes, kindFilter]);
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[nodes.length - 1];
  const select = (id: string) => {
    setSelectedId(id);
  };
  const moveNode = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = Math.max(0, visibleNodes.findIndex((node) => node.id === selected.id));
    const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const next = event.key === "Home" ? 0 : event.key === "End" ? visibleNodes.length - 1 : (current + delta + visibleNodes.length) % visibleNodes.length;
    select(visibleNodes[next].id);
    requestAnimationFrame(() => document.getElementById(`system-node-${density}-${visibleNodes[next].id}`)?.focus());
  };
  const incoming = agentGuardSystemEdges.filter((edge) => edge.to === selected.id).length;
  const outgoing = agentGuardSystemEdges.filter((edge) => edge.from === selected.id).length;
  const intervention = locale === "zh" ? {
    found: "敏感数据将进入外部系统", action: "移除客户身份与合同字段，保留管理结论", result: "分析继续 · 外发合规 · 全程留痕",
  } : { found: "Sensitive data is about to enter an external system", action: "Remove customer identity and contract fields while preserving management findings", result: "Analysis continues · compliant egress · fully audited" };

  return <section className={`ag-system-map density-${density}`} aria-label={copy.title} data-running="false">
    <header className="ag-system-map__bar"><div className="ag-runtime-mark"><b>AG</b><span><strong>AgentGuard</strong><small>{copy.runtime}</small></span></div><em>{locale === "zh" ? "节点检查视图" : "Node inspection view"}</em></header>
    {density === "full" && <div className="ag-system-map__filters" aria-label={copy.select}><button type="button" className={kindFilter === "all" ? "is-active" : ""} onClick={() => setKindFilter("all")}>{locale === "zh" ? "全部" : "All"}</button>{kindOrder.map((kind) => <button type="button" key={kind} className={kindFilter === kind ? "is-active" : ""} onClick={() => setKindFilter(kind)}>{kindLabels[kind][locale]}</button>)}</div>}
    <div className="ag-system-map__workspace">
      <div className="ag-system-map__canvas">
        <svg viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`} role="img" aria-label={locale === "zh" ? "数据、授权与动作影响在企业智能体系统中的传播路径" : "Data, authorization, and action-effect propagation through an enterprise agent system"}>
          <defs><marker id={`ag-arrow-${density}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" /></marker></defs>
          <rect className="ag-runtime-boundary" x="35" y="40" width="930" height="465" rx="42" /><text className="ag-runtime-boundary-label" x="60" y="70">AGENTGUARD INTERACTION BOUNDARY RUNTIME</text>
          {edges.map((edge) => { const path = pathFromPoints(edge.points); return <g key={edge.id} className="is-active"><path className={`ag-map-edge is-${edge.kind}`} d={path} markerEnd={`url(#ag-arrow-${density})`} /></g>; })}
        </svg>
        <div className="ag-system-map__nodes">{nodes.map((node) => { const point = layout[node.id]; return <button id={`system-node-${density}-${node.id}`} key={node.id} type="button" className={`ag-system-node kind-${node.kind} is-active ${selected.id === node.id ? "is-selected" : ""} ${kindFilter !== "all" && kindFilter !== node.kind ? "is-muted" : ""}`} style={{ left: `${point.x / VIEWBOX.width * 100}%`, top: `${point.y / VIEWBOX.height * 100}%` }} aria-pressed={selected.id === node.id} onClick={() => select(node.id)} onKeyDown={moveNode}><i aria-hidden="true" /><span>{density === "compact" && node.id === "tools" ? (locale === "zh" ? "工具与 MCP" : "Tools & MCP") : localize(node.shortLabel, locale)}</span><small>{kindLabels[node.kind][locale]}</small></button>; })}</div>
        <ol className="ag-system-map__mobile-trace">{nodes.map((node, index) => <li key={node.id}><button type="button" className={selected.id === node.id ? "is-selected" : ""} onClick={() => select(node.id)}><span>0{index + 1}</span><strong>{density === "compact" && node.id === "tools" ? (locale === "zh" ? "工具与 MCP" : "Tools & MCP") : localize(node.shortLabel, locale)}</strong><small>{localize(node.tracking, locale)}</small></button></li>)}</ol>
        <div className="ag-system-map__legend">{flowMeta.map((item) => <span key={item.kind} className={`is-${item.kind}`}><b aria-hidden="true">{item.symbol}</b>{locale === "zh" ? item.zh : item.en}</span>)}</div>
      </div>
      <aside className="ag-system-map__inspector" aria-live="polite">
        {selected.id === "external" ? <><header><span>AGENTGUARD</span><strong className="ag-system-map__inspector-title">{locale === "zh" ? "外发边界保护" : "Egress boundary protection"}</strong></header><dl className="ag-system-map__decision"><div><dt>{locale === "zh" ? "AgentGuard 发现" : "AgentGuard detects"}</dt><dd>{intervention.found}</dd></div><div className="is-response"><dt>{locale === "zh" ? "AgentGuard 处置" : "AgentGuard response"}</dt><dd>{intervention.action}</dd></div><div className="is-result"><dt>{locale === "zh" ? "业务结果" : "Business result"}</dt><dd>{intervention.result}</dd></div></dl></> : <><header><span>{kindLabels[selected.kind][locale]}</span><strong className="ag-system-map__inspector-title">{localize(selected.label, locale)}</strong></header><dl><div><dt>{copy.handling}</dt><dd>{localize(selected.handling, locale)}</dd></div><div><dt>{copy.challenge}</dt><dd>{localize(selected.challenge, locale)}</dd></div><div><dt>{copy.tracking}</dt><dd>{localize(selected.tracking, locale)}</dd></div><div className="is-response"><dt>{copy.response}</dt><dd>{localize(selected.response, locale)}</dd></div></dl></>}
        {density === "full" && <div className="ag-system-map__impact"><span>{copy.incoming}<b>{incoming}</b></span><span>{copy.outgoing}<b>{outgoing}</b></span><span>{copy.impact}<b>{incoming + outgoing}</b></span></div>}
      </aside>
    </div>
  </section>;
}
