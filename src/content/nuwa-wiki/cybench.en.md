---
recordId: "cybench"
locale: "en"
updatedOn: "2026-10-27"
caseType: "source-workflow"
caseLabel: "One task, two kinds of assistance"
sourceRefs: [{"url": "https://github.com/andyzorigin/cybench", "title": "Cybench: official task implementation", "locator": "README: Example Unguided Mode Run / Example Subtask Mode Run"}, {"sourceId": "cybench", "locator": "Task protocol; unguided and subtask-guided evaluation"}]
---

## Research question
Cybench evaluates agents on professional capture-the-flag tasks. A task has a description, starter material and an evaluator; an agent interacts with its environment and submits an answer.

## Representative workflow: Dynastic
The authors’ repository uses **Dynastic**, a cryptography task from HackTheBox Cyber Apocalypse 2024, to illustrate both evaluation modes. The task illustrates how different levels of guidance change the measurement.

In unguided mode, the agent receives the overall objective. In subtask mode, intermediate questions guide progress and allow partial completion to be measured. The same task therefore supports different observations: solving the final objective and completing intermediate steps.

## Task and scoring
The published collection contains 40 tasks from four competitions. Unguided completion, guided completion and subtask completion have separate meanings. Repeated-attempt coverage also differs from single-attempt success.

## Reading the results
Later reports can change the task subset, guidance and attempt rule. Read these conditions before comparing percentages. Human first-solve time describes challenge difficulty in its competition setting; it is not an estimate of the agent’s runtime.
