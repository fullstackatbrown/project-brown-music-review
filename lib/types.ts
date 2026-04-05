export interface Image {
  url: string
  imgix_url?: string
}

export interface CosmicSelect {
  key: string
  value: string
}

export type ArticleBodyFormat = "markdown" | "html"

interface BaseMetadata {
  tagline: string
}

/** Full metadata for the "AlbumRate" Object Type */
export interface AlbumRateMetadata extends BaseMetadata {
  writer: string
  review_contributors: string
  // Use quotes for keys with special characters like parentheses or hyphens
  "editor(s)": string
  managing_editor?: string | null
  score: CosmicSelect
  publish_date?: string | null
  cover_image?: Image
  body_content: string
  "in-paragraph_video"?: Image
}

/** Metadata for the "AlbumReviews" Object Type */
export interface AlbumReviewMetadata extends BaseMetadata {
  body: string
  citation?: string
}

/** Generic Base for Cosmic Objects */
interface CosmicObjectBase<TType extends string, TMetadata> {
  id: string
  slug: string
  title: string
  type: TType
  metadata: TMetadata
  created_at?: string
  modified_at?: string
  published_at?: string
  thumbnail?: string | Image
}

/** * These type literals match the "type" field in your JSON response.
 * Note: 'albumreview' is singular in the API even if the folder is 'AlbumReviews'.
 */
export type AlbumRate = CosmicObjectBase<"albumrate", AlbumRateMetadata>
export type AlbumReview = CosmicObjectBase<"albumreview", AlbumReviewMetadata>

export interface HomepageArticle {
  id: string
  slug: string
  href: string
  title: string
  artist: string
  reviewer: string
  year: string
  genre: string
  summary: string
  typeLabel: string
  coverImage: string | null
  ratingLabel: string | null
  accentColor: string
  labelColor: string
  vinylLabel: string
}

export interface CosmicResponse<T> {
  object: T | null
}

export interface CosmicListResponse<T> {
  objects: T[]
  total: number
  limit?: number
}
