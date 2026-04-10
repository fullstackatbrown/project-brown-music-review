"use client";
import Image from "next/image";
import EmailSignup from "../components/EmailSignup";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const articles = [
  {
    id: 0,
    title: "Stop Gatekeeping 'Real' Music",
    author: "Bryan Chung '29",
    date: "March 2026",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "The obsession with authenticity in music criticism is doing more harm than good.",
    abstract:
      "We need to stop pretending that there's a meaningful line between 'real' and 'manufactured' music. Every genre was once someone's experiment.",
    accentColor: "#D20000",
    featured: true,
  },
  {
    id: 1,
    title: "The Grammy Problem Nobody Talks About",
    author: "Jennifer Park '29",
    date: "February 2026",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "It's not just about who wins — it's about who gets to be nominated in the first place.",
    abstract:
      "An examination of the Recording Academy's structural biases and why the nomination process matters more than the ceremony.",
    accentColor: "#1d3f8a",
    featured: false,
  },
  {
    id: 2,
    title: "Streaming Killed the Album. Good.",
    author: "Thomas Lu '28",
    date: "January 2026",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "The album format was never sacred — and the playlist era might actually be freeing artists.",
    abstract:
      "A contrarian take on why the decline of the album as a commercial unit has been quietly liberating for musicians willing to experiment.",
    accentColor: "#5c2d91",
    featured: false,
  },
  {
    id: 3,
    title: "Why Your Favorite Artist's 'Comeback' Album Is Mid",
    author: "Sarah Kim '28",
    date: "December 2025",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb: "Nostalgia is a trap, and legacy artists keep falling into it.",
    abstract:
      "From reunion tours to late-career 'returns to form,' the music industry's obsession with nostalgia often produces work that satisfies no one.",
    accentColor: "#8b1a00",
    featured: false,
  },
  {
    id: 4,
    title: "AI Music Isn't the Threat You Think It Is",
    author: "Alex Rivera '27",
    date: "November 2025",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "The real danger isn't AI making music — it's the industry using it as an excuse to pay artists less.",
    abstract:
      "While critics panic about AI-generated songs, the more pressing issue is how labels and platforms will weaponize the technology against the creators they claim to support.",
    accentColor: "#1a6b3c",
    featured: false,
  },
  {
    id: 5,
    title: "Concert Tickets Should Not Cost $500",
    author: "Karina Gostian '27",
    date: "November 2025",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb: "Dynamic pricing is ruining live music, and we're all complicit.",
    abstract:
      "The live music industry has become a playground for speculative pricing, and fans are paying the price — literally.",
    accentColor: "#b8860b",
    featured: false,
  },
  {
    id: 6,
    title: "In Defense of the One-Hit Wonder",
    author: "Yali Sommer '27",
    date: "October 2025",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb: "One perfect song is worth more than a lifetime of decent albums.",
    abstract:
      "We celebrate prolificacy in music but rarely ask whether quantity actually serves art. Sometimes one transcendent moment is the whole point.",
    accentColor: "#d4681f",
    featured: false,
  },
  {
    id: 7,
    title: "Music Criticism Is Dead. Long Live Music Criticism.",
    author: "Andrew Fuente '29",
    date: "September 2025",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb: "The old guard fell. What rises from the ashes might be better.",
    abstract:
      "With legacy publications shrinking and social media fragmenting taste, a new form of criticism is emerging — personal, democratic, and messy.",
    accentColor: "#1a4d5c",
    featured: false,
  },
];

function OpinionCard({
  article,
  index,
}: {
  article: (typeof articles)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const isLarge = index === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group cursor-pointer ${
        isLarge ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div
        className={`flex flex-col h-full rounded-none border-l-4 bg-white transition-all ${
          hovered ? "shadow-lg" : "shadow-sm"
        }`}
        style={{ borderLeftColor: hovered ? article.accentColor : "#e5e5e5" }}
      >
        {isLarge && (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-200">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: article.accentColor }}
            />
            <span className="text-xs font-mono tracking-widest uppercase text-neutral-400">
              Opinion · {article.date}
            </span>
          </div>
          <h3
            className={`font-bold leading-snug transition-colors ${
              isLarge ? "text-3xl" : "text-xl"
            }`}
            style={{ color: hovered ? article.accentColor : "#0a0a0a" }}
          >
            {article.title}
          </h3>
          <p
            className={`text-neutral-500 leading-relaxed ${
              isLarge ? "text-base line-clamp-4" : "text-sm line-clamp-3"
            }`}
          >
            {isLarge ? article.abstract : article.blurb}
          </p>
          <div className="mt-auto pt-3">
            <span className="text-sm font-medium text-neutral-600">
              {article.author}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedOpinion({ article }: { article: (typeof articles)[0] }) {
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
      <div className="max-w-[1000px] mx-auto flex flex-col items-center text-center gap-8">
        <span className="text-xs font-mono tracking-widest uppercase text-[#D20000]">
          Featured Opinion
        </span>
        <h2
          className="text-5xl md:text-6xl font-bold italic leading-tight max-w-3xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          &ldquo;{article.title}&rdquo;
        </h2>
        <div className="w-16 h-[3px] bg-[#D20000]" />
        <p className="text-lg leading-relaxed text-neutral-300 max-w-2xl">
          {article.abstract}
        </p>
        <p className="text-sm font-mono tracking-wide uppercase text-neutral-500">
          {article.author} · {article.date}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-8 py-3 bg-[#D20000] text-white text-sm font-mono tracking-widest uppercase"
        >
          Read the Full Take →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function OpinionsPage() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);
  const [displayedCount, setDisplayedCount] = useState(7);

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
          Opinions
        </h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-[3px] w-20 bg-black origin-left mb-6"
        />
        <p className="text-lg text-neutral-500 max-w-xl leading-relaxed">
          Bold takes, hot debates, and the arguments that keep us up at night.
          We don&apos;t do lukewarm.
        </p>
      </motion.div>

      {/* Featured opinion */}
      {featured && <FeaturedOpinion article={featured} />}

      {/* Opinions grid — editorial/magazine style with mixed sizes */}
      <div className="px-12 py-16">
        <div className="flex items-center gap-4 mb-12">
          <h2
            className="text-3xl font-bold italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            All Opinions
          </h2>
          <div className="h-[2px] w-10 bg-[#D20000]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px]">
          {rest.slice(0, displayedCount).map((article, idx) => (
            <OpinionCard key={article.id} article={article} index={idx} />
          ))}
        </div>

        {displayedCount < rest.length && (
          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() =>
                setDisplayedCount((prev) => Math.min(prev + 3, rest.length))
              }
              className="px-8 py-3 text-sm font-mono tracking-widest uppercase bg-[#D20000] text-white cursor-pointer"
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
