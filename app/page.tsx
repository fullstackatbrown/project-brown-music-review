"use client";
import EmailSignup from "./components/EmailSignup";
/* Lines 2-5 omitted */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import SplashCursor from "../components/SplashCursor";

const RATING_LABELS: Record<number, string> = {
  1: "trash it",
  2: "skip it",
  3: "rent it",
  4: "buy it",
  5: "crown it",
};

const albums = [
  {
    id: 0,
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "Californication",
    subtitle: null,
    artist: "Red Hot Chili Peppers",
    year: "1999",
    genre: "Alternative Rock",
    rating: 4,
    tag: "Album Review",
    accentColor: "#c8102e",
    labelColor: "#c8102e",
    vinylLabel: "WBR",
    song: "/tmp_song.mp3",
    reviewer: "Bryan Chung",
    blurb:
      "A sunburned, introspective record that trades manic energy for something wistful and weathered. Frusciante's return breathes life into every track.",
  },
  {
    id: 1,
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "Good Kid, M.A.A.D City",
    subtitle: null,
    artist: "Kendrick Lamar",
    year: "2012",
    genre: "Hip-Hop",
    rating: 5,
    tag: "Staff Pick",
    accentColor: "#1a6b3c",
    labelColor: "#1a6b3c",
    vinylLabel: "TDE",
    song: "/tmp_song.mp3",
    reviewer: "Bryan Chung",
    blurb:
      "A short film disguised as an album, shot entirely through memory and guilt. The Compton he paints breathes and threatens and loves all at once.",
  },
  {
    id: 2,
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "To Pimp a Butterfly",
    subtitle: null,
    artist: "Kendrick Lamar",
    year: "2015",
    genre: "Hip-Hop / Jazz / Funk",
    rating: 5,
    tag: "Classic",
    accentColor: "#b8860b",
    labelColor: "#b8860b",
    vinylLabel: "TDE",
    song: "/tmp_song.mp3",
    reviewer: "Bryan Chung",
    blurb:
      "Not an album — a reckoning. A sprawling, jazz-funk treatise on Blackness, fame, and self-destruction that left critics reaching for new vocabulary.",
  },
  {
    id: 3,
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "Untitled Unmastered",
    subtitle: null,
    artist: "Kendrick Lamar",
    year: "2016",
    genre: "Hip-Hop",
    rating: 3,
    tag: "Revisited",
    accentColor: "#1d3f8a",
    labelColor: "#1d3f8a",
    vinylLabel: "TDE",
    song: "/tmp_song.mp3",
    reviewer: "Bryan Chung",
    blurb:
      "Eight untitled demos that would be another artist's career highlight. A rare glimpse at Kendrick thinking out loud, pencil sketches in place of stone.",
  },
  {
    id: 4,
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "Mr Morale and the Big Steppers",
    subtitle: null,
    artist: "Kendrick ",
    year: "1997",
    genre: "Art Rock",
    rating: 5,
    tag: "Essential",
    accentColor: "#5c2d91",
    labelColor: "#5c2d91",
    vinylLabel: "PAR",
    song: "/tmp_song.mp3",
    reviewer: "Bryan Chung",
    blurb:
      "Twenty-eight years later it sounds more prescient than ever. A document of alienation built from guitars and dread, still unmatched in its ambition.",
  },
  {
    id: 5,
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "Section 80",
    subtitle: null,
    artist: "Kendrick Lamar",
    year: "1998",
    genre: "R&B / Soul / Hip-Hop",
    rating: 5,
    tag: "Cornerstone",
    accentColor: "#8b1a00",
    labelColor: "#8b1a00",
    vinylLabel: "RUF",
    song: "/tmp_song.mp3",
    reviewer: "Bryan Chung",
    blurb:
      "An album that arrived fully formed and has never been equaled. Hill performs the impossible: making raw heartbreak sound like catechism.",
  },
];

function VinylDisc({
  color,
  label,
  spinning,
  size = 80,
}: {
  color: string;
  label: string;
  spinning: boolean;
  size?: number;
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

      {/* Groove rings */}
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
      {/* Sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "conic-gradient(from 30deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.06) 40deg, rgba(255,255,255,0) 80deg, rgba(255,255,255,0.03) 200deg, rgba(255,255,255,0) 360deg)",
        }}
      />
      {/* Center label */}
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
  );
}

function ReviewRow({
  album,
  index,
  onOpen,
}: {
  album: (typeof albums)[0];
  index: number;
  onOpen: (id: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const ratingWord = RATING_LABELS[album.rating];

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
      onClick={() => onOpen(album.id)}
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
      {/* Hover fill */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          background: album.accentColor,
          transformOrigin: "left",
          zIndex: 0,
          opacity: 0.04,
        }}
      />

      {/* Index */}
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.62rem",
          color: hovered ? album.accentColor : "#bbb",
          letterSpacing: "0.1em",
          zIndex: 1,
          transition: "color 0.2s",
          textAlign: "right",
          paddingRight: 4,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Vinyl + cover stack */}
      <div
        style={{
          position: "relative",
          width: 96,
          height: 64,
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {/* Album cover */}
        <motion.img
          src={album.cover}
          alt={album.title}
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
          }}
        />
        {/* Vinyl peeking */}
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
          onClick={(e) => {
            e.stopPropagation();
            setPlaying((p) => !p);
          }}
        >
          <VinylDisc
            color={album.labelColor}
            label={album.vinylLabel}
            spinning={playing}
            size={64}
          />
        </motion.div>
      </div>

      {/* Text block */}
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
              color: hovered ? album.accentColor : "#0a0a0a",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {album.title}
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
            {album.artist}
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
          {album.blurb}
        </p>
      </div>

      {/* Rating */}
      <div style={{ zIndex: 1, textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: album.accentColor,
            borderBottom: `2px solid ${album.accentColor}`,
            paddingBottom: 1,
            marginBottom: 4,
          }}
        >
          {ratingWord}
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
          {album.year} · {album.genre}
        </div>
      </div>

      {/* Tag pill + reviewer */}
      <div
        style={{ zIndex: 1, textAlign: "right", flexShrink: 0, minWidth: 90 }}
      >
        <div
          style={{
            display: "inline-block",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#fff",
            background: album.accentColor,
            padding: "3px 8px",
            marginBottom: 5,
          }}
        >
          {album.tag}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.62rem",
            color: "#aaa",
          }}
        >
          {album.reviewer}
        </div>
      </div>
    </motion.div>
  );
}

function ReviewModal({
  album,
  onClose,
}: {
  album: (typeof albums)[0];
  onClose: () => void;
}) {
  const [spinning, setSpinning] = useState(false);
  const ratingWord = RATING_LABELS[album.rating];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

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
        onClick={(e) => e.stopPropagation()}
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
        {/* Left: artwork */}
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
          {/* Accent circle behind */}
          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: album.accentColor,
              opacity: 0.06,
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />

          {/* Cover + vinyl */}
          <div style={{ position: "relative", width: 200, height: 200 }}>
            <div
              style={{
                position: "absolute",
                left: 80,
                top: 0,
                zIndex: 1,
                cursor: "pointer",
              }}
              onClick={() => setSpinning((s) => !s)}
            >
              <VinylDisc
                color={album.labelColor}
                label={album.vinylLabel}
                spinning={spinning}
                size={200}
              />
            </div>
            <motion.img
              src={album.cover}
              alt={album.title}
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
              }}
            />
          </div>

          <button
            onClick={() => setSpinning((s) => !s)}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              background: spinning ? album.accentColor : "transparent",
              color: spinning ? "#fff" : album.accentColor,
              border: `1.5px solid ${album.accentColor}`,
              padding: "8px 20px",
              cursor: "pointer",
              zIndex: 3,
              transition: "all 0.2s",
            }}
          >
            {spinning ? "⏸ stop spinning" : "▶ spin the record"}
          </button>
        </div>

        {/* Right: info */}
        <div
          style={{
            padding: "40px 36px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Close */}
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
            ✕ close
          </button>

          <span
            style={{
              display: "inline-block",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#fff",
              background: album.accentColor,
              padding: "3px 9px",
              alignSelf: "flex-start",
              marginBottom: 14,
            }}
          >
            {album.tag}
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "2rem",
              fontWeight: 700,
              color: album.accentColor,
              lineHeight: 1.1,
              marginBottom: 6,
            }}
          >
            {album.title}
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
            {album.artist}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.7rem",
              color: "#aaa",
              marginBottom: 20,
            }}
          >
            {album.year} · {album.genre}
          </p>

          <div
            style={{
              height: 1,
              background: "#e8e8e8",
              marginBottom: 16,
            }}
          />

          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: album.accentColor,
                borderBottom: `2px solid ${album.accentColor}`,
                paddingBottom: 2,
              }}
            >
              {ratingWord}
            </span>
            <div
              style={{
                display: "flex",
                gap: 5,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              {Object.values(RATING_LABELS).map((lbl, i) => (
                <span
                  key={lbl}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.52rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "3px 7px",
                    border: `1px solid ${i < album.rating ? album.accentColor : "#e8e8e8"}`,
                    background:
                      i < album.rating ? album.accentColor : "transparent",
                    color: i < album.rating ? "#fff" : "#ccc",
                  }}
                >
                  {lbl}
                </span>
              ))}
            </div>
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
            {album.blurb}
          </p>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem",
              color: "#aaa",
              marginTop: 20,
            }}
          >
            Reviewed by{" "}
            <strong style={{ color: "#555", fontWeight: 500 }}>
              {album.reviewer}
            </strong>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HomePage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const openAlbum =
    openId !== null ? albums.find((a) => a.id === openId) : null;

  const headerRef = useRef(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ddd; }
      `}</style>

      {/* HERO HEADER */}
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
        {/* Large decorative background text */}
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
            Bryan Musoc Review — Home
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
            What we've been
            <br />
            <em style={{ color: "#555" }}>listening to.</em>
          </motion.h2>

          {/* Decorative rule with stats */}
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
            }}
          >
            {[
              { label: "Reviews this month", value: "06" },
              { label: "Staff picks", value: "02" },
              { label: "Average rating", value: "buy it" },
            ].map((stat) => (
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
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* COLUMN HEADERS */}
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
        {["#", "", "Title / Artist", "Rating", "Tag"].map((h, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ccc",
              textAlign: i === 3 ? "right" : i === 4 ? "right" : undefined,
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* REVIEW ROWS */}
      <div style={{ padding: "0 48px 80px" }}>
        {albums.map((album, index) => (
          <ReviewRow
            key={album.id}
            album={album}
            index={index}
            onOpen={setOpenId}
          />
        ))}
      </div>

        {/* EMAIL SIGNUP */}
        <EmailSignup />

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1.5px solid #0a0a0a",
          padding: "24px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          teeeheee
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
          Bryan Chung @ MIT '29 · Jennifer Park @ Tufts '29
        </span>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {openAlbum && (
          <ReviewModal album={openAlbum} onClose={() => setOpenId(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
