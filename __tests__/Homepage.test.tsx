import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import type { HomepageArticle } from "@/lib/types"

function makeArticle(overrides: Partial<HomepageArticle> = {}): HomepageArticle {
  return {
    id: "1",
    slug: "test-article",
    href: "/reviews/test-article",
    title: "Test Album Title",
    artist: "Test Writer",
    reviewer: "Test Writer",
    year: "2026",
    genre: "Album Rate",
    summary: "A short summary of the article.",
    typeLabel: "Album Rate",
    coverImage: "https://imgix.cosmicjs.com/test.jpg",
    ratingLabel: "BUY",
    accentColor: "#1a6b3c",
    labelColor: "#1a6b3c",
    vinylLabel: "BUY",
    ...overrides,
  }
}

function makeArticles(count: number): HomepageArticle[] {
  return Array.from({ length: count }, (_, i) =>
    makeArticle({
      id: String(i + 1),
      slug: `article-${i + 1}`,
      href: `/reviews/article-${i + 1}`,
      title: `Article Title ${i + 1}`,
      artist: `Writer ${i + 1}`,
      reviewer: `Writer ${i + 1}`,
    })
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("Homepage", () => {
  it("renders the Latest From hero heading", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: makeArticles(15) }),
    })

    const { default: HomePage } = await import("@/app/page")
    render(<HomePage />)

    expect(screen.getByText("Latest From")).toBeInTheDocument()
  })

  it("renders category pills (Deep Dive, Narratives)", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: makeArticles(15) }),
    })

    const { default: HomePage } = await import("@/app/page")
    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getAllByText("Deep Dive").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Narratives").length).toBeGreaterThan(0)
    })
  })

  it("renders hero article previews from first 2 articles", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: makeArticles(15) }),
    })

    const { default: HomePage } = await import("@/app/page")
    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getAllByText("Article Title 1").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Article Title 2").length).toBeGreaterThan(0)
    })
  })

  it("renders the dark featured section", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: makeArticles(15) }),
    })

    const { default: HomePage } = await import("@/app/page")
    render(<HomePage />)

    await waitFor(() => {
      // Featured center article
      expect(screen.getAllByText("Article Title 7").length).toBeGreaterThan(0)
    })
  })

  it("renders the article card grid", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: makeArticles(15) }),
    })

    const { default: HomePage } = await import("@/app/page")
    render(<HomePage />)

    await waitFor(() => {
      // Grid articles start at index 9
      expect(screen.getByText("Article Title 10")).toBeInTheDocument()
    })
  })

  it("renders see all link", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: makeArticles(15) }),
    })

    const { default: HomePage } = await import("@/app/page")
    render(<HomePage />)

    expect(screen.getByText(/see all/i)).toBeInTheDocument()
  })

  it("renders article links pointing to /reviews/[slug]", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: makeArticles(15) }),
    })

    const { default: HomePage } = await import("@/app/page")
    render(<HomePage />)

    await waitFor(() => {
      const links = screen.getAllByRole("link")
      const reviewLinks = links.filter((l) =>
        l.getAttribute("href")?.startsWith("/reviews/")
      )
      expect(reviewLinks.length).toBeGreaterThan(0)
    })
  })

  it("fills with mock data when Cosmic returns fewer articles", async () => {
    // Only 2 articles from Cosmic - mock should fill the rest
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: makeArticles(2) }),
    })

    const { default: HomePage } = await import("@/app/page")
    render(<HomePage />)

    await waitFor(() => {
      // The 2 real articles should render
      expect(screen.getAllByText("Article Title 1").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Article Title 2").length).toBeGreaterThan(0)
    })

    // Mock articles should fill remaining slots with varied titles
    await waitFor(() => {
      const mockTitles = screen.getAllByText("The Sound of Silence Revisited")
      expect(mockTitles.length).toBeGreaterThan(0)
    })
  })

  it("renders the email signup section", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: [] }),
    })

    const { default: HomePage } = await import("@/app/page")
    render(<HomePage />)

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
  })

  it("handles empty articles gracefully with all mock data", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: [] }),
    })

    const { default: HomePage } = await import("@/app/page")
    render(<HomePage />)

    // Should still render all sections without errors
    expect(screen.getByText("Latest From")).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getAllByText("Deep Dive").length).toBeGreaterThan(0)
    })
  })
})
