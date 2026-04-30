"use client";
import Image from "next/image";
import Link from "next/link";
import EmailSignup from "../components/EmailSignup";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { HomepageArticle } from "@/lib/types";

function OpinionCard({ article, index }: { article: HomepageArticle; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const isLarge = index === 0;

  const card = (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.06 }} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} className={`group cursor-pointer ${isLarge ? "md:col-span-2 md:row-span-2" : ""}`}>
      <div className={`flex flex-col h-full rounded-none border-l-4 bg-white transition-all ${hovered ? "shadow-lg" : "shadow-sm"}`} style={{ borderLeftColor: hovered ? article.accentColor : "#e5e5e5" }}>
        {isLarge && (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-200">
            {article.coverImage ? <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority /> : <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />}
          </div>
        )}
        <div className="p-6 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: article.accentColor }} />
            <span className="text-xs font-mono tracking-widest uppercase text-neutral-400">{article.typeLabel} &middot; {article.year}</span>
          </div>
          <h3 className={`font-bold leading-snug transition-colors ${isLarge ? "text-3xl" : "text-xl"}`} style={{ color: hovered ? article.accentColor : "#0a0a0a" }}>{article.title}</h3>
          <p className={`text-neutral-500 leading-relaxed ${isLarge ? "text-base line-clamp-4" : "text-sm line-clamp-3"}`}>{article.summary}</p>
          <div className="mt-auto pt-3"><span className="text-sm font-medium text-neutral-600">{article.reviewer}</span></div>
        </div>
      </div>
    </motion.div>
  );

  if (article.slug) return <Link href={article.href}>{card}</Link>;
  return card;
}

function FeaturedOpinion({ article }: { article: HomepageArticle }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const inner = (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }} className="w-full bg-black text-white" style={{ padding: "80px 48px" }}>
      <div className="max-w-[1000px] mx-auto flex flex-col items-center text-center gap-8">
        <span className="text-xs font-mono tracking-widest uppercase text-[var(--accent-opinions)]">Featured</span>
        {article.coverImage ? (
          <div
            className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] overflow-hidden shadow-2xl"
            style={{ border: `2px solid var(--accent-opinions)` }}
          >
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority sizes="320px" />
          </div>
        ) : null}
        <h2 className="text-5xl md:text-6xl leading-tight max-w-3xl font-display tracking-wide">&ldquo;{article.title}&rdquo;</h2>
        <div className="w-16 h-[3px] bg-[var(--accent-opinions)]" />
        <p className="text-lg leading-relaxed text-neutral-300 max-w-2xl">{article.summary}</p>
        <p className="text-sm font-mono tracking-wide uppercase text-neutral-500">{article.reviewer} &middot; {article.year}</p>
        <motion.span whileHover={{ scale: 1.05 }} className="px-8 py-3 bg-[var(--accent-opinions)] text-black text-sm font-mono tracking-widest uppercase inline-block">Read the Full Take &rarr;</motion.span>
      </div>
    </motion.div>
  );

  if (article.slug) return <Link href={article.href}>{inner}</Link>;
  return inner;
}

export default function OpinionsClient({ articles }: { articles: HomepageArticle[] }) {
  const [displayedCount, setDisplayedCount] = useState(7);
  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="px-12 pt-16 pb-10 border-b border-neutral-200">
        <span className="text-xs font-mono tracking-widest uppercase text-[var(--accent-opinions)] block mb-3">Brown Music Review</span>
        <h1 className="text-6xl text-[var(--accent-opinions)] mb-4 font-display tracking-wide">Opinions</h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="h-[3px] w-20 bg-black origin-left mb-6" />
        <p className="text-lg text-neutral-500 max-w-xl leading-relaxed">Bold takes, hot debates, and the arguments that keep us up at night. We don&apos;t do lukewarm.</p>
      </motion.div>

      {featured && <FeaturedOpinion article={featured} />}

      <div className="px-12 py-16">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl font-display tracking-wide">All Opinions</h2>
          <div className="h-[2px] w-10 bg-[var(--accent-opinions)]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
          {rest.slice(0, displayedCount).map((article, idx) => (
            <OpinionCard key={article.id} article={article} index={idx} />
          ))}
        </div>
        {displayedCount < rest.length && (
          <div className="flex justify-center mt-12">
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setDisplayedCount((prev) => Math.min(prev + 3, rest.length))} className="px-8 py-3 text-sm font-mono tracking-widest uppercase bg-[var(--accent-opinions)] text-black cursor-pointer">Load More</motion.button>
          </div>
        )}
      </div>
      <EmailSignup />
    </>
  );
}
