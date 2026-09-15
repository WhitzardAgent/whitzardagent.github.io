import type { Locale } from "../../i18n/config";
import type { AgentGuardCopy } from "../../i18n/pages/agentguard";

type Props = {
  locale: Locale;
  nodes: AgentGuardCopy["deployment"]["nodes"];
  modes: AgentGuardCopy["deployment"]["modes"];
};

export default function DeploymentArchitecture({ locale, nodes, modes }: Props) {
  const zh = locale === "zh";
  const coverage = zh
    ? ["身份与委派", "任务上下文", "工具与 MCP", "数据血缘", "Memory 来源", "外部行动"]
    : ["Identity & delegation", "Task context", "Tools & MCP", "Data lineage", "Memory provenance", "External action"];
  const phases = zh
    ? ["执行前检查", "运行时防护", "事后审计"]
    : ["Pre-execution checks", "Runtime protection", "Post-execution audit"];

  return (
    <div className="ag-trust" aria-label={zh ? "AgentGuard 企业信任边界部署架构" : "AgentGuard enterprise trust-boundary architecture"}>
      <header className="ag-trust__header">
        <div><span>{zh ? "企业信任边界" : "ENTERPRISE TRUST BOUNDARY"}</span><strong>{zh ? "安全中间层" : "SECURITY CONTROL LAYER"}</strong></div>
        <small>{zh ? "策略、轨迹与证据留在企业环境" : "Policy, traces, and evidence stay in your environment"}</small>
      </header>

      <div className="ag-trust__body">
        <section className="ag-trust__stack">
          <header><span>01</span><strong>{zh ? "智能体业务与执行环境" : "AGENT WORKLOADS & EXECUTION"}</strong></header>
          <div className="ag-trust__workload">
            <span>{nodes[0]}</span>
            <i aria-hidden="true">→</i>
            <span>{nodes[1]}</span>
          </div>
          <div className="ag-trust__runtime">
            <div><span>AGENTGUARD</span><strong>{nodes[2]}</strong></div>
            <p>{zh ? "在模型与工具执行前后形成连续控制" : "Continuous control before and after model and tool execution"}</p>
            <ol>{phases.map((phase, index) => <li key={phase}><span>0{index + 1}</span><strong>{phase}</strong></li>)}</ol>
          </div>
          <div className="ag-trust__foundation">
            <span>{nodes[3]}</span>
            <span>{nodes[4]}</span>
          </div>
          <span className="ag-trust__signal" aria-hidden="true"></span>
        </section>

        <aside className="ag-trust__matrix">
          <header><span>02</span><strong>{zh ? "完整上下文覆盖" : "FULL-CONTEXT COVERAGE"}</strong></header>
          <div className="ag-trust__coverage">{coverage.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div>
          <div className="ag-trust__judgment"><span>{zh ? "协同研判" : "JOINT JUDGMENT"}</span><strong>DSL × Safety Model</strong><small>{zh ? "按最小必要原则执行处置" : "Apply the minimum necessary control"}</small></div>
        </aside>
      </div>

      <footer className="ag-trust__modes">
        {modes.map((mode, index) => <div key={mode.title}><span>0{index + 1}</span><strong>{mode.title}</strong><p>{mode.body}</p></div>)}
      </footer>
    </div>
  );
}
