import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// Inherits the `@renderer` alias (and react plugin) from vite.config so test
// imports resolve exactly like app imports.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/setupTests.ts'],
      css: false,
      include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    },
  }),
)
