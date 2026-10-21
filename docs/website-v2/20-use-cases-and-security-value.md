# 企业应用场景与安全价值

2026-10-21 用户定稿，交付本地审阅版本。

## 分类与字段

| 中文 | English | 任务范围 |
| --- | --- | --- |
| 通用办公 | Office productivity | 检索、文档、邮件与协作 |
| 开发运维 | Development & operations | 代码、命令、环境与资源 |
| GUI 智能体 | Computer-use agents | 浏览器、桌面、移动应用 |
| AI 工作流 | AI workflows | 知识库、工具编排、跨系统流程；Dify 为示例 |

共享数据在 `src/i18n/pages/company.ts`：用 `tasks`、`securityDimensions[]`、`value` 替代 `objective`、`boundary`、`outcome`，补充 `controls.agentguard` 与 `controls.gateway`。首页、场景页、AgentGuard 场景入口共同读取，英文独立编辑。

栏目固定为“典型任务 / Typical tasks”“安全维度 / Security dimensions”“应用价值 / Business value”。四个安全维度为静态列表 badge，不可点击、不表示运行或通过状态。价值说明采用约束、支持、降低风险等表述，不增加数值或安全认证。

## 布局与交互

- 首页桌面四项手动切换；手机（700px 以下）与无 JavaScript 时四类全部可读；支持方向键、Home、End、Tab。
- 场景页沿用四类摘要选择，手机及无 JS 时展开；去除流程箭头，使用栏目解释任务、维度与价值。
- 场景页下方保留四类静态产品对应说明，独立列出 AgentGuard 与 WhitzardGateway 的职责及入口；详情锚点为 `#use-case-01` 至 `#use-case-04`。
- AgentGuard 四项入口同步标题、任务与价值，分别链接对应详情锚点。
- 无执行动画、进度条、“已保护”或模拟处置结果；不改变核心产品导航、网关管理场景或研究栏目。

## 能力依据与边界

AgentGuard 的运行时策略、工具边界与审计依据现有产品材料；WhitzardGateway 的模型接入、凭证、权限、防护与用量依据 0.9.5 和手册，见 19。场景安全维度表示应用安全目标，不宣称两款产品都实现全部维度。

GUI 应用范围由用户确认覆盖三端；实际支持依据可接入的客户端、工具与可观测交互。MirrorGuard 研究见仓库原始论文记录 arXiv:2601.12822，不将论文结果推导为三端产品适配证明。本轮不新增移动端兼容或完整屏幕识别能力声明。

## 验收

中英文首页、场景页、AgentGuard 页覆盖 1440/1024/900/808/390，检查标题、四个 badge、价值说明、产品入口、语言切换、键盘、触摸、无 JS 与 reduced-motion。运行类型、现有测试、术语、内容、链接、Research Blog 与静态构建；不自动推送或部署。

### 本地验收记录（2026-10-21）

- 类型检查：188 文件，0 errors / warnings / hints；现有 23 项测试通过。
- 正式静态构建 46 页；内容检查覆盖 184 个源文件、54 个 HTML；术语、Research Blog 与链接检查通过。JSONL 原始记录及生成数据未改变。
- 场景检查脚本覆盖双语三类页面 × 五档宽度，共 30 组，验证四类标题、每类四个标签、产品说明与入口、方向键/Home/End/Tab、桌面转手机、AgentGuard 详情锚点、无 JS 与 reduced-motion；无横向溢出及浏览器运行错误。
- 全站品牌回归双语 13 路由 × 1440/900/390，共 78 组；同时核对 canonical、hreflang、组织信息、语言切换、菜单、表单及降级行为。
- 复核首页桌面/手机、英文场景页、平板产品对应说明与手机展开截图；场景切换按钮正文统一 14px，序号与安全标签至少 12px。
- 本轮仅交付本地预览，未提交、推送或部署。
