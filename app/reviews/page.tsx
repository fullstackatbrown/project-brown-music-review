import { getAllArticles } from "@/lib/cosmic"
import ReviewsClient from "./ReviewsClient"

export default async function ReviewsPage() {
  const articles = await getAllArticles(50)
  return <ReviewsClient articles={articles} />
}
