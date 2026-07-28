import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Vite Fast Refresh tolerates a non-component constant exported alongside
      // components (e.g. Sidebar's NAV table).
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },
  {
    // Context modules intentionally co-locate their `useXContext` hook with the
    // provider (the React-docs pattern), and router.tsx exports `useRouter`
    // beside its Provider/Link. Fast Refresh doesn't apply to these the way it
    // does to leaf components, so the hook export next to the component is fine.
    files: ['src/state/**/*.{ts,tsx}', 'src/router.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // Test helpers export render functions beside provider wrappers and re-export
    // Testing Library; none of it participates in Fast Refresh.
    files: ['src/**/__tests__/**/*.{ts,tsx}', 'src/setupTests.ts'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
