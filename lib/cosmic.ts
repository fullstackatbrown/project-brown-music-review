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
// call (from the /api/revalidate webhook configured in Cosmic on Object
// Published / Edited / Deleted) invalidates all Cosmic-backed data at once,
// so the next visit re-fetches and re-renders fresh HTML. We deliberately
// do NOT set a time-based `revalidate` on the unstable_cache wrappers —
// the webhook is the single source of truth for cache freshness.
export const COSMIC_TAG = "cosmic-content"

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

// Used when an article has no cover image set in Cosmic. Lives in /public.
// The space in the filename is URL-encoded so Next.js Image accepts it.
const FALLBACK_COVER_URL = "/BMR%20STICKER.png"

// Category assignments for articles. Maps slug → page section so each
// subpage shows the articles assigned to it. Every published Cosmic slug
// should appear here — articles without an entry will not render on any
// section page (only on the homepage feed).
export type ArticleCategory =
  | "reviews"
  | "deepdive"
  | "narratives"
  | "hottopics"
  | "opinions"

const ARTICLE_CATEGORIES: Record<string, ArticleCategory> = {
  // Deep dive
  "everything-in-its-right-place-and-time-radiohead-before-and-after-2000": "deepdive",
  "jim-legxacy-the-new-david-bowie": "deepdive",
  "listening-back-to-pieces-of-a-man": "deepdive",

  // Narratives
  "an-ode-to-a-place": "narratives",
  "what-was-that": "narratives",

  // Hot topics
  "bmrs-music-of-2025": "hottopics",
  "spring-weekend-listicle": "hottopics",

  // Opinions
  "for-melancholy-brunettes-and-sad-women-japanese-breakfast": "opinions",
  "through-the-wall": "opinions",

  // Reviews (album rates and album reviews — the default home for
  // anything that isn't a long-form essay, narrative, hot take, or opinion)
  "xavier-review": "reviews",
  "wuthering-heights-review": "reviews",
  "afterglow-review": "reviews",
  "growing-pains-and-falling-in-love-foragers-even-a-child-can-cover-the-sun-with-a-finger": "reviews",
  "mayhem": "reviews",
  "virgin-review": "reviews",
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
    // Published only — same reasoning as getArticlesByType. We never
    // want to render an article that isn't ready to ship.
    const { object } = await getCosmicClient().objects
      .findOne({
        slug,
      })
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
  { tags: [COSMIC_TAG] },
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

const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  sbquo: "‚",
  bdquo: "„",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  bull: "•",
  middot: "·",
  copy: "©",
  reg: "®",
  trade: "™",
  laquo: "«",
  raquo: "»",
  deg: "°",
  prime: "′",
  Prime: "″",
}

function decodeHtmlEntitiesOnce(value: string): string {
  return value.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, entity: string) => {
    if (entity[0] === "#") {
      const codePoint =
        entity[1] === "x" || entity[1] === "X"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10)
      if (Number.isFinite(codePoint) && codePoint > 0 && codePoint <= 0x10ffff) {
        try {
          return String.fromCodePoint(codePoint)
        } catch {
          return match
        }
      }
      return match
    }
    return NAMED_HTML_ENTITIES[entity] ?? match
  })
}

// CMS content is sometimes double- or triple-encoded (e.g. "&amp;rsquo;" must
// decode to "'" via two passes). Loop until the string stops changing, with a
// safety cap so we can't spin on pathological input.
export function decodeHtmlEntities(value: string): string {
  let current = value
  for (let i = 0; i < 4; i++) {
    const next = decodeHtmlEntitiesOnce(current)
    if (next === current) return next
    current = next
  }
  return current
}

function toPreviewText(value: string): string {
  // Decode first so encoded tags (e.g. "&lt;sup&gt;") become real tags that
  // stripHtml can remove, then strip, then decode any entities the strip
  // exposed. Previews are plain text — no HTML should reach the renderer.
  const decoded = decodeHtmlEntities(value)
  const stripped = stripHtml(decoded)
  return decodeHtmlEntities(stripped).replace(/\s+/g, " ").trim()
}

function getArticleSummary(article: CosmicArticle): string {
  const metadata = getArticleMetadata(article)

  if (metadata.tagline?.trim()) {
    return toPreviewText(metadata.tagline)
  }

  const body = getArticleBodyContent(article)
  if (!body) {
    return ""
  }

  return toPreviewText(body).slice(0, 220)
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

export function getArticleCoverImageUrl(article: CosmicArticle): string {
  const coverImage = getArticleCoverImage(article)
  return coverImage?.imgix_url ?? coverImage?.url ?? FALLBACK_COVER_URL
}

async function getArticlesByType<T extends CosmicArticle>(
  type: string,
  limit: number,
): Promise<T[]> {
  try {
    // Default Cosmic status (published only) — never .status("any") on a
    // list fetcher: that pulls draft revisions whose body fields can be
    // empty mid-edit, which then get silently dropped by hasBodyContent
    // and the article disappears from every section page.
    const { objects } = await getCosmicClient().objects
      .find({ type })
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

function hasCoverImage(article: CosmicArticle): boolean {
  return getArticleCoverImage(article) !== null
}

// Articles with a real cover image rank before articles without one;
// inside each group we keep newest-first. Highlight slots (homepage hero,
// section featured) consume the top of this list, so visually richer
// articles show up first. Articles without covers still appear, just
// further down the page.
function compareForHighlight(left: CosmicArticle, right: CosmicArticle): number {
  const coverDiff = Number(hasCoverImage(right)) - Number(hasCoverImage(left))
  if (coverDiff !== 0) return coverDiff
  return getArticlePublishedSortValue(right) - getArticlePublishedSortValue(left)
}

async function loadAllCosmicArticles(limit: number): Promise<CosmicArticle[]> {
  const [albumRates, albumReviews] = await Promise.all([
    getArticlesByType<AlbumRate>(ALBUM_RATE_TYPE, limit),
    getArticlesByType<AlbumReview>(ALBUM_REVIEW_TYPE, limit),
  ])

  return [...albumRates, ...albumReviews]
    .filter(hasBodyContent)
    .sort(compareForHighlight)
}

async function loadHomepageArticles(limit: number): Promise<HomepageArticle[]> {
  const articles = await loadAllCosmicArticles(limit)
  return articles.slice(0, limit).map(normalizeHomepageArticle)
}

export const getHomepageArticles = unstable_cache(
  async (limit: number = ARTICLE_LIST_LIMIT) => loadHomepageArticles(limit),
  ["cosmic-homepage-articles-v7"],
  { tags: [COSMIC_TAG] },
)

async function loadAllArticles(limit: number): Promise<HomepageArticle[]> {
  const articles = await loadAllCosmicArticles(limit)
  return articles.slice(0, limit).map(normalizeHomepageArticle)
}

export const getAllArticles = unstable_cache(
  async (limit: number = 50) => loadAllArticles(limit),
  ["cosmic-all-articles-v7"],
  { tags: [COSMIC_TAG] },
)

// Minimum article count we want every section page to display. If the
// in-category set is smaller, pad with articles from other categories
// up to this threshold so the page never feels empty. We deliberately
// don't pad further — sections still need their own identity, so the
// in-category articles always come first and only enough filler is
// added to clear the threshold.
const SECTION_MIN_ARTICLES = 6

async function loadArticlesByCategory(
  category: ArticleCategory,
  limit: number,
): Promise<HomepageArticle[]> {
  const articles = await loadAllCosmicArticles(limit)
  const inCategory = articles.filter((a) => ARTICLE_CATEGORIES[a.slug] === category)

  let result: CosmicArticle[] = inCategory
  if (inCategory.length < SECTION_MIN_ARTICLES) {
    const needed = SECTION_MIN_ARTICLES - inCategory.length
    const inCategoryIds = new Set(inCategory.map((a) => a.id))
    const filler = articles.filter((a) => !inCategoryIds.has(a.id)).slice(0, needed)
    result = [...inCategory, ...filler]
  }

  return result.slice(0, limit).map(normalizeHomepageArticle)
}

export const getArticlesByCategory = unstable_cache(
  async (category: ArticleCategory, limit: number = 50) =>
    loadArticlesByCategory(category, limit),
  ["cosmic-articles-by-category-v7"],
  { tags: [COSMIC_TAG] },
)
