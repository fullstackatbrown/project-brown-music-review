export interface Image {
  url: string
  imgix_url?: string
}

export interface ArticleMetadata {
  writer: string
  review_contributors: string
  editor_s: string
  managing_editor?: string
  publish_date?: string
  tagline: string
  cover_image: Image
  body_content: string
  in_paragraph_video?: Image
}

export interface Article {
  id: string
  slug: string
  title: string
  type: "article"
  created_at?: string
  modified_at?: string
  published_at?: string
  thumbnail?: string
  metadata: ArticleMetadata
}

export interface CosmicResponse<T> {
  object: T | null
}

export interface CosmicListResponse<T> {
  objects: T[]
  total: number
  limit?: number
}
