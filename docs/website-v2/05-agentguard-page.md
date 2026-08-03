# 05｜AgentGuard 产品页 V3.1

## 页面职责

AgentGuard 只回答产品是什么、如何判断、如何处置、如何接入；企业工作流与采购场景进入解决方案页。

## 页面结构

### 1. Product Hero

- 中文：`智能体运行时安全控制层`
- English: `Control the full agent runtime.`
- 使用公开 Dashboard 局部界面作为真实产品证据。
- 首屏列出已公开支持的七个 Agent 框架。

### 2. Runtime Console

与首页共用 `AgentGuardRuntimeConsole` 数据和状态机，使用完整密度：

- 三类真实场景与公开策略 ID；
- 完整轨迹与节点检查；
- DSL 与安全模型协同研判；
- `ALLOW · SANITIZE · ALIGN · DEGRADE · APPROVE · DENY`；
- `HUMAN_CHECK` 的批准一次与拒绝分支；
- 键盘场景切换、节点检查与重放；
- SSR 输出完整默认状态，减少动画模式直接显示最终状态。

### 3. 真实产品界面

- Dashboard
- 可视化策略配置
- 策略生成
- 官方点击播放 Demo
- `retrieve_doc → send_email_to` Allow / Deny 规则

### 4. 核心机制

- 全链建模
- 协同研判
- 精细处置

### 5. 接入与部署

- Hook
- Sidecar
- Gateway
- Runtime
- 私有控制面

### 6. 开放证据与 CTA

只链接可核实的 AgentGuard 代码、安全模型与 NUWA 研究，不展示未经证实的客户、部署、性能或规模数据。
