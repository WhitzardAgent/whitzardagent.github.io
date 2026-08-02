# 02｜视觉设计系统

## 颜色系统

### Whitzard 主品牌

| Token | 色值 | 用途 |
|---|---|---|
| `--wz-xuan` | `#102B5C` | 玄青：品牌主色、深色背景 |
| `--wz-indigo` | `#174AA6` | 靛蓝：链路、产品交互、重点标题 |
| `--wz-bright-blue` | `#2864FF` | 少量高亮、活动节点 |
| `--wz-moon` | `#F6F7F3` | 月白：全站主背景 |
| `--wz-frost` | `#EEF3F5` | 淡青灰：卡片、分区背景 |
| `--wz-ink` | `#182234` | 墨色：正文 |
| `--wz-muted` | `#667080` | 辅助文字 |
| `--wz-hairline` | `#DCE2E8` | 边框 |
| `--wz-cinnabar` | `#D8563A` | 朱砂：关键状态、CTA、落印 |
| `--wz-success` | `#2F7F7A` | 允许、安全、通过 |

### NVWA Lab

| Token | 色值 | 用途 |
|---|---|---|
| `--nw-jade` | `#76A9A4` | 玉青：研究、知识和开放协作 |
| `--nw-deep-jade` | `#2F7F7A` | 深玉青：标题、按钮 |
| `--nw-paper` | `#F4F2EC` | 纸色背景 |
| `--nw-ink` | `#1E2B2E` | 研究正文 |

## 字体

### 中文

- UI 与正文：`Noto Sans SC`, `HarmonyOS Sans SC`, system sans-serif
- 品牌判断和研究引语：`Noto Serif SC` 或思源宋体

### 英文

- UI 与正文：`Inter` 或 `Geist`
- 研究和宣言：`Source Serif 4`

### 字体使用限制

- 宋体/Serif 只用于 10% 左右的内容；
- 不要所有标题都用超粗体；
- Hero 标题字重 600，正文 400–500；
- 中文正文行高 1.75，英文正文行高 1.6。

## 圆角与边框

- 普通卡片：16px
- 重点容器：24px
- CTA：999px 或 12px，统一一种风格
- 边框：1px hairline
- 禁止所有卡片使用明显投影
- 仅浮层、导航和主视觉节点使用低透明阴影

## 空间系统

- 页面最大宽度：1200–1240px
- 桌面 section 纵向间距：120–160px
- 移动端 section 间距：72–96px
- Hero 顶部有效空间：120px
- 单段正文最大宽度：680px
- 任何一屏最多一个视觉主角

## 状态视觉

- Allow：玉青 / 玄青
- Correct：朱砂
- Approve：靛蓝
- Redact：淡朱砂
- Limit：中性蓝灰
- Block：深朱砂

状态出现动画应像“落印”：

1. 轻微缩放 0.92 → 1
2. 透明度 0 → 1
3. 120–180ms
4. 不使用弹跳
