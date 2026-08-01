// Summarize axe-core JSON artifacts written by e2e/a11y/axe.spec.ts.
// Usage: node scripts/a11y-summary.mjs [projectDir]
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const proj = process.argv[2] ?? 'a11y-chromium'
const dir = fileURLToPath(new URL(`../test-results/a11y/${proj}`, import.meta.url))

let total = 0
for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(readFileSync(`${dir}/${file}`, 'utf8'))
  const page = file.replace('.json', '')
  const v = data.violations
  console.log(`\n=== ${page} — ${v.length} violation rule(s) ===`)
  for (const rule of v) {
    total += rule.nodes.length
    console.log(`  • [${rule.impact}] ${rule.id}: ${rule.help} (${rule.nodes.length} node(s))`)
    for (const node of rule.nodes) {
      console.log(`      target: ${JSON.stringify(node.target)}`)
      const msg = (node.any?.[0]?.message ?? node.failureSummary ?? '').replace(/\s+/g, ' ')
      console.log(`      why: ${msg.slice(0, 240)}`)
    }
  }
}
console.log(`\nTOTAL failing nodes across ${proj}: ${total}`)
