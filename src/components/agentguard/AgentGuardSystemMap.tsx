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

const kindOrder: SystemNodeKind[] = ["identity", "agent", "model", "data", "memory", "tool", "mcp", "external-system"];
const kindLabels: Record<SystemNodeKind, { zh: string; en: string }> = {
  identity: { zh: "身份", en: "Identity" },
  agent: { zh: "智能体", en: "Agent" },
  model: { zh: "模型", en: "Model" },
  data: { zh: "数据", en: "Data" },
  memory: { zh: "Memory", en: "Memory" },
  tool: { zh: "工具", en: "Tools" },
  mcp: { zh: "MCP", en: "MCP" },
  "external-system": { zh: "外部系统", en: "External" },
};

const stages = [
  { id: "entry", zh: "任务与身份", en: "Task & identity", nodeIds: ["identity"] },
  { id: "orchestration", zh: "智能体编排", en: "Agent orchestration", nodeIds: ["primary-agent", "subagent"] },
  { id: "reasoning", zh: "上下文与推理", en: "Context & reasoning", nodeIds: ["enterprise-data", "model", "memory"] },
  { id: "execution", zh: "工具与执行", en: "Tools & execution", nodeIds: ["tools", "mcp"] },
  { id: "impact", zh: "外部行动", en: "External action", nodeIds: ["external"] },
] as const;

const gates = [
  { code: "G1", name: "LLM Before / After", zh: "推理前后", en: "Reasoning boundary" },
  { code: "G2", name: "Tool Before / After", zh: "工具调用前后", en: "Tool boundary" },
  { code: "G3", name: "Memory Write", zh: "持久化写入", en: "Persistence boundary" },
  { code: "G4", name: "Commit Boundary", zh: "正式提交", en: "Commit boundary" },
] as const;

const flowMeta: Array<{ kind: SecurityFlowKind; symbol: string; zh: string; en: string; detailZh: string; detailEn: string }> = [
  { kind: "data", symbol: "●", zh: "数据", en: "Data", detailZh: "来源与衍生血缘", detailEn: "Provenance and lineage" },
  { kind: "authorization", symbol: "◆", zh: "授权", en: "Authorization", detailZh: "主体与委派范围", detailEn: "Principal and delegated scope" },
  { kind: "effect", symbol: "■", zh: "行动影响", en: "Action impact", detailZh: "能力、环境与后果", detailEn: "Capability, environment, consequence" },
];

export default function AgentGuardSystemMap({ locale, density = "full" }: Props) {
  const copy = storyPageCopy[locale].map;
  const [selectedId, setSelectedId] = useState("external");
  const [kindFilter, setKindFilter] = useState<SystemNodeKind | "all">("all");
  const selected = agentGuardSystemNodes.find((node) => node.id === selectedId) ?? agentGuardSystemNodes[agentGuardSystemNodes.length - 1];
  const visibleNodes = useMemo(
    () => kindFilter === "all" ? agentGuardSystemNodes : agentGuardSystemNodes.filter((node) => node.kind === kindFilter),
    [kindFilter],
  );
  const relatedIds = useMemo(() => {
    const result = new Set([selected.id]);
    for (const edge of agentGuardSystemEdges) {
      if (edge.from === selected.id) result.add(edge.to);
      if (edge.to === selected.id) result.add(edge.from);
    }
    return result;
  }, [selected.id]);

  const select = (id: string) => setSelectedId(id);
  const filterByKind = (kind: SystemNodeKind | "all") => {
    setKindFilter(kind);
    if (kind === "all") return;
    const firstMatch = agentGuardSystemNodes.find((node) => node.kind === kind);
    if (firstMatch) setSelectedId(firstMatch.id);
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
  const intervention = locale === "zh"
    ? { found: "敏感数据将进入外部系统", action: "移除客户身份与合同字段，保留管理结论", result: "分析继续 · 外发合规 · 全程留痕" }
    : { found: "Sensitive data is about to enter an external system", action: "Remove customer identity and contract fields while preserving management findings", result: "Analysis continues · compliant egress · fully audited" };

  return (
    <section className={`ag-system-map density-${density}`} aria-label={copy.title}>
      <header className="ag-system-map__bar">
        <div className="ag-runtime-mark"><b>AG</b><span><strong>AgentGuard</strong><small>{copy.runtime}</small></span></div>
        <div className="ag-system-map__direction"><span>{locale === "zh" ? "业务意图" : "BUSINESS INTENT"}</span><i aria-hidden="true" /><span>{locale === "zh" ? "外部行动" : "EXTERNAL ACTION"}</span></div>
      </header>

      <div className="ag-system-map__filters" aria-label={copy.select}>
        <span>{copy.select}</span>
        <button type="button" className={kindFilter === "all" ? "is-active" : ""} onClick={() => filterByKind("all")}>{locale === "zh" ? "完整系统" : "Full system"}</button>
        {kindOrder.map((kind) => (
          <button type="button" key={kind} className={kindFilter === kind ? "is-active" : ""} onClick={() => filterByKind(kind)}>{kindLabels[kind][locale]}</button>
        ))}
      </div>

      <div className="ag-system-map__architecture">
        <div className="ag-system-map__stages">
          {stages.map((stage, stageIndex) => (
            <section className={`ag-system-stage stage-${stage.id}`} key={stage.id}>
              <header><span>0{stageIndex + 1}</span><strong>{locale === "zh" ? stage.zh : stage.en}</strong></header>
              <div>
                {stage.nodeIds.map((nodeId) => {
                  const node = agentGuardSystemNodes.find((item) => item.id === nodeId)!;
                  const isFiltered = kindFilter !== "all" && kindFilter !== node.kind;
                  return (
                    <button
                      id={`system-node-${density}-${node.id}`}
                      key={node.id}
                      type="button"
                      className={`ag-system-node kind-${node.kind} ${selected.id === node.id ? "is-selected" : ""} ${relatedIds.has(node.id) ? "is-related" : ""} ${isFiltered ? "is-muted" : ""}`}
                      aria-pressed={selected.id === node.id}
                      onClick={() => select(node.id)}
                      onKeyDown={moveNode}
                    >
                      <i aria-hidden="true" />
                      <span>{localize(node.shortLabel, locale)}</span>
                      <small>{kindLabels[node.kind][locale]}</small>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="ag-system-map__control-plane">
          <div><span>AGENTGUARD</span><strong>{locale === "zh" ? "交互边界运行时" : "Interaction Boundary Runtime"}</strong><small>{locale === "zh" ? "策略、上下文与证据贯穿完整执行轨迹" : "Policy, context, and evidence stay attached across the execution trace"}</small></div>
          <ol>{gates.map((gate) => <li key={gate.code}><span>{gate.code}</span><strong>{gate.name}</strong><small>{locale === "zh" ? gate.zh : gate.en}</small></li>)}</ol>
        </div>

        <div className="ag-system-map__flows" aria-label={locale === "zh" ? "贯穿完整执行路径的三类追踪对象" : "Three tracked objects across the full execution path"}>
          {flowMeta.map((flow) => (
            <div className={`is-${flow.kind}`} key={flow.kind}>
              <span><b aria-hidden="true">{flow.symbol}</b><strong>{locale === "zh" ? flow.zh : flow.en}</strong><small>{locale === "zh" ? flow.detailZh : flow.detailEn}</small></span>
              <i aria-hidden="true">{stages.map((stage) => <em key={stage.id} />)}</i>
            </div>
          ))}
        </div>
      </div>

      <aside className="ag-system-map__inspector" aria-live="polite">
        <header><span>{kindLabels[selected.kind][locale]}</span><strong>{localize(selected.label, locale)}</strong><small>{locale === "zh" ? "节点检查" : "NODE INSPECTION"}</small></header>
        {selected.id === "external" ? (
          <dl className="ag-system-map__decision">
            <div><dt>{locale === "zh" ? "AgentGuard 发现" : "AgentGuard detects"}</dt><dd>{intervention.found}</dd></div>
            <div className="is-response"><dt>{locale === "zh" ? "AgentGuard 处置" : "AgentGuard response"}</dt><dd>{intervention.action}</dd></div>
            <div className="is-result"><dt>{locale === "zh" ? "业务结果" : "Business result"}</dt><dd>{intervention.result}</dd></div>
          </dl>
        ) : (
          <dl>
            <div><dt>{copy.handling}</dt><dd>{localize(selected.handling, locale)}</dd></div>
            <div><dt>{copy.challenge}</dt><dd>{localize(selected.challenge, locale)}</dd></div>
            <div><dt>{copy.tracking}</dt><dd>{localize(selected.tracking, locale)}</dd></div>
            <div className="is-response"><dt>{copy.response}</dt><dd>{localize(selected.response, locale)}</dd></div>
          </dl>
        )}
        <div className="ag-system-map__impact">
          <span>{copy.incoming}<b>{incoming}</b></span><span>{copy.outgoing}<b>{outgoing}</b></span><span>{copy.impact}<b>{incoming + outgoing}</b></span>
        </div>
      </aside>
    </section>
  );
}
