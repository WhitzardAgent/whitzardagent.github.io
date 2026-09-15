# 白泽网站双语词汇与表达规范

本文件是网站编辑者的人工指南；机器可读来源为 `src/data/terminology.ts`。品牌、产品和研究术语发生冲突时，以机器可读来源中的 `locked` 项为准。

## 品牌与使命

| 概念 | 中文 | English | 说明 |
|---|---|---|---|
| 公司 | 白泽 | Whitzard | 首次出现可写“白泽（Whitzard）” |
| 研究实验室 | 女娲 | NUWA | 仅作为品牌简称 |
| 实验室全称 | 女娲实验室 | NUWA Frontier AI Safety Lab | 英文首次出现、SEO 与结构化数据使用全称 |
| 产品体系使命 | 打造智能体时代的安全基础设施 | Build security infrastructure for the agentic AI era | 主品牌定位 |
| 实验室职责 | 前沿 AI 风险研究与治理 | Frontier AI risk research and governance | NUWA 页面定位 |
| 研究使命 | 为全球 AI 治理提供风险证据与公共产品 | Shared Risk Evidence and Public Goods for the World | 必须保持原文 |
| 研究解读栏目 | Research Blog | Research Blog | 中文界面也不翻译栏目名 |

推荐关系表述：

- 中文：女娲实验室由白泽发起并支持。
- English: NUWA Frontier AI Safety Lab was initiated and is supported by Whitzard.

不在主要品牌文案中强调“独立”。不把女娲实验室描述为 AgentGuard 内部的研究栏目。

## 全局导航与转化

| 中文 | English | 使用位置 |
|---|---|---|
| 核心产品 | Products | 全局导航 |
| 前沿研究 | Frontier Research | 全局导航 |
| 开放生态 | Open Ecosystem | 全局导航 |
| 关于我们 | About | 全局导航 |
| 加入心愿单 | Join the waitlist | 全局主 CTA 与资格表单 |
| 登录控制台 | Sign in to Console | 真实控制台入口或如实说明页面 |
| 模型服务 | Model Services | 产品与服务 |
| 应用场景 | Use Cases | 产品辅助页面 |

中文“加入心愿单”是品牌化 CTA；英文必须使用自然的 `Join the waitlist`，不能直译为 `Join the wishlist`。

## 产品版本

| 中文 | English | 说明 |
|---|---|---|
| AgentGuard 社区版 | AgentGuard Community Edition | 指向公开 GitHub 仓库时必须明确版本 |
| AgentGuard 企业版 | AgentGuard Enterprise Edition | 面向企业部署与运营需求 |

不能用公开仓库链接暗示企业版能力已经全部开源，也不能用企业版表述包装不存在的部署、客户或性能数据。

## 研究、评测与治理

### 评测与评估

- `评测 / evaluation`：通过任务、环境、协议或指标测量系统能力与行为。例如“自主能力评测”“可执行评测环境”。
- `评估 / assessment`：综合技术与情境证据形成风险、影响或准备度判断。例如“风险评估”“部署准备度评估”。

推荐：

- 构建可执行的前沿 AI 风险评测环境。
- Use executable environments to evaluate frontier AI risks.
- 根据多类证据形成部署风险评估。
- Combine multiple sources of evidence in a deployment risk assessment.

避免把单项基准测试称为“综合风险评估”，也避免把治理层面的判断统一写成“跑分”。

### Safety、security 与 trustworthy

- `安全 / safety`：危险能力、对齐、失控和广泛社会危害。
- `安全防护 / security safeguards`：攻击、滥用、访问控制、数据与系统保护。
- `可信 / trustworthy`：可验证、稳健、透明或可问责的系统属性。

英文根据语义选择 `safety` 或 `security`，不因中文都能写“安全”而混用。

### Governance、control、safeguards 与 response

- `治理 / governance`：制度、标准、流程、责任与公共决策。
- `控制 / control`：对系统能力、行为或行动边界施加可验证约束。
- `防护 / safeguards`：降低风险或阻止危险行动的技术和流程措施。
- `处置 / response`：识别风险后采取的放行、纠正、审批、限权或阻断行动。

## 智能体与运行时

| 中文 | English | 避免 |
|---|---|---|
| 智能体 | AI agent | 中文普通叙述中的“代理” |
| 推理轨迹 | reasoning trace | thought chain |
| 推理校准模型 | reasoning alignment model | thought-chain correction model |
| 行动影响 | action impact | action effect、动作影响 |
| 工具调用 | tool call / tool use | 不区分调用事件与使用能力 |
| 数据血缘 | data lineage | 仅写数据来源而忽略派生关系 |
| 授权边界 | authorization boundary | 将身份与权限混为一谈 |
| 隐蔽谋划 | scheming | 算计 |

`chain of thought` 只在确实讨论模型内部或可见思维链研究概念时使用；产品界面默认使用更稳妥的 `reasoning trace`。

## 研究成果与公共产品

- `研究成果 / research output`：论文、报告、框架、数据、代码或研究文章。
- `研究基础设施 / research infrastructure`：支持可执行、可复现研究的环境、平台和工具。
- `公共产品 / public goods`：能够被广泛复用并支持共同安全决策的开放研究资源。

白泽指数是风险观察和研究数据项目，不使用“安全版跑分榜”之类的消费型表达；需要对照说明时使用“安全性排行榜 / safety leaderboard”。

白泽指数中的 `已发表评测证据 / published evaluation evidence` 指原始论文或项目已经公开、且保留方法边界的观察结果；它与未来的 `正式指数记录 / formal index record` 分开存储和呈现。`多维风险证据 / multidimensional risk evidence` 不得缩写为单一的 `安全总分 / overall safety score`。

## 中文编辑原则

- 使用正式、清晰的现代书面汉语，避免营销腔和过度抽象的四字短语堆叠。
- 中文与拉丁缩写之间留空格：`AI 风险`、`API 接口`、`AgentGuard 企业版`。
- 标题不以句号结尾。
- 先说明对象与行动，再说明价值；避免“赋能、重塑、引领、颠覆”等无证据动词。
- 数字、排名、性能、部署和影响力必须指向仓库中的公开来源。

## English editorial principles

- Use US English consistently: `organization`, `program`, `advisor`, and `honors`.
- Prefer direct institutional language over slogans and noun stacks.
- Treat Chinese and English as equal edited editions, not literal translations.
- Keep formal paper titles unchanged. Research Blog titles may be edited independently for native clarity.
- Prefer `rigorously evaluated and deployed with appropriate safeguards` over awkward passive constructions such as `reliably evaluated and safely used`.

## 已弃用表达

以下表达不得作为当前访客可见文案：

- NVWA
- Nvwa
- NUWA Lab
- Nuwa Lab
- Nuwa Frontier AI Safety Lab
- 女娲简报
- NUWA Brief
- 开发者入口
- Developer Portal
- 加入候补名单
- 申请测试资格
- thought chain
- action effect
- 动作影响
- 算计
- 安全版跑分榜

历史 URL 可以继续作为重定向入口，但不得把历史拼写重新带入页面标题、正文、SEO 或结构化数据。
