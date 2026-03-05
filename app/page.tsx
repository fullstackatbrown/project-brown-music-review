"use client";
import { useState, useRef, useEffect, useCallback } from "react";

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const albums = [
  {
    id: 0,
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "Californication",
    subtitle: "",
    artist: "Red Hot Chilli Peppers",
    year: "1973",
    genre: "Prog Rock",
    rating: 5,
    ratingHalf: false,
    tag: "Album Review",
    labelColor: "#e01010",
    accentColor: "#e01010",
    href: "/reviews/dark-side",
    vinylLabel: "HVT",
    song: "/tmp_song.mp3",
  },
  {
    id: 1,
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "Good kid, Maad City",
    subtitle: "",
    artist: "Kendrick Lamar",
    year: "1977",
    genre: "Rap",
    rating: 5,
    ratingHalf: true,
    tag: "Staff Pick",
    labelColor: "#1a6b3c",
    accentColor: "#1a6b3c",
    href: "/reviews/rumours",
    vinylLabel: "WBR",
    song: "/tmp_song.mp3",
  },
  {
    id: 2,
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "To Pimp",
    subtitle: "a Butterfly",
    artist: "Kendrick Lamar",
    year: "2015",
    genre: "Hip-Hop",
    rating: 5,
    ratingHalf: false,
    tag: "Classic",
    labelColor: "#d4a017",
    accentColor: "#d4a017",
    href: "/reviews/tpab",
    vinylLabel: "TDE",
    song: "/tmp_song.mp3",
  },
  {
    id: 3,
    cover: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "Untitled",
    subtitle: "Unmastered",
    artist: "Kendrick Lamar",
    year: "1971",
    genre: "Folk / Singer-Songwriter",
    rating: 5,
    ratingHalf: false,
    tag: "Revisited",
    labelColor: "#2563eb",
    accentColor: "#2563eb",
    href: "/reviews/blue",
    vinylLabel: "REP",
    song: "/tmp_song.mp3",
  },
];

export default function Home() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");

  const [spinning, setSpinning] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAccum = useRef(0);
  const lastScrollTime = useRef(0);

  const album = albums[activeIdx];

  const navigate = useCallback(
    (dir: "up" | "down") => {
      if (transitioning) return;
      const next =
        dir === "down"
          ? Math.min(activeIdx + 1, albums.length - 1)
          : Math.max(activeIdx - 1, 0);
      if (next === activeIdx) return;

      setDirection(dir);
      setPrevIdx(activeIdx);
      setTransitioning(true);
      setActiveIdx(next);
      setSpinning(false);
      setProgress(0);
      setCurrentTime(0);

      setTimeout(() => {
        setTransitioning(false);
        setPrevIdx(null);
      }, 700);
    },
    [activeIdx, transitioning],
  );

  // Global wheel — whole window
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      // Hard cooldown: ignore all events for 900ms after a navigation
      if (now - lastScrollTime.current < 900) return;
      scrollAccum.current += e.deltaY;
      if (Math.abs(scrollAccum.current) > 80) {
        lastScrollTime.current = now;
        navigate(scrollAccum.current > 0 ? "down" : "up");
        scrollAccum.current = 0;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [navigate]);

  // Audio
  useEffect(() => {
    if (!audioRef.current) return;
    if (spinning) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [spinning]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = () => {
    const a = audioRef.current;
    if (!a || seeking) return;
    setCurrentTime(a.currentTime);
    setProgress(a.duration ? a.currentTime / a.duration : 0);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    setCurrentTime(val * (audioRef.current?.duration ?? 0));
  };

  const handleSeekStart = () => setSeeking(true);

  const handleSeekCommit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = val * audioRef.current.duration;
    }
    setSeeking(false);
  };

  const toggleSpin = () => setSpinning((s) => !s);

  return (
    <>
      <audio
        ref={audioRef}
        src={album.song}
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          height: 100vh;
        }

        .page {
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* NAVBAR */
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 48px;
          border-bottom: 1.5px solid #0a0a0a;
          flex-shrink: 0;
          background: #fff;
          z-index: 10;
        }
        .navbar h1 {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .navbar-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: color 0.5s;
        }

        /* MAIN */
        .main {
          display: flex;
          flex: 1;
          overflow: hidden;
          min-height: 0;
        }

        /* LEFT */
        .left-col {
          width: 55%;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1.5px solid #0a0a0a;
        }

        /* scroll hints */
        .scroll-hint {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          z-index: 20;
          pointer-events: none;
          opacity: 0.28;
        }
        .scroll-hint.top { top: 18px; }
        .scroll-hint.bottom { bottom: 18px; }
        .scroll-hint span {
          font-family: 'DM Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0a0a0a;
        }

        /* dots */
        .album-dots {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 20;
        }
        .adot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #e8e8e8;
          border: 1px solid #ccc;
          cursor: pointer;
          transition: all 0.3s;
        }
        .adot.active {
          background: #0a0a0a;
          border-color: #0a0a0a;
          transform: scale(1.4);
        }

        /* counter */
        .album-counter {
          position: absolute;
          left: 24px;
          bottom: 22px;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: #888;
          text-transform: uppercase;
          z-index: 10;
        }

        /* nav arrows */
        .nav-arrows {
          position: absolute;
          right: 22px;
          bottom: 22px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          z-index: 10;
        }
        .nav-arrow {
          width: 30px;
          height: 30px;
          border: 1.5px solid #0a0a0a;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-arrow:hover { background: #0a0a0a; color: #fff; }
        .nav-arrow:disabled { opacity: 0.18; cursor: default; pointer-events: none; }
        .nav-arrow svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; }

        /* ARTWORK ANIMATIONS */
        .artwork-slot {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .artwork-slot.entering {
          animation: artEnter 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .artwork-slot.exiting {
          animation: artExit 0.55s cubic-bezier(0.55, 0, 1, 0.45) forwards;
          pointer-events: none;
        }

        @keyframes artEnter {
          from { opacity: 0; transform: translateY(var(--travel)) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes artExit {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(calc(var(--travel) * -1)) scale(0.96); }
        }

        /*
          ARTWORK SCENE
          --sz: size of cover square and vinyl circle
          Layout: cover at left:0, vinyl centered at left = sz * 0.6
          so vinyl right edge = sz*0.6 + sz/2 = sz*1.1
          Total scene width = sz * 1.15 (give a little breathing room on right)
          This whole block is then centered by the flex parent.
        */
        .artwork-scene {
          --sz: min(310px, calc(100vh - 230px));
          position: relative;
          width: calc(var(--sz) * 1.15);
          height: var(--sz);
          flex-shrink: 0;
        }

        .album-cover {
          position: absolute;
          top: 0;
          left: 0;
          width: var(--sz);
          height: var(--sz);
          object-fit: cover;
          z-index: 2;
          box-shadow: 6px 6px 0px #0a0a0a;
          display: block;
        }

        .vinyl-wrap {
          position: absolute;
          top: 0;
          /* vinyl left edge starts at 55% of sz so ~45% peeks out */
          left: calc(var(--sz) * 0.55);
          width: var(--sz);
          height: var(--sz);
          z-index: 1;
          cursor: pointer;
        }

        .vinyl {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%,
            #2a2a2a 0%, #111 35%, #080808 65%, #030303 100%);
          box-shadow: 4px 4px 30px rgba(0,0,0,0.45);
          position: relative;
          overflow: hidden;
        }
        .vinyl::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 50%;
          background: repeating-radial-gradient(
            circle at 50%,
            transparent 0px, transparent 4px,
            rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 5px
          );
        }
        .vinyl::after {
          content: '';
          position: absolute; inset: 0;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            rgba(255,255,255,0) 0deg, rgba(255,255,255,0.04) 15deg,
            rgba(255,255,255,0) 30deg, rgba(255,255,255,0.02) 90deg,
            rgba(255,255,255,0.06) 180deg, rgba(255,255,255,0.01) 270deg,
            rgba(255,255,255,0) 360deg
          );
          pointer-events: none;
        }

        .vinyl-label {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 26%;
          aspect-ratio: 1;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .vinyl-label span {
          font-family: 'Playfair Display', serif;
          font-size: 0.42rem;
          color: white;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .vinyl-label .center-dot {
          width: 5px; height: 5px;
          background: #0a0a0a;
          border-radius: 50%;
          margin-top: 3px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .spinning { animation: spin 2.8s linear infinite; }

        /* RIGHT */
        .right-col {
          width: 45%;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 36px 44px;
        }
        .review-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .content-wrap {
          transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .content-wrap.fading { opacity: 0; transform: translateY(10px); }

        .category-tag {
          display: inline-block;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #fff;
          padding: 4px 10px;
          margin-bottom: 18px;
        }

        .review-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.7rem;
          line-height: 1.05;
          font-weight: 700;
          color: #0a0a0a;
          margin-bottom: 6px;
        }
        .review-title em { font-style: italic; }

        .review-artist {
          font-family: 'DM Mono', monospace;
          font-size: 0.74rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .review-meta {
          font-size: 0.72rem;
          color: #aaa;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .review-author {
          font-size: 0.82rem;
          font-weight: 300;
          color: #888;
          letter-spacing: 0.04em;
          margin-bottom: 26px;
        }
        .review-author strong { font-weight: 500; color: #0a0a0a; }

        .divider { width: 100%; height: 1px; background: #e8e8e8; margin-bottom: 22px; }

        .rating-row { display: flex; align-items: center; gap: 14px; margin-bottom: 26px; }
        .stars { display: flex; gap: 3px; }
        .star { width: 15px; height: 15px; }
        .star.empty { fill: none; stroke: #e8e8e8; stroke-width: 1.5px; }
        .rating-label { font-family: 'DM Mono', monospace; font-size: 0.72rem; letter-spacing: 0.1em; color: #888; }

        .player-section {
          margin-bottom: 26px;
          padding: 16px;
          border: 1px solid #e8e8e8;
          background: #fafafa;
        }
        .player-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .play-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1.5px solid #0a0a0a;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .play-btn:hover { background: #0a0a0a; }
        .play-btn:hover svg { fill: #fff; }
        .play-btn svg { width: 14px; height: 14px; fill: #0a0a0a; transition: fill 0.2s; }

        .track-info { flex: 1; min-width: 0; }
        .track-name {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem; color: #0a0a0a;
          letter-spacing: 0.06em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .track-sub { font-size: 0.62rem; color: #888; margin-top: 2px; letter-spacing: 0.04em; }

        .progress-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .time-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; color: #888;
          letter-spacing: 0.04em; flex-shrink: 0; width: 28px;
        }
        .time-label.right { text-align: right; }
        .progress-wrap { flex: 1; position: relative; height: 18px; display: flex; align-items: center; cursor: pointer; }
        .progress-fill-track {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          height: 3px; background: #e8e8e8; width: 100%; border-radius: 2px; pointer-events: none;
        }
        .progress-fill-bar {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          height: 3px; border-radius: 2px; pointer-events: none;
          transition: width 0.1s linear;
        }
        .progress-slider {
          position: relative; z-index: 1; width: 100%;
          -webkit-appearance: none; appearance: none;
          height: 3px; background: transparent; outline: none; cursor: pointer;
        }
        .progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 13px; height: 13px; border-radius: 50%;
          background: #0a0a0a; cursor: pointer;
          border: 2px solid #fff; box-shadow: 0 0 0 1.5px #0a0a0a;
          transition: transform 0.15s;
        }
        .progress-slider:hover::-webkit-slider-thumb { transform: scale(1.2); }

        .volume-row { display: flex; align-items: center; gap: 8px; }
        .vol-icon { width: 14px; height: 14px; flex-shrink: 0; color: #888; }
        .volume-slider {
          flex: 1; -webkit-appearance: none; appearance: none;
          height: 2px; background: #e8e8e8; outline: none; cursor: pointer;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px; height: 10px; border-radius: 50%; background: #0a0a0a; cursor: pointer;
        }

        .btn-row { display: flex; align-items: center; gap: 16px; }
        .read-more {
          display: inline-flex; align-items: center; gap: 12px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 14px 28px; border: none; cursor: pointer;
          text-decoration: none; transition: filter 0.2s;
        }
        .read-more:hover { filter: brightness(0.82); }
        .read-more::after { content: '→'; font-size: 0.95rem; transition: transform 0.2s; }
        .read-more:hover::after { transform: translateX(4px); }

        .spin-hint {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem; letter-spacing: 0.12em;
          color: #888; cursor: pointer; text-transform: uppercase;
          transition: color 0.2s; background: none; border: none; padding: 0;
        }
      `}</style>

      <div className="page">
        <nav className="navbar">
          <h1>teeeheee</h1>
          <span className="navbar-tag" style={{ color: album.accentColor }}>
            Vol. 12 — 2025
          </span>
        </nav>

        <div className="main">
          {/* ── LEFT ── */}
          <div className="left-col">
            {activeIdx > 0 && (
              <div className="scroll-hint top">
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                  <path
                    d="M1 8L9 2L17 8"
                    stroke="#0a0a0a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>prev</span>
              </div>
            )}
            {activeIdx < albums.length - 1 && (
              <div className="scroll-hint bottom">
                <span>next</span>
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                  <path
                    d="M1 2L9 8L17 2"
                    stroke="#0a0a0a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}

            <div className="album-dots">
              {albums.map((a, i) => (
                <div
                  key={a.id}
                  className={`adot ${i === activeIdx ? "active" : ""}`}
                  onClick={() => {
                    if (!transitioning && i !== activeIdx)
                      navigate(i > activeIdx ? "down" : "up");
                  }}
                  title={a.artist}
                />
              ))}
            </div>

            <div className="album-counter">
              {String(activeIdx + 1).padStart(2, "0")} /{" "}
              {String(albums.length).padStart(2, "0")}
            </div>

            <div className="nav-arrows">
              <button
                className="nav-arrow"
                onClick={() => navigate("up")}
                disabled={activeIdx === 0 || transitioning}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
              <button
                className="nav-arrow"
                onClick={() => navigate("down")}
                disabled={activeIdx === albums.length - 1 || transitioning}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>

            {/* Exiting */}
            {transitioning &&
              prevIdx !== null &&
              (() => {
                const ea = albums[prevIdx];
                return (
                  <div
                    className="artwork-slot exiting"
                    style={{
                      ["--travel" as any]:
                        direction === "down" ? "80px" : "-80px",
                    }}
                  >
                    <div className="artwork-scene">
                      <div className="vinyl-wrap">
                        <div className="vinyl">
                          <div
                            className="vinyl-label"
                            style={{ background: ea.labelColor }}
                          >
                            <span>{ea.vinylLabel}</span>
                            <div className="center-dot" />
                          </div>
                        </div>
                      </div>
                      <img src={ea.cover} alt="" className="album-cover" />
                    </div>
                  </div>
                );
              })()}

            {/* Entering / active */}
            <div
              key={activeIdx}
              className="artwork-slot entering"
              style={{
                ["--travel" as any]: direction === "down" ? "80px" : "-80px",
              }}
            >
              <div className="artwork-scene">
                <div className="vinyl-wrap" onClick={toggleSpin}>
                  <div className={`vinyl ${spinning ? "spinning" : ""}`}>
                    <div
                      className="vinyl-label"
                      style={{ background: album.labelColor }}
                    >
                      <span>{album.vinylLabel}</span>
                      <div className="center-dot" />
                    </div>
                  </div>
                </div>
                <img
                  src={album.cover}
                  alt="Album cover"
                  className="album-cover"
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="right-col">
            <div className="review-card">
              <div className={`content-wrap ${transitioning ? "fading" : ""}`}>
                {/* half-star gradient */}
                <svg width="0" height="0" style={{ position: "absolute" }}>
                  <defs>
                    <linearGradient
                      id="half-grad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="50%" stopColor={album.accentColor} />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>

                <span
                  className="category-tag"
                  style={{ background: album.accentColor }}
                >
                  {album.tag}
                </span>

                <h2 className="review-title">
                  <em style={{ color: album.accentColor }}>{album.title}</em>
                  {album.subtitle && (
                    <>
                      <br />
                      {album.subtitle}
                    </>
                  )}
                </h2>

                <p
                  className="review-artist"
                  style={{ color: album.accentColor }}
                >
                  {album.artist}
                </p>

                <p className="review-meta">
                  {album.year} · {album.genre}
                </p>

                <p className="review-author">
                  Reviewed by <strong>Bryan Chung @ MIT '29</strong>
                  <br />
                  Minor UI Contribution by{" "}
                  <strong>Jennifer Park @ Tufts '29</strong>
                </p>

                <div className="divider" />

                <div className="rating-row">
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const isHalf =
                        album.ratingHalf && i === Math.floor(album.rating);
                      const isEmpty = album.ratingHalf
                        ? i > Math.floor(album.rating)
                        : i >= album.rating;
                      if (isHalf)
                        return (
                          <svg
                            key={i}
                            className="star"
                            viewBox="0 0 24 24"
                            style={{ fill: "url(#half-grad)" }}
                          >
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                          </svg>
                        );
                      if (isEmpty)
                        return (
                          <svg
                            key={i}
                            className="star empty"
                            viewBox="0 0 24 24"
                          >
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                          </svg>
                        );
                      return (
                        <svg
                          key={i}
                          className="star"
                          viewBox="0 0 24 24"
                          style={{ fill: album.accentColor }}
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      );
                    })}
                  </div>
                  <span className="rating-label">
                    {album.ratingHalf ? `${album.rating}.5` : `${album.rating}`}{" "}
                    / 5
                  </span>
                </div>

                {/* Player */}
                <div className="player-section">
                  <div className="player-top">
                    <button
                      className="play-btn"
                      onClick={toggleSpin}
                      title={spinning ? "Pause" : "Play"}
                      style={
                        spinning
                          ? {
                              background: album.accentColor,
                              borderColor: album.accentColor,
                            }
                          : {}
                      }
                    >
                      {spinning ? (
                        <svg viewBox="0 0 24 24" fill="white">
                          <rect x="5" y="4" width="4" height="16" />
                          <rect x="15" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      )}
                    </button>

                    <div className="track-info">
                      <div className="track-name">
                        Play Bryan's Recommended Song
                      </div>
                      <div className="track-sub">
                        {spinning
                          ? "Now playing · spins with record"
                          : "Click play or spin the record"}
                      </div>
                    </div>
                  </div>

                  <div className="progress-row">
                    <span className="time-label">
                      {formatTime(currentTime)}
                    </span>
                    <div className="progress-wrap">
                      <div className="progress-fill-track" />
                      <div
                        className="progress-fill-bar"
                        style={{
                          width: `${progress * 100}%`,
                          background: album.accentColor,
                        }}
                      />
                      <input
                        type="range"
                        className="progress-slider"
                        min={0}
                        max={1}
                        step={0.001}
                        value={progress}
                        onMouseDown={handleSeekStart}
                        onTouchStart={handleSeekStart}
                        onChange={handleSeekChange}
                        onMouseUp={handleSeekCommit as any}
                        onTouchEnd={handleSeekCommit as any}
                      />
                    </div>
                    <span className="time-label right">
                      {formatTime(duration)}
                    </span>
                  </div>

                  <div className="volume-row">
                    <svg
                      className="vol-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                    <input
                      type="range"
                      className="volume-slider"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="btn-row">
                  <a
                    href={album.href}
                    className="read-more"
                    style={{ background: album.accentColor }}
                  >
                    Read Full Review
                  </a>
                  <button className="spin-hint" onClick={toggleSpin}>
                    {spinning ? "⏸ Stop" : "▶ Spin"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
