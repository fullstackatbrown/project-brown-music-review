import {
  getArticleBySlug,
  getArticleCoverImage,
  getArticleTypeLabel,
  getArticleWriter,
} from "@/lib/cosmic"
import ArticleBody from "@/app/components/ArticleBody"
import Image from "next/image"
import { notFound } from "next/navigation"

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const coverImage = getArticleCoverImage(article)
  const writer = getArticleWriter(article)
  const articleTypeLabel = getArticleTypeLabel(article)
  const imageSrc = coverImage?.imgix_url ?? coverImage?.url

  return (
    <div>
      {/* white bg box up top */}
      <section className="bg-white px-16 py-12">
        <div className="flex items-start gap-8 max-w-5xl mx-auto">
          {/* image */}
          {imageSrc && (
            <div className="relative w-[55%] shrink-0">
              <Image
                src={imageSrc}
                alt={article.title}
                className="w-full h-auto"
                width={600}
                height={600}
              />
            </div>
          )}

          {/* review content */}
          <div className="flex flex-col justify-center pt-8">
            <span className="text-xs font-mono tracking-widest uppercase text-red-600 mb-2">
              {articleTypeLabel}
            </span>
            <h1 className="text-4xl font-bold font-serif mb-2">
              {article.title}
            </h1>
            {writer && (
              <p className="text-sm text-gray-500 mb-6">
                Reviewed by <strong className="text-black">{writer}</strong>
              </p>
            )}
            <div className="w-full h-px bg-gray-200 mb-6" />
            <ArticleBody article={article} />
          </div>
        </div>
      </section>
    </div>
  )
}
