"use client";
import Image from "next/image";
import Link from "next/link";
import EmailSignup from "../components/EmailSignup";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { HomepageArticle } from "@/lib/types";

function HotTopicCard({
  article,
  index,
}: {
  article: HomepageArticle;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  const card = (
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
          {article.coverImage ? (
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
          )}
        </motion.div>
        <div className="absolute top-4 left-4 bg-[var(--accent-hottopics)] text-white text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full">
          {article.typeLabel}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="text-xl font-bold leading-snug transition-colors line-clamp-2" style={{ color: hovered ? article.accentColor : "#0a0a0a" }}>
          {article.title}
        </h3>
        <p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed flex-1">{article.summary}</p>
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <span className="text-sm text-neutral-400">{article.reviewer}</span>
          <span className="text-xs text-neutral-300 font-mono">{article.year}</span>
        </div>
      </div>
    </motion.div>
  );

  if (article.slug) return <Link href={article.href}>{card}</Link>;
  return card;
}

function FeaturedBanner({ article }: { article: HomepageArticle }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const inner = (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }} className="w-full bg-black text-white" style={{ padding: "80px 48px" }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -48 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-right">
          <h2 className="text-4xl leading-tight mb-4 font-display tracking-wide">{article.title}</h2>
          <p className="text-sm italic text-neutral-400">by {article.reviewer}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6, delay: 0.15 }} className="relative aspect-square rounded-[20px] overflow-hidden shadow-2xl">
          {article.coverImage ? <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority /> : <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900" />}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 48 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col gap-5">
          <p className="text-sm font-mono tracking-wide uppercase text-neutral-500">{article.year}</p>
          <p className="text-base leading-relaxed text-neutral-300">{article.summary}</p>
          <motion.span whileHover={{ x: 8 }} className="self-end px-6 py-3 text-sm font-mono tracking-wide uppercase bg-[var(--accent-hottopics)] text-white inline-block">Read More &rarr;</motion.span>
        </motion.div>
      </div>
    </motion.div>
  );

  if (article.slug) return <Link href={article.href}>{inner}</Link>;
  return inner;
}

export default function HotTopicsClient({ articles }: { articles: HomepageArticle[] }) {
  const [displayedCount, setDisplayedCount] = useState(6);
  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="px-12 pt-16 pb-10 border-b border-neutral-200">
        <span className="text-xs font-mono tracking-widest uppercase text-[var(--accent-hottopics)] block mb-3">Brown Music Review</span>
        <h1 className="text-6xl text-[var(--accent-hottopics)] mb-4 font-display tracking-wide">Hot Topics</h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="h-[3px] w-20 bg-black origin-left mb-6" />
        <p className="text-lg text-neutral-500 max-w-xl leading-relaxed">The news, controversies, and conversations shaping the music world right now. Stay in the loop.</p>
      </motion.div>

      {featured && <FeaturedBanner article={featured} />}

      <div className="px-12 py-16">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl font-display tracking-wide">Trending Now</h2>
          <div className="h-[2px] w-10 bg-[var(--accent-hottopics)]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {rest.slice(0, displayedCount).map((article, idx) => (
            <HotTopicCard key={article.id} article={article} index={idx} />
          ))}
        </div>
        {displayedCount < rest.length && (
          <div className="flex justify-center mt-12">
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setDisplayedCount((prev) => Math.min(prev + 3, rest.length))} className="px-8 py-3 text-sm font-mono tracking-widest uppercase bg-[var(--accent-hottopics)] text-white cursor-pointer">Load More</motion.button>
          </div>
        )}
      </div>
      <EmailSignup />
    </>
  );
}
