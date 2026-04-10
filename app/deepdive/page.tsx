"use client";
import Image from "next/image";
import EmailSignup from "../components/EmailSignup";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const articles = [
  {
    id: 0,
    title: "The Art of Alter Egos",
    author: "Karina Gostian '27",
    date: "March 2026",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "Within the art world, an iconic pair of sunglasses can mark the beginning of a universe.",
    abstract:
      "How musicians construct elaborate personas to explore themes they couldn't approach as themselves — from Ziggy Stardust to Sasha Fierce.",
    accentColor: "#D20000",
    featured: true,
  },
  {
    id: 1,
    title: "Everything In Its Right Place: Radiohead Before and After 2000",
    author: "Yali Sommer '27",
    date: "February 2026",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "How Kid A rewired a generation's expectations of what rock music could be.",
    abstract:
      "Tracing Radiohead's dramatic pivot from guitar-driven anthems to electronic experimentation, and the seismic impact it had on alternative music.",
    accentColor: "#1d3f8a",
    featured: false,
  },
  {
    id: 2,
    title: "Listening Back to 'Pieces of a Man'",
    author: "Elsa Eastwood '27",
    date: "February 2026",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "Gil Scott-Heron and Brian Jackson's 1971 masterpiece in the context of the Civil Rights movement.",
    abstract:
      "A re-examination of one of the most politically charged albums in American music history and its enduring resonance.",
    accentColor: "#8b1a00",
    featured: false,
  },
  {
    id: 3,
    title: "TikTokification: How One App Changed Music Forever",
    author: "Andrew Fuente '29",
    date: "December 2025",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb: "Social media's seismic impact on contemporary music production and consumption.",
    abstract:
      "From 15-second hooks to algorithmic virality, how TikTok has fundamentally altered the way artists create, distribute, and monetize music.",
    accentColor: "#5c2d91",
    featured: false,
  },
  {
    id: 4,
    title: "Exploring Boris: 30 Years of Noise",
    author: "Alex Pearson '27",
    date: "December 2025",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "A journey through the experimental metal band's prolific and genre-defying catalog.",
    abstract:
      "Boris has released over 25 studio albums across drone, sludge, shoegaze, and pop — this piece maps the through-lines of a career built on reinvention.",
    accentColor: "#1a6b3c",
    featured: false,
  },
  {
    id: 5,
    title: "The Anatomy of a Film Score",
    author: "Jennifer Park '29",
    date: "November 2025",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb: "How composers build emotional architecture beneath the moving image.",
    abstract:
      "From John Williams to Trent Reznor, a technical and emotional analysis of how film scores guide audiences through narrative.",
    accentColor: "#b8860b",
    featured: false,
  },
  {
    id: 6,
    title: "The Second Wave of Afrobeats",
    author: "Bryan Chung '29",
    date: "October 2025",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb: "How Burna Boy, Wizkid, and Tems brought West African rhythms to the global mainstream.",
    abstract:
      "Examining the cultural and sonic evolution from Fela Kuti's Afrobeat to the contemporary Afrobeats dominating global charts.",
    accentColor: "#d4681f",
    featured: false,
  },
  {
    id: 7,
    title: "Why Does Music Make Us Cry?",
    author: "Sarah Kim '28",
    date: "October 2025",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb: "The neuroscience of musical emotion and why certain chords break us open.",
    abstract:
      "A look at the science behind music's ability to trigger deep emotional responses — from the 'chills' of a key change to the grief of a minor chord.",
    accentColor: "#8b3a62",
    featured: false,
  },
];

function ArticleCard({
  article,
  index,
}: {
  article: (typeof articles)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-col rounded-[20px] border border-neutral-100 overflow-hidden bg-white cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-200">
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={article.cover}
            alt={article.title}
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <span
          className="text-xs font-mono tracking-widest uppercase self-start px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: article.accentColor }}
        >
          Deep Dive
        </span>
        <h3
          className="text-xl font-bold leading-snug transition-colors line-clamp-2"
          style={{ color: hovered ? article.accentColor : "#0a0a0a" }}
        >
          {article.title}
        </h3>
        <p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed flex-1">
          {article.blurb}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <span className="text-sm text-neutral-400">{article.author}</span>
          <span className="text-xs text-neutral-300 font-mono">{article.date}</span>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedArticle({ article }: { article: (typeof articles)[0] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="w-full bg-black text-white"
      style={{ padding: "80px 48px" }}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative aspect-square rounded-[20px] overflow-hidden shadow-2xl"
          style={{ border: `2px solid ${article.accentColor}` }}
        >
          <Image
            src={article.cover}
            alt={article.title}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <span className="text-xs font-mono tracking-widest uppercase text-[#D20000]">
            Featured Deep Dive
          </span>
          <h2
            className="text-4xl font-bold italic leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: article.accentColor }}
          >
            {article.title}
          </h2>
          <p className="text-sm font-mono tracking-wide uppercase text-neutral-400">
            By {article.author} · {article.date}
          </p>
          <p className="text-base leading-relaxed text-neutral-300">
            {article.abstract}
          </p>
          <motion.button
            whileHover={{ x: 8 }}
            className="self-start px-6 py-3 text-sm font-mono tracking-wide uppercase text-black"
            style={{ backgroundColor: article.accentColor }}
          >
            Read Article →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function DeepDivePage() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);
  const [displayedCount, setDisplayedCount] = useState(6);

  return (
    <>
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="px-12 pt-16 pb-10 border-b border-neutral-200"
      >
        <span className="text-xs font-mono tracking-widest uppercase text-[#D20000] block mb-3">
          Brown Music Review
        </span>
        <h1
          className="text-6xl font-bold italic text-[#D20000] mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Deep Dive
        </h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-[3px] w-20 bg-black origin-left mb-6"
        />
        <p className="text-lg text-neutral-500 max-w-xl leading-relaxed">
          Long-form explorations of the artists, albums, and movements that shaped music history.
          We go beyond the surface to find the stories that matter.
        </p>
      </motion.div>

      {/* Featured article */}
      {featured && <FeaturedArticle article={featured} />}

      {/* Article grid */}
      <div className="px-12 py-16">
        <div className="flex items-center gap-4 mb-12">
          <h2
            className="text-3xl font-bold italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            All Deep Dives
          </h2>
          <div className="h-[2px] w-10 bg-[#D20000]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px]">
          {rest.slice(0, displayedCount).map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>

        {displayedCount < rest.length && (
          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setDisplayedCount((prev) => Math.min(prev + 3, rest.length))}
              className="px-8 py-3 text-sm font-mono tracking-widest uppercase bg-[#D20000] text-white rounded-none cursor-pointer"
            >
              Load More
            </motion.button>
          </div>
        )}
      </div>

      <EmailSignup />
    </>
  );
}
