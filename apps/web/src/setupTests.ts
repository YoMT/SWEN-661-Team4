import '@testing-library/jest-dom/vitest'
import { toHaveNoViolations } from 'jest-axe'

// Register the jest-axe matcher so `expect(await axe(container)).toHaveNoViolations()`
// works in the *.a11y.test.tsx suites. jest-axe's matcher is runner-agnostic;
// only the type augmentation differs under Vitest (see vitest-axe.d.ts).
expect.extend(toHaveNoViolations)

// jsdom doesn't implement Element.scrollTo; several components call it inside
// layout effects (e.g. PeggyPanel keeps the newest message in view). Provide a
// no-op so those effects don't throw during tests.
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = (): void => {}
}

// The router calls window.scrollTo on navigation; silence jsdom's
// "Not implemented" noise.
window.scrollTo = (): void => {}

// jsdom has no matchMedia (use-install-prompt checks display-mode: standalone).
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false
    }) as MediaQueryList
}
