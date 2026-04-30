"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { HomepageArticle } from "@/lib/types";
import EmailSignup from "../components/EmailSignup";

function ArticleCard({
  article,
  index,
}: {
  article: HomepageArticle;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={article.href}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.05 }}
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
          </motion.div>
        </div>
        <div className="p-6 flex flex-col gap-3 flex-1">
          <span
            className="text-xs font-mono tracking-widest uppercase self-start px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: article.accentColor }}
          >
            {article.typeLabel}
          </span>
          <h3
            className="text-xl font-bold leading-snug transition-colors line-clamp-2"
            style={{ color: hovered ? article.accentColor : "#0a0a0a" }}
          >
            {article.title}
          </h3>
          <p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed flex-1">
            {article.summary}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <span className="text-sm text-neutral-400">{article.reviewer}</span>
            <span className="text-xs text-neutral-300 font-mono">{article.year}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ReviewsClient({ articles }: { articles: HomepageArticle[] }) {
  const [displayedCount, setDisplayedCount] = useState(9);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="px-12 pt-16 pb-10 border-b border-neutral-200"
      >
        <span className="text-xs font-mono tracking-widest uppercase text-[var(--accent-reviews)] block mb-3">
          Brown Music Review
        </span>
        <h1 className="text-6xl text-[var(--accent-reviews)] mb-4 font-display tracking-wide">
          All Articles
        </h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-[3px] w-20 bg-black origin-left mb-6"
        />
        <p className="text-lg text-neutral-500 max-w-xl leading-relaxed">
          Everything we&apos;ve published — deep dives, narratives, hot takes, and album reviews.
        </p>
      </motion.div>

      <div className="px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {articles.slice(0, displayedCount).map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>

        {displayedCount < articles.length && (
          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setDisplayedCount((prev) => Math.min(prev + 6, articles.length))}
              className="px-8 py-3 text-sm font-mono tracking-widest uppercase bg-[var(--accent-reviews)] text-white rounded-none cursor-pointer"
            >
              Load More
            </motion.button>
          </div>
        )}

        {displayedCount >= articles.length && articles.length > 0 && (
          <p className="text-center text-neutral-400 mt-12 text-sm font-mono">
            You&apos;ve reached the end — that&apos;s everything we&apos;ve got (for now).
          </p>
        )}
      </div>

      <EmailSignup />
    </>
  );
}
