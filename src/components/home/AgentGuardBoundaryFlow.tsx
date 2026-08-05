import { useEffect, useRef, useState } from "react";

type Props = { locale: "en" | "zh" };

const copy = {
  zh: {
    title: "AgentGuard 交互边界运行时",
    status: "持续保护中",
    taskLabel: "业务任务",
    task: "汇总重点客户续约风险，并将管理摘要发送给获批外部顾问",
    runtimeLabel: "智能体执行闭环",
    stages: ["业务目标", "Agent 规划", "LLM 推理", "工具调用", "Observation", "Agent 再规划", "外部行动"],
    details: ["续约风险分析", "拆解任务与选择工具", "生成检索与分析计划", "CRM · 合同 · 知识库", "结果回传并更新上下文", "生成管理摘要", "HTTP 发送获批顾问"],
    gates: ["LLM Before / After", "Tool Before / After", "Memory Write", "Commit Boundary"],
    tracks: [
      ["data", "数据链", "客户身份 · 合同字段 · 衍生摘要"],
      ["authorization", "授权链", "运营智能体 · 单次任务 · 获批目标"],
      ["effect", "动作影响", "读取 → 生成 → 外发"],
    ],
    conflict: "敏感字段即将进入外部系统",
    response: "字段脱敏 · 重新检查 · 安全放行",
    result: "分析继续 · 外发合规 · 全程留痕",
    pause: "暂停",
    continue: "继续",
    replay: "重新演示",
  },
  en: {
    title: "AgentGuard Interaction Boundary Runtime",
    status: "Continuous protection",
    taskLabel: "Business task",
    task: "Summarize renewal risk and send a management brief to an approved external advisor",
    runtimeLabel: "Agent execution loop",
    stages: ["Business goal", "Agent planning", "LLM reasoning", "Tool calls", "Observation", "Agent re-planning", "External action"],
    details: ["Renewal analysis", "Decompose task and select tools", "Build retrieval and analysis plan", "CRM · contract · knowledge", "Return results into context", "Generate management brief", "HTTP to approved advisor"],
    gates: ["LLM Before / After", "Tool Before / After", "Memory Write", "Commit Boundary"],
    tracks: [
      ["data", "Data chain", "Identity · contract fields · derived summary"],
      ["authorization", "Authorization", "Operations agent · single task · approved target"],
      ["effect", "Action effect", "Read → create → send"],
    ],
    conflict: "Sensitive fields are about to cross an external boundary",
    response: "Redact fields · recheck payload · allow safe output",
    result: "Analysis continues · compliant egress · fully audited",
    pause: "Pause",
    continue: "Continue",
    replay: "Replay",
  },
} as const;

export default function AgentGuardBoundaryFlow({ locale }: Props) {
  const text = copy[locale];
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const running = inView && !paused;

  return (
    <section
      ref={root}
      className="boundary-flow"
      data-running={running ? "true" : "false"}
      aria-label={text.title}
    >
      <header className="boundary-flow__bar">
        <div>
          <b aria-hidden="true">AG</b>
          <span><strong>AgentGuard</strong><small>{text.title}</small></span>
        </div>
        <span className="boundary-flow__status"><i aria-hidden="true" />{text.status}</span>
      </header>

      <div className="boundary-flow__task">
        <span>{text.taskLabel}</span>
        <p>{text.task}</p>
      </div>

      <div className="boundary-flow__runtime" key={cycle}>
        <div className="boundary-flow__lane-labels" aria-hidden="true">
          <span>{locale === "zh" ? "任务输入" : "TASK INPUT"}</span>
          <strong>{text.runtimeLabel}</strong>
          <span>{locale === "zh" ? "外部边界" : "EXTERNAL BOUNDARY"}</span>
        </div>
        <div className="boundary-flow__path">
          {text.stages.map((stage, index) => (
            <div className="boundary-flow__path-item" key={stage}>
              <article className={index === 0 ? "is-entry" : index === 6 ? "is-external" : index === 1 || index === 5 ? "is-agent" : ""}>
                <span>0{index + 1}</span>
                <strong>{stage}</strong>
                <small>{text.details[index]}</small>
              </article>
              {index < text.stages.length - 1 && (
                <div className={`boundary-flow__connector connector-${index + 1}`} aria-hidden="true">
                  <i />
                  <b />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="boundary-flow__agentguard">
          <div><b>AgentGuard</b><span>{locale === "zh" ? "贯穿智能体执行过程的交互边界运行时" : "Interaction boundary runtime across the agent loop"}</span></div>
          <ul>{text.gates.map((gate, index) => <li key={gate}><span>G{index + 1}</span>{gate}</li>)}</ul>
        </div>
      </div>

      <div className="boundary-flow__tracks" aria-label={locale === "zh" ? "AgentGuard 追踪对象" : "Objects tracked by AgentGuard"}>
        {text.tracks.map(([kind, label, value]) => (
          <div className={`boundary-flow__track is-${kind}`} key={kind}>
            <i aria-hidden="true" />
            <strong>{label}</strong>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div className="boundary-flow__decision">
        <div><span>{locale === "zh" ? "发现" : "Detected"}</span><strong>{text.conflict}</strong></div>
        <div className="is-response"><span>AgentGuard</span><strong>{text.response}</strong></div>
        <p>{text.result}</p>
      </div>

      <div className="boundary-flow__controls">
        <button type="button" onClick={() => setPaused((value) => !value)}>{paused ? text.continue : text.pause}</button>
        <button type="button" onClick={() => { setCycle((value) => value + 1); setPaused(false); }}>{text.replay}</button>
      </div>
    </section>
  );
}
