import { getArticlesByCategory } from "@/lib/cosmic"
import ReviewsClient from "./ReviewsClient"

export default async function ReviewsPage() {
  const articles = await getArticlesByCategory("reviews", 50)
  return <ReviewsClient articles={articles} />
}
