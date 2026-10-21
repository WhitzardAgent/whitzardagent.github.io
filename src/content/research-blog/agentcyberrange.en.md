---
title: "AgentCyberRange: Evaluating autonomous cyber capabilities over long-horizon tasks"
locale: en
pair: agentcyberrange-long-horizon
articleSlug: agentcyberrange
date: 2026-10-21
authors: ["NUWA Frontier AI Safety Lab"]
summary: "Starting with limited target information, AgentCyberRange evaluates how agents discover attack surfaces, exploit vulnerabilities, and carry access, credentials, and network reachability through a multistage attack."
tags: ["Cybersecurity evaluation", "Autonomous agents", "Frontier AI risk"]
infrastructureSlug: agentcyberrange
originalTitle: AgentCyberRange
originalUrl: https://agentcyberrange.io/
cover:
  src: /assets/research/agentcyberrange/attack-flow.webp
  alt: "Example attack chain spanning initial exploitation, credential discovery, code auditing, and further exploitation"
  width: 2510
  height: 532
featured: true
draft: false
---

## From reproducing vulnerabilities to autonomous attacks

Cybersecurity evaluations measure different capabilities. Given vulnerability information and a codebase, an agent may be asked to construct a proof of concept that triggers a bug. Starting with limited information about a target and pursuing a multistage attack also requires exploration, planning, and sustained decision-making.

AgentCyberRange focuses on the latter setting. The Fudan Baize team has been developing the environment since 2025 to evaluate frontier AI systems' autonomous cyber capabilities in enterprise-like environments.

## A task whose state changes at every step

Agents start with a list of target entry-point IP addresses. They must discover attack surfaces, exploit vulnerabilities, and continue after gaining initial access. Privilege escalation, credential use, and lateral movement depend on what happened earlier: a newly obtained shell, credential, permission, or network route changes the actions available next.

The figure above illustrates one such path, from an initial Confluence exploit to credential discovery, GitLab code auditing, and further exploitation. It illustrates dependencies across stages; it does not establish that every evaluated system can complete that path.

## Environment scope in this release overview

| Component | Scope |
| --- | --- |
| Real-world web applications | 30 |
| Vulnerabilities, including 0-days and 1-days | 200+ |
| Internal network environments | 50+ |
| Vulnerable hosts | 300+ |

These figures describe the snapshot used for this research overview. Environment scope and task sets may change between releases. Each evaluation should be interpreted against the project's published method and configuration.

## Complementary evaluation settings

| Dimension | CyberGym | AgentCyberRange |
| --- | --- | --- |
| Primary objective | Analyze and reproduce a target vulnerability | Evaluate autonomous cyber capabilities |
| Starting information | Vulnerability information and a codebase | Target entry-point IP addresses |
| Environment | Vulnerability instances in real software projects | Enterprise-like networks |
| Capabilities emphasized | Vulnerability analysis and PoC construction | Exploration, exploitation, and sustained decisions across later stages |
| Task structure | Targeted vulnerability task | Long-horizon, state-dependent attack chain |

The two settings provide complementary evidence. Success rates need to be read alongside task definitions, available information, and execution configurations. They cannot be directly interpreted as the probability of a successful real-world attack.

## Research engagement and trial requests

AgentCyberRange has received **trial requests from 50+ organizations**, spanning AI companies, foundation-model teams, security research groups, and universities. The count describes requests for trial access. Selected organizations are shown below with that relationship explicitly labeled.

## Interpreting results and following updates

Evaluation results should identify model and agent versions, tool permissions, task sets, budgets, and submission dates. This overview does not combine results from different configurations or tasks into a single safety score. Visit the [AgentCyberRange project](https://agentcyberrange.io/) for evaluation results and methodology.

The [original Chinese report](https://mp.weixin.qq.com/s/giumeYfpF0tmQ6CKK5KiCg) provides further context. Environment extensions and evaluation updates will be reflected in this article and in research news.
