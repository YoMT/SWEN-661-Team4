// Jest transform wrapper: neutralises Vite's `import.meta.env` (unsupported by
// ts-jest's CommonJS output) so renderer modules that read build-time env vars
// — e.g. src/renderer/src/services/api.ts — can be imported under jsdom.
// `import.meta.env.X` becomes `({}).X` → undefined, which makes api.ts fall back
// to the in-memory mock backend (USE_MOCK = true). Everything else is delegated
// verbatim to ts-jest.
const tsJest = require('ts-jest').default.createTransformer({
  tsconfig: 'tsconfig.web.json'
})

module.exports = {
  process(src, filename, options) {
    const patched = src.replace(/import\.meta\.env/g, '({})')
    return tsJest.process(patched, filename, options)
  },
  getCacheKey(src, filename, ...rest) {
    return tsJest.getCacheKey(src.replace(/import\.meta\.env/g, '({})'), filename, ...rest)
  }
}
