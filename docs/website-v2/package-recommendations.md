# 动态与组件库建议

## 建议安装

```bash
npm install gsap lenis clsx tailwind-merge
```

## 各库职责

| 库 | 职责 | 使用范围 |
|---|---|---|
| Framer Motion（现有） | React 微交互、SVG、Hero、状态动画 | 全站局部 |
| GSAP + ScrollTrigger | pinned 滚动叙事、复杂时间线 | 仅 2 个旗舰 section |
| Lenis | 桌面平滑滚动和 ScrollTrigger 同步 | 全站可选、可降级 |
| clsx + tailwind-merge | 可靠组合 Tailwind class | 组件底层 |
| Astro ClientRouter | 页面转场和视觉连续性 | 全站 |

## 不建议安装

### Three.js / React Three Fiber

当前品牌不需要 3D 场景。它会：

- 增加首屏 JS；
- 容易落入通用科技网站风格；
- 降低移动端体验；
- 削弱“冷静、精密”的东方气质。

### React Flow

适合编辑器和可交互流程图，不适合首页品牌视觉。Agent Runtime 应使用定制 SVG。

### Lottie

适合固定动画素材，但不利于将真实状态和滚动进度绑定到视觉。

## 使用原则

高级感来自：

- 视觉和业务概念一致；
- 动画节奏统一；
- 页面层次和留白；
- 清晰的状态变化；
- 性能稳定。

库本身不等于高级感。
