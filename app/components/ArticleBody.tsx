import {
  getArticleBodyContent,
  getArticleBodyFormat,
  type CosmicArticle,
} from "@/lib/cosmic"
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
} from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type ArticleBodyProps = {
  article: CosmicArticle
}

export default function ArticleBody({ article }: ArticleBodyProps) {
  const body = getArticleBodyContent(article)

  if (!body) {
    return null
  }

  if (getArticleBodyFormat(article) === "html") {
    return (
      <div
        className="text-base leading-relaxed text-gray-800 [&_a]:text-red-700 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_li]:mb-2 [&_ol]:mb-4 [&_p]:mb-4 [&_ul]:mb-4"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    )
  }

  return (
    <div className="text-base leading-relaxed text-gray-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: (props: HTMLAttributes<HTMLParagraphElement>) => (
            <p className="mb-4" {...props} />
          ),
          a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
            <a
              className="text-red-700 underline"
              rel="noreferrer"
              target="_blank"
              {...props}
            />
          ),
          ul: (props: HTMLAttributes<HTMLUListElement>) => (
            <ul className="mb-4 list-disc pl-6" {...props} />
          ),
          ol: (props: HTMLAttributes<HTMLOListElement>) => (
            <ol className="mb-4 list-decimal pl-6" {...props} />
          ),
          blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
            <blockquote
              className="mb-4 border-l-2 border-gray-300 pl-4 italic text-gray-600"
              {...props}
            />
          ),
          h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
            <h1 className="mb-4 text-3xl font-bold" {...props} />
          ),
          h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
            <h2 className="mb-3 text-2xl font-bold" {...props} />
          ),
          h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
            <h3 className="mb-3 text-xl font-semibold" {...props} />
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
