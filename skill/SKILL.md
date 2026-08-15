---
name: project-quality-inspection
description: '用于对项目做代码质量巡检——检查文档与上下文健康度，发现过期/混杂/废弃的文档与决策记录，修复项目上下文（AGENTS.md 类文件），决定哪些文档该废弃或归档，并推荐让修复不再复发的机械门禁。适用于任何项目：自动探测项目自身的结构与约定，不预设任何目录布局。'
---

# 项目质量巡检

适用于"AI 写大部分代码、人类无法逐行 review"的项目。AI 自己读项目、自己分类、自己找腐化、自己修上下文、自己判废弃、自己推荐门禁。

本 skill 是引导，不是脚本。**按阶段加载引用，不要一次性全读**。细节在 `references/` 里。

## 核心教义

每条发现必须是**证据，不是观点**：路径 + 行号 + 符号/命令/配置键。验证世界，不验证 AI 的自述。项目自身约定与本 skill 冲突时，以项目为准，记录分歧。

## 工作流

1. **摸底** —— 盘点项目：站立指令（AGENTS.md 类）、文档树、决策记录（adr/rfc/notes）、事故记录、生成文档、质量信号（lint/typecheck/test/coverage/CI）。记录有什么**和没有什么**——缺失本身就是发现项。探测真实布局，不做任何假设。
2. **清点分类** —— 建表：路径 | 角色（站立指令/架构/参考/教程/决策记录/事故/生成）| 状态 | 证据。按实际用途分类，不看路径。标记混合形态、重复事实（grep 特征短语）、手写目录、命名漂移。
3. **新鲜度审计** —— 排查腐化类并修复。加载 [references/stale-context.md](references/stale-context.md)：八类腐化、检测顺序、修复规则。
4. **废弃决策** —— 逐条定案：修复/重写/合并/归档/取代/删除。**删或归档前必读** [references/deprecation.md](references/deprecation.md)。
5. **门禁分析** —— 为会复发的发现类推荐可执行的检查。加载 [references/gates.md](references/gates.md)：类别↔门禁对照表和权衡规则。
6. **报告与修复** —— 发现表（严重度 | 路径:行 | 证据 | 决策 | 门禁）、带项目证据的决策、没改什么及原因、跑过哪些检查。安全的机械修复直接做；碰行为/契约/架构的一律先提案。每次修复后外部复查。

## 需要具体命令时

加载 [references/probes.md](references/probes.md)。命令是**校准过的范例，不是照抄**：按项目实际名字和布局调整；零命中不代表没货——先用已知正例验证模式有效。

## 引用索引

| 文件 | 何时加载 |
|---|---|
| [references/stale-context.md](references/stale-context.md) | 第 3 步开始时（新鲜度审计） |
| [references/deprecation.md](references/deprecation.md) | 第 4 步开始前（删/归档前必读） |
| [references/gates.md](references/gates.md) | 第 5 步开始时（门禁推荐） |
| [references/probes.md](references/probes.md) | 任何步骤，需要具体检测命令时 |
| [references/examples.md](references/examples.md) | 发现项有歧义、需要好坏范例校准判断时 |
