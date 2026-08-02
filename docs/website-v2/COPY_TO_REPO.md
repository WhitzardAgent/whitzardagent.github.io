# 使用方式

将本压缩包中的：

`docs/website-v2/`

复制到网站仓库：

`whitzardagent.github.io/docs/website-v2/`

然后在仓库根目录向 Codex 发送：

```text
请完整阅读 docs/website-v2/README.md、CODEX_MASTER_PROMPT.md 和目录中的全部文档。

你可以直接开始执行 CODEX_MASTER_PROMPT.md 中的任务。
先生成代码审计报告，再按 Phase 1 到 Phase 6 逐步实施。
每个阶段必须运行 npm run build，并报告修改文件、构建结果和遗留问题。
不要迁移技术栈，不要删除现有数据管线和旧路由，不要编造任何数据。
```
