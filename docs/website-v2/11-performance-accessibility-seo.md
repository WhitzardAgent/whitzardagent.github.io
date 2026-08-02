# 11｜性能、无障碍与 SEO

## 性能预算

- 首页初始 JS：目标 `< 180KB gzip`
- 单个非首屏 island：目标 `< 70KB gzip`
- LCP：移动端目标 `< 2.5s`
- CLS：`< 0.05`
- 首屏不得加载大型视频
- 视觉图形优先 SVG
- 图片使用 Astro Image 管线
- 非首屏 React 使用 `client:visible`

## 动画性能

- 只动画 transform、opacity、stroke-dashoffset
- 避免持续 box-shadow 和 filter 动画
- 页面不可见时暂停循环
- reduced motion 下禁用 parallax、Lenis 和 pinned scrollytelling
- 移动端将复杂场景降级为静态步骤

## 无障碍

- 所有交互可键盘访问
- 状态动画必须有文字结果
- SVG 装饰设置 `aria-hidden`
- Hero 视觉不能承载唯一信息
- 对比度满足 WCAG AA
- 移动菜单焦点锁定
- 语言切换有明确 aria-label
- 不自动移动焦点

## SEO

BaseLayout 增加：

- locale-aware title / description
- canonical
- hreflang
- Open Graph locale
- Organization JSON-LD
- SoftwareApplication JSON-LD（AgentGuard 页面）
- ResearchOrganization JSON-LD（NVWA 页面）
- breadcrumb schema

## 内容可信度

以下数据必须由配置文件统一管理，不得散落在页面：

- 支持框架数量
- 开源项目数量
- 论文数量
- Benchmark 数量
- 模型参数规模
- 性能指标
- 合作伙伴和奖项

新增：

`src/data/evidence.ts`
