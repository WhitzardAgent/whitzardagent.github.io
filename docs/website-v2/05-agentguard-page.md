# 05｜AgentGuard 产品页

## 页面目标

让企业客户完成四个判断：

1. 这是企业产品，不是论文 Demo；
2. 它保护完整 Agent Runtime；
3. 它与传统输入输出护栏不同；
4. 它可以接入现有智能体和私有化部署。

## 页面结构

### 1. Product Hero

标题：

`Security control for the full agent runtime`

中文：

`覆盖智能体完整运行过程的统一安全控制层`

右侧使用真实运行轨迹，不再使用抽象 Policy / Trace / Approval / Audit 流程。

### 2. Runtime Control Surface

展示四类事件：

- Before LLM
- After LLM
- Before Tool
- After Tool

展示六类处置：

- Allow
- Correct
- Approve
- Redact
- Limit
- Block

### 3. Three-Chain Intelligence

- Thought chain alignment
- Behavior chain reasoning
- Data lineage tracking

强调：

`Deterministic DSL × Lightweight Model × Frontier Model`

### 4. Four Platform Layers

- Secure Connect
- Runtime Intelligence
- Evaluate & Operate
- Model & Data Foundation

### 5. Enterprise Deployment

展示：

- SDK / Hook
- Sidecar
- Gateway
- Control Plane
- Private Deployment

### 6. Evidence

不要只用形容词，应展示：

- 兼容框架数量；
- 已公开模型；
- 评测结果；
- 开源仓库；
- 论文或基准；
- 实际部署形态。

只使用可核实数据。

### 7. CTA

- Book a Demo
- Read Documentation
- View GitHub

## 当前代码的具体调整

删除或降级：

- `The Problem` 两段通用说明；
- `Policy / Trace / Approval / Audit` 四张通用卡片；
- 仅靠小型 SVG 方框表达产品。

新增 React islands：

- `AgentRuntimeDemo.tsx`
- `ThreeChainScrolly.tsx`
- `DeploymentArchitecture.tsx`

静态 Astro 组件：

- `PlatformLayer.astro`
- `EvidenceStrip.astro`
- `EnterpriseFeature.astro`
