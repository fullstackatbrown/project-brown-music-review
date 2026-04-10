/**
 * On-demand revalidation webhook for Cosmic CMS content changes.
 *
 * Setup (Cosmic dashboard):
 *   1. Go to Bucket Settings → Webhooks
 *   2. Add a webhook for each event you want to trigger a refresh:
 *        - Object Published
 *        - Object Edited
 *        - Object Deleted
 *   3. Set the URL to:
 *        https://<your-production-domain>/api/revalidate?secret=<COSMIC_WEBHOOK_SECRET>
 *   4. Set the environment variable COSMIC_WEBHOOK_SECRET in your deployment
 *      (Vercel → Project → Settings → Environment Variables) to a long random string.
 *
 * What it does:
 *   - Validates the incoming request against COSMIC_WEBHOOK_SECRET (query string or header).
 *   - Calls revalidateTag("cosmic-content") which invalidates every Cosmic-backed
 *     unstable_cache entry in lib/cosmic.ts, so the next request fetches fresh data.
 *
 * The shared "cosmic-content" tag is defined as COSMIC_TAG in lib/cosmic.ts.
 */

import { COSMIC_TAG } from "@/lib/cosmic"
import { revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"

// This route must run per-request — never statically cache the handler itself.
export const dynamic = "force-dynamic"

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.COSMIC_WEBHOOK_SECRET
  if (!expected) {
    // Fail closed if the secret isn't configured — better to 401 loudly than
    // to expose an unauthenticated cache-bust endpoint.
    return false
  }

  const headerSecret = request.headers.get("x-webhook-secret")
  const querySecret = request.nextUrl.searchParams.get("secret")
  const provided = headerSecret ?? querySecret

  return provided === expected
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ revalidated: false, error: "unauthorized" }, { status: 401 })
  }

  // Next 16 requires a cache-life profile as the second argument. The
  // profile is applied to entries created via the `use cache` directive;
  // legacy unstable_cache entries (what lib/cosmic.ts uses) are invalidated
  // by the tag regardless. "default" is the safe choice here.
  revalidateTag(COSMIC_TAG, "default")

  return NextResponse.json({ revalidated: true, tag: COSMIC_TAG, now: Date.now() })
}

export async function POST(request: NextRequest) {
  return handle(request)
}

// Cosmic sends POST by default, but allow GET for easy manual testing
// (e.g. `curl https://site/api/revalidate?secret=...`) during setup.
export async function GET(request: NextRequest) {
  return handle(request)
}
