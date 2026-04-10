import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import About from "@/app/about/page"

describe("About Page", () => {
  it("renders the About Us heading", () => {
    render(<About />)
    expect(screen.getByText("About Us")).toBeInTheDocument()
  })

  it("renders the main title", () => {
    render(<About />)
    expect(
      screen.getByText("We are Brown Music Review.")
    ).toBeInTheDocument()
  })

  it("renders the BMR description paragraph", () => {
    render(<About />)
    expect(
      screen.getByText(/premier music publication/i)
    ).toBeInTheDocument()
  })

  it("renders the Brown University disclaimer", () => {
    render(<About />)
    expect(
      screen.getByText(/independently from Brown University/i)
    ).toBeInTheDocument()
  })

  it("renders the Meet our staff section", () => {
    render(<About />)
    expect(screen.getByText("Meet our staff")).toBeInTheDocument()
  })

  it("renders a staff member with profile image", () => {
    render(<About />)
    const img = screen.getByAltText("Staff writer")
    expect(img).toBeInTheDocument()
  })
})
