import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

// Register the jest-axe matcher so `expect(await axe(container)).toHaveNoViolations()`
// works in the *.a11y.test.tsx suites.
expect.extend(toHaveNoViolations)

// jsdom doesn't implement Element.scrollTo; several components call it inside
// layout effects (e.g. PeggyPanel keeps the newest message in view). Provide a
// no-op so those effects don't throw during tests.
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = (): void => {}
}
