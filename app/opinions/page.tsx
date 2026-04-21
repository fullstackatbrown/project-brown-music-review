import { getArticlesByCategory } from "@/lib/cosmic"
import OpinionsClient from "./OpinionsClient"

export default async function OpinionsPage() {
  const articles = await getArticlesByCategory("opinions", 50)
  return <OpinionsClient articles={articles} />
}
