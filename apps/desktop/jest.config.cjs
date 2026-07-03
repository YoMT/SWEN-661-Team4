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

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.web.json'
      }
    ]
  },

  moduleNameMapper: {
    '^@renderer/(.*)$': '<rootDir>/src/renderer/src/$1'
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