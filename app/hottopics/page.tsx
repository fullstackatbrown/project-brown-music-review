"use client";
import Image from "next/image";
import EmailSignup from "../components/EmailSignup";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const articles = [
  {
    id: 0,
    title: "Rihanna Unharmed After Shots Fired at Her L.A. Home",
    author: "Bryan Chung '29",
    date: "November 2026",
    cover: "/Wavejobim.jpg",
    blurb:
      "Breaking down the incident and what it says about celebrity safety in 2026.",
    abstract:
      "A look at the shocking events surrounding the pop icon's Los Angeles residence and the broader conversation about security for public figures.",
    accentColor: "#D20000",
    featured: true,
  },
  {
    id: 1,
    title: "Drake vs. Kendrick: The Beef That Defined a Year",
    author: "Thomas Lu '28",
    date: "October 2026",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "How a rivalry between two titans reshaped the hip-hop landscape overnight.",
    accentColor: "#1d3f8a",
    featured: false,
  },
  {
    id: 2,
    title: "Spotify Raises Prices Again — Is It Worth It?",
    author: "Jennifer Park '29",
    date: "September 2026",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "The streaming giant's latest price hike and what it means for listeners and artists.",
    accentColor: "#1a6b3c",
    featured: false,
  },
  {
    id: 3,
    title: "The Coachella Lineup Controversy",
    author: "Sarah Kim '28",
    date: "August 2026",
    cover: "/Wavejobim.jpg",
    blurb:
      "This year's festival headliners sparked heated debate — here's why.",
    accentColor: "#5c2d91",
    featured: false,
  },
  {
    id: 4,
    title: "Why Vinyl Sales Just Hit a 30-Year High",
    author: "Alex Rivera '27",
    date: "July 2026",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "Physical media refuses to die. The numbers tell an unexpected story.",
    accentColor: "#b8860b",
    featured: false,
  },
  {
    id: 5,
    title: "Taylor Swift's Eras Tour: By the Numbers",
    author: "Karina Gostian '27",
    date: "June 2026",
    cover: "/Wavejobim.jpg",
    blurb:
      "The economic and cultural footprint of the highest-grossing tour in history.",
    accentColor: "#8b1a00",
    featured: false,
  },
  {
    id: 6,
    title: "Is SoundCloud Rap Actually Dead?",
    author: "Andrew Fuente '29",
    date: "May 2026",
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    blurb:
      "Reports of its death may have been exaggerated. A new generation is logging on.",
    accentColor: "#d4681f",
    featured: false,
  },
  {
    id: 7,
    title: "The Grammys Snubbed Hip-Hop Again",
    author: "Yali Sommer '27",
    date: "April 2026",
    cover: "/Wavejobim.jpg",
    blurb:
      "Another year, another round of questionable decisions from the Recording Academy.",
    accentColor: "#1a4d5c",
    featured: false,
  },
];

function HotTopicCard({
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
      className="flex flex-col rounded-[20px] overflow-hidden bg-white cursor-pointer border border-neutral-100 shadow-sm hover:shadow-lg transition-shadow"
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
        {/* Hot badge */}
        <div className="absolute top-4 left-4 bg-[#D20000] text-white text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full">
          Hot Topic
        </div>
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
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

function FeaturedBanner({ article }: { article: (typeof articles)[0] }) {
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
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        {/* Left: title + author */}
        <motion.div
          initial={{ opacity: 0, x: -48 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-right"
        >
          <h2
            className="text-4xl font-bold italic leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {article.title}
          </h2>
          <p className="text-sm italic text-neutral-400">
            by {article.author}
          </p>
        </motion.div>

        {/* Center: image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative aspect-square rounded-[20px] overflow-hidden shadow-2xl"
        >
          <Image
            src={article.cover}
            alt={article.title}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Right: date + blurb + read more */}
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-5"
        >
          <p className="text-sm font-mono tracking-wide uppercase text-neutral-500">
            {article.date}
          </p>
          <p className="text-base leading-relaxed text-neutral-300">
            {article.abstract}
          </p>
          <motion.button
            whileHover={{ x: 8 }}
            className="self-end px-6 py-3 text-sm font-mono tracking-wide uppercase bg-[#D20000] text-white"
          >
            Read More →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HotTopicsPage() {
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
          Hot Topics
        </h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-[3px] w-20 bg-black origin-left mb-6"
        />
        <p className="text-lg text-neutral-500 max-w-xl leading-relaxed">
          The news, controversies, and conversations shaping the music world
          right now. Stay in the loop.
        </p>
      </motion.div>

      {/* Featured banner */}
      {featured && <FeaturedBanner article={featured} />}

      {/* Article grid */}
      <div className="px-12 py-16">
        <div className="flex items-center gap-4 mb-12">
          <h2
            className="text-3xl font-bold italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Trending Now
          </h2>
          <div className="h-[2px] w-10 bg-[#D20000]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {rest.slice(0, displayedCount).map((article, idx) => (
            <HotTopicCard key={article.id} article={article} index={idx} />
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
