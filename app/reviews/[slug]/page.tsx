import {
  getArticleBySlug,
  getArticleCoverImageUrl,
  getArticlePublishedDateDisplay,
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

  const writer = getArticleWriter(article)
  const articleTypeLabel = getArticleTypeLabel(article)
  const publishedDate = getArticlePublishedDateDisplay(article)
  const imageSrc = getArticleCoverImageUrl(article)

  return (
    <div>
      {/* NYT-style vertical article layout:
          type label → title → divider → cover image → byline → divider → body */}
      <section className="bg-white px-6 sm:px-12 lg:px-16 py-12">
        <article className="mx-auto max-w-3xl">
          <span className="mb-3 block text-xs font-mono tracking-widest uppercase text-[var(--accent-reviews)]">
            {articleTypeLabel}
          </span>

          <h1 className="mb-6 font-display text-4xl leading-tight sm:text-5xl tracking-wide">
            {article.title}
          </h1>

          <div className="mb-8 h-px w-full bg-gray-200" />

          {imageSrc && (
            <div className="relative mb-4 w-full overflow-hidden rounded-md">
              <Image
                src={imageSrc}
                alt={article.title}
                className="h-auto w-full"
                width={1200}
                height={800}
                priority
              />
            </div>
          )}

          {(writer || publishedDate) && (
            <p className="mb-8 text-sm text-gray-500">
              {writer && (
                <>
                  By <strong className="text-black">{writer}</strong>
                </>
              )}
              {writer && publishedDate && <span className="mx-2">·</span>}
              {publishedDate && <span>{publishedDate}</span>}
            </p>
          )}

          <div className="mb-8 h-px w-full bg-gray-200" />

          <ArticleBody article={article} />
        </article>
      </section>
    </div>
  )
}
