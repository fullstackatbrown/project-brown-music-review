import { getArticlesByCategory } from "@/lib/cosmic"
import NarrativesClient from "./NarrativesClient"

export default async function NarrativesPage() {
  const articles = await getArticlesByCategory("narratives", 50)
  return <NarrativesClient articles={articles} />
}
