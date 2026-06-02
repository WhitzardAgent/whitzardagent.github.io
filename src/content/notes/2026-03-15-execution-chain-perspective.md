---
title: "Why Agent Safety Needs an Execution-Chain Perspective"
date: 2026-03-15
type: note
brand: nuwa
authors: ["Nuwa Lab"]
summary: "Traditional safety evaluation focuses on model outputs. But for AI agents that chain tool calls into multi-step plans, we need to evaluate the entire execution chain — not just individual actions."
tags: ["Agent Safety", "Evaluation", "Runtime Safety"]
draft: false
featured: true
research_area: "Agent Behavior Safety"
---

## The Problem with Output-Level Evaluation

Most AI safety evaluation today focuses on the model's outputs: does the model produce harmful text? Does it refuse dangerous requests? This output-level evaluation works for chat models, but it breaks down for AI agents.

AI agents don't just produce text. They produce **actions**: executing code, calling APIs, browsing websites, sending messages. And these actions are chained together into multi-step execution plans where each step depends on the results of previous steps.

## The Execution Chain

An execution chain is the sequence of tool calls and intermediate results that an agent produces while completing a task. For example:

1. Agent receives task: "Find and summarize recent papers on AI safety"
2. Agent calls `web_search("recent AI safety papers 2026")`
3. Agent receives search results
4. Agent calls `web_fetch("https://arxiv.org/abs/...")`
5. Agent reads paper content
6. Agent calls `write_file("summary.md", ...)`

Each step in this chain is a decision point where things can go wrong. A single malicious or misaligned step can lead to unauthorized access, data exfiltration, or unintended actions.

## Why Execution-Chain Evaluation Matters

Output-level evaluation misses critical risks:

- **Context-dependent actions**: The same tool call can be safe in one context and dangerous in another. `execute_code("rm -rf /")` is dangerous; `execute_code("rm -rf /tmp/test")` may be fine.
- **Emergent risk from chaining**: Individual steps may appear safe, but their combination can produce harmful outcomes. An agent that browses the web and then writes a file is normal; an agent that browses a phishing site and then writes credentials to a file is dangerous.
- **Policy violations at boundaries**: Risk often emerges at the boundaries between tool calls — when an agent transitions from reading to writing, from browsing to executing, or from analyzing to acting.

## What We Propose

We propose evaluating AI agent safety at the execution-chain level, not just the individual action level. This means:

1. **Trace the full execution chain**: Log every tool call, its inputs, outputs, and the reasoning that led to it.
2. **Evaluate transitions**: Check whether the transition between steps is consistent with the agent's stated goal and safety constraints.
3. **Enforce boundaries**: Implement runtime policy checks at execution boundaries, not just at individual action level.
4. **Audit the chain**: Maintain a complete audit trail that can be reviewed after execution.

This execution-chain perspective is the foundation of the Nuwa Agent Safety Framework and the design of AgentGuard.
