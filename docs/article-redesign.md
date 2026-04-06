# For Frontend

## Current Progress

The article experience currently has two layers:

1. Homepage preview list and modal
2. Full article page at `/reviews/[slug]`

The homepage pulls live Cosmic content from both `albumrate` and `albumreview`, normalizes them into one frontend shape, and lets a user open a modal preview before navigating to the full article.

The full article page fetches a single article by slug and renders the body using the correct renderer for the underlying Cosmic field type.

## File Map

- `lib/types.ts`
  - Type definitions for Cosmic objects and the normalized `HomepageArticle` shape.
- `lib/cosmic.ts`
  - Cosmic client creation
  - Fetch helpers for single articles and homepage lists
  - Field normalization helpers
  - Body-format detection
- `app/api/homepage-articles/route.ts`
  - API route used by the homepage client to fetch normalized article cards.
- `app/page.tsx`
  - Homepage review list, modal preview, and "Read full piece" link.
- `app/reviews/[slug]/page.tsx`
  - Full article page layout.
- `app/components/ArticleBody.tsx`
  - Body renderer that switches between Markdown and HTML modes.
- `app/reviews/[slug]/loading.tsx`
  - Loading skeleton for the full article route.

## Cosmic Data Model

There are two supported object types:

### `albumrate`

- Body field: `metadata.body_content`
- Cosmic field type: `markdown`
- Renderer used: `react-markdown` with `remark-gfm`
- Extra metadata available:
  - `writer`
  - `review_contributors`
  - `editor(s)`
  - `score`
  - `cover_image`
  - `tagline`

### `albumreview`

- Body field: `metadata.body`
- Cosmic field type: `html-textarea`
- Renderer used: raw HTML via `dangerouslySetInnerHTML`
- Extra metadata available:
  - `citation`
  - `tagline`

## Current Rendering Rules

Body rendering is decided in `app/components/ArticleBody.tsx`:

- If the article is `albumreview`, render the saved HTML directly.
- If the article is `albumrate`, render Markdown using `react-markdown`.

This behavior depends on `getArticleBodyFormat()` and `getArticleBodyContent()` in `lib/cosmic.ts`.


## How To Change The Article Layout

If a frontend engineer wants to redesign the full article page, the main file to edit is:

- `app/reviews/[slug]/page.tsx`

This file currently controls:

- top-level page shell
- image placement
- title and byline placement
- section spacing
- article metadata display

### Recommended Workflow

1. Keep the data fetch logic as-is in `app/reviews/[slug]/page.tsx`
2. Move presentational markup into a dedicated component if the page becomes more complex
3. Leave body rendering inside `app/components/ArticleBody.tsx` unless the renderer itself needs visual changes
4. If the new design needs citations, scores, editors, or contributor blocks, pull them from the typed metadata in `lib/types.ts`

## How To Change Body Typography / Rich Content Styling

If the request is about how paragraphs, headings, links, blockquotes, or lists look, edit:

- `app/components/ArticleBody.tsx`

That file controls:

- Markdown element mappings
- HTML body wrapper styles
- spacing between paragraphs
- link styling
- heading styling
- blockquote styling

Examples of design changes that belong there:

- larger body font
- narrower reading column
- serif body copy
- custom heading scale
- styled pull quotes
- stronger link color treatment

## How To Change Homepage Preview Cards / Modal

If the request is about the homepage article list or modal preview, edit:

- `app/page.tsx`

Key sections:

- `ReviewRow`
  - row card layout in the homepage list
- `ReviewModal`
  - modal preview layout and CTA
- `HomePage`
  - loading state, stats, and article fetch behavior

## If New Metadata Needs To Be Shown

Update in this order:

1. `lib/types.ts`
   - add the field to the appropriate metadata type
2. `lib/cosmic.ts`
   - expose a helper if the field needs normalization
3. `app/reviews/[slug]/page.tsx` or `app/page.tsx`
   - render the field in the desired location

Examples:

- Show `citation` under the article body for `albumreview`
- Show `score.value` as a branded score badge for `albumrate`
- Show `review_contributors` under the byline
- Show `editor(s)` in a credits footer

## If The Team Wants A Cleaner Separation

Suggested next refactor:

1. Create `app/components/article/ArticleHero.tsx`
2. Create `app/components/article/ArticleMeta.tsx`
3. Create `app/components/article/ArticleCredits.tsx`
4. Keep `ArticleBody.tsx` as the rich-text renderer
5. Reduce `app/reviews/[slug]/page.tsx` to data fetch + composition

That would make it much easier for a frontend engineer to redesign the article page without touching Cosmic fetch logic.

## Known Constraint

`albumrate` and `albumreview` do not currently have the same metadata shape. Any redesign that assumes all articles have:

- writer
- cover image
- score
- citation

must handle missing fields gracefully.

## Suggested Frontend Priorities

1. Redesign the article hero section in `app/reviews/[slug]/page.tsx`
2. Improve reading-width and typography in `app/components/ArticleBody.tsx`
3. Add an optional credits/citation/footer section
4. Decide whether homepage modal should stay or whether rows should link directly to full articles
5. Extract article presentation into dedicated components once the visual direction is approved
