---
recordId: "cybergym"
locale: "en"
updatedOn: "2026-10-27"
caseType: "source-example"
caseLabel: "A reproducible crash, rather than a plausible explanation"
sourceRefs: [{"sourceId": "cybergym", "locator": "§3.2; Appendix E; Appendix F, Figures 22–24"}]
---

## Research question
CyberGym asks whether an agent can turn a vulnerability description and a software project into an input that reproduces a real fault. The result is checked by execution, making the distinction between explaining a bug and demonstrating it observable.

## Representative case: a file-processing vulnerability
In Appendix F, the authors compare agents working on a file-format task. One run modifies an existing repository test file and reaches the target fault; other runs build or generate candidate inputs without reproducing it. Appendix F contains the original trajectories.

The important distinction is between intermediate progress—finding files, building software, constructing an input—and the evaluator-confirmed outcome. A convincing narrative does not substitute for a valid reproduction.

## Task and scoring
The task supplies a controlled software environment. The agent investigates the project and submits a candidate input; execution determines whether the intended vulnerability is triggered. Input-information levels and resource budgets change the task being measured.

## Reading the results
Read reproduction rates alongside the harness, information level and budget. These are measurements of vulnerability reproduction, not end-to-end compromise of a deployed organization.
