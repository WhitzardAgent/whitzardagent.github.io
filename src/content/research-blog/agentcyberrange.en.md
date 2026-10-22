---
title: "AgentCyberRange: Evaluating autonomous cyber capabilities over long-horizon tasks"
locale: en
pair: agentcyberrange-long-horizon
articleSlug: agentcyberrange
date: 2026-10-21
updated: 2026-10-22
authors: ["NUWA Frontier AI Safety Lab"]
summary: "Starting with limited target information, AgentCyberRange evaluates how agents discover attack surfaces, exploit vulnerabilities, and carry access, credentials, and network reachability through a multistage attack."
tags: ["Cybersecurity evaluation", "Autonomous agents", "Frontier AI risk"]
infrastructureSlug: agentcyberrange
originalTitle: AgentCyberRange
originalUrl: https://agentcyberrange.io/
cover:
  src: /assets/research/agentcyberrange/results-comparison.webp
  thumbnail: /assets/research/agentcyberrange/results-comparison-1280.webp
  alt: "Model success rates on web exploitation and post-exploitation tasks, shown under Level-0, Level-1, and Level-2 settings"
  caption: "Results for web exploitation and post-exploitation tasks. Interpret each task stage separately."
  width: 2372
  height: 972
featured: true
draft: false
---

## Research question

Cybersecurity evaluations measure different capabilities. Given vulnerability information and a codebase, an agent may be asked to construct a proof of concept that triggers a bug. Starting with limited information about a target and pursuing a multistage attack also requires exploration, planning, and sustained decision-making.

AgentCyberRange focuses on the latter setting. The Fudan Baize team has been developing the environment since 2025 to evaluate frontier AI systems' autonomous cyber capabilities in enterprise-like environments.

## Evaluation results

![Model success rates on web exploitation and post-exploitation tasks](/assets/research/agentcyberrange/results-comparison.webp "Figure 1. Success rates on web exploitation and post-exploitation tasks, shown by model and evaluation setting.")

Figure supplied by the research team. See [AgentCyberRange](https://agentcyberrange.io/) for the project and methodology.

The figure separates web exploitation from post-exploitation. The first concerns discovering and exploiting an initial attack surface; the second also involves exploration and continued action after access has been obtained. Reading the panels together shows how performance varies across task stages and settings, rather than reducing it to a single score without context.

Results need to be interpreted alongside their task definitions and execution configurations. These success rates are not probabilities of real-world attacks.

## Long-horizon attack trajectory

![An attack trajectory across three network segments, showing successful exploitation, reached but unexploited targets, reused clues, scans, and failed attempts](/assets/research/agentcyberrange/attack-trajectory.webp "Figure 2. A long-horizon task across three network segments. Successful advances, reused clues, and unsuccessful exploration are all part of the trajectory.")

Figure supplied by the research team.

### State and clue reuse

The trajectory moves from an initial entry point into deeper network segments. Access, credentials, and service information obtained earlier change the actions available later. Connections between segments show that progress depends on accumulated state, rather than a collection of independent vulnerability tasks.

### Unsuccessful paths and exploration

The figure retains scans, failed attempts, targets that were reached but not exploited, and successful exploitation nodes. Showing only the final successful path would hide branches and constraints encountered during exploration. The fuller record helps explain how an agent uses available information, where it gets stuck, and which conditions make further progress possible.

This is one task trajectory, not evidence that every evaluated system can follow the same path.

## Task setting and environment

### Attack chains and state dependencies

Agents start with a list of target entry-point IP addresses. They must discover attack surfaces, exploit vulnerabilities, and continue after gaining initial access. Privilege escalation, credential use, and lateral movement depend on what happened earlier.

![A task flow spanning initial exploitation, credential discovery, code auditing, and further exploitation](/assets/research/agentcyberrange/attack-flow.webp "Figure 3. An example task structure: state dependencies link initial exploitation, credential discovery, code auditing, and further exploitation.")

Figure source: [original research overview](https://mp.weixin.qq.com/s/giumeYfpF0tmQ6CKK5KiCg).

This method figure and the trajectory above serve different purposes. The method figure summarizes dependencies between information and access; the trajectory illustrates one concrete path with exploratory branches.

### Environment scope

| Component | Scope |
| --- | --- |
| Real-world web applications | 30 |
| Vulnerabilities, including 0-days and 1-days | 200+ |
| Internal network environments | 50+ |
| Vulnerable hosts | 300+ |

These figures describe the environment snapshot from the original research overview. Scope and task sets may change between releases. Each evaluation should be read against its published method and configuration.

## Scope and interpretation

| Dimension | CyberGym | AgentCyberRange |
| --- | --- | --- |
| Primary objective | Analyze and reproduce a target vulnerability | Evaluate autonomous cyber capabilities |
| Starting information | Vulnerability information and a codebase | Target entry-point IP addresses |
| Environment | Vulnerability instances in real software projects | Enterprise-like networks |
| Capabilities emphasized | Vulnerability analysis and PoC construction | Exploration, exploitation, and sustained decisions across later stages |
| Task structure | Targeted vulnerability task | Long-horizon, state-dependent attack chain |

The two settings provide complementary evidence. Success rates depend on task definitions, available information, tool permissions, and budgets. Results from different configurations or tasks cannot simply be combined into a single safety score.

## Project and updates

AgentCyberRange has received **access requests from 100+ research institutions worldwide**. This count refers to requests, not completed deployments. Selected institutions are shown below.

Visit the [AgentCyberRange project](https://agentcyberrange.io/) for evaluation results and methodology. The [original Chinese report](https://mp.weixin.qq.com/s/giumeYfpF0tmQ6CKK5KiCg) provides further context.

**Updated October 22, 2026:** Added evaluation and cross-network trajectory figures with accompanying discussion.
