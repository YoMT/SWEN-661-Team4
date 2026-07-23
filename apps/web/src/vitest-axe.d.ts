// @types/jest-axe drags in Jest's global `expect` typings, which clobber
// Vitest's — so we type the two jest-axe exports we use ourselves and augment
// Vitest's assertion interfaces for the matcher.
declare module 'jest-axe' {
  import type { AxeResults, RunOptions } from 'axe-core'
  export function axe(
    container: Element | Document | string,
    options?: RunOptions
  ): Promise<AxeResults>
  export const toHaveNoViolations: {
    toHaveNoViolations(results: AxeResults): { pass: boolean; message: () => string }
  }
}

declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void
  }
}
