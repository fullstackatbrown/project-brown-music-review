import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Footer from "@/app/components/Footer"

describe("Footer", () => {
  it("renders Brown Music Review heading", () => {
    render(<Footer />)
    expect(screen.getByText("Brown Music Review")).toBeInTheDocument()
  })

  it("renders disclaimer about Brown University independence", () => {
    render(<Footer />)
    expect(screen.getByText(/independently from Brown University/i)).toBeInTheDocument()
  })

  it("renders Pages section with correct links", () => {
    render(<Footer />)
    expect(screen.getByText("Pages")).toBeInTheDocument()
    const pageLinks = ["Deep Dive", "Narratives", "Hot Topics", "Opinions", "About Us"]
    for (const name of pageLinks) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument()
    }
  })

  it("renders Contact Us section", () => {
    render(<Footer />)
    expect(screen.getByText("Contact Us")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /join our staff/i })).toBeInTheDocument()
  })

  it("renders social media links", () => {
    render(<Footer />)
    expect(screen.getByLabelText(/instagram/i)).toBeInTheDocument()
  })
})
