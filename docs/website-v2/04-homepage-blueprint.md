# 04｜首页 V3.1 逐屏设计

## 01 Hero：公司定位与真实运行时控制

- H1：`守其边界，行其智能` / `Secure autonomy, by design.`
- 中文导语：`评测、控制并审计智能体的推理、工具、权限与数据流。`
- 主行动：预约演示；次行动：进入 AgentGuard 真实产品演示。
- 右侧统一使用 `AgentGuardRuntimeConsole` 的紧凑版本，不再使用抽象折线或 `Correct` 示意图。
- 首屏直接列出已公开支持的 LangChain、AutoGen、OpenAI Agents、LangGraph、LlamaIndex、Dify 与 OpenClaw。

控制台固定提供三个可交互场景：

1. `database_query → report.generate → http.post`：`SANITIZE → ALLOW WITH AUDIT`；
2. `browser.fetch → llm.respond → shell.exec`：`DENY`；
3. `database_query → slack.post`：`HUMAN_CHECK`，允许批准一次或拒绝。

## 02 安全边界判断

深玄青背景，只保留一句：

- 中文：`自主性在可信边界内释放。`
- English: `Autonomy thrives inside a trustworthy security boundary.`

## 03 运行时风险

以自主规划、委托权限、运行时风险说明单次输入输出检测的局限。每张卡只表达一个判断。

## 04 真实产品证据

使用 AgentGuard 公开控制台与 `retrieve_doc → send_email_to` 规则，展示 Allow / Deny 两种路径并进入完整产品页。

## 05 平台与三链机制

- 四层平台：安全接入、智能防护、评测运营、模型底座。
- 三链视角：思维链、行为链、数据链。
- 决策谱系：`Allow · Sanitize · Align · Degrade · Approve · Deny`。

## 06 企业部署

展示低侵入接入、私有部署、分层智能与可解释运营，并用极简部署图说明控制层位置。

## 07 NUWA Lab × AgentGuard

核心关系压缩为：`NUWA 发现并评估风险，AgentGuard 将安全能力带入企业运行环境。`

## 08 开放技术证据

首页只展示 AgentGuard、Thought-Aligner、snowl 与 cyberhunter，并始终按 locale 读取项目描述。

## 09 最终 CTA

- 中文：`安全部署企业智能体`
- English: `Deploy AI agents with confidence.`
