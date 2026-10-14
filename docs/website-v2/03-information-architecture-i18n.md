# 03｜信息架构与中英文方案

## 2026-10-14 Research 统一入口（覆盖下方旧研究栏目规则）

- “前沿研究”文字点击进入 `/nuwa` 的实验室介绍；相邻箭头提供分类菜单，移动端亦分开链接与展开按钮。
- 实验室介绍下方通过三个入口卡片进入 Research：Publication、Technical Report、Blogs。
- `/nuwa/research` 与 `/en/nuwa/research` 为统一的研究列表；`?kind=publication`、`?kind=technical-report`、`?kind=blogs` 指定内容类型。默认全部，分类切换清空其他筛选，重置搜索／标签不改变已选分类。
- 旧 `/nuwa/blog` 与 `/en/nuwa/blog` 保留静态跳转至对应的 Blogs 分类；文章详情与 RSS 保持原路由。重定向列表页不进入 sitemap。
- 白泽指数仅呈现名称与“建设中 / Under construction”，撤下图表、结果与方法正文；原始数据仍保留在仓库。

## 推荐导航

中文：

- 产品
- 解决方案
- 研究
- 开源生态
- 关于我们
- 预约演示

English:

- Platform
- Solutions
- Research
- Open Source
- About Us
- Book a Demo

## 推荐路由

中文为默认语言并使用无前缀路由，英文使用 `/en`；旧 `/zh/*` 作为兼容入口：

| 中文 | English |
|---|---|
| `/` | `/en/` |
| `/agentguard` | `/en/agentguard` |
| `/solutions` | `/en/solutions` |
| `/nuwa` | `/en/nuwa` |
| `/research` | `/en/research` |
| `/news` | `/en/news` |
| `/open-ecosystem` | `/en/open-ecosystem` |
| `/about` | `/en/about` |
| `/contact` | `/en/contact` |

保留兼容路由：

- `/open-source` → `/open-ecosystem`
- `/publications` → `/research`
- `/NVWA-Project/` → `/nuwa`

## 实施方式

### Astro 配置

在 `astro.config.mjs` 中启用：

- locales: `en`, `zh`
- default locale: `zh`
- 中文不加前缀
- 英文使用 `/en/*`
- 旧 `/zh/*` 输出 noindex 静态兼容跳转

### 文案组织

新增：

```text
src/i18n/
  config.ts
  routes.ts
  ui.en.ts
  ui.zh.ts
  pages/
    home.en.ts
    home.zh.ts
    agentguard.en.ts
    agentguard.zh.ts
```

禁止在 React 视觉组件中直接硬编码中英文长文案。组件接收 `copy` props。

## 语言切换

Header 中使用 `EN / 中文`，不使用地球图标。

切换规则：

1. 当前页面存在对应语言时，跳转对应页面；
2. 不存在时回到该语言首页；
3. 记录到 localStorage；
4. 不做强制浏览器语言重定向；
5. 首次中文浏览器访问英文站时，可显示一次轻量提示。

## SEO

每页必须输出：

- 正确的 `<html lang>`
- canonical
- `hreflang="en"`
- `hreflang="zh-CN"`
- `hreflang="x-default"`
- 本地化 title / description / OG image alt
