module.exports = {
  preset: 'ts-jest',

  testEnvironment: 'jsdom',

  roots: ['<rootDir>/src/renderer/src'],

  setupFilesAfterEnv: [
    '<rootDir>/src/renderer/src/setupTests.ts'
  ],

  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx'
  ],

  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)'
  ],

  // Custom ts-jest wrapper that strips Vite's `import.meta.env` so renderer
  // modules reading build-time env (services/api.ts) load under jsdom.
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/jest/import-meta-transform.cjs'
  },

  moduleNameMapper: {
    '^@renderer/(.*)$': '<rootDir>/src/renderer/src/$1',
    '\\.(jpg|jpeg|png|gif|webp|svg|avif)$': '<rootDir>/jest/file-mock.cjs'
  },

  collectCoverageFrom: [
    'src/renderer/src/**/*.{ts,tsx}',
    '!src/renderer/src/main.tsx',
    '!src/renderer/src/env.d.ts',
    '!src/renderer/src/types.ts'
  ],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/skipped/'
  ],

  coverageDirectory: 'coverage'
}