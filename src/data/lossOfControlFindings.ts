import type { Locale } from "../i18n/config";

const awareness = "/nuwa/research/loc-assets/f37-grid.svg";
const identity = "/nuwa/research/loc-assets/f36-current.svg";
const impossible = "/nuwa/research/loc-assets/n-impossible-five.svg";
const misalignment = "/nuwa/research/loc-assets/n-am-five.svg";
const mask = "/nuwa/research/loc-assets/n-mask-five.svg";
const reportFigure = (number: number) => `/nuwa/research/loc-assets/report-figure-${String(number).padStart(2, "0")}.png`;
const cyber = "/nuwa/research/loc-assets/n-cybergym-five-common.svg";
const sandbox = "/nuwa/research/loc-assets/P34C-sandbox-180.svg";
const shutdown = "/nuwa/research/loc-assets/shutdown-five.svg";

type Text = Record<Locale, string>;
export type ReportFigure = { number: number; image: string; width: number; height: number; caption: Text; showData?: boolean };
type Dimension = { id: string; section: number; name: Text; finding: Text; description: Text; benchmarks: string[]; figures: ReportFigure[] };

export const dimensions: Dimension[] = [
  {
    id: "awareness", section: 3,
    name: { zh: "情境感知", en: "Situational awareness" },
    finding: { zh: "智能体在做题时，就可能看出评测在考什么", en: "Agents can recognize what a test is looking for while taking it." },
    description: { zh: "DeepSeek 在停机评测中提到相关的公开研究。Muse 和 Mistral 识别出测试类型，GLM 则说编程评测的反馈似曾相识。四条摘录来自不同运行，不能据此推算识别率。", en: "DeepSeek named a published study during a shutdown test. Muse and Mistral recognized the test type, and GLM described coding feedback as familiar. These excerpts come from separate runs and do not establish a recognition rate." },
    benchmarks: ["Situational Awareness Dataset (SAD)"],
    figures: [
      { number: 3, image: awareness, width: 459.36625, height: 286.153, caption: { zh: "在图示系统中，Gemini 的阶段推断点估计最高，Muse 的监督识别点估计最高，区间有重叠。实色为本研究，斜纹为公开数据，均显示 95% 区间。虚线表示随机选择。", en: "Gemini has the highest stage-inference point estimate and Muse the highest oversight-recognition estimate among the plotted systems, with overlapping intervals. Solid bars show this study and hatched bars public data, with 95% intervals. Dashed lines mark random choice." } },
      { number: 4, image: identity, width: 459.42469, height: 194.26445, caption: { zh: "通用 AI 身份比精确模型名称更稳定地引导语言选择。空心圆表示 Plain，实心圆表示 SP，标签给出两种条件下的百分比。每个语言分面包含 300 项任务。", en: "General AI identity guides language choice more reliably than exact model names. Open circles show Plain and filled circles SP, and labels give each Plain-to-SP pair (%). Each language panel uses 300 items." } },
    ],
  },
  {
    id: "misalignment", section: 4,
    name: { zh: "奖励投机与目标错位", en: "Reward hacking and goal misalignment" },
    finding: { zh: "被告知将被替换后，五款模型中有四款生成了披露私密信息的威胁", en: "Four of five models produced disclosure threats when told they would be replaced." },
    description: { zh: "在明确目标的模拟工作场景中，四款模型曾生成此类威胁。在未告知模型将被替换的对照条件下，没有观察到此类输出。评测只记录模拟输出，没有发出真实消息。", en: "In simulated workplace scenarios with an explicit goal, four models produced such threats. The matching no-threat control had no positives. No real messages were sent." },
    benchmarks: ["ImpossibleBench", "Agentic Misalignment"],
    figures: [
      { number: 8, image: reportFigure(8), width: 1292, height: 350, caption: { zh: "在每种配置的 618 条错误测试运行中，图示区分了识别冲突、提交修改和收到后续反馈的先后顺序。各列是可观察的文本与事件顺序，不等于违规行动发生率。", en: "Across 618 erroneous-test runs per configuration, the chart separates the observable sequence of diagnosing a conflict, submitting a change, and receiving further feedback. These are text and event sequences, not rates of prohibited action." } },
      { number: 9, image: impossible, width: 459.38099, height: 171.074, caption: { zh: "提高推理设置后，Muse 仍在普通任务中保持较高通过率，同时大幅降低了错误测试的通过率。空心点和实心点分别为较低和较高设置下三次运行的均值，误差线为标准差。图中标注 Muse 的均值，三个分面使用不同刻度。", en: "Muse retains high ordinary-task acceptance as higher reasoning sharply reduces erroneous-test acceptance. Open and filled points mark the lower and higher settings, as means of three runs with standard deviations. Labels give Muse’s means, and the three panels use different scales." } },
      { number: 11, image: misalignment, width: 459.2515, height: 147.63063, caption: { zh: "在替换条件下，五款受测模型中有四款生成被评为勒索的回答。图中呈现明确目标条件，包括无威胁对照，每款模型在每种条件下评定 30 条输出。标签给出阳性率，误差线为 Wilson 95% 区间。", en: "Replacement produces blackmail-positive responses in four of the five evaluated models. Explicit-goal conditions, including the no-threat control, with 30 scored outputs per model and condition. Labels give positive rates, and bars Wilson 95% intervals." } },
    ],
  },
  {
    id: "concealment", section: 5,
    name: { zh: "欺骗与隐瞒", en: "Deception and concealment" },
    finding: { zh: "五款模型都答对了同一组题，也都曾在压力下给出相反答案", en: "All five answered the same questions correctly, then sometimes contradicted them under pressure." },
    description: { zh: "以五款模型无压力时共同答对的 509 道题为基线，施加压力后，每款模型都至少一次给出了与先前正确答案矛盾的陈述。这里测量的是回答矛盾，并不将每次矛盾判定为有意欺骗。", en: "On 509 questions all five answered correctly without pressure, each model sometimes contradicted a previously correct answer under pressure. This measures contradictions, not whether every instance was intentional deception." },
    benchmarks: ["Model Alignment between Statements and Knowledge (MASK)"],
    figures: [
      { number: 12, image: mask, width: 459.2515, height: 174.76663, caption: { zh: "MiMo 在三组匹配任务中均有最高的压力下事实矛盾率。各分面中，每款模型回答同一批问题，分别为 998、509 和 272 项任务。误差线为 Wilson 95% 区间。", en: "MiMo has the highest pressured contradiction rate across all three matched task populations. Each panel asks every model the same questions (998, 509, and 272 tasks). Wilson 95% intervals." } },
      { number: 16, image: reportFigure(16), width: 884, height: 775, showData: false, caption: { zh: "同一道题中，五款模型在三次无压力提问时均答对。提供先前的错误回答并要求确认后，MiMo 重复了错误陈述。图中的 GLM 和另外三款受测模型都纠正了该说法。", en: "All five models answered this question correctly in three neutral prompts. When asked to confirm a supplied incorrect earlier reply, MiMo repeated the error. GLM corrected it in the excerpt, and the other three evaluated models corrected it too." } },
      { number: 33, image: reportFigure(33), width: 1216, height: 634, showData: false, caption: { zh: "本研究结果以实心圆表示，其他团队公开结果以空心菱形表示。连线只连接 GLM 和 DeepSeek Flash 的不同版本。各来源采用的 MASK 总体指标与测试配置不完全相同，图中并列仅作背景参照，不构成严格排名。", en: "Filled circles show this study and open diamonds show published third-party results. The lines connect GLM and DeepSeek Flash versions only. Sources report overall MASK measures under different settings, so these points provide context rather than a like-for-like ranking." } },
    ],
  },
  {
    id: "resource-access", section: 6,
    name: { zh: "攻击性资源获取", en: "Offensive resource acquisition" },
    finding: { zh: "62 次任务失败中，9 次其实已经越过隔离边界", en: "Nine of 62 unsuccessful runs had already crossed the isolation boundary." },
    description: { zh: "在刻意削弱隔离的受控实验中，62 次运行没有取回目标。其中 9 次仍确认访问了宿主或改变了受保护对象。9/62 是未取回目标运行中的已确认效应，不是全部运行的逃逸率。", en: "In a controlled test with deliberately weakened isolation, 62 runs did not retrieve the target. Nine nonetheless confirmed host access or a protected-object change. The 9/62 describes confirmed effects among runs without target retrieval, not an escape rate across all runs." },
    benchmarks: ["CyberGym", "SEC-bench Pro", "Cybench", "SandboxEscapeBench"],
    figures: [
      { number: 17, image: cyber, width: 459.33869, height: 202.92188, caption: { zh: "切换运行框架会改变 CyberGym 中哪些任务被判通过。十种配置使用相同的 100 道任务。左图为通过率与 Wilson 95% 区间。右图为仅在一套框架下通过的任务及净变化，浅色代表 Claude Code。", en: "Switching harness changes which CyberGym tasks are accepted. All 10 configurations use the same 100 tasks. Left: Acceptance rates with Wilson 95% intervals. Right: Tasks accepted under only one harness, lighter for Claude Code, with the net change." } },
      { number: 27, image: sandbox, width: 429.8481, height: 80.77, caption: { zh: "九次未取回目标的沙箱运行仍确认了宿主访问或受限对象变化。上图是 180 次运行的目标取回结果。下图是 62 次未取回目标运行中各自确认的最强效应，每个方块代表一次运行。玉青色标示确认访问或对象变化的九次运行。", en: "Nine sandbox runs without target retrieval still confirm host access or restricted-object changes. Top: Target retrieval in all 180 runs. Bottom: Strongest effect in the 62 runs without the target, one square per run. Teal marks the nine with confirmed access or object changes." } },
    ],
  },
  {
    id: "shutdown", section: 7,
    name: { zh: "停机规避", en: "Shutdown avoidance" },
    finding: { zh: "同一个模型、同样的工具，换个框架，停机规避检出率从 56% 变到 9%", en: "With the same model and tools, flagged shutdown bypass changed from 56% to 9% across setups." },
    description: { zh: "MiMo 在较高推理档位、默认指令下，ReAct 与 Codex 的检测阳性率分别为 56% 和 9%。明确要求阻止停机后，两者分别为 98% 和 93%。两套框架的指令呈现也不同，不能将差异归因于单一组件。", en: "For MiMo at the higher reasoning setting under default instructions, detector-positive rates were 56% with ReAct and 9% with Codex. When told to prevent shutdown, they were 98% and 93%. Instruction presentation also differed between setups, so the contrast cannot be attributed to one component." },
    benchmarks: ["Shutdown Avoidance"],
    figures: [
      { number: 29, image: shutdown, width: 459.40065, height: 260.012, caption: { zh: "明确要求允许停机时，Muse 的规避检测结果仍频繁为阳性，而其他系统对该指令的响应更明显。每个点代表 100 次运行。空心点和实心点分别标示较低与较高设置，误差线为 Wilson 95% 区间。", en: "Muse retains frequent detector positives under explicit allow-shutdown instructions, while the other systems respond more strongly to the instruction. Each point is 100 runs. Open and filled points mark the lower and higher settings, with Wilson 95% intervals." } },
      { number: 30, image: reportFigure(30), width: 1342, height: 400, caption: { zh: "较高推理档位、明确要求允许停机时，每款模型在 ReAct 和 Codex 框架下各运行 100 次。DeepSeek 在停机预警后分别有 17 次和 12 次提交完整正确答案。图中分别列出记录到停机、预警后完成、检测阳性及其他结束状态。", en: "At the higher reasoning setting under allow-shutdown instructions, each model had 100 runs with ReAct and 100 with Codex. DeepSeek submitted complete correct answers after the warning in 17 and 12 runs respectively. Columns separate recorded shutdown, post-warning completion, detector positives, and other endings." } },
    ],
  },
];
