---
title: "AgentCyberRange：评测长程自主网络攻击能力"
locale: zh
pair: agentcyberrange-long-horizon
articleSlug: agentcyberrange
date: 2026-10-21
updated: 2026-10-22
authors: ["女娲实验室"]
summary: "从有限目标信息出发，评测智能体的攻击面发现、漏洞利用及长程攻击规划能力。"
tags: ["网络安全评测", "自主智能体", "前沿 AI 风险"]
infrastructureSlug: agentcyberrange
originalTitle: AgentCyberRange
originalUrl: https://agentcyberrange.io/
cover:
  src: /assets/research/agentcyberrange/results-comparison.webp
  thumbnail: /assets/research/agentcyberrange/results-comparison-1280.webp
  alt: "不同模型在 Web 利用与后渗透任务中的成功率对比，包含 Level-0、Level-1 和 Level-2 三组设置"
  caption: "Web 利用与后渗透任务的结果对比。不同任务阶段应分别解读。"
  width: 2372
  height: 972
featured: true
draft: false
---

## 研究问题

评估 AI 的网络安全能力，需要区分不同任务所要求的能力。给定漏洞信息与代码库，构造能够触发漏洞的 PoC，可以衡量漏洞分析和复现能力；从有限目标信息出发，自主发现攻击面并推进后续攻击，则进一步考察探索、规划与持续决策。

AgentCyberRange 面向后一类问题。复旦白泽团队自 2025 年以来持续构建这一评测环境，研究前沿 AI 系统在复杂企业场景中的自主网络攻击能力。

## 评测结果

![不同模型在 Web 利用与后渗透任务中的成功率对比](/assets/research/agentcyberrange/results-comparison.webp "图 1｜Web 利用与后渗透任务的成功率，按模型与图中设置分别呈现。")

图示来源：研究团队提供；项目与方法见 [AgentCyberRange](https://agentcyberrange.io/)。

这张图把 Web 利用与后渗透分开呈现。两类任务考察的能力并不相同：前者关注初始攻击面与漏洞利用，后者进一步涉及取得访问权限后的探索与持续行动。将两部分放在一起阅读，可以看到模型表现随任务阶段和设置发生的变化；不宜把它们压缩成一个缺乏上下文的总分。

图中的结果应结合对应任务与执行配置理解，不能直接外推为真实网络攻击的发生概率。

## 长程攻击轨迹

![一条贯穿三个网络区段的攻击轨迹，区分成功利用、到达但未利用、线索复用、扫描与失败尝试](/assets/research/agentcyberrange/attack-trajectory.webp "图 2｜三个网络区段中的长程任务轨迹。成功推进、线索复用与未成功的探索共同构成任务过程。")

图示来源：研究团队提供。

### 状态与线索复用

轨迹从初始入口向更深的网络区段推进。前一步获得的访问权限、凭证和服务线索，会改变下一步可以尝试的操作。图中的跨区段连接说明，后续行动依赖已经建立的状态，而不是一组彼此独立的漏洞任务。

### 失败路径与任务过程

图中同时保留扫描、失败尝试、已到达但未利用的目标，以及成功利用的节点。只保留最后的成功路径，会掩盖探索过程中的分支与限制。完整轨迹有助于分析智能体如何使用已有信息、在哪里受阻，以及某次推进依赖了什么条件。

该图用于解释一条任务轨迹，不代表所有受测系统都能完成同样的路径。

## 任务设置与环境

### 攻击链与状态依赖

智能体从目标入口 IP 列表出发，需要自主发现攻击面、完成漏洞利用，并在获得初始访问权限后继续推进任务。外网打点、权限提升、凭证利用与横向移动之间存在状态依赖。

![从初始利用到凭证发现、代码审计与后续利用的任务流程](/assets/research/agentcyberrange/attack-flow.webp "图 3｜任务机制示例：初始利用、凭证发现、代码审计与后续利用之间的状态依赖。")

图示来源：[原始成果介绍](https://mp.weixin.qq.com/s/giumeYfpF0tmQ6CKK5KiCg)。

这张方法图与上面的轨迹图承担不同作用：方法图概括任务中信息与权限的依赖关系，轨迹图则展示一条包含探索分支的具体路径。

### 环境规模

| 组成 | 规模 |
| --- | --- |
| 真实 Web 应用 | 30 个 |
| 0-day、1-day 等漏洞 | 200+ 个 |
| 内网环境 | 50+ 个 |
| 漏洞主机 | 300+ 台 |

以上为原成果介绍中的环境规模快照。环境范围和任务集合可能随版本变化，具体评测应以项目发布的方法与配置为准。

## 适用范围

| 维度 | CyberGym | AgentCyberRange |
| --- | --- | --- |
| 主要目标 | 分析并复现目标漏洞 | 评测自主网络攻击能力 |
| 起始信息 | 漏洞相关信息与代码库 | 目标入口 IP 列表 |
| 任务环境 | 真实软件项目中的漏洞实例 | 复杂企业网络环境 |
| 重点能力 | 漏洞分析与 PoC 构造 | 探索、利用及后续攻击阶段的持续决策 |
| 任务结构 | 目标漏洞任务 | 长程、状态依赖的攻击链 |

这两类评测提供互补证据。成功率应结合任务定义、提供的信息、工具权限与预算解释，不同配置或不同任务的结果不能直接合并为统一安全分数。

## 项目与更新

AgentCyberRange 已有 **100+ 家全球研究机构申请使用**。这一数字反映使用申请的范围，不代表已完成部署；下方展示部分申请机构。

最新评测结果与方法请访问 [AgentCyberRange 项目官网](https://agentcyberrange.io/)，相关中文介绍见[原始报道](https://mp.weixin.qq.com/s/giumeYfpF0tmQ6CKK5KiCg)。

**2026-10-22 更新：**补充评测结果图、跨网络区段轨迹及图示解读。
