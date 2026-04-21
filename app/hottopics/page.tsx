import { getArticlesByCategory } from "@/lib/cosmic"
import HotTopicsClient from "./HotTopicsClient"

export default async function HotTopicsPage() {
  const articles = await getArticlesByCategory("hottopics", 50)
  return <HotTopicsClient articles={articles} />
}
