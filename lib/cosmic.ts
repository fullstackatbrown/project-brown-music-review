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
const ALBUM_RATE_TYPE = process.env.COSMIC_TYPE_ALBUM_RATE ?? "albumrates"
const ALBUM_REVIEW_TYPE = process.env.COSMIC_TYPE_ALBUM_REVIEW ?? "albumreview"

// The type field on Cosmic objects can vary (e.g. "albumrate", "albumrates",
// "article" for rates; "albumreview", "albumreviews" for reviews) due to
// historical slug changes. These sets let us identify the article kind
// regardless of the exact value.
const ALBUM_RATE_TYPES = new Set(["albumrate", "albumrates", "article"])
const ALBUM_REVIEW_TYPES = new Set(["albumreview", "albumreviews"])

// Shared cache tag for every Cosmic read. A single revalidateTag(COSMIC_TAG)
// call (from the /api/revalidate webhook) invalidates all Cosmic-backed data
// at once. The 1-hour revalidate is a safety net in case the webhook fails.
export const COSMIC_TAG = "cosmic-content"
const COSMIC_REVALIDATE_SECONDS = 60 * 60

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

// Fallback cover images for articles missing covers in Cosmic.
// Sourced from Wikimedia Commons (Creative Commons licensed).
const FALLBACK_COVERS: Record<string, string> = {
  "jim-legxacy-the-new-david-bowie":
    "https://upload.wikimedia.org/wikipedia/commons/6/68/David_Bowie_1974.JPG",
  "bmrs-music-of-2025":
    "https://upload.wikimedia.org/wikipedia/commons/d/da/Audience_at_the_Main_Stage_concert_at_night_-_Pol%27and%27Rock_Festival_2019._photo_by_%C5%81ukasz_Widziszowski_03.jpg",
  "an-ode-to-a-place":
    "https://upload.wikimedia.org/wikipedia/commons/b/b2/2014-365-37_In_the_Groove_%2812358036875%29.jpg",
  "what-was-that":
    "https://upload.wikimedia.org/wikipedia/commons/3/30/Lorde_Glasto2025-9_%28cropped%29.jpg",
  "spring-weekend-listicle":
    "https://upload.wikimedia.org/wikipedia/commons/3/32/Pulitzer2018-portraits-kendrick-lamar.jpg",
  "everything-in-its-right-place-and-time-radiohead-before-and-after-2000":
    "https://upload.wikimedia.org/wikipedia/commons/0/08/Thom_Yorke.jpg",
  "virgin-review":
    "https://upload.wikimedia.org/wikipedia/commons/3/30/Lorde_Glasto2025-9_%28cropped%29.jpg",
  "listening-back-to-pieces-of-a-man":
    "https://upload.wikimedia.org/wikipedia/commons/1/14/Gil_Scott-Heron.jpg",
  "mayhem":
    "https://upload.wikimedia.org/wikipedia/commons/9/98/Lady_Gaga_at_the_White_House_in_2023_%281%29.jpg",
}

// Category assignments for articles. Maps slug → page category so each
// subpage shows different content. Articles not listed here appear on all pages.
export type ArticleCategory = "deepdive" | "narratives" | "hottopics" | "opinions"

const ARTICLE_CATEGORIES: Record<string, ArticleCategory> = {
  "everything-in-its-right-place-and-time-radiohead-before-and-after-2000": "deepdive",
  "jim-legxacy-the-new-david-bowie": "deepdive",
  "an-ode-to-a-place": "narratives",
  "what-was-that": "narratives",
  "bmrs-music-of-2025": "hottopics",
  "spring-weekend-listicle": "hottopics",
  "for-melancholy-brunettes-and-sad-women-japanese-breakfast": "opinions",
  "through-the-wall": "opinions",
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

export function isAlbumRate(article: CosmicArticle): article is AlbumRate {
  return ALBUM_RATE_TYPES.has(article.type)
}

export function isAlbumReview(article: CosmicArticle): article is AlbumReview {
  return ALBUM_REVIEW_TYPES.has(article.type)
}

function getArticleMetadata(article: CosmicArticle): ArticleMetadata {
  return (article.metadata ?? {}) as ArticleMetadata
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
      .status("any")
      .depth(1)

    const article = (object as CosmicArticle | null) ?? null

    if (!article) {
      return null
    }

    if (!isAlbumRate(article) && !isAlbumReview(article)) {
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
  { revalidate: COSMIC_REVALIDATE_SECONDS, tags: [COSMIC_TAG] },
)

export function getArticleBodyFormat<T extends CosmicArticle>(
  article: T,
): T extends AlbumRate ? "markdown" : "html" {
  return (isAlbumRate(article) ? "markdown" : "html") as T extends AlbumRate
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
  if (isAlbumRate(article)) {
    return "Album Rate"
  }

  if (isAlbumReview(article)) {
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
    const raw = metadata.tagline.trim()
    // Taglines may contain HTML (e.g. <p> tags from the rich-text editor).
    return looksLikeHtml(raw) ? stripHtml(raw) : raw
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

export function getArticlePublishedDateDisplay(article: CosmicArticle): string | null {
  const metadata = getArticleMetadata(article)
  const rawDate = metadata.publish_date || article.published_at || article.created_at

  if (!rawDate) {
    return null
  }

  const parsed = new Date(rawDate)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
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
  if (isAlbumRate(article)) {
    const metadata = getArticleMetadata(article)
    return metadata.score?.value ?? null
  }

  return "Read it"
}

function getArticleAccentStyle(article: CosmicArticle): AccentStyle {
  if (isAlbumRate(article)) {
    const metadata = getArticleMetadata(article)
    const scoreKey = metadata.score?.key ?? ""
    return SCORE_STYLES[scoreKey] ?? REVIEW_STYLE
  }

  return REVIEW_STYLE
}

function getArticlePrimaryLine(article: CosmicArticle): string {
  return getArticleWriter(article) ?? "Brown Music Review"
}

export function getArticleCoverImageUrl(article: CosmicArticle): string | null {
  const coverImage = getArticleCoverImage(article)
  return coverImage?.imgix_url ?? coverImage?.url ?? FALLBACK_COVERS[article.slug] ?? null
}

async function getArticlesByType<T extends CosmicArticle>(
  type: string,
  limit: number,
): Promise<T[]> {
  try {
    const { objects } = await getCosmicClient().objects
      .find({ type })
      .status("any")
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

function hasBodyContent(article: CosmicArticle): boolean {
  const metadata = getArticleMetadata(article)
  return !!((metadata.body || "").trim() || (metadata.body_content || "").trim())
}

async function loadAllCosmicArticles(limit: number): Promise<CosmicArticle[]> {
  const [albumRates, albumReviews] = await Promise.all([
    getArticlesByType<AlbumRate>(ALBUM_RATE_TYPE, limit),
    getArticlesByType<AlbumReview>(ALBUM_REVIEW_TYPE, limit),
  ])

  return [...albumRates, ...albumReviews]
    .filter(hasBodyContent)
    .sort((left, right) => getArticlePublishedSortValue(right) - getArticlePublishedSortValue(left))
}

async function loadHomepageArticles(limit: number): Promise<HomepageArticle[]> {
  const articles = await loadAllCosmicArticles(limit)
  return articles.slice(0, limit).map(normalizeHomepageArticle)
}

export const getHomepageArticles = unstable_cache(
  async (limit: number = ARTICLE_LIST_LIMIT) => loadHomepageArticles(limit),
  ["cosmic-homepage-articles"],
  { revalidate: COSMIC_REVALIDATE_SECONDS, tags: [COSMIC_TAG] },
)

async function loadAllArticles(limit: number): Promise<HomepageArticle[]> {
  const articles = await loadAllCosmicArticles(limit)
  return articles.slice(0, limit).map(normalizeHomepageArticle)
}

export const getAllArticles = unstable_cache(
  async (limit: number = 50) => loadAllArticles(limit),
  ["cosmic-all-articles"],
  { revalidate: COSMIC_REVALIDATE_SECONDS, tags: [COSMIC_TAG] },
)

async function loadArticlesByCategory(
  category: ArticleCategory,
  limit: number,
): Promise<HomepageArticle[]> {
  const articles = await loadAllCosmicArticles(limit)
  const filtered = articles.filter((a) => ARTICLE_CATEGORIES[a.slug] === category)
  return filtered.slice(0, limit).map(normalizeHomepageArticle)
}

export const getArticlesByCategory = unstable_cache(
  async (category: ArticleCategory, limit: number = 50) =>
    loadArticlesByCategory(category, limit),
  ["cosmic-articles-by-category"],
  { revalidate: COSMIC_REVALIDATE_SECONDS, tags: [COSMIC_TAG] },
)
