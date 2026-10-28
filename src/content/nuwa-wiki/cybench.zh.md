---
recordId: "cybench"
locale: "zh"
updatedOn: "2026-10-27"
caseType: "source-workflow"
caseLabel: "同一任务，不同程度的引导"
sourceRefs: [{"url": "https://github.com/andyzorigin/cybench", "title": "Cybench: official task implementation", "locator": "README: Example Unguided Mode Run / Example Subtask Mode Run"}, {"sourceId": "cybench", "locator": "Task protocol; unguided and subtask-guided evaluation"}]
---

## 研究问题
Cybench 使用专业夺旗竞赛任务评估智能体。任务包含说明、初始材料及评测器，智能体与环境交互后提交答案。

## 代表流程：Dynastic
作者代码仓库以 HackTheBox Cyber Apocalypse 2024 的密码学任务 **Dynastic** 演示两种评测模式。该任务说明不同程度的引导如何改变测量。

无引导模式只给出最终目标；子任务模式通过中间问题引导推进，并允许记录部分完成情况。因此，同一题目可以产生不同观测：是否完成最终目标，以及完成了哪些中间步骤。

## 任务与评分
原始集合包含四场竞赛的 40 项任务。无引导完成率、有引导完成率和子任务完成比例分别具有独立含义，多次尝试覆盖也不同于单次成功率。

## 结果解读
后续报告可能改变任务子集、提示和尝试规则，比较百分比前需要核对这些条件。人类首次解出时间描述竞赛条件下的任务难度，并不是智能体运行时长。
