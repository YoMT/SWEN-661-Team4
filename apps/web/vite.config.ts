import { defineConfig, type Plugin } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'

/**
 * Injects the hashed build assets and a deterministic version into the
 * hand-rolled service worker (public/sw.js) after the bundle is written, so
 * offline works on first visit without adding a PWA build dependency.
 */
function swPrecachePlugin(): Plugin {
  let assets: string[] = []
  let outDir = ''
  return {
    name: 'careconnect-sw-precache',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    generateBundle(_options, bundle) {
      assets = Object.keys(bundle)
        .filter((f) => !f.endsWith('.map') && f !== 'index.html')
        .map((f) => '/' + f.replace(/\\/g, '/'))
        .sort()
    },
    // closeBundle runs after Vite copies public/ into dist, so dist/sw.js exists.
    closeBundle() {
      const swPath = path.join(outDir, 'sw.js')
      if (!existsSync(swPath)) return
      const source = readFileSync(swPath, 'utf8')
      // Deterministic: same inputs → same version; any asset or SW change busts caches.
      const version = createHash('sha256')
        .update(source + JSON.stringify(assets))
        .digest('hex')
        .slice(0, 8)
      const injected = source
        .replace(/^const BUILD = .*$/m, `const BUILD = '${version}'`)
        .replace(/^const HASHED_ASSETS = .*$/m, `const HASHED_ASSETS = ${JSON.stringify(assets)}`)
      if (injected === source) {
        throw new Error('sw.js precache markers not found — sw.js and vite.config.ts are out of sync')
      }
      writeFileSync(swPath, injected)
    }
  }
}

// https://vite.dev/config/
// The `@renderer` alias mirrors the desktop renderer so shared modules
// (types, services, state, screens) are copied over without rewriting imports.
export default defineConfig({
  plugins: [react(), swPrecachePlugin()],
  resolve: {
    alias: {
      '@renderer': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
