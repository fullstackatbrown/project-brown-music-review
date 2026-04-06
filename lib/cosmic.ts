import { createBucketClient } from "@cosmicjs/sdk"
import { unstable_cache } from "next/cache"
import type {
  AlbumRate,
  AlbumReview,
  HomepageArticle,
  Image as CosmicImage,
} from "./types"

// These should match your Cosmic object type slugs used in API queries.
// Keep env-configurable to avoid casing/slug mismatch.
const ALBUM_RATE_TYPE = process.env.COSMIC_TYPE_ALBUM_RATE ?? "albumrate"
const ALBUM_REVIEW_TYPE = process.env.COSMIC_TYPE_ALBUM_REVIEW ?? "albumreview"

export type CosmicArticle = AlbumRate | AlbumReview

type ArticleMetadata = {
  body?: string | null
  body_content?: string | null
  citation?: string | null
  publish_date?: string | null
  score?: {
    key?: string | null
    value?: string | null
  } | null
  tagline?: string | null
  writer?: string | null
  cover_image?: CosmicImage | null
}

type AccentStyle = {
  accentColor: string
  labelColor: string
  vinylLabel: string
}

const ARTICLE_LIST_LIMIT = 12

const SCORE_STYLES: Record<string, AccentStyle> = {
  trash: {
    accentColor: "#6b7280",
    labelColor: "#6b7280",
    vinylLabel: "TRS",
  },
  skip: {
    accentColor: "#8b1a00",
    labelColor: "#8b1a00",
    vinylLabel: "SKP",
  },
  rent: {
    accentColor: "#1d3f8a",
    labelColor: "#1d3f8a",
    vinylLabel: "RNT",
  },
  buy: {
    accentColor: "#1a6b3c",
    labelColor: "#1a6b3c",
    vinylLabel: "BUY",
  },
  crown: {
    accentColor: "#b8860b",
    labelColor: "#b8860b",
    vinylLabel: "CRN",
  },
}

const REVIEW_STYLE: AccentStyle = {
  accentColor: "#5c2d91",
  labelColor: "#5c2d91",
  vinylLabel: "BMR",
}

let cosmicClient: ReturnType<typeof createBucketClient> | null = null

function getCosmicClient() {
  if (!cosmicClient) {
    const bucketSlug = process.env.COSMIC_BUCKET_SLUG
    const readKey = process.env.COSMIC_READ_KEY

    if (!bucketSlug || !readKey) {
      throw new Error("Missing COSMIC_BUCKET_SLUG or COSMIC_READ_KEY")
    }

    cosmicClient = createBucketClient({
      bucketSlug,
      readKey,
    })
  }

  return cosmicClient
}

function getArticleMetadata(article: CosmicArticle): ArticleMetadata {
  return article.metadata as ArticleMetadata
}

async function findOneByTypeAndSlug<T>(type: string, slug: string): Promise<T | null> {
  try {
    const { object } = await getCosmicClient().objects
      .findOne({
        type,
        slug,
      })
      .depth(1)

    return (object as T) ?? null
  } catch {
    return null
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

function convertPlainTextToHtml(value: string): string {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`)
    .join("")
}

export async function getAlbumRateBySlug(slug: string): Promise<AlbumRate | null> {
  return findOneByTypeAndSlug<AlbumRate>(ALBUM_RATE_TYPE, slug)
}

export async function getAlbumReviewBySlug(slug: string): Promise<AlbumReview | null> {
  return findOneByTypeAndSlug<AlbumReview>(ALBUM_REVIEW_TYPE, slug)
}

async function findArticleBySlug(slug: string): Promise<CosmicArticle | null> {
  try {
    const { object } = await getCosmicClient().objects
      .findOne({
        slug,
      })
      .status("published")
      .depth(1)

    const article = (object as CosmicArticle | null) ?? null

    if (!article) {
      return null
    }

    if (article.type !== ALBUM_RATE_TYPE && article.type !== ALBUM_REVIEW_TYPE) {
      return null
    }

    return article
  } catch {
    return null
  }
}

export const getArticleBySlug = unstable_cache(
  async (slug: string) => findArticleBySlug(slug),
  ["cosmic-article-by-slug"],
  { revalidate: 300 },
)

export function getArticleBodyFormat<T extends CosmicArticle>(
  article: T,
): T extends AlbumRate ? "markdown" : "html" {
  return (article.type === "albumrate" ? "markdown" : "html") as T extends AlbumRate
    ? "markdown"
    : "html"
}

export function getArticleBodyContent(article: CosmicArticle): string {
  const metadata = getArticleMetadata(article)
  return metadata.body?.trim() || metadata.body_content?.trim() || ""
}

export function getArticleBodyHtml(article: CosmicArticle): string {
  const body = getArticleBodyContent(article)
  if (!body) return ""
  if (getArticleBodyFormat(article) === "html" || looksLikeHtml(body)) return body
  return convertPlainTextToHtml(body)
}

export function getArticleWriter(article: CosmicArticle): string | null {
  const writer = getArticleMetadata(article).writer?.trim()
  return writer || null
}

export function getArticleCoverImage(article: CosmicArticle): CosmicImage | null {
  return getArticleMetadata(article).cover_image ?? null
}

export function getArticleTypeLabel(article: CosmicArticle): string {
  if (article.type === "albumrate") {
    return "Album Rate"
  }

  if (article.type === "albumreview") {
    return "Album Review"
  }

  return "Article"
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function getArticleSummary(article: CosmicArticle): string {
  const metadata = getArticleMetadata(article)

  if (metadata.tagline?.trim()) {
    return metadata.tagline.trim()
  }

  const body = getArticleBodyContent(article)
  if (!body) {
    return ""
  }

  const plainText = getArticleBodyFormat(article) === "html" ? stripHtml(body) : body
  return plainText.replace(/\s+/g, " ").trim().slice(0, 220)
}

function getArticlePublishedYear(article: CosmicArticle): string {
  const metadata = getArticleMetadata(article)
  const rawDate = metadata.publish_date || article.published_at || article.created_at

  if (!rawDate) {
    return "Draft"
  }

  const parsed = new Date(rawDate)
  if (Number.isNaN(parsed.getTime())) {
    return rawDate.slice(0, 4)
  }

  return String(parsed.getUTCFullYear())
}

function getArticlePublishedSortValue(article: CosmicArticle): number {
  const metadata = getArticleMetadata(article)
  const rawDate = metadata.publish_date || article.published_at || article.created_at

  if (!rawDate) {
    return 0
  }

  const parsed = new Date(rawDate)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

function getArticleRatingLabel(article: CosmicArticle): string | null {
  if (article.type === "albumrate") {
    return article.metadata.score?.value ?? null
  }

  return "Read it"
}

function getArticleAccentStyle(article: CosmicArticle): AccentStyle {
  if (article.type === "albumrate") {
    const scoreKey = article.metadata.score?.key ?? ""
    return SCORE_STYLES[scoreKey] ?? REVIEW_STYLE
  }

  return REVIEW_STYLE
}

function getArticlePrimaryLine(article: CosmicArticle): string {
  return getArticleWriter(article) ?? "Brown Music Review"
}

function getArticleCoverImageUrl(article: CosmicArticle): string | null {
  const coverImage = getArticleCoverImage(article)
  return coverImage?.imgix_url ?? coverImage?.url ?? null
}

async function getPublishedArticlesByType<T extends CosmicArticle>(
  type: string,
  limit: number,
): Promise<T[]> {
  try {
    const { objects } = await getCosmicClient().objects
      .find({ type })
      .status("published")
      .limit(limit)

    return (objects as T[]) ?? []
  } catch {
    return []
  }
}

function normalizeHomepageArticle(article: CosmicArticle): HomepageArticle {
  const style = getArticleAccentStyle(article)

  return {
    id: article.id,
    slug: article.slug,
    href: `/reviews/${article.slug}`,
    title: article.title,
    artist: getArticlePrimaryLine(article),
    reviewer: getArticlePrimaryLine(article),
    year: getArticlePublishedYear(article),
    genre: getArticleTypeLabel(article),
    summary: getArticleSummary(article),
    typeLabel: getArticleTypeLabel(article),
    coverImage: getArticleCoverImageUrl(article),
    ratingLabel: getArticleRatingLabel(article),
    accentColor: style.accentColor,
    labelColor: style.labelColor,
    vinylLabel: style.vinylLabel,
  }
}

export async function getHomepageArticles(
  limit = ARTICLE_LIST_LIMIT,
): Promise<HomepageArticle[]> {
  const [albumRates, albumReviews] = await Promise.all([
    getPublishedArticlesByType<AlbumRate>(ALBUM_RATE_TYPE, limit),
    getPublishedArticlesByType<AlbumReview>(ALBUM_REVIEW_TYPE, limit),
  ])

  return [...albumRates, ...albumReviews]
    .sort((left, right) => getArticlePublishedSortValue(right) - getArticlePublishedSortValue(left))
    .slice(0, limit)
    .map(normalizeHomepageArticle)
}
