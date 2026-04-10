import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Navbar from "@/app/components/Navbar"

describe("Navbar", () => {
  it("renders the BROWN MUSIC REVIEW title text", () => {
    render(<Navbar />)
    expect(screen.getByText("BROWN MUSIC REVIEW")).toBeInTheDocument()
  })

  it("renders a Subscribe button", () => {
    render(<Navbar />)
    const btn = screen.getByRole("link", { name: /subscribe/i })
    expect(btn).toBeInTheDocument()
  })

  it("renders correct navigation links", () => {
    render(<Navbar />)
    const expectedLinks = [
      "Home",
      "Deep Dive",
      "Narratives",
      "Hot Topics",
      "Opinions",
      "About Us",
    ]
    for (const name of expectedLinks) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument()
    }
  })

  it("does not render old Review link", () => {
    render(<Navbar />)
    expect(screen.queryByRole("link", { name: "Review" })).not.toBeInTheDocument()
  })

  it("renders a search icon button", () => {
    render(<Navbar />)
    expect(screen.getByLabelText("Search")).toBeInTheDocument()
  })

  it("links Deep Dive to /deepdive", () => {
    render(<Navbar />)
    expect(screen.getByRole("link", { name: "Deep Dive" })).toHaveAttribute("href", "/deepdive")
  })

  it("links Narratives to /narratives", () => {
    render(<Navbar />)
    expect(screen.getByRole("link", { name: "Narratives" })).toHaveAttribute("href", "/narratives")
  })

  it("links About Us to /about", () => {
    render(<Navbar />)
    expect(screen.getByRole("link", { name: "About Us" })).toHaveAttribute("href", "/about")
  })
})
