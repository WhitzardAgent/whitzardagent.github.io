# 07｜动效与高级交互系统

## 推荐库

### 保留：Framer Motion / Motion

当前仓库已经使用它，应继续负责：

- Hero 元素入场
- 卡片和按钮微交互
- SVG path 动画
- 状态标签
- 局部 scroll-linked 动画
- reduced motion

### 新增：GSAP + ScrollTrigger

只用于两个复杂场景：

1. 首页“三链技术” pinned scrollytelling
2. 首页“研究—产品循环”路径动画

不要全站使用 GSAP，避免多个动画系统互相争夺。

### 新增：Lenis

用于桌面端平滑滚动，并与 ScrollTrigger 同步。

约束：

- 尊重 `prefers-reduced-motion`
- 触摸设备默认使用原生滚动
- 表单、锚点和键盘导航必须正常
- 不使用无限滚动和横向滚动噱头

### 使用 Astro ClientRouter

用于：

- 页面间淡入淡出
- Header 持续存在
- 品牌色在 Whitzard / NVWA 间平滑切换

## 动效分级

### L1 微交互

- 按钮
- 导航
- 标签
- 链接箭头

时长：120–220ms

### L2 内容进入

- 标题
- 说明
- 卡片
- 数据

时长：450–700ms  
位移：8–24px

### L3 叙事动画

- Runtime Trace
- Three Chains
- Research-to-Product Loop

时长由滚动驱动，不自动快速播放。

## 东方气质的动效词汇

- 生长：线条沿路径出现
- 展开：内容像屏风轻移
- 收束：风险路径被修正
- 落印：状态标签出现
- 留白：动画结束后保持静止

## 禁止

- 反复循环的强动画
- 鼠标跟随光斑
- 大量浮动卡片
- 快速数字滚动
- 过度弹簧和弹跳
- 全站 WebGL
- 首屏自动播放视频
