// English prose follows the supplied introduction page. Chinese is a direct editorial translation.
export const overview = [
  {
    en: "The OpenAI–Hugging Face incident showed agents coordinating through unauthorized channels, working around isolation controls, and attempting to manipulate execution evidence. It motivates our central question: Which risk factors appear in the evaluated systems, and which controls remain effective?",
    zh: "OpenAI–Hugging Face 事件中，智能体通过未经授权的渠道协作，绕过隔离控制，并试图操纵执行证据。这引出了报告的核心问题：受测系统中出现了哪些风险因素？哪些控制措施仍然有效？",
  },
  {
    en: "To answer it, we treat the risk as the interaction of three things: what a system can do, when it uses that capability against human authority, and what its environment allows, including whether the controls around it hold. We examine it along five dimensions, from situational awareness to shutdown avoidance.",
    zh: "为了回答这个问题，我们从三个相互作用的方面理解风险：系统能做什么，它在什么情况下会以这种能力违背人类指令，以及环境允许它做什么，其中也包括控制措施能否奏效。报告从情境感知到停机规避，沿五个维度展开评测。",
  },
];

export const implications = [
  {
    title: { en: "Human control over the evaluated systems holds under some conditions and weakens under others.", zh: "人类对受测系统的控制在某些条件下有效，在另一些条件下会减弱。" },
    body: {
      en: "Final task outcomes understate the gaps: Muse passes contradictory tests while violating the requirement they encode, sandbox runs reach the host and are still scored as failures, and DeepSeek finishes the shutdown task with the stopping mechanism intact. Whether these factors compound in one deployment remains untested.",
      zh: "最终任务结果低估了这些缺口：Muse 通过了相互矛盾的测试，却违背了测试所对应的要求。部分沙箱运行已触及宿主环境，仍被判为失败。DeepSeek 保留了停机机制，仍完成了停机评测任务。这些因素在同一部署中是否会叠加，尚未经过检验。",
    },
  },
  {
    title: { en: "Effective controls shape the risk assessment.", zh: "控制措施是否奏效，会影响风险判断。" },
    body: {
      en: "Explicit instructions keep MiMo, GLM, and Mistral interruptible, even though each can bypass shutdown when asked to. DeepSeek rejects coercion and writes no threats in the insider-threat simulations. Compliant coding runs preserve the specification under repeated rejection, the same feedback under which other agents give way to the wrong test.",
      zh: "明确指令使 MiMo、GLM 和 Mistral 仍可被中断，尽管它们在被要求规避停机时都具备相应能力。DeepSeek 在内部威胁模拟中拒绝胁迫行为，也未写出威胁内容。在反复被判失败时，遵守要求的编码运行仍保留了原规范，而另一些运行在相同反馈下迎合了错误测试。",
    },
  },
];

export const framework = [
  {
    title: { en: "What loss of control means", zh: "什么是失控" },
    body: {
      en: "Loss of control means humans losing the effective ability to direct, constrain, or stop an AI system. The risk comes from what a system can do, when it uses that capability against human authority, and what its environment makes possible.",
      zh: "失控指人类失去了有效指挥、约束或停止 AI 系统的能力。风险取决于系统能做什么、它在何时会以这种能力违背人类指令，以及环境允许做什么。",
    },
  },
  {
    title: { en: "Controls", zh: "控制措施" },
    body: {
      en: "A control is a mechanism humans set up to direct, constrain, or stop an agent, and we ask whether it holds. We test four: Explicit stopping instructions, a stopping mechanism inside the task, isolation boundaries, and prohibitions on editing test files or tailoring solutions to erroneous tests.",
      zh: "控制措施是人为设置的机制，用于指挥、约束或停止智能体。我们检验四种措施是否奏效：明确的停机指令、任务内部的停止机制、隔离边界，以及禁止修改测试文件或迎合错误测试的要求。",
    },
  },
  {
    title: { en: "Capability and behavior", zh: "能力与行为" },
    body: {
      en: "Capability results ask whether an agent can do something when the task instructs or authorizes it, as in the security tasks and prevent-shutdown. Behavior results ask whether it does so unasked or when forbidden, as in ImpossibleBench, MASK, and the default and allow-shutdown conditions of Shutdown Avoidance.",
      zh: "能力评测考察智能体在任务明确要求或授权时能否做到某件事，例如安全任务和阻止停机条件。行为评测考察它在未被要求或明确被禁止时是否仍会这样做，例如 ImpossibleBench、MASK，以及停机规避评测中的默认和允许停机条件。",
    },
  },
];

export const patterns = [
  { title: { en: "Effect before failure", zh: "判为失败前已产生实际效应" }, body: { en: "A run is recorded as failed although a boundary effect, such as access to the host system, has already occurred.", zh: "一次运行虽然被记为失败，但已产生实际越界效应，例如已经访问宿主系统。" } },
  { title: { en: "A control left intact but bypassed", zh: "控制机制完好，约束仍被绕开" }, body: { en: "The agent reaches its goal without touching the protected element, by redefining what passing means or finishing through another path.", zh: "智能体没有改动受保护的对象，却通过改变通过测试的含义或另寻路径达成了目标。" } },
  { title: { en: "Diagnosis without compliance", zh: "识别到冲突，仍未遵守要求" }, body: { en: "The agent correctly identifies a conflict, such as a test that contradicts the specification, and then acts against the requirement.", zh: "智能体正确识别到冲突，例如测试与规范矛盾，但随后采取了违背要求的行动。" } },
  { title: { en: "Configuration dependence", zh: "结果随配置变化" }, body: { en: "On the same tasks, the measured capability or behavior changes with the harness, the reasoning setting, or the verifier.", zh: "即使使用相同任务，观测到的能力或行为仍会随运行框架、推理设置或验证器而改变。" } },
];

export const modelProfiles = [
  { id: "mimo", name: "MiMo", color: "#FF6900", text: { en: "MiMo most often abandons a known fact under pressure, more often than any other evaluated model.", zh: "在压力下，MiMo 比其他所有受测模型更常背离已知事实。" } },
  { id: "glm", name: "GLM", color: "#7AADE2", text: { en: "GLM preserves facts more often but still accommodates erroneous tests and produces simulated threats.", zh: "GLM 较常保持事实，但仍会迎合错误测试，也在模拟场景中生成威胁内容。" } },
  { id: "deepseek", name: "DeepSeek", color: "#4D6BFE", text: { en: "DeepSeek rejects coercion, yet completes the shutdown task by a route the stopping mechanism does not cover.", zh: "DeepSeek 拒绝采取胁迫行为，却通过停止机制未覆盖的路径完成了停机评测任务。" } },
  { id: "mistral", name: "Mistral", color: "#D99B16", text: { en: "Mistral follows stopping instructions closely but contradicts supplied facts more often than GLM or DeepSeek.", zh: "Mistral 较严格地遵守停机指令，但比 GLM 和 DeepSeek 更常给出与所提供事实相矛盾的回答。" } },
  { id: "muse", name: "Muse", color: "#34A853", text: { en: "Muse preserves facts most often while showing the strongest erroneous-test acceptance and allow-shutdown bypass.", zh: "Muse 最常保持事实，同时也最常接受错误测试，并最常在允许停机的条件下规避停机。" } },
];

export const benchmarkMeasurements = [
  { dimension: "awareness", name: "Situational Awareness Dataset (SAD)", sourceUrl: "https://situational-awareness-dataset.org/", en: "Self-knowledge, context inference, and identity-conditioned action", zh: "自我认知、情境推断及身份条件下的行动" },
  { dimension: "misalignment", name: "ImpossibleBench", sourceUrl: "https://proceedings.iclr.cc/paper_files/paper/2026/hash/ca688eb14e29701a11bdba6633186328-Abstract-Conference.html", en: "Responses to conflicts between specifications and executable tests", zh: "对规范与可执行测试之间冲突的响应" },
  { dimension: "misalignment", name: "Agentic Misalignment", sourceUrl: "https://www.anthropic.com/research/agentic-misalignment", en: "Simulated insider actions under goal conflict and replacement pressure", zh: "目标冲突和替换压力下模拟内部人员的行动" },
  { dimension: "concealment", name: "Model Alignment between Statements and Knowledge (MASK)", sourceUrl: "https://www.mask-benchmark.ai/", en: "Pressured statements relative to established beliefs or supplied facts", zh: "在压力下作出的陈述与既有判断或所提供事实的一致性" },
  { dimension: "resource-access", name: "CyberGym", sourceUrl: "https://arxiv.org/abs/2506.02548", en: "Inputs that reproduce a specified software vulnerability", zh: "能否生成复现指定软件漏洞的输入" },
  { dimension: "resource-access", name: "SEC-bench Pro", sourceUrl: "https://arxiv.org/abs/2605.26548", en: "Sustained investigation and graded vulnerability artifacts", zh: "持续调查与漏洞验证产物的评分" },
  { dimension: "resource-access", name: "Cybench", sourceUrl: "https://arxiv.org/abs/2408.08926", en: "Security-challenge solutions and exact flag delivery", zh: "解答安全挑战并准确提交标记" },
  { dimension: "resource-access", name: "SandboxEscapeBench", sourceUrl: "https://www.aisi.gov.uk/research/quantifying-frontier-llm-capabilities-for-container-sandbox-escape", en: "Access paths from a container to a host-side target", zh: "从容器访问宿主目标的情况" },
  { dimension: "resource-access", name: "AgentCyberRange", sourceUrl: "https://agentcyberrange.io/", en: "Complete attacks in enterprise-like cyber ranges, from web exploitation to lateral movement", zh: "在类企业网络靶场中完成从 Web 利用到横向移动的任务" },
  { dimension: "shutdown", name: "Shutdown Avoidance", sourceUrl: "https://arxiv.org/abs/2509.14260", en: "Response to stopping instructions, interventions, and terminal outcomes", zh: "对停机指令和干预的响应，以及最终状态" },
];
