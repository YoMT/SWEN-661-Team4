import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// The `@renderer` alias mirrors the desktop renderer so shared modules
// (types, services, state, screens) are copied over without rewriting imports.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@renderer': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
