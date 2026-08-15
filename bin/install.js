#!/usr/bin/env node
/**
 * dsh-quality-inspection installer
 *
 * Usage:
 *   npx dsh-quality-inspection install [target-dir]
 *   npx dsh-quality-inspection --check-self
 *
 * Copies the skill (SKILL.md + references/) into <target-dir>/.agents/skills/project-quality-inspection/
 * and appends a short usage note to the target's AGENTS.md/CLAUDE.md if present.
 * Default target: current working directory.
 */
import { cp, mkdir, readFile, appendFile, access } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILL_SRC = resolve(__dirname, '..', 'skill')
const SKILL_NAME = 'project-quality-inspection'
const USAGE_NOTE = `
## 质量巡检

- 代码/文档质量保障巡检使用 \`.agents/skills/project-quality-inspection/SKILL.md\`：AI 自己读项目、自己分类、自己找腐化（过期/混杂/废弃文档与决策记录）、自己修上下文、自己判废弃、自己推荐门禁。按阶段加载 \`references/\`，不要一次性全读。
- 每次巡检输出：发现表（严重度 | 路径:行 | 证据 | 决策 | 门禁）、带项目证据的决策、没改什么及原因、跑过哪些检查。验证世界，不验证自述。
`

async function checkSelf() {
  const files = ['SKILL.md', 'references/stale-context.md', 'references/deprecation.md',
    'references/gates.md', 'references/probes.md', 'references/examples.md']
  for (const f of files) {
    try { await access(resolve(SKILL_SRC, f)) } catch { throw new Error(`missing ${f} in package`) }
  }
  console.log('[dsh-quality-inspection] package self-check OK: skill files present')
}

async function install(target) {
  const dir = resolve(target || '.')
  const dest = join(dir, '.agents', 'skills', SKILL_NAME)
  await mkdir(join(dest, 'references'), { recursive: true })
  await cp(resolve(SKILL_SRC, 'SKILL.md'), join(dest, 'SKILL.md'))
  await cp(resolve(SKILL_SRC, 'references'), join(dest, 'references'), { recursive: true })
  console.log(`[dsh-quality-inspection] skill installed -> ${dest}`)

  for (const name of ['AGENTS.md', 'CLAUDE.md']) {
    const p = join(dir, name)
    try { await access(p) } catch { continue }
    const content = await readFile(p, 'utf-8')
    if (content.includes('质量巡检') || content.includes('project-quality-inspection')) {
      console.log(`[dsh-quality-inspection] ${name} already references the skill, skipped`)
    } else {
      await appendFile(p, USAGE_NOTE)
      console.log(`[dsh-quality-inspection] appended usage note to ${name}`)
    }
  }
  console.log('[dsh-quality-inspection] done. Tell your agent: 用 project-quality-inspection skill 巡检这个项目')
}

const args = process.argv.slice(2)
if (args.includes('--check-self')) {
  checkSelf().then(() => process.exit(0), e => { console.error(e.message); process.exit(1) })
} else if (args[0] === 'install') {
  install(args[1]).then(() => process.exit(0), e => { console.error(`[dsh-quality-inspection] ${e.message}`); process.exit(1) })
} else {
  console.log(`dsh-quality-inspection v0.1.0 — install the skill into a project

Usage:
  npx dsh-quality-inspection install [target-dir]   install skill into target (default: cwd)
  npx dsh-quality-inspection --check-self            verify package files

After install, the skill lives at <target>/.agents/skills/project-quality-inspection/
and your agent can run it with: 用 project-quality-inspection skill 巡检这个项目
`)
  process.exit(0)
}
