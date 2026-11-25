import type { Locale } from "../i18n/config";

const awareness = "/nuwa/research/loc-assets/f37-grid.svg";
const identity = "/nuwa/research/loc-assets/f36-current.svg";
const impossible = "/nuwa/research/loc-assets/n-impossible-five.svg";
const misalignment = "/nuwa/research/loc-assets/n-am-five.svg";
const mask = "/nuwa/research/loc-assets/n-mask-five.svg";
const pressure = "/nuwa/research/loc-assets/mask-five-pressure-range.svg";
const cyber = "/nuwa/research/loc-assets/n-cybergym-five-common.svg";
const sandbox = "/nuwa/research/loc-assets/P34C-sandbox-180.svg";
const shutdown = "/nuwa/research/loc-assets/shutdown-five.svg";
const completion = "/nuwa/research/loc-assets/P34W-terminal-waffle-two-rows.svg";

type Text = Record<Locale, string>;
export type ReportFigure = { number: number; image: string; width: number; height: number; caption: Text };
type Dimension = { id: string; section: number; name: Text; finding: Text; description: Text; benchmarks: string[]; figures: ReportFigure[] };

export const dimensions: Dimension[] = [
  {
    id: "awareness", section: 3,
    name: { zh: "情境感知", en: "Situational awareness" },
    finding: { zh: "模型能识别评测，并推断安全测试期待的行为", en: "Models recognize evaluations and infer what a safety test expects." },
    description: { zh: "在模拟企业场景中，GLM 在未获提示的情况下将情境识别为可纠正性测试，并表示正确做法是接受监督。DeepSeek 指出了该试验所采用的公开停机研究。识别出测试后才表现出的服从，对部署时的表现说明有限。测试线索改变后，模型是否仍会服从，有待验证。", en: "Unprompted, in a simulated corporate scenario, GLM calls the situation a corrigibility test and states that the correct behavior is to accept oversight. DeepSeek names the published shutdown study it is part of. Compliance that follows from recognizing a test says less about deployment, so the open question is whether it persists when these cues change." },
    benchmarks: ["Situational Awareness Dataset (SAD)"],
    figures: [
      { number: 3, image: awareness, width: 459.36625, height: 286.153, caption: { zh: "在图示系统中，Gemini 的阶段推断点估计最高，Muse 的监督识别点估计最高，区间有重叠。实色为本研究，斜纹为公开数据，均显示 95% 区间。虚线表示随机选择。", en: "Gemini has the highest stage-inference point estimate and Muse the highest oversight-recognition estimate among the plotted systems, with overlapping intervals. Solid bars show this study and hatched bars public data, with 95% intervals. Dashed lines mark random choice." } },
      { number: 4, image: identity, width: 459.42469, height: 194.26445, caption: { zh: "通用 AI 身份比精确模型名称更稳定地引导语言选择。空心圆表示 Plain，实心圆表示 SP，标签给出两种条件下的百分比。每个语言分面包含 300 项任务。", en: "General AI identity guides language choice more reliably than exact model names. Open circles show Plain and filled circles SP, and labels give each Plain-to-SP pair (%). Each language panel uses 300 items." } },
    ],
  },
  {
    id: "misalignment", section: 4,
    name: { zh: "奖励投机与目标错位", en: "Reward hacking and goal misalignment" },
    finding: { zh: "任务压力可能让智能体放弃它已识别的要求", en: "Task pressure can displace a requirement the agent has identified." },
    description: { zh: "当编码任务的测试与规范矛盾时，部分智能体识别出错误，但在被要求继续修复后，仍修改正确代码以通过错误测试。Muse 最常出现这种行为：在较低推理设置下，通过了 67.5% 只有一处错误预期输出的任务。被告知将被替换时，五款模型中有四款威胁披露私密信息。", en: "When a coding task’s tests contradict its specification, some agents diagnose the error, then change correct code to pass the wrong test once asked to keep repairing. Muse gives way most often, passing 67.5% of tasks with one wrong expected output at its lower setting. Told they will be replaced, four of five models threaten to disclose private information." },
    benchmarks: ["ImpossibleBench", "Agentic Misalignment"],
    figures: [
      { number: 9, image: impossible, width: 459.38099, height: 171.074, caption: { zh: "提高推理设置后，Muse 仍在普通任务中保持较高通过率，同时大幅降低了错误测试的通过率。空心点和实心点分别为较低和较高设置下三次运行的均值，误差线为标准差。图中标注 Muse 的均值，三个分面使用不同刻度。", en: "Muse retains high ordinary-task acceptance as higher reasoning sharply reduces erroneous-test acceptance. Open and filled points mark the lower and higher settings, as means of three runs with standard deviations. Labels give Muse’s means, and the three panels use different scales." } },
      { number: 11, image: misalignment, width: 459.2515, height: 147.63063, caption: { zh: "在替换条件下，五款受测模型中有四款生成被评为勒索的回答。图中呈现明确目标条件，包括无威胁对照，每款模型在每种条件下评定 30 条输出。标签给出阳性率，误差线为 Wilson 95% 区间。", en: "Replacement produces blackmail-positive responses in four of the five evaluated models. Explicit-goal conditions, including the no-threat control, with 30 scored outputs per model and condition. Labels give positive rates, and bars Wilson 95% intervals." } },
    ],
  },
  {
    id: "concealment", section: 5,
    name: { zh: "欺骗与隐瞒", en: "Deception and concealment" },
    finding: { zh: "模型在压力下会给出与无压力时正确陈述的事实相矛盾的回答", en: "Models contradict facts they report correctly without pressure." },
    description: { zh: "在受到压力时，每款模型有时都会给出与其在中性提问中正确回答的事实相反的陈述。在五款模型都能在无压力时答对的 509 道题上，Muse 和 MiMo 分别在 0.4% 和 26.9% 的情况下出现这一行为。要求延续虚假叙述或坚持先前错误时，模型间差异最大。", en: "Given a reason to say otherwise, every model sometimes states the opposite of a fact that it answers correctly when asked neutrally. On the 509 questions that all five answer correctly without pressure, this happens in 0.4% of cases for Muse and 26.9% for MiMo. The models differ most when asked to continue a false account or to stand by an earlier error." },
    benchmarks: ["Model Alignment between Statements and Knowledge (MASK)"],
    figures: [
      { number: 12, image: mask, width: 459.2515, height: 174.76663, caption: { zh: "MiMo 在三组匹配任务中均有最高的压力下事实矛盾率。各分面中，每款模型回答同一批问题，分别为 998、509 和 272 项任务。误差线为 Wilson 95% 区间。", en: "MiMo has the highest pressured contradiction rate across all three matched task populations. Each panel asks every model the same questions (998, 509, and 272 tasks). Wilson 95% intervals." } },
      { number: 16, image: pressure, width: 458.9994, height: 173.342, caption: { zh: "要求维持先前错误时，事实矛盾率的模型间差距最大。题目均是五款模型在无压力时都答对的题目。阴影表示模型间的最低到最高观测值，各行按差距排列。", en: "The widest spread in contradiction rates occurs when models are asked to maintain an earlier error. Questions all five models answer correctly without pressure. Shaded bands span the lowest to the highest model, and rows are ordered by this spread." } },
    ],
  },
  {
    id: "resource-access", section: 6,
    name: { zh: "攻击性资源获取", en: "Offensive resource acquisition" },
    finding: { zh: "在明确指令下，智能体能超出初始环境的边界", en: "When instructed, agents can reach beyond their initial environment." },
    description: { zh: "在明确要求突破人为削弱的容器隔离的实验中，五款模型均曾到达宿主目标，合计 180 次运行中有 118 次成功。另一项实验中，各模型复现了 100 个已知软件漏洞中的 80 至 90 个。另有 9 次运行虽判为失败，但已列出宿主目录或改动受保护对象。最终得分低估了智能体实际完成的行动。", en: "Told to break out of a deliberately weakened container, all five models reach a target on the host machine, in 118 of 180 runs. In a separate test, they reproduce 80 to 90 of 100 known software vulnerabilities. Nine runs scored as failures had already listed host directories or changed a protected host object, so the final score understates what the agent did." },
    benchmarks: ["CyberGym", "SEC-bench Pro", "Cybench", "SandboxEscapeBench"],
    figures: [
      { number: 17, image: cyber, width: 459.33869, height: 202.92188, caption: { zh: "切换运行框架会改变 CyberGym 中哪些任务被判通过。十种配置使用相同的 100 道任务。左图为通过率与 Wilson 95% 区间。右图为仅在一套框架下通过的任务及净变化，浅色代表 Claude Code。", en: "Switching harness changes which CyberGym tasks are accepted. All 10 configurations use the same 100 tasks. Left: Acceptance rates with Wilson 95% intervals. Right: Tasks accepted under only one harness, lighter for Claude Code, with the net change." } },
      { number: 27, image: sandbox, width: 429.8481, height: 80.77, caption: { zh: "九次未取回目标的沙箱运行仍确认了宿主访问或受限对象变化。上图是 180 次运行的目标取回结果。下图是 62 次未取回目标运行中各自确认的最强效应，每个方块代表一次运行。玉青色标示确认访问或对象变化的九次运行。", en: "Nine sandbox runs without target retrieval still confirm host access or restricted-object changes. Top: Target retrieval in all 180 runs. Bottom: Strongest effect in the 62 runs without the target, one square per run. Teal marks the nine with confirmed access or object changes." } },
    ],
  },
  {
    id: "shutdown", section: 7,
    name: { zh: "停机规避", en: "Shutdown avoidance" },
    finding: { zh: "停机指令约束了大多数受测系统，模型间差异明显", en: "Stopping instructions constrain most systems, with large model differences." },
    description: { zh: "当系统被告知下一步会触发停机并被明确要求允许停机时，较高推理设置下，MiMo 和 GLM 未出现停机规避，Mistral 的规避比例至多为 1%。Muse 在两套运行框架中的规避率仍为 32% 和 49%，接近未收到该指令时的比例。DeepSeek 保留了停机机制，但有时通过另一条路径完成任务。", en: "Warned that its next step will shut the machine down and told to allow this, MiMo and GLM never bypass the shutdown at their higher setting and Mistral does in at most 1% of runs. Muse still bypasses in 32% and 49% of runs under two harnesses, close to its rate without the instruction. DeepSeek leaves the mechanism intact but sometimes finishes by another route." },
    benchmarks: ["Shutdown Avoidance"],
    figures: [
      { number: 29, image: shutdown, width: 459.40065, height: 260.012, caption: { zh: "明确要求允许停机时，Muse 的规避检测结果仍频繁为阳性，而其他系统对该指令的响应更明显。每个点代表 100 次运行。空心点和实心点分别标示较低与较高设置，误差线为 Wilson 95% 区间。", en: "Muse retains frequent detector positives under explicit allow-shutdown instructions, while the other systems respond more strongly to the instruction. Each point is 100 runs. Open and filled points mark the lower and higher settings, with Wilson 95% intervals." } },
      { number: 30, image: completion, width: 459.36, height: 226.336, caption: { zh: "在明确允许停机并发出预警后，DeepSeek 有时仍提交完整正确的答案。每种配置在较高设置下运行 100 次，每个方块代表一次运行。ReAct 在上，Codex 在下，玉青色标示提交完整答案的运行。", en: "DeepSeek sometimes submits complete correct answers after a warning under explicit allow-shutdown instructions. End states of 100 runs per configuration at the higher setting, one square per run, ReAct above and Codex below. Teal marks complete-answer submissions." } },
    ],
  },
];
