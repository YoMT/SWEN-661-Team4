// Jest transform wrapper: neutralises Vite's `import.meta.env` (unsupported by
// ts-jest's CommonJS output) so modules that read build-time env vars can be
// imported under jsdom. `import.meta.env.X` becomes `({}).X` -> undefined, which
// makes services/api.ts fall back to the in-memory mock backend (USE_MOCK = true)
// and main.tsx skip service-worker registration. Everything else is delegated
// verbatim to ts-jest.
const tsJest = require('ts-jest').default.createTransformer({
  tsconfig: 'tsconfig.spec.json'
})

const patch = (src) => src.replace(/import\.meta\.env/g, '({})')

module.exports = {
  process(src, filename, options) {
    return tsJest.process(patch(src), filename, options)
  },
  getCacheKey(src, filename, ...rest) {
    return tsJest.getCacheKey(patch(src), filename, ...rest)
  }
}
