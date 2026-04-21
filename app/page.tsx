import { getHomepageArticles } from "@/lib/cosmic"
import HomeClient from "./HomeClient"

export default async function HomePage() {
  const articles = await getHomepageArticles(20)
  return <HomeClient articles={articles} />
}
