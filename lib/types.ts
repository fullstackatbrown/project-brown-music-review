//This file is used to define the article type matching Cosmic's response
export interface Image {
  url: string;
  imgix_url?: string;
}

export interface ArticleMetadata {
  writer: string;
  review_contributors: string;
  editor_s: string;
  managing_editor?: string;
  score: "rent it" | "buy it" | "skip it"; //needs revision 
  publish_date?: string;
  tagline: string;
  cover_image: Image;
  body_content: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  type: "articles"; //needs to match cosmic object type
  created_at?: string;
  modified_at?: string;
  published_at?: string;
  thumbnail?: string;
  metadata: ArticleMetadata;
}

//For fetching Cosmic object
export interface CosmicResponse<T> {
  object: T;
}

export interface CosmicListResponse<T> {
  objects: T[];
  total: number;
}