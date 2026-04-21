"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo } from "react"
import { motion } from "framer-motion"

import type { HomepageArticle } from "@/lib/types"
import EmailSignup from "./components/EmailSignup"
import turntableArm from "./assets/69083a19ea0c16a5b974b718a75cd1d08b245ce6.png"


const MOCK_TITLES = [
  "The Sound of Silence Revisited",
  "When Jazz Met Hip-Hop",
  "Vinyl Dreams in a Digital Age",
  "The Art of the B-Side",
  "Echoes From the Underground",
  "Rhythm & Rebellion",
  "Notes on a Genre in Flux",
  "Frequency and Feeling",
  "The Lost Tapes",
  "Beyond the Bassline",
  "Melody as Memory",
  "Sonic Landscapes",
  "The Groove Manifesto",
  "Chords of Change",
  "Rewind, Replay, Reimagine",
  "Static and Soul",
  "The Backbeat Diaries",
  "Amplified Emotions",
  "Turntable Philosophy",
  "Waveforms and Wanderlust",
]

const MOCK_BLURBS = [
  "A deep exploration of how silence and space define the most powerful moments in music history.",
  "Tracing the unexpected connections between two genres that changed everything.",
  "Why the warmth of analog still matters in an era of infinite streaming.",
  "The forgotten tracks that shaped careers and redefined artistic direction.",
  "How underground scenes continue to push the boundaries of popular music.",
  "An examination of music as protest, from folk to punk to hip-hop.",
]

const MOCK_AUTHORS = [
  "Bryan Chung",
  "Jennifer Park",
  "Thomas Lu",
  "Sarah Kim",
  "Alex Rivera",
]

function makeMockArticle(index: number): HomepageArticle {
  return {
    id: `mock-${index}`,
    slug: "",
    href: "#",
    title: MOCK_TITLES[index % MOCK_TITLES.length],
    artist: MOCK_AUTHORS[index % MOCK_AUTHORS.length],
    reviewer: MOCK_AUTHORS[index % MOCK_AUTHORS.length],
    year: "2026",
    genre: "",
    summary: MOCK_BLURBS[index % MOCK_BLURBS.length],
    typeLabel: "Article",
    coverImage: null,
    ratingLabel: null,
    accentColor: "#D20000",
    labelColor: "#D20000",
    vinylLabel: "BMR",
  }
}

function fillSlots(
  articles: HomepageArticle[],
  count: number
): HomepageArticle[] {
  const result = articles.slice(0, count)
  for (let i = result.length; i < count; i++) {
    result.push(makeMockArticle(i))
  }
  return result
}

/* ------------------------------------------------------------------ */
/*  Spinning Vinyl Record                                              */
/* ------------------------------------------------------------------ */
function SpinningVinyl({ size = 620 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Everything spins together as one unit */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50%, #1a1a1a 0%, #0a0a0a 30%, #111 50%, #0a0a0a 70%, #050505 100%)",
        }}
      >
        {/* Groove rings */}
        {[0.92, 0.84, 0.76, 0.68, 0.6, 0.52].map((r) => (
          <div
            key={r}
            className="absolute rounded-full border border-white/[0.03]"
            style={{
              top: `${(1 - r) * 50}%`,
              left: `${(1 - r) * 50}%`,
              width: `${r * 100}%`,
              height: `${r * 100}%`,
            }}
          />
        ))}
        {/* Sheen highlight */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.04) 60deg, transparent 120deg, rgba(255,255,255,0.02) 240deg, transparent 360deg)",
          }}
        />
        {/* Red label - 29% of disc */}
        <div
          className="absolute bg-[#D20000] rounded-full"
          style={{
            width: "29%",
            height: "29%",
            top: "35.5%",
            left: "35.5%",
          }}
        />
        {/* Center hole - 13% of disc */}
        <div
          className="absolute bg-[#0a0a0a] rounded-full"
          style={{
            width: "13%",
            height: "13%",
            top: "43.5%",
            left: "43.5%",
          }}
        />
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Article Card (grid)                                                */
/* ------------------------------------------------------------------ */
function ArticleCard({ article }: { article: HomepageArticle }) {
  const inner = (
    <motion.div
      whileHover={{ y: -8 }}
      className="flex flex-col group bg-white cursor-pointer border border-neutral-100 rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-200">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold leading-snug mb-2 group-hover:text-[#D20000] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-neutral-500 mb-4 line-clamp-3 leading-relaxed">
          {article.summary}
        </p>
        <p className="text-sm italic text-neutral-400">
          by {article.reviewer}
        </p>
      </div>
    </motion.div>
  )

  if (article.slug) {
    return <Link href={article.href}>{inner}</Link>
  }
  return inner
}

/* ------------------------------------------------------------------ */
/*  Wide Feature Card (horizontal)                                     */
/* ------------------------------------------------------------------ */
function WideFeatureCard({ article }: { article: HomepageArticle }) {
  const inner = (
    <motion.div
      whileHover={{ y: -4 }}
      className="group grid grid-cols-1 md:grid-cols-2 bg-white border border-neutral-100 rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-neutral-200">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
        )}
      </div>
      <div className="p-8 flex flex-col justify-center">
        <span className="text-xs font-mono tracking-widest uppercase text-[#D20000] mb-3">
          Featured
        </span>
        <h3 className="text-2xl font-bold leading-snug mb-3 group-hover:text-[#D20000] transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-neutral-500 mb-4 leading-relaxed line-clamp-4">
          {article.summary}
        </p>
        <p className="text-sm italic text-neutral-400">
          by {article.reviewer}
        </p>
      </div>
    </motion.div>
  )

  if (article.slug) {
    return <Link href={article.href}>{inner}</Link>
  }
  return inner
}

/* ------------------------------------------------------------------ */
/*  Auto-scrolling carousel for hero section                           */
/* ------------------------------------------------------------------ */
function AutoScrollCarousel({ articles }: { articles: HomepageArticle[] }) {
  const labels = ["Deep Dive", "Narratives", "Hot Topics", "Opinions", "Deep Dive", "Narratives"]

  // Duplicate the items so the scroll can loop seamlessly. Because the two
  // copies are identical, when the animation wraps back to its start position
  // the visible layout is pixel-identical — the viewer sees a continuous reel.
  const items = [...articles, ...articles]

  // Each card is 240px wide with a 24px gap (Tailwind `gap-6` = 1.5rem = 24px),
  // so one full "stride" from the start of one card to the start of the next is
  // exactly 264px. Animating by `articles.length * STRIDE` lands the second copy
  // of the list precisely where the first copy started, making the loop seamless.
  const CARD_WIDTH = 240
  const CARD_GAP = 24
  const STRIDE = CARD_WIDTH + CARD_GAP
  const loopDistance = articles.length * STRIDE

  return (
    <div
      className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <motion.div
        className="flex gap-6"
        // Scroll left-to-right: start with the list shifted one full copy to
        // the left, then ease back to 0. Items visually enter from the left
        // edge and exit on the right.
        animate={{ x: [-loopDistance, 0] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: articles.length * 6,
            ease: "linear",
          },
        }}
      >
        {items.map((article, i) => {
          const card = (
            <div className={`flex-shrink-0 ${article.slug ? "cursor-pointer" : ""}`} style={{ width: 240 }}>
              {/* Category pill */}
              <div className="flex justify-center mb-4">
                <div className="h-[40px] px-8 bg-[#D20000] rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {labels[i % labels.length]}
                  </span>
                </div>
              </div>
              {/* Cover image */}
              <div className="w-[240px] h-[240px] rounded-[20px] overflow-hidden bg-neutral-200 relative mb-4">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                )}
              </div>
              {/* Title + author */}
              <div className="text-center">
                <p className="text-lg font-bold leading-tight mb-1">{article.title}</p>
                <p className="text-sm italic text-neutral-500">{article.reviewer}</p>
              </div>
            </div>
          )

          return article.slug ? (
            <Link key={`${article.id}-${i}`} href={article.href}>
              {card}
            </Link>
          ) : (
            <div key={`${article.id}-${i}`}>{card}</div>
          )
        })}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Dark Section Text Block                                            */
/* ------------------------------------------------------------------ */
function DarkSectionArticle({ article }: { article: HomepageArticle }) {
  const inner = (
    <div className="text-center max-w-[380px]">
      <h4 className="text-white text-2xl md:text-3xl font-bold mb-3 uppercase">
        {article.title}
      </h4>
      <p className="text-white/70 text-base md:text-lg leading-relaxed">
        {article.summary}
      </p>
    </div>
  )

  if (article.slug) {
    return (
      <Link href={article.href} className="hover:opacity-80 transition-opacity">
        {inner}
      </Link>
    )
  }
  return inner
}

/* ------------------------------------------------------------------ */
/*  Featured Center Article (dark section)                             */
/* ------------------------------------------------------------------ */
function FeaturedCenterArticle({ article }: { article: HomepageArticle }) {
  const inner = (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[372px] aspect-square rounded-[30px] overflow-hidden mb-8 bg-neutral-700 shadow-xl relative">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-700" />
        )}
      </div>
      <div className="h-[51px] px-10 bg-[#D20000] rounded-[30px] flex items-center justify-center mb-6">
        <span className="text-white text-2xl font-normal">Deep Dive</span>
      </div>
      <h2 className="text-white text-3xl md:text-4xl font-bold mb-3 text-center">
        {article.title}
      </h2>
      <p className="text-white/70 text-lg text-center leading-relaxed max-w-md">
        {article.summary}
      </p>
    </div>
  )

  if (article.slug) {
    return (
      <Link href={article.href} className="hover:opacity-90 transition-opacity">
        {inner}
      </Link>
    )
  }
  return inner
}

/* ------------------------------------------------------------------ */
/*  Main Homepage                                                      */
/* ------------------------------------------------------------------ */
export default function HomeClient({ articles }: { articles: HomepageArticle[] }) {

  const {
    heroArticles,
    featuredCenter,
    featuredSides,
    wideFeatures,
    gridArticles,
  } = useMemo(() => {
    const total = articles.length

    if (total === 0) {
      // No articles at all — fill everything with mocks
      return {
        heroArticles: fillSlots([], 6),
        featuredCenter: makeMockArticle(6),
        featuredSides: fillSlots([], 6),
        wideFeatures: fillSlots([], 2),
        gridArticles: fillSlots([], 6),
      }
    }

    // Hero carousel: first 6 articles
    const hero = fillSlots(articles.slice(0, 6), 6)

    // Dark featured section: next batch after hero
    const center = fillSlots(articles.slice(6, 7), 1)
    const sides = fillSlots(articles.slice(7, 13), 6)

    // Wide features: pick 2 articles. If we have more than 13, use those;
    // otherwise cycle back to the start of the list so the section stays filled.
    const wideStart = total > 13 ? 13 : 0
    const wide = articles.slice(wideStart, wideStart + 2)

    // Grid ("More from BMR"): show all articles so users can browse everything.
    // Skip any that are already the wide features to avoid immediate duplicates.
    const wideIds = new Set(wide.map((a) => a.id))
    const grid = articles.filter((a) => !wideIds.has(a.id))

    return {
      heroArticles: hero,
      featuredCenter: center[0],
      featuredSides: sides,
      wideFeatures: wide,
      gridArticles: grid,
    }
  }, [articles])

  return (
    <div className="w-full bg-white relative overflow-x-hidden min-h-screen">
      {/* ============================================================ */}
      {/* HERO: Record player left, Latest From + scrolling cards right  */}
      {/* ============================================================ */}
      <section className="relative w-full flex" style={{ minHeight: 520 }}>
        {/* Left: Record player.
            Fixed pixel width (was "38%") — on wide viewports 38% left hundreds
            of pixels of empty space to the right of the vinyl, pushing the
            "Latest From" heading + carousel far toward the right edge. A fixed
            width that just contains the vinyl lets the right column grow and
            makes the carousel start further left on the page naturally. */}
        <div className="relative flex-shrink-0" style={{ width: 440 }}>
          <div className="absolute" style={{ left: 20, top: 30 }}>
            <SpinningVinyl size={400} />
          </div>
          <div
            className="absolute z-10"
            style={{
              left: 320,
              top: 0,
              width: 100,
              height: 280,
              transform: "rotate(30deg)",
              transformOrigin: "50% 5%",
            }}
          >
            <Image
              src={turntableArm}
              alt=""
              width={100}
              height={280}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right: Latest From + auto-scrolling article carousel.
            Because the left column is now a fixed 440px (instead of 38%),
            this column grows wider on all viewports — the heading and
            carousel naturally start farther left on the page. */}
        <div className="flex-1 flex flex-col pt-6 pr-0 overflow-hidden">
          {/* Latest From heading */}
          <div className="pr-12 mb-8">
            <h2 className="text-[clamp(48px,6vw,90px)] font-medium text-[#D20000] leading-none mb-3 text-right">
              Latest From
            </h2>
            <div className="border-t-[5px] border-black w-full" />
          </div>

          {/* Auto-scrolling carousel */}
          <div className="relative flex-1 overflow-hidden">
            <AutoScrollCarousel articles={heroArticles} />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION C: Dark Featured Section                              */}
      {/* ============================================================ */}
      <section className="w-full bg-black py-16 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div className="flex flex-col gap-12 items-center">
            {featuredSides.slice(0, 3).map((a) => (
              <DarkSectionArticle key={a.id} article={a} />
            ))}
          </div>
          <FeaturedCenterArticle article={featuredCenter} />
          <div className="flex flex-col gap-12 items-center">
            {featuredSides.slice(3, 6).map((a) => (
              <DarkSectionArticle key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION D: Wide Feature Cards                                 */}
      {/* ============================================================ */}
      <section className="w-full px-8 md:px-16 py-16">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
          {wideFeatures.map((article) => (
            <WideFeatureCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION E: Article Card Grid                                  */}
      {/* ============================================================ */}
      <section className="w-full px-8 md:px-16 pb-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8">More From BMR</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION F: See All                                            */}
      {/* ============================================================ */}
      <section className="w-full text-center pb-16">
        <Link
          href="/reviews"
          className="text-4xl font-bold hover:text-[#D20000] transition-colors"
        >
          see all
        </Link>
      </section>

      {/* ============================================================ */}
      {/* SECTION G: Email Signup                                       */}
      {/* ============================================================ */}
      <EmailSignup />
    </div>
  )
}
