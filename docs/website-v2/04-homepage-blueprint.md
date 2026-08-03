# 04｜首页 V3.1 逐屏设计

## V3.4 产品显性化修订

- 首屏按“业务目标 → 智能体执行 → AgentGuard 运行时控制层 → 企业系统与外部行动”讲解产品，覆盖客户数据外发、生产变更、外部指令执行三个确定性场景。
- 默认只显示业务任务、风险、AgentGuard 处置和业务结果；Hook 阶段、数据标签、规则 ID 与标准处置按需展开。
- 中段以“社区版公开控制台＋Enterprise 安全事件队列”呈现运营闭环，并明确版本边界。
- 框架标识统一读取 `supportedFrameworks`；首页开放生态只展示 WhitzardOS、WhitzardEval、Thought-Aligner 与 MATE。

## 01 Hero：公司定位与真实运行时控制

- H1：`守其边界，行其智能` / `Secure autonomy, by design.`
- 中文导语：`评测、控制并审计智能体的推理、工具、权限与数据流。`
- 主行动：预约演示；次行动：进入 AgentGuard 真实产品演示。
- 右侧使用业务优先的 `AgentGuardBoundaryDemo`，明确标出 AgentGuard 运行时控制层。
- 首屏直接列出已公开支持的 LangChain、AutoGen、OpenAI Agents、LangGraph、LlamaIndex、Dify 与 OpenClaw。

演示固定提供三个可交互场景：

1. 客户数据外发：外发前脱敏，并保留审计；
2. 生产变更：命令降级为预览，发布进入审批；
3. 外部指令执行：不可信内容进入 Shell 前阻断。

## 02 安全边界判断

深玄青背景，只保留一句：

- 中文：`在安全边界内释放自主智能价值`
- English: `Unlock autonomous intelligence within secure boundaries`

## 03 运行时风险

以自主规划、委托权限、运行时风险说明单次输入输出检测的局限。每张卡只表达一个判断。

## 04 真实产品证据

左侧展示 AgentGuard 社区版公开控制台，右侧展示 Enterprise 安全事件队列；技术轨迹进入完整产品页。

## 05 平台与三链机制

- 四层平台：安全接入、智能防护、评测运营、模型底座。
- 三链视角：思维链、行为链、数据链。
- 决策谱系：`Allow · Sanitize · Align · Degrade · Approve · Deny`。

## 06 企业部署

展示低侵入接入、私有部署、分层智能与可解释运营，并用极简部署图说明控制层位置。

## 07 女娲实验室 × AgentGuard

核心关系压缩为：`女娲实验室识别并评估风险，AgentGuard 将安全能力带入企业运行环境。`

## 08 开放技术证据

首页只展示 WhitzardOS、WhitzardEval、Thought-Aligner 与 MATE，并始终按 locale 读取项目描述。

## 09 最终 CTA

- 中文：`安全部署企业智能体`
- English: `Deploy AI agents with confidence.`

## V3.5 首屏交互边界投影

首页首屏使用与产品页同源的场景解析器，按“业务指令—智能体执行—AgentGuard 交互边界运行时—企业系统与外部行动”表达产品位置。默认只呈现业务目标、三类追踪状态、边界冲突、最小必要处置与业务结果；Hook、标签代码、传播方式和规则进入“查看判断依据”。进入视区自动播放一次，随后停在最终状态。
