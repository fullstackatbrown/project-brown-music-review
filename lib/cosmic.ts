import {
  createBucketClient,
  type BucketConfig,
  type GenericObject,
} from "@cosmicjs/sdk"
import type {
  Article,
  CosmicListResponse as TypedCosmicListResponse,
  CosmicResponse as TypedCosmicResponse,
} from "../lib/types"

export type CosmicStatus = "published" | "draft" | "any"

export type CosmicMetadata = Record<string, unknown>

export const articleProps = `{
  id
  slug
  title
  type
  metadata {
    writer
    review_contributors
    editor_s
    managing_editor
    publish_date
    tagline
    cover_image {
      url
      imgix_url
    }
    body_content
    in_paragraph_video {
      url
      imgix_url
    }
  }
}`

export const articleMediaProps = "alt_text,width,height"

export type CosmicObject<TMetadata extends CosmicMetadata = CosmicMetadata> = {
  id: string
  type: string
  title: string
  slug: string
  status: Exclude<CosmicStatus, "any">
  metadata: TMetadata
  created_at?: string
  modified_at?: string
  published_at?: string | null
  publish_at?: string | null
  unpublish_at?: string | null
  thumbnail?: string | null
  locale?: string | null
  [key: string]: unknown
}

export type CosmicMetadataListResponse<
  TMetadata extends CosmicMetadata = CosmicMetadata,
> = {
  objects: CosmicObject<TMetadata>[]
  total?: number
  limit?: number
}

export type CosmicMetadataSingleResponse<
  TMetadata extends CosmicMetadata = CosmicMetadata,
> = {
  object: CosmicObject<TMetadata> | null
}

type CosmicProps = string | string[]

type CosmicQuery = GenericObject

type QueryOptions = {
  props?: CosmicProps
  status?: CosmicStatus
  depth?: number
  mediaProps?: string
}

export type GetObjectsParams = QueryOptions & {
  query?: CosmicQuery
  limit?: number
  skip?: number
  after?: string
  sort?: string
}

export type GetObjectParams = QueryOptions & {
  query: CosmicQuery
}

let cosmicClient: ReturnType<typeof createBucketClient> | null = null

function getRequiredEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in your environment before using Cosmic.`,
    )
  }

  return value
}

export function isCosmicConfigured(): boolean {
  return Boolean(process.env.COSMIC_BUCKET_SLUG && process.env.COSMIC_READ_KEY)
}

export function getCosmicConfig(): BucketConfig {
  const apiEnvironment =
    process.env.COSMIC_API_ENVIRONMENT === "staging"
      ? "staging"
      : "production"

  return {
    bucketSlug: getRequiredEnv("COSMIC_BUCKET_SLUG"),
    readKey: getRequiredEnv("COSMIC_READ_KEY"),
    writeKey: process.env.COSMIC_WRITE_KEY,
    apiVersion: "v3",
    apiEnvironment,
  }
}

export function getCosmicClient() {
  if (!cosmicClient) {
    cosmicClient = createBucketClient(getCosmicConfig())
  }

  return cosmicClient
}

function applySharedOptions<
  T extends {
    props(props: CosmicProps): T
    status(status: CosmicStatus): T
    depth(depth: number): T
    options(options: { media: { props: string } }): T
  },
>(request: T, options: QueryOptions): T {
  let nextRequest = request

  if (options.props) {
    nextRequest = nextRequest.props(options.props)
  }

  if (options.status) {
    nextRequest = nextRequest.status(options.status)
  }

  if (typeof options.depth === "number") {
    nextRequest = nextRequest.depth(options.depth)
  }

  if (options.mediaProps) {
    nextRequest = nextRequest.options({
      media: {
        props: options.mediaProps,
      },
    })
  }

  return nextRequest
}

export async function getObjects<
  TMetadata extends CosmicMetadata = CosmicMetadata,
>({
  query = {},
  props,
  status,
  depth,
  mediaProps,
  limit,
  skip,
  after,
  sort,
}: GetObjectsParams = {}): Promise<CosmicMetadataListResponse<TMetadata>> {
  let request = applySharedOptions(getCosmicClient().objects.find(query), {
    props,
    status,
    depth,
    mediaProps,
  })

  if (typeof limit === "number") {
    request = request.limit(limit)
  }

  if (typeof skip === "number") {
    request = request.skip(skip)
  }

  if (after) {
    request = request.after(after)
  }

  if (sort) {
    request = request.sort(sort)
  }

  return (await request) as CosmicMetadataListResponse<TMetadata>
}

export async function getObject<
  TMetadata extends CosmicMetadata = CosmicMetadata,
>({
  query,
  props,
  status,
  depth,
  mediaProps,
}: GetObjectParams): Promise<CosmicMetadataSingleResponse<TMetadata>> {
  const request = applySharedOptions(getCosmicClient().objects.findOne(query), {
    props,
    status,
    depth,
    mediaProps,
  })

  return (await request) as CosmicMetadataSingleResponse<TMetadata>
}

export async function getArticles(
  params: Omit<GetObjectsParams, "query"> = {},
): Promise<TypedCosmicListResponse<Article>> {
  return (await getObjects({
    query: { type: "article" },
    props: articleProps,
    mediaProps: articleMediaProps,
    ...params,
  })) as unknown as TypedCosmicListResponse<Article>
}

export async function getArticleBySlug(
  slug: string,
  options: Omit<GetObjectParams, "query"> = {},
): Promise<TypedCosmicResponse<Article>> {
  return (await getObjectBySlug("article", slug, {
    props: articleProps,
    mediaProps: articleMediaProps,
    ...options,
  })) as unknown as TypedCosmicResponse<Article>
}

export async function getObjectBySlug<
  TMetadata extends CosmicMetadata = CosmicMetadata,
>(
  type: string,
  slug: string,
  options: Omit<GetObjectParams, "query"> = {},
): Promise<CosmicMetadataSingleResponse<TMetadata>> {
  return getObject<TMetadata>({
    query: { type, slug },
    ...options,
  })
}

export async function getObjectById<
  TMetadata extends CosmicMetadata = CosmicMetadata,
>(
  id: string,
  options: Omit<GetObjectParams, "query"> = {},
): Promise<CosmicMetadataSingleResponse<TMetadata>> {
  return getObject<TMetadata>({
    query: { id },
    ...options,
  })
}
