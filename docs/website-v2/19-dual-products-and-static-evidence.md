# 双产品展示与静态产品证据

2026-10-21 用户确认；覆盖 04、07、15 中要求展示模拟执行流程的历史方案。

## 页面与阅读路径

- 首页：品牌 → 双产品 → 模型服务 → 应用场景 → 女娲研究 → 开放生态 → 动态 → 心愿单。
- 首页主行动为“了解产品 / Explore products”，锚点为 `#products`。
- AgentGuard 与 WhitzardGateway 在桌面使用等宽展位，相同文字、能力、真实截图及详情入口层级；1024px 以下顺序展开。
- 网关详情：产品定位 → 真实登录界面 → 核心能力 → 团队场景 → 产品接入。双语路由 `/gateway`、`/en/gateway`。
- 核心产品导航仅保留 AgentGuard、WhitzardGateway；桌面下拉与移动二级入口统一单列。模型服务和应用场景保留首页、页脚及独立页面入口。页脚和心愿单增加 WhitzardGateway；咨询页面向两款产品。沿用现有表单与邮箱，不新增后端。

## 素材与事实依据

- 对外产品名为 WhitzardGateway；SafeGateway 是提供材料的本地目录名，不作为官网品牌。
- 材料依据：提供目录的 `CHANGELOG.md` 0.9.5（2026-10-20）及 `docs/handbook/content/zh/{models,protection,costs}.md`。README 的 0.9.0 版本标记较旧，不用于判断最新版本。
- 可陈述能力：模型服务接入、独立 Agent 凭证、权限与运行防护、行为记录、Token 用量与参考费用。费用估算不等同实际账单；不承诺吞吐、加速、降本比例、任意客户端兼容或全量动态安全验证。
- 用户提供截图 `codex-clipboard-240d942e-6519-4734-8494-7a7a4e9a7ed5.png`，2684×1636。原始素材保存在 `public/assets/gateway/sign-in-original.png`；800px 与 1600px WebP 仅等比压缩，分别约 16KB、47KB。
- 图注为登录界面；英文页面标明截图为中文。禁止伪造控制台、运行计数、费用或防护成果；没有工作台素材时不填占位数据。
- 面向中小企业的 SaaS 是用户确定的未来方向，仅在接入区表述规划；不提供虚假的注册、付费或已开放登录入口。

## 演示与动效

- 首页不再加载 AgentGuardBoundaryFlow。AgentGuard 不再加载 SystemMap、InfluenceEngine、RiskSimulator。
- 产品页以静态控制位置、策略配置、审计记录替代模拟器，保留 `system-map`、`engine`、`runtime` 旧片段目标。
- 部署架构保持静态，去除扫描线及信号传播。真实截图与手动播放的真实录屏继续保留。
- 场景为业务目标、关键边界、控制要求，不表示完成了模拟或实际验证。
- 品牌背景轻动效、内容进入、手动筛选继续有效；离屏/后台暂停与 reduced-motion 规则不变。
- 历史模拟组件与数据未删除，但不再由公开页面引用；其原有算法测试不是官网产品能力证据。

## 验收

中英文首页、网关、AgentGuard、应用场景覆盖 1440/1024/900/808/390；检查图片比例、双产品权重、旧锚点、菜单、语言切换与心愿单。检查无 JavaScript、reduced-motion、手动视频及无模拟状态。运行类型、测试、术语、Research Blog、内容、链接与构建。只交付本地审阅，不自动发布。

### 本地验收记录（2026-10-21）

- `npm run check`：187 文件，0 errors / warnings / hints；23 项现有测试全部通过。
- `npm run build`：46 个静态页面；JSONL ingestion 保持 86 个研究记录、2 项研究基础设施与 22 项可见开源项目。
- 内容检查覆盖 183 个源文件、54 个输出 HTML；术语检查 162 个源文件；Research Blog 检查 4 篇 Markdown；内部链接检查通过。
- `check-products-browser.mjs`：双语四类页面 × 五档宽度，共 40 组；验证等权布局、完整截图、旧锚点、无模拟状态、两种语言的心愿单网关选项、无 JS 与 reduced-motion。未提交表单。
- 全站品牌回归 130 组，菜单回归 8 组桌面及 2 组触摸/无 JS；无浏览器运行错误。额外复核桌面、手机及英文截图，保护“下一代智能体网关”的语义断行。
- 30 秒本地移动实验：390×844、DPR 1、冷缓存、CPU 4×、1.6Mbps、150ms。中文 LCP 1164ms、CLS 0.000033；英文 LCP 1020ms、CLS 0.000120；两者初始 JS 正文资源为 12283 bytes，横向溢出为 0。实验结果不等同线上 Core Web Vitals。
- 本地预览 `http://localhost:4322/`；未提交、推送或部署，SafeGateway 源项目未修改。
