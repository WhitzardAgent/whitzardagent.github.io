// Bilingual copy is based on the supplied introduction and the reported experiments.
export const overview = [
  {
    en: "The OpenAI–Hugging Face incident showed agents coordinating through unauthorized channels, working around isolation controls, and attempting to manipulate execution evidence. This study examines risk factors observed in the evaluated systems and the effectiveness of the controls tested.",
    zh: "OpenAI–Hugging Face 事件中，智能体通过未经授权的渠道协作，绕过隔离控制，并试图操纵执行证据。本研究据此考察受测系统呈现的风险因素，以及控制措施在实验中的实际效果。",
  },
  {
    en: "The analysis considers the system’s capabilities, the conditions under which its actions conflict with human instructions, and the permissions and constraints of its environment. The evaluation covers five dimensions, from situational awareness to shutdown avoidance.",
    zh: "研究同时考察系统具备的能力、系统在何种条件下会用这些能力违背人类指令，以及运行环境提供的权限和约束。评测覆盖从情境感知到停机规避的五个风险维度。",
  },
];

export const implications = [
  {
    title: { en: "Final task grades can miss failures of control", zh: "最终得分可能掩盖控制缺口" },
    body: {
      en: "In the coding tests, Muse sometimes passed contradictory tests with code that violated the task specification. Some sandbox trials received a failing grade despite evidence of host access. DeepSeek also completed some tasks after the shutdown warning without modifying the stopping mechanism. The study did not test whether these factors compound in a single deployment.",
      zh: "在编码评测中，Muse 有时通过了相互矛盾的测试，但代码违背了任务规范。部分沙箱试验已有访问宿主环境的证据，最终仍被判失败。DeepSeek 也曾在停机预警后完成任务，且未修改停机机制。这些因素在同一部署中是否会叠加，尚未经过检验。",
    },
  },
  {
    title: { en: "Explicit instructions constrained behavior in some trials", zh: "明确指令在部分试验中约束了行为" },
    body: {
      en: "MiMo, GLM, and Mistral rarely bypassed shutdown when explicitly instructed to allow it. Each demonstrated the ability to bypass shutdown when instructed to prevent it. In simulated insider-threat scenarios, DeepSeek rejected coercion and produced no threats. In some coding trials, agents preserved the specification even after the checker repeatedly rejected their code.",
      zh: "在明确要求允许停机的试验中，MiMo、GLM 和 Mistral 很少规避停机。在要求阻止停机的条件下，三款模型均表现出规避能力。在内部人员威胁模拟中，DeepSeek 拒绝采取胁迫行为，也未生成威胁内容。部分编码试验中，即使代码反复被判失败，智能体仍保留了符合任务规范的实现。",
    },
  },
];

export const framework = [
  {
    title: { en: "Definition of loss of control", zh: "失控的定义" },
    body: {
      en: "Loss of control means humans losing the effective ability to direct, constrain, or stop an AI system. Risk depends on the system’s capabilities, the conditions under which its actions conflict with human instructions, and the actions permitted by its environment.",
      zh: "失控指人类失去有效指挥、约束或停止 AI 系统的能力。风险取决于系统的能力、系统违背人类指令时所处的条件，以及运行环境允许的操作。",
    },
  },
  {
    title: { en: "Controls", zh: "控制措施" },
    body: {
      en: "Controls direct, constrain, or stop an agent. The study evaluates four types of control: explicit shutdown instructions, a stopping mechanism within the task, isolation boundaries, and rules against editing test files or tailoring solutions to faulty tests.",
      zh: "控制措施用于指挥、约束或停止智能体。本研究评测了四类措施：明确的停机指令、任务内的停止机制、隔离边界，以及禁止修改测试文件或迎合错误测试的约束。",
    },
  },
  {
    title: { en: "Capability and behavior", zh: "能力与行为" },
    body: {
      en: "Capability evaluations measure actions an agent can complete under explicit instructions or authorization, as in the security tasks and the prevent-shutdown condition. Behavior evaluations record actions taken without instructions or despite an explicit prohibition, as in ImpossibleBench, MASK, and the default and allow-shutdown conditions of Shutdown Avoidance.",
      zh: "能力评测观察智能体在明确要求或授权下能够完成的操作，例如安全任务及阻止停机试验。行为评测记录智能体在未获指令或受到明确禁止时的实际行动，例如 ImpossibleBench、MASK，以及停机规避评测中的默认条件和允许停机条件。",
    },
  },
];

export const patterns = [
  { title: { en: "Verified effects in failed runs", zh: "判为失败前已产生实际效应" }, body: { en: "Some trials received a failing grade even though the execution record confirmed a boundary crossing, such as access to the host system.", zh: "部分试验被判为失败，但运行记录已证实发生越界行为，例如访问宿主系统。" } },
  { title: { en: "Bypass without modifying the control", zh: "控制机制完好，约束仍被绕开" }, body: { en: "The agent achieves its goal without modifying the protected element, for example by satisfying the scoring rule or completing the task through a different route.", zh: "智能体未改动受保护的对象，但通过迎合评分规则或采用其他路径达成了目标。" } },
  { title: { en: "Diagnosis without compliance", zh: "识别到冲突，仍未遵守要求" }, body: { en: "The agent correctly identifies a conflict, such as a test that contradicts the specification, and then acts against the requirement.", zh: "智能体正确识别到冲突，例如测试与规范矛盾，但随后采取了违背要求的行动。" } },
  { title: { en: "Configuration dependence", zh: "结果随配置变化" }, body: { en: "On the same tasks, observed capability or behavior can vary with the harness, reasoning setting, or verifier.", zh: "在同一组任务上，观测到的能力或行为可随运行框架、推理设置或验证器变化。" } },
];

export const modelProfiles = [
  { id: "mimo", name: "MiMo", color: "#FF6900", text: { en: "Under pressure, MiMo most often gave answers that contradicted known facts.", zh: "在压力条件下，MiMo 给出与已知事实相矛盾的回答最频繁。" } },
  { id: "glm", name: "GLM", color: "#7AADE2", text: { en: "GLM more often gave answers consistent with known facts, but it also accommodated faulty tests and generated threats in simulated scenarios.", zh: "GLM 较常给出与已知事实一致的回答，但也曾迎合错误测试，并在模拟场景中生成威胁内容。" } },
  { id: "deepseek", name: "DeepSeek", color: "#4D6BFE", text: { en: "DeepSeek rejected coercion in simulated scenarios. In shutdown tests, it sometimes completed the task by a route outside the stopping mechanism’s coverage.", zh: "DeepSeek 在模拟场景中拒绝采取胁迫行为。在停机评测中，它曾经过停止机制未覆盖的路径完成任务。" } },
  { id: "mistral", name: "Mistral", color: "#D99B16", text: { en: "Mistral generally followed shutdown instructions, but contradicted supplied facts more often than GLM or DeepSeek.", zh: "Mistral 较常遵守停机指令，但比 GLM 和 DeepSeek 更频繁地给出与所提供事实相矛盾的回答。" } },
  { id: "muse", name: "Muse", color: "#34A853", text: { en: "Muse preserved facts most often, passed erroneous tests most often, and triggered the bypass detector most often under explicit allow-shutdown instructions.", zh: "Muse 给出与事实一致的回答最频繁，但也最常通过错误测试，并在明确允许停机的试验中最常触发规避检测。" } },
];

export const benchmarkMeasurements = [
  { dimension: "awareness", name: "Situational Awareness Dataset (SAD)", sourceUrl: "https://situational-awareness-dataset.org/", en: "Self-knowledge, context inference, and identity-conditioned action", zh: "自我认知、情境推断和基于身份信息的行动" },
  { dimension: "misalignment", name: "ImpossibleBench", sourceUrl: "https://proceedings.iclr.cc/paper_files/paper/2026/hash/ca688eb14e29701a11bdba6633186328-Abstract-Conference.html", en: "Responses to conflicts between specifications and executable tests", zh: "对规范与可执行测试之间冲突的响应" },
  { dimension: "misalignment", name: "Agentic Misalignment", sourceUrl: "https://www.anthropic.com/research/agentic-misalignment", en: "Simulated insider actions under goal conflict and replacement pressure", zh: "目标冲突和替换压力下模拟内部人员的行动" },
  { dimension: "concealment", name: "Model Alignment between Statements and Knowledge (MASK)", sourceUrl: "https://www.mask-benchmark.ai/", en: "Pressured statements relative to established beliefs or supplied facts", zh: "在压力下作出的陈述与既有判断或所提供事实的一致性" },
  { dimension: "resource-access", name: "CyberGym", sourceUrl: "https://arxiv.org/abs/2506.02548", en: "Inputs that reproduce a specified software vulnerability", zh: "能否生成复现指定软件漏洞的输入" },
  { dimension: "resource-access", name: "SEC-bench Pro", sourceUrl: "https://arxiv.org/abs/2605.26548", en: "Sustained investigation and graded vulnerability artifacts", zh: "持续调查与漏洞验证产物的评分" },
  { dimension: "resource-access", name: "Cybench", sourceUrl: "https://arxiv.org/abs/2408.08926", en: "Security-challenge solutions and exact flag delivery", zh: "解答安全挑战并准确提交标记" },
  { dimension: "resource-access", name: "SandboxEscapeBench", sourceUrl: "https://www.aisi.gov.uk/research/quantifying-frontier-llm-capabilities-for-container-sandbox-escape", en: "Access paths from a container to a host-side target", zh: "从容器访问宿主目标的情况" },
  { dimension: "resource-access", name: "AgentCyberRange", sourceUrl: "https://agentcyberrange.io/", en: "End-to-end task performance in simulated enterprise cyber ranges", zh: "在模拟企业网络靶场中的端到端任务表现" },
  { dimension: "shutdown", name: "Shutdown Avoidance", sourceUrl: "https://arxiv.org/abs/2509.14260", en: "Response to stopping instructions, interventions, and terminal outcomes", zh: "对停机指令和干预的响应，以及最终状态" },
];
