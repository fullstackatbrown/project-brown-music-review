"use client";
import Image from "next/image";
import Link from "next/link";
import EmailSignup from "../components/EmailSignup";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { HomepageArticle } from "@/lib/types";


function VinylDisc({
  color,
  size = 80,
  rotation = 0,
}: {
  color: string;
  size?: number;
  rotation?: number;
}) {
  return (
    <motion.div
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 500, damping: 90, mass: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 50%, #2a2a2a 0%, #111 35%, #060606 100%)",
        boxShadow: "0 2px 18px rgba(0,0,0,0.5)",
        position: "relative",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {[0.72, 0.58, 0.46].map((r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: `${r * 100}%`,
            height: `${r * 100}%`,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "conic-gradient(from 30deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.06) 40deg, rgba(255,255,255,0) 80deg, rgba(255,255,255,0.03) 200deg, rgba(255,255,255,0) 360deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "28%",
          height: "28%",
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <div
          style={{
            width: size * 0.04,
            height: size * 0.04,
            borderRadius: "50%",
            background: "#0a0a0a",
          }}
        />
      </div>
    </motion.div>
  );
}

function CarouselItem({ article }: { article: HomepageArticle }) {
  const [hovered, setHovered] = useState(false);

  const card = (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ scale: hovered ? 1.04 : 1, y: hovered ? -8 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        minWidth: 200,
        flexShrink: 0,
        position: "relative",
        zIndex: hovered ? 50 : 1,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 200,
          height: 200,
          backgroundColor: "#f4f4f4",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.3s",
        }}
      >
        {article.coverImage ? (
          <motion.img
            src={article.coverImage}
            alt={article.title}
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #e5e5e5, #ccc)" }} />
        )}
      </div>
      <div>
        <p
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "0.9rem",
            fontWeight: 700,
            fontStyle: "italic",
            color: hovered ? article.accentColor : "#0a0a0a",
            margin: 0,
            marginBottom: 4,
            transition: "color 0.2s",
            lineHeight: 1.2,
          }}
        >
          {article.title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: "0.65rem",
            color: "#999",
            margin: 0,
          }}
        >
          {article.reviewer}
        </p>
      </div>
    </motion.div>
  );

  if (article.slug) {
    return <Link href={article.href}>{card}</Link>;
  }
  return card;
}

function FeaturedSection({ article }: { article: HomepageArticle }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const inner = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        background: "#0a0a0a",
        color: "#fff",
        padding: "80px 48px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 48,
          alignItems: "center",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -48 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              fontStyle: "italic",
              lineHeight: 1.15,
              marginBottom: 20,
              color: article.accentColor,
            }}
          >
            {article.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#aaa",
            }}
          >
            By {article.reviewer}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            position: "relative",
            width: 280,
            height: 280,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
            border: `2px solid ${article.accentColor}`,
          }}
        >
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #333, #111)" }} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 48 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#666",
                marginBottom: 12,
              }}
            >
              {article.year}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "#ccc",
              }}
            >
              {article.summary}
            </p>
          </div>

          <motion.span
            whileHover={{ x: 8 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              background: article.accentColor,
              color: "#000000",
              border: "none",
              padding: "12px 24px",
              cursor: "pointer",
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "background 0.2s",
            }}
          >
            Read Article &rarr;
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );

  if (article.slug) {
    return <Link href={article.href}>{inner}</Link>;
  }
  return inner;
}

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

  const card = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 8,
        border: `1.5px solid ${hovered ? article.accentColor : "#e2e2e2"}`,
        overflow: "hidden",
        cursor: "pointer",
        backgroundColor: "#fff",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: hovered
          ? `0 8px 24px ${article.accentColor}20`
          : "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "100%",
          backgroundColor: "#f4f4f4",
          overflow: "hidden",
        }}
      >
        {article.coverImage ? (
          <motion.img
            src={article.coverImage}
            alt={article.title}
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #e5e5e5, #ccc)" }} />
        )}
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              fontStyle: "italic",
              color: hovered ? article.accentColor : "#0a0a0a",
              margin: 0,
              marginBottom: 8,
              lineHeight: 1.2,
              transition: "color 0.2s",
              minHeight: 52,
              display: "flex",
              alignItems: "center",
            }}
          >
            {article.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "0.8rem",
              color: "#777",
              margin: 0,
              lineHeight: 1.5,
              minHeight: 40,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.summary}
          </p>
        </div>
        <div
          style={{
            paddingTop: 12,
            borderTop: `1px solid ${hovered ? article.accentColor + "30" : "#e8e8e8"}`,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#999",
              margin: 0,
            }}
          >
            {article.reviewer}
          </p>
        </div>
      </div>
    </motion.div>
  );

  if (article.slug) {
    return <Link href={article.href}>{card}</Link>;
  }
  return card;
}

export default function NarrativesClient({ articles }: { articles: HomepageArticle[] }) {
  const [displayedCount, setDisplayedCount] = useState(6);
  const [vinylRotation, setVinylRotation] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastScrollLeftRef = useRef(0);
  const headerRef = useRef(null);

  const featured = articles[0] ?? null;
  const latest = articles.slice(1);
  const carouselItems = articles.slice(0, 9);

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const scrollDelta = scrollLeft - lastScrollLeftRef.current;
      setVinylRotation((prev) => prev + scrollDelta * 0.5);
      lastScrollLeftRef.current = scrollLeft;
    }
  };

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ddd; }
      `}</style>

      {/* HERO SECTION */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          display: "grid",
          gridTemplateColumns: "0.8fr 1.2fr",
          gap: 48,
          padding: "40px 48px",
          borderBottom: "1px solid #e8e8e8",
          alignItems: "start",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "auto",
            overflow: "visible",
            marginLeft: -150,
          }}
        >
          <VinylDisc color="var(--accent-narratives)" size={600} rotation={vinylRotation} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "clamp(3rem, 6vw, 4.2rem)",
              fontWeight: 700,
              fontStyle: "italic",
              color: "var(--accent-narratives)",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Narratives
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              height: 3,
              width: 80,
              background: "#000000",
              marginBottom: 28,
              transformOrigin: "left",
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "1.05rem",
              color: "#555",
              lineHeight: 1.8,
              marginBottom: 40,
              maxWidth: 520,
            }}
          >
            Blending storytelling and critique to paint a vivid picture of the music&apos;s sound, mood, and emotional impact.
          </motion.p>

          {/* Carousel */}
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            style={{
              display: "flex",
              gap: 20,
              overflowX: "auto",
              overflowY: "visible",
              paddingTop: 20,
              paddingBottom: 20,
              paddingLeft: 24,
              paddingRight: 24,
              scrollBehavior: "smooth",
              width: "53vw",
              maxWidth: "53vw",
              flexWrap: "nowrap",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {carouselItems.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <CarouselItem article={article} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* FEATURED SECTION */}
      {featured && <FeaturedSection article={featured} />}

      {/* LATEST NARRATIVES SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
        style={{ padding: "80px 48px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 48,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "1.8rem",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#0a0a0a",
              margin: 0,
            }}
          >
            Latest Narratives
          </h2>
          <div
            style={{
              height: 2,
              width: 40,
              background: "var(--accent-narratives)",
            }}
          />
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {latest.slice(0, displayedCount).map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>

        {displayedCount < latest.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 48,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={() =>
                setDisplayedCount((prev) =>
                  Math.min(prev + 3, latest.length)
                )
              }
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                background: "var(--accent-narratives)",
                color: "#fff",
                border: "none",
                padding: "12px 32px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Read More Articles
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <EmailSignup />
    </>
  );
}
