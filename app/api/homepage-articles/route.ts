import { getHomepageArticles } from "@/lib/cosmic"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const articles = await getHomepageArticles(20)
    return NextResponse.json({ articles })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load homepage articles"

    return NextResponse.json({ message }, { status: 500 })
  }
}
