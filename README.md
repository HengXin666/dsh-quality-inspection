# dsh-quality-inspection

A portable **project quality-inspection skill** extracted from [DeepSeek Harness](https://github.com/deepseek-ai/dsh) — a 12,294-commit codebase built by AI agents for AI agents. This package distills how that project keeps AI output deterministic, verifiable, non-destructive, constrained, and high-quality, into a skill any project can install in one command.

[English](README.en.md) | [中文](README.md) — 主文档为中文。

## What this is

For projects where **an AI writes most of the code and a human cannot review every line**, this skill makes the AI audit its own context:

- **Inventory** the project (standing orders, docs, decision records, quality signals) and record what is *missing* — absence is a finding.
- **Classify** documents by actual role, not by path or title.
- **Audit freshness**: eight stale-context classes (dead references, history narration, version-mixed docs, broken links, non-compiling code blocks, contradictory decision records, intermediate artifacts, orphaned standing orders).
- **Decide deprecation**: repair / rewrite / consolidate / archive / supersede / delete — never silently.
- **Recommend gates** so each recurring finding class fails in CI.
- **Report with evidence**: severity | path:line | evidence | decision | gate. Verify the world, not the self-report.

The skill body is intentionally short (~37 lines) with details in `references/` loaded per phase — no context bloat.

## Why it exists (the origin)

DeepSeek Harness was built from zero (first commit 2026-06-10) to a public release (0.1.0-rc.5, 2026-08-13) in ~2 months and 12,294 commits, almost entirely by coding agents. The engineering method that made that possible — and that survived agent turnover — was extracted into this package:

- **Mechanical gates over prose conventions**: agents follow enforced exit codes far more reliably than prose rules (per-file 100% coverage, doc-sync, link checks, rename ledgers).
- **Event-sourced sessions**: model-visible ⟺ logged, replayable, immutable.
- **Decision records with mandatory alternatives**: proposed → implemented (kept current with code) → archived (frozen).
- **Verify the world, not the self-report**: e2e re-runs commands and re-reads files; an AI's own output is never evidence.
- **Capability seams** (Service Definition / Provider / Consumer) so swapping implementations never touches model-facing contracts.

The full research — build timeline and the three questions (context / quality / control) — is in [docs/harness-method.html](docs/harness-method.html) (a merged, tabbed, self-contained page, no external dependencies).

## Install

Requires Node.js ≥ 18 and npm. No build step, no dependencies.

```sh
# install the skill into the current project (works from the GitHub repo, no npm publish needed)
npx github:HengXin666/dsh-quality-inspection install

# install into a specific project directory
npx github:HengXin666/dsh-quality-inspection install /path/to/project
```

Once published to npm, the same command works with the short form:

```sh
npx dsh-quality-inspection install
```

Or add it as a dev dependency:

```sh
npm install --save-dev dsh-quality-inspection
npx dsh-quality-inspection install
```

What `install` does:

1. Copies `skill/SKILL.md` + `skill/references/*.md` into `<project>/.agents/skills/project-quality-inspection/`.
2. If the project has `AGENTS.md` or `CLAUDE.md`, appends a short usage note (idempotent — skips if already referenced).

## Use

After install, tell your agent:

> 用 project-quality-inspection skill 巡检这个项目

(Or in English: *Use the project-quality-inspection skill to inspect this project.*)

The agent will: orient → inventory → freshness audit → deprecation decisions → gate analysis → report & repair. It loads `references/` per phase, on demand.

## Repository layout

```
skill/                     the skill itself (portable, self-contained)
  SKILL.md                 short main body: doctrine + 6-step workflow + reference index
  references/              loaded per phase, never all at once
    stale-context.md       eight stale-context classes + repair rules
    deprecation.md         decision ladder + rules (read before deleting/archiving)
    gates.md               finding-class → gate table + tradeoff rules
    probes.md              calibrated detection commands (adapt, don't copy)
    examples.md            good/bad examples + overcorrection traps
docs/
  harness-method.html      merged research: build timeline + three questions (self-contained, tabbed)
bin/install.js             the installer (also npm bin)
```

## License

MIT
