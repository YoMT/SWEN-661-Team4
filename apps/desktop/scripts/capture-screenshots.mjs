// Capture a screenshot gallery of the built CareConnect desktop app and emit a
// DOCX. Launches the production build (out/) with Electron's remote-debugging
// port, drives it over the Chrome DevTools Protocol (log in with the demo
// account, visit each screen), captures PNGs, writes a Markdown doc, and converts
// it to DOCX by reusing Documentation/md_to_docx.py. No external dependencies:
// Node 22's global WebSocket + fetch speak CDP directly.
//
// Usage (from apps/desktop):  node scripts/capture-screenshots.mjs
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import electronPath from 'electron'

const __dirname = dirname(fileURLToPath(import.meta.url))
const APP_DIR = resolve(__dirname, '..') // apps/desktop
const REPO_DIR = resolve(APP_DIR, '..', '..')
const DOC_DIR = join(REPO_DIR, 'Documentation')
const SHOTS_DIR = join(DOC_DIR, 'screenshots')
const PORT = Number(process.env.CDP_PORT || 9222)
const DEMO_EMAIL = 'demo@careconnect.com'
const DEMO_PASSWORD = 'demo123'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// ---- tiny CDP client -------------------------------------------------------
function cdpConnect(wsUrl) {
  const ws = new WebSocket(wsUrl)
  const pending = new Map()
  let nextId = 1
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve: res, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(new Error(msg.error.message))
      else res(msg.result)
    }
  })
  const ready = new Promise((res, rej) => {
    ws.addEventListener('open', () => res())
    ws.addEventListener('error', () => rej(new Error('CDP websocket error')))
  })
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const id = nextId++
      pending.set(id, { resolve: res, reject: rej })
      ws.send(JSON.stringify({ id, method, params }))
    })
  return { ws, ready, send }
}

async function findPageTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`)
      const targets = await res.json()
      const page = targets.find(
        (t) => t.type === 'page' && t.webSocketDebuggerUrl && !t.url.startsWith('devtools://')
      )
      if (page) return page
    } catch {
      /* server not up yet */
    }
    await delay(500)
  }
  throw new Error('Timed out waiting for the Electron CDP page target.')
}

// ---- main ------------------------------------------------------------------
async function main() {
  if (!existsSync(join(APP_DIR, 'out', 'renderer', 'index.html'))) {
    throw new Error("out/renderer/index.html not found. Run 'electron-vite build' first.")
  }
  mkdirSync(SHOTS_DIR, { recursive: true })

  console.log(`Launching Electron (remote debugging on ${PORT})...`)
  const proc = spawn(
    electronPath,
    ['.', `--remote-debugging-port=${PORT}`, '--no-sandbox'],
    { cwd: APP_DIR, stdio: 'ignore', windowsHide: false }
  )
  let cdp = null
  const captured = []

  try {
    const target = await findPageTarget()
    cdp = cdpConnect(target.webSocketDebuggerUrl)
    await cdp.ready
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    // Consistent, crisp 1440x900 frames regardless of the actual OS window size.
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    })

    const evalJS = async (expression) => {
      const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true
      })
      if (exceptionDetails) throw new Error(exceptionDetails.text || 'evaluate failed')
      return result.value
    }

    const waitFor = async (selector, timeout = 15000) => {
      const start = Date.now()
      while (Date.now() - start < timeout) {
        if (await evalJS(`!!document.querySelector(${JSON.stringify(selector)})`)) return true
        await delay(250)
      }
      return false
    }

    const capture = async (name) => {
      await delay(500) // let transitions/paint settle
      const { data } = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true
      })
      const file = join(SHOTS_DIR, name)
      writeFileSync(file, Buffer.from(data, 'base64'))
      const kb = (statSync(file).size / 1024).toFixed(0)
      console.log(`  captured ${name} (${kb} KB)`)
      captured.push(name)
    }

    // 1. Landing
    await waitFor('.landing', 20000)
    await capture('01-landing.png')

    // 2. Login
    await evalJS(
      `(() => { const b = document.querySelector('.landing-signin') || document.querySelector('.ask-pill'); if (b) { b.click(); return true } return false })()`
    )
    await waitFor('.login-page', 8000)
    await capture('02-login.png')

    // 3. Dashboard (log in with the demo account)
    await evalJS(`(() => {
      const set = (el, v) => {
        const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')
        d.set.call(el, v)
        el.dispatchEvent(new Event('input', { bubbles: true }))
      }
      const email = document.querySelector('#email')
      const pw = document.querySelector('#password')
      if (!email || !pw) return false
      set(email, ${JSON.stringify(DEMO_EMAIL)})
      set(pw, ${JSON.stringify(DEMO_PASSWORD)})
      const form = document.querySelector('.login-card')
      if (form && form.requestSubmit) form.requestSubmit()
      else document.querySelector('.login-card button[type=submit]').click()
      return true
    })()`)
    await waitFor('.app-body', 10000)
    await delay(600)
    await capture('03-dashboard.png')

    // 4-7. Sidebar screens
    const screens = [
      ['Medications', '04-medications.png'],
      ['Appointments', '05-appointments.png'],
      ['Symptoms', '06-symptoms.png'],
      ['Profile', '07-profile.png']
    ]
    for (const [label, file] of screens) {
      const clicked = await evalJS(`(() => {
        const items = [...document.querySelectorAll('.sidebar-nav .nav-item')]
        const el = items.find((b) => b.textContent.trim().includes(${JSON.stringify(label)}))
        if (el) { el.click(); return true }
        return false
      })()`)
      if (!clicked) console.log(`  warning: sidebar item '${label}' not found`)
      await delay(500)
      await capture(file)
    }

    // Close the window so the app quits cleanly.
    await evalJS('window.close()').catch(() => {})
  } finally {
    try {
      cdp?.ws.close()
    } catch {
      /* ignore */
    }
    await delay(300)
    if (!proc.killed) proc.kill()
    setTimeout(() => proc.kill('SIGKILL'), 2000).unref?.()
  }

  if (captured.length === 0) throw new Error('No screenshots were captured.')
  writeDoc(captured)
}

// ---- doc + DOCX ------------------------------------------------------------
function writeDoc(captured) {
  const meta = {
    '01-landing.png': ['Landing', 'The pre-sign-in welcome screen shown on launch.'],
    '02-login.png': ['Sign in', 'Email / password sign-in with the built-in demo account.'],
    '03-dashboard.png': ['Dashboard', 'Live dose, appointment and symptom counts with quick links.'],
    '04-medications.png': ['Medications', 'Dose list sorted by urgency with mark-as-taken.'],
    '05-appointments.png': ['Appointments', "Today's and upcoming visits."],
    '06-symptoms.png': ['Symptoms', 'Recent symptom log and the "log a symptom" form.'],
    '07-profile.png': ['Profile', 'Caregiver profile and account details.']
  }
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  let md = `# CareConnect Desktop - Application Screenshots\n\n`
  md += `_Generated ${now} UTC by scripts/capture-screenshots.mjs. Screens are driven live over the CareConnect desktop build (Electron) with the demo account; data comes from the in-memory mock backend._\n\n`
  md += `---\n\n`
  let n = 1
  for (const file of captured) {
    const [title, caption] = meta[file] || [file, '']
    md += `## ${n}. ${title}\n\n`
    if (caption) md += `${caption}\n\n`
    md += `![${title}](screenshots/${file})\n\n`
    n++
  }
  const mdPath = join(DOC_DIR, 'DESKTOP_APP_SCREENSHOTS.md')
  const docxPath = join(DOC_DIR, 'DESKTOP_APP_SCREENSHOTS.docx')
  writeFileSync(mdPath, md, 'utf8')
  console.log(`Wrote ${mdPath}`)

  const fwd = (p) => p.replace(/\\/g, '/')
  const py = [
    'import sys',
    `sys.path.insert(0, r"${fwd(DOC_DIR)}")`,
    'from pathlib import Path',
    'from md_to_docx import convert',
    `convert(Path(r"${fwd(mdPath)}"), Path(r"${fwd(docxPath)}"))`
  ].join('\n')
  const tmp = join(tmpdir(), `md2docx_${Date.now()}.py`)
  writeFileSync(tmp, py, 'utf8')
  const r = spawnSync('py', [tmp], { stdio: 'inherit' })
  if (r.status === 0 && existsSync(docxPath)) {
    console.log(`Wrote ${docxPath}`)
  } else {
    console.warn(`DOCX conversion failed; Markdown is available at ${mdPath}`)
  }
}

main().catch((err) => {
  console.error('capture-screenshots failed:', err.message)
  process.exit(1)
})
