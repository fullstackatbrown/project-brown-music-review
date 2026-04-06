"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion, useInView } from "framer-motion"

import SplashCursor from "../components/SplashCursor"
import type { HomepageArticle } from "@/lib/types"
import EmailSignup from "./components/EmailSignup"

const FALLBACK_COVER = "/bmr_logo.webp"

type HomepageArticlesResponse = {
  articles: HomepageArticle[]
}

function formatCount(value: number, isLoading: boolean): string {
  if (isLoading) {
    return ".."
  }

  return String(value).padStart(2, "0")
}

function VinylDisc({
  color,
  label,
  spinning,
  size = 72,
}: {
  color: string
  label: string
  spinning: boolean
  size?: number
}) {
  return (
    <motion.div
      animate={{ rotate: spinning ? 360 : 0 }}
      transition={
        spinning
          ? { repeat: Infinity, duration: 2.6, ease: "linear" }
          : { duration: 0.3 }
      }
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
      <SplashCursor
        SPLAT_FORCE={1500}
        SPLAT_RADIUS={0.08}
        DENSITY_DISSIPATION={6}
        VELOCITY_DISSIPATION={4}
        CURL={1}
      />

      {[0.72, 0.58, 0.46].map((ring) => (
        <div
          key={ring}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: `${ring * 100}%`,
            height: `${ring * 100}%`,
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
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: size * 0.055,
            color: "#fff",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
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
  )
}

function ReviewRow({
  article,
  index,
  onOpen,
}: {
  article: HomepageArticle
  index: number
  onOpen: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(article.id)}
      style={{
        display: "grid",
        gridTemplateColumns: "52px 96px 1fr auto auto",
        alignItems: "center",
        gap: "0 24px",
        padding: "20px 0",
        borderBottom: "1px solid #e2e2e2",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          background: article.accentColor,
          transformOrigin: "left",
          zIndex: 0,
          opacity: 0.04,
        }}
      />

      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.62rem",
          color: hovered ? article.accentColor : "#bbb",
          letterSpacing: "0.1em",
          zIndex: 1,
          transition: "color 0.2s",
          textAlign: "right",
          paddingRight: 4,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        style={{
          position: "relative",
          width: 96,
          height: 64,
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <motion.img
          src={article.coverImage ?? FALLBACK_COVER}
          alt={article.title}
          animate={{ x: hovered ? -8 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 64,
            height: 64,
            objectFit: "cover",
            boxShadow: "3px 3px 0 #0a0a0a",
            zIndex: 2,
            background: "#f4f4f4",
          }}
        />

        <motion.div
          animate={{ x: hovered ? 10 : 0, opacity: hovered ? 1 : 0.6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: 26,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
          onClick={(event) => {
            event.stopPropagation()
            setPlaying((value) => !value)
          }}
        >
          <VinylDisc
            color={article.labelColor}
            label={article.vinylLabel}
            spinning={playing}
            size={64}
          />
        </motion.div>
      </div>

      <div style={{ zIndex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.15rem",
              fontStyle: "italic",
              fontWeight: 700,
              color: hovered ? article.accentColor : "#0a0a0a",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {article.title}
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              color: "#777",
              fontWeight: 300,
              flexShrink: 0,
            }}
          >
            {article.artist}
          </span>
        </div>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.72rem",
            color: "#999",
            lineHeight: 1.45,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.summary}
        </p>
      </div>

      <div style={{ zIndex: 1, textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: article.accentColor,
            borderBottom: `2px solid ${article.accentColor}`,
            paddingBottom: 1,
            marginBottom: 4,
          }}
        >
          {article.ratingLabel ?? article.typeLabel}
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.55rem",
            color: "#bbb",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {article.year} / {article.genre}
        </div>
      </div>

      <div
        style={{ zIndex: 1, textAlign: "right", flexShrink: 0, minWidth: 110 }}
      >
        <div
          style={{
            display: "inline-block",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#fff",
            background: article.accentColor,
            padding: "3px 8px",
            marginBottom: 5,
          }}
        >
          {article.typeLabel}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.62rem",
            color: "#aaa",
          }}
        >
          {article.reviewer}
        </div>
      </div>
    </motion.div>
  )
}

function ReviewModal({
  article,
  onClose,
}: {
  article: HomepageArticle
  onClose: () => void
}) {
  const [spinning, setSpinning] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  useEffect(() => {
    router.prefetch(article.href)
  }, [article.href, router])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,10,0.7)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        style={{
          background: "#fff",
          maxWidth: 780,
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          position: "relative",
        }}
      >
        <div
          style={{
            background: "#f4f4f4",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
            gap: 28,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: article.accentColor,
              opacity: 0.06,
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />

          <div style={{ position: "relative", width: 200, height: 200 }}>
            <div
              style={{
                position: "absolute",
                left: 80,
                top: 0,
                zIndex: 1,
                cursor: "pointer",
              }}
              onClick={() => setSpinning((value) => !value)}
            >
              <VinylDisc
                color={article.labelColor}
                label={article.vinylLabel}
                spinning={spinning}
                size={200}
              />
            </div>
            <motion.img
              src={article.coverImage ?? FALLBACK_COVER}
              alt={article.title}
              initial={{ x: 0 }}
              animate={{ x: spinning ? -20 : 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 170,
                height: 170,
                objectFit: "cover",
                boxShadow: "6px 6px 0 #0a0a0a",
                zIndex: 2,
                background: "#fff",
              }}
            />
          </div>
          <div className="absolute left-[707px] top-[422px] w-[647px] h-0 border-t-[5px] border-black" />

          <button
            onClick={() => setSpinning((value) => !value)}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              background: spinning ? article.accentColor : "transparent",
              color: spinning ? "#fff" : article.accentColor,
              border: `1.5px solid ${article.accentColor}`,
              padding: "8px 20px",
              cursor: "pointer",
              zIndex: 3,
              transition: "all 0.2s",
            }}
          >
            {spinning ? "stop spinning" : "spin the record"}
          </button>
        </div>

        <div
          style={{
            padding: "40px 36px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            onClick={onClose}
            style={{
              alignSelf: "flex-end",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              color: "#bbb",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            close
          </button>

          <span
            style={{
              display: "inline-block",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#fff",
              background: article.accentColor,
              padding: "3px 9px",
              alignSelf: "flex-start",
              marginBottom: 14,
            }}
          >
            {article.typeLabel}
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "2rem",
              fontWeight: 700,
              color: article.accentColor,
              lineHeight: 1.1,
              marginBottom: 6,
            }}
          >
            {article.title}
          </h2>

          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: 4,
            }}
          >
            {article.artist}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.7rem",
              color: "#aaa",
              marginBottom: 20,
            }}
          >
            {article.year} / {article.genre}
          </p>

            <div className="flex flex-col items-center">
              <div className="w-[315px] h-[51px] bg-[#D20000] rounded-full flex items-center justify-center mb-[24px]">
                <span className="text-white text-[32px] font-semibold">Narratives</span>
              </div>
              <div className="w-[315px] h-[315px] bg-neutral-200 rounded-[30px] mb-[75px]" />
              <div className="text-center w-[312px]">
                <p className="text-[32px] font-bold leading-tight">ARTICLE TITLE?<br/></p>
                <p className="text-[20px] font-normal italic text-neutral-800">author</p>
              </div>
            </div>

          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: article.accentColor,
                borderBottom: `2px solid ${article.accentColor}`,
                paddingBottom: 2,
              }}
            >
              {article.ratingLabel ?? article.typeLabel}
            </span>
          </div>

          <div
            style={{
              height: 1,
              background: "#e8e8e8",
              marginBottom: 16,
            }}
          />

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              lineHeight: 1.75,
              color: "#333",
              fontWeight: 300,
              flex: 1,
            }}
          >
            {article.summary}
          </p>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem",
              color: "#aaa",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Reviewed by{" "}
            <strong style={{ color: "#555", fontWeight: 500 }}>
              {article.reviewer}
            </strong>
          </p>

          <Link
            href={article.href}
            style={{
              alignSelf: "flex-start",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#fff",
              background: article.accentColor,
              padding: "10px 16px",
              textDecoration: "none",
            }}
          >
            Read full piece
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HomePage() {
  const [articles, setArticles] = useState<HomepageArticle[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const headerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function loadArticles() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/homepage-articles")
        const payload = (await response.json()) as HomepageArticlesResponse & {
          message?: string
        }

        if (!response.ok) {
          throw new Error(payload.message ?? "Failed to load homepage articles")
        }

        if (!cancelled) {
          setArticles(payload.articles)
          setLoadError(null)
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Failed to load homepage articles",
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadArticles()

    return () => {
      cancelled = true
    }
  }, [])

  const openArticle =
    openId !== null ? articles.find((article) => article.id === openId) ?? null : null

  const stats = useMemo(
    () => [
      {
        label: "Pieces live",
        value: formatCount(articles.length, isLoading),
      },
      {
        label: "Album rates",
        value: formatCount(
          articles.filter((article) => article.typeLabel === "Album Rate").length,
          isLoading,
        ),
      },
      {
        label: "Album reviews",
        value: formatCount(
          articles.filter((article) => article.typeLabel === "Album Review").length,
          isLoading,
        ),
      },
    ],
    [articles, isLoading],
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ddd; }
      `}</style>

      <motion.div
        ref={headerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          padding: "56px 48px 40px",
          borderBottom: "1.5px solid #0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -10,
            right: 48,
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(80px, 14vw, 180px)",
            fontWeight: 700,
            fontStyle: "italic",
            color: "transparent",
            WebkitTextStroke: "1px #f0f0f0",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: "-0.02em",
          }}
        >
          Reviews
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#bbb",
              marginBottom: 14,
            }}
          >
            Brown Music Review / Home
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.18,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.4rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#0a0a0a",
              maxWidth: 640,
            }}
          >
            What we&apos;ve been
            <br />
            <em style={{ color: "#555" }}>listening to.</em>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              delay: 0.35,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "flex",
              gap: 32,
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid #e8e8e8",
              transformOrigin: "left",
              flexWrap: "wrap",
            }}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "#0a0a0a",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#bbb",
                  }}
                >
                  {stat.label}
                </div>
                <h2 className="text-white text-[45px] font-bold mb-4">title</h2>
                <p className="text-white/80 text-[28px] font-medium text-center leading-normal">
                  short description short description short description short description short description short description
                </p>
              </div>
            </div>
          </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "52px 96px 1fr auto auto",
          gap: "0 24px",
          padding: "10px 48px",
          borderBottom: "1px solid #e8e8e8",
          background: "#fafafa",
        }}
      >
        {["#", "", "Title / Writer", "Rating", "Type"].map((heading, index) => (
          <span
            key={heading}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ccc",
              textAlign: index === 3 ? "right" : index === 4 ? "right" : undefined,
            }}
          >
            {heading}
          </span>
        ))}
      </div>

      <div style={{ padding: "0 48px 80px" }}>
        {isLoading && (
          <div
            style={{
              padding: "32px 0",
              borderBottom: "1px solid #e2e2e2",
              color: "#888",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Loading latest Cosmic entries...
          </div>
        )}

        {!isLoading && loadError && (
          <div
            style={{
              padding: "32px 0",
              borderBottom: "1px solid #e2e2e2",
              color: "#8b1a00",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            {loadError}
          </div>
        )}

        {!isLoading && !loadError && articles.length === 0 && (
          <div
            style={{
              padding: "32px 0",
              borderBottom: "1px solid #e2e2e2",
              color: "#666",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            No published Cosmic articles are available yet.
          </div>
        )}

        {!isLoading &&
          !loadError &&
          articles.map((article, index) => (
            <ReviewRow
              key={article.id}
              article={article}
              index={index}
              onOpen={setOpenId}
            />
          ))}
      </div>

      <EmailSignup />

      <footer
        style={{
          borderTop: "1.5px solid #0a0a0a",
          padding: "24px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.9rem",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#0a0a0a",
            letterSpacing: "0.08em",
          }}
        >
          brown music review
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#ccc",
          }}
        >
          Bryan Chung @ MIT &apos;29 / Jennifer Park @ Tufts &apos;29
        </span>
      </footer>

      <AnimatePresence>
        {openArticle && (
          <ReviewModal article={openArticle} onClose={() => setOpenId(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
