# 03｜信息架构与中英文方案

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
- Company
- Book a Demo

## 推荐路由

为保留现有外部链接，英文继续使用无前缀路由，中文新增 `/zh`：

| English | 中文 |
|---|---|
| `/` | `/zh/` |
| `/agentguard` | `/zh/agentguard` |
| `/solutions` | `/zh/solutions` |
| `/nuwa` | `/zh/nuwa` |
| `/research` | `/zh/research` |
| `/open-ecosystem` | `/zh/open-ecosystem` |
| `/about` | `/zh/about` |
| `/contact` | `/zh/contact` |

保留兼容路由：

- `/open-source` → `/open-ecosystem`
- `/publications` → `/research`
- `/NVWA-Project/` → `/nuwa`

## 实施方式

### Astro 配置

在 `astro.config.mjs` 中启用：

- locales: `en`, `zh`
- default locale: `en`
- default locale 不加前缀
- 中文使用 `/zh/*`

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
