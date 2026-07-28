import '@testing-library/jest-dom'

// jsdom doesn't implement Element.scrollTo; components that keep content in view
// (e.g. PeggyPanel scrolling to the newest message) call it inside layout effects.
// Provide a no-op so those effects don't throw during tests.
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
