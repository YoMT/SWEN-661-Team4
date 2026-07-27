// Jest config for the web PWA. Mirrors apps/desktop's Jest-on-Vite setup:
// ts-jest (transpile-only) + jsdom, with a transform that neutralises
// `import.meta.env`. Must be `.cjs` because package.json is `"type": "module"`.
module.exports = {
  testEnvironment: 'jsdom',

  roots: ['<rootDir>/src'],

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)'
  ],

  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/jest/import-meta-transform.cjs'
  },

  moduleNameMapper: {
    '^@renderer/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/jest/style-mock.cjs',
    '\\.(jpg|jpeg|png|gif|webp|svg|avif|ico)$': '<rootDir>/jest/file-mock.cjs'
  },

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/setupTests.ts',
    '!src/main.tsx',
    '!src/router.tsx',
    '!src/types.ts'
  ],

  coverageThreshold: {
    global: {
      statements: 75,
      branches: 70,
      functions: 70,
      lines: 75
    }
  },

  coverageDirectory: 'coverage'
}
