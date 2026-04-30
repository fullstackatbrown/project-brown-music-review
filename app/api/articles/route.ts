import { getAllArticles, getArticlesByCategory, type ArticleCategory } from "@/lib/cosmic"
import { NextRequest, NextResponse } from "next/server"

const VALID_CATEGORIES = new Set(["reviews", "deepdive", "narratives", "hottopics", "opinions"])

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category")

    let articles
    if (category && VALID_CATEGORIES.has(category)) {
      articles = await getArticlesByCategory(category as ArticleCategory, 50)
    } else {
      articles = await getAllArticles(50)
    }

    return NextResponse.json({ articles }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load articles"

    return NextResponse.json({ message }, { status: 500 })
  }
}
