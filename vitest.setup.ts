import "@testing-library/jest-dom/vitest"

// Polyfill IntersectionObserver for jsdom (used by framer-motion useInView)
class MockIntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ""
  readonly thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

global.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver
