import { getArticlesByCategory } from "@/lib/cosmic"
import DeepDiveClient from "./DeepDiveClient"

export default async function DeepDivePage() {
  const articles = await getArticlesByCategory("deepdive", 50)
  return <DeepDiveClient articles={articles} />
}
