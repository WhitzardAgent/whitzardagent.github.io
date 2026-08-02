# 08｜组件架构与具体代码修改

## 新增目录

```text
src/
  components/
    brand/
      Wordmark.astro
      BrandSeal.astro
    layout/
      SiteHeader.astro
      SiteFooter.astro
      LanguageSwitch.astro
      DemoCTA.astro
    home/
      HomeHero.tsx
      RuntimeTrace.tsx
      ManifestoBand.astro
      PlatformStack.tsx
      ThreeChainScrolly.tsx
      ResearchProductLoop.tsx
      EnterpriseProof.astro
      OpenEcosystemPreview.astro
    agentguard/
      AgentRuntimeDemo.tsx
      PlatformLayer.astro
      DeploymentArchitecture.tsx
      EvidenceStrip.astro
    motion/
      MotionProvider.tsx
      Reveal.tsx
      LineDraw.tsx
      StampState.tsx
      SmoothScroll.tsx
  i18n/
    config.ts
    routes.ts
    ui.en.ts
    ui.zh.ts
    pages/
  styles/
    tokens.css
    typography.css
    components.css
    motion.css
```

## 现有组件处理

| 文件 | 处理方式 |
|---|---|
| `WhitzardHero.tsx` | 重构为 `home/HomeHero.tsx` |
| `HeroBackdropWhitzard.tsx` | 替换为 `RuntimeTrace.tsx` |
| `NuwaHero.tsx` | 保留思路，统一 token 和 locale props |
| `AnimatedStoneSequence.tsx` | 降级为品牌装饰，不进入所有页面 |
| `FloatingResearchCards.tsx` | 仅 NVWA 使用，减少浮动幅度 |
| `SignalNodes.tsx` | 可复用为轨迹节点底层 primitive |
| `visuals/FiveStoneMotif.astro` | 保留为品牌分隔符，使用频率降低 |
| `Header.astro` | 重写为双语、产品优先、带 Demo CTA |
| `BaseLayout.astro` | 增加 locale、hreflang、ClientRouter 和结构化数据 |

## package.json 建议

保留：

- Astro
- React
- Tailwind
- framer-motion

新增：

- `gsap`
- `lenis`
- `clsx`
- `tailwind-merge`

暂不加入：

- Three.js
- React Three Fiber
- React Flow
- Lottie

原因：主视觉可以由 SVG + Motion + GSAP 完成，体积更小，也更符合克制和东方感。

## Astro Islands 策略

### `client:load`

仅限：

- 首页首屏 Runtime Trace
- Header 必需交互

### `client:visible`

用于：

- ThreeChainScrolly
- ResearchProductLoop
- AgentRuntimeDemo
- DeploymentArchitecture

### 纯 Astro

- 文案 section
- 卡片
- 新闻
- 论文
- 项目列表
- Footer
- SEO

## BaseLayout Props

建议新增：

```ts
interface Props {
  title: string;
  description: string;
  locale: "en" | "zh";
  brand?: "whitzard" | "nuwa";
  ogImage?: string;
  alternatePath?: string;
  noindex?: boolean;
}
```

## Header

桌面端：

`Whitzard | Platform | Solutions | Research | Open Source | Company | EN/中文 | Book a Demo`

移动端：

- 简洁抽屉
- 产品和研究分组
- CTA 固定在底部
- 禁止把 GitHub / Hugging Face 图标挤在主导航

## 首页文件

`src/pages/index.astro` 只负责组合，不应继续包含大量文案数组和布局细节。

建议压缩到 80–120 行。
