import '@testing-library/jest-dom'

// jsdom doesn't implement Element.scrollTo; components that keep content in view
// (e.g. PeggyPanel scrolling to the newest message) call it inside layout effects.
// Provide a no-op so those effects don't throw during tests.
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = (): void => {}
}
