# 04｜首页 V2 逐屏设计

## 01 Hero：产品定位

### 中文

Eyebrow：

`智能体安全基础设施`

主标题：

# 守其边界，行其智能

说明：

> Whitzard 为企业智能体提供上线前评测、运行时控制与安全运营能力，让智能体在安全边界内自主行动。

按钮：

- 预约产品演示
- 查看 AgentGuard

### English

Eyebrow：

`AI AGENT SECURITY INFRASTRUCTURE`

Title:

# Secure autonomy, by design.

Description:

> Whitzard provides the infrastructure to evaluate, govern, and protect AI agents across their full runtime—without removing the autonomy that makes them valuable.

Buttons:

- Book a Demo
- Explore AgentGuard

### 右侧主视觉：Runtime Trace

节点：

`Intent → Reasoning → Tool → Data → Action`

动态过程：

1. 信号沿主轴缓慢移动；
2. Reasoning 节点出现风险；
3. AgentGuard 生成 `CORRECT` 状态；
4. 风险路径收束为安全路径；
5. Tool 与 Data 节点继续执行；
6. 最终显示 `ALLOWED WITH POLICY`。

它必须让访问者在 5 秒内理解：AgentGuard 介入智能体的实际执行过程。

---

## 02 品牌判断屏

深玄青全屏，仅放一句：

中文：

# 自主性不应被关闭，而应被安全地释放。

English:

# Autonomy should not be removed. It should be secured.

背景只保留一条缓慢变化的边界线。

---

## 03 为什么需要新的安全基础设施

三列：

1. 自主规划  
   智能体会根据任务和反馈持续改变计划。

2. 委托权限  
   智能体能够调用工具、访问数据并代表用户执行操作。

3. 运行时风险  
   单次输入输出检测无法识别跨步骤行为和数据流风险。

底部一句：

> The risk is not only in what the model says. It is in what the agent does next.

---

## 04 AgentGuard 四层平台

采用纵向层叠、类似现代屏风的结构：

1. 安全接入  
   多框架接入｜工具与 MCP 代理｜身份权限｜可信沙箱

2. 智能防护  
   思维链校准｜行为链分析｜数据链追踪｜策略处置

3. 评测运营  
   自动红队｜持续评测｜风险画像｜审计响应

4. 模型底座  
   数据工厂｜模型训练｜风险知识｜反馈优化

滚动时依次展开，每层只出现一次，不做四宫格 hover 卡片。

---

## 05 三链技术叙事

这一屏使用 pinned scrollytelling。

左侧固定视觉，右侧滚动三个章节：

### Thought Chain

识别高风险推理，并在行为发生前纠正。

### Behavior Chain

关联跨步骤、跨工具和跨智能体的组合风险。

### Data Chain

追踪敏感数据来源、用途、流向与外泄边界。

视觉最终汇入：

`DSL Rules × Small Safety Model × Frontier Model`

输出：

`Allow · Correct · Approve · Redact · Limit · Block`

---

## 06 研究—产品内循环

中心文案：

> Research discovers the risk. Product controls it in the real world.

闭环：

`NUWA Lab → Evaluation & Evidence → Safety Models → AgentGuard → Deployment Feedback → NUWA Lab`

禁止画成传统太极。使用不完全闭合圆环和细线。

---

## 07 企业落地

四项证据：

- 低侵入接入主流 Agent 框架
- 私有化部署与数据不出域
- 规则、小模型和大模型协同
- 全链路审计与可解释处置

配合极简部署图：

`Agents → AgentGuard Control Layer → Models / Tools / MCP / Data / Sandbox`

---

## 08 开源生态

只展示四个代表性项目，不铺满全部仓库：

- AgentGuard
- Thought-Aligner / MirrorGuard
- Snowl
- CyberGym / CyberEvolver（按当前对外策略择一）

其余进入 Open Ecosystem 页面。

---

## 09 最终 CTA

深玄青背景：

中文：

# 让企业放心部署和规模化使用智能体

English:

# Deploy AI agents with confidence.

按钮：

- 预约产品演示
- 联系合作
