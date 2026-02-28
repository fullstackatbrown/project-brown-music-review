"use client";
import { useState, useRef, useEffect } from "react";

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function Home() {
  const [spinning, setSpinning] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0); // 0–1
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        src="/tmp_song.mp3"
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        :root {
          --white: #ffffff;
          --black: #0a0a0a;
          --red: #e01010;
          --gray: #888;
          --light-gray: #e8e8e8;
        }

        body {
          margin: 0;
          background: var(--white);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .page {
          height: 100vh;
          width: 100vw;
          background: var(--white);
          display: flex;
          flex-direction: column;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 48px;
          border-bottom: 1.5px solid var(--black);
          flex-shrink: 0;
        }

        .navbar h1 {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--black);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0;
        }

        .navbar-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: var(--red);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .main {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          gap: 200px;
          padding: 40px 48px;
          overflow: hidden;
        }

        .left-col {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .artwork-stack {
          position: relative;
          --sz: min(400px, calc(100vh - 180px));
          width: calc(var(--sz) * 1.5);
          height: var(--sz);
        }

        .album-cover {
          position: absolute;
          top: 0;
          left: 0;
          width: var(--sz);
          height: var(--sz);
          object-fit: cover;
          display: block;
          z-index: 2;
          box-shadow: 5px 5px 0px var(--black);
        }

        .vinyl-wrap {
          position: absolute;
          width: var(--sz);
          height: var(--sz);
          top: 0;
          left: 35%;
          z-index: 1;
          cursor: pointer;
        }

        .vinyl {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, #2a2a2a 0%, #111 35%, #080808 65%, #030303 100%);
          box-shadow: 4px 4px 30px rgba(0,0,0,0.45);
          position: relative;
          overflow: hidden;
        }

        .vinyl::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: repeating-radial-gradient(
            circle at 50%,
            transparent 0px,
            transparent 4px,
            rgba(255,255,255,0.03) 4px,
            rgba(255,255,255,0.03) 5px
          );
        }

        .vinyl-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 26%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: var(--red);
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

        .vinyl-label .dot {
          width: 5px;
          height: 5px;
          background: var(--black);
          border-radius: 50%;
          margin-top: 3px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .spinning { animation: spin 2.8s linear infinite; }

        .right-col {
          flex: 1;
          display: flex;
          align-items: center;
          max-width: 480px;
        }

        .review-card { width: 100%; }

        .category-tag {
          display: inline-block;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--white);
          background: var(--red);
          padding: 4px 10px;
          margin-bottom: 20px;
        }

        .review-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          line-height: 1.05;
          font-weight: 700;
          color: var(--black);
          margin: 0 0 12px;
        }

        .review-title em {
          font-style: italic;
          color: var(--red);
        }

        .review-author {
          font-size: 0.82rem;
          font-weight: 300;
          color: var(--gray);
          letter-spacing: 0.04em;
          margin: 0 0 28px;
        }

        .review-author strong {
          font-weight: 500;
          color: var(--black);
        }

        .divider {
          width: 100%;
          height: 1px;
          background: var(--light-gray);
          margin-bottom: 24px;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }

        .stars { display: flex; gap: 3px; }
        .star { width: 15px; height: 15px; fill: var(--red); }
        .star.empty { fill: none; stroke: var(--light-gray); stroke-width: 1.5px; }

        .rating-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--gray);
        }

        .player-section {
          margin-bottom: 28px;
          padding: 16px;
          border: 1px solid var(--light-gray);
          background: #fafafa;
        }

        .player-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .play-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--black);
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }

        .play-btn:hover { background: var(--black); }
        .play-btn:hover svg { fill: var(--white); }

        .play-btn svg {
          width: 14px;
          height: 14px;
          fill: var(--black);
          transition: fill 0.2s;
        }

        .play-btn.active {
          background: var(--red);
          border-color: var(--red);
        }

        .play-btn.active svg { fill: var(--white); }
        .play-btn.active:hover { background: #c00; border-color: #c00; }

        .track-info { flex: 1; min-width: 0; }

        .track-name {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          color: var(--black);
          letter-spacing: 0.06em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .track-sub {
          font-size: 0.62rem;
          color: var(--gray);
          margin-top: 2px;
          letter-spacing: 0.04em;
        }

        /* PROGRESS BAR */
        .progress-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .time-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          color: var(--gray);
          letter-spacing: 0.04em;
          flex-shrink: 0;
          width: 28px;
        }

        .time-label.right { text-align: right; }

        .progress-wrap {
          flex: 1;
          position: relative;
          height: 18px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .progress-fill-track {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 3px;
          background: var(--light-gray);
          width: 100%;
          border-radius: 2px;
          pointer-events: none;
        }

        .progress-fill-bar {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 3px;
          background: var(--red);
          border-radius: 2px;
          pointer-events: none;
          transition: width 0.1s linear;
        }

        .progress-slider {
          position: relative;
          z-index: 1;
          width: 100%;
          -webkit-appearance: none;
          appearance: none;
          height: 3px;
          background: transparent;
          outline: none;
          cursor: pointer;
          margin: 0;
        }

        .progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: var(--black);
          cursor: pointer;
          border: 2px solid var(--white);
          box-shadow: 0 0 0 1.5px var(--black);
          transition: transform 0.15s;
        }

        .progress-slider:hover::-webkit-slider-thumb {
          transform: scale(1.2);
          background: var(--red);
          box-shadow: 0 0 0 1.5px var(--red);
        }

        .progress-slider::-moz-range-thumb {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: var(--black);
          cursor: pointer;
          border: 2px solid var(--white);
          box-shadow: 0 0 0 1.5px var(--black);
        }

        .volume-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vol-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          color: var(--gray);
        }

        .volume-slider {
          flex: 1;
          -webkit-appearance: none;
          appearance: none;
          height: 2px;
          background: var(--light-gray);
          outline: none;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--black);
          cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--black);
          cursor: pointer;
          border: none;
        }

        .btn-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .read-more {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: var(--black);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 14px 28px;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .read-more:hover { background: var(--red); }

        .read-more::after {
          content: '→';
          font-size: 0.95rem;
          transition: transform 0.2s;
        }

        .read-more:hover::after { transform: translateX(4px); }

        .spin-hint {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          color: var(--gray);
          cursor: pointer;
          user-select: none;
          text-transform: uppercase;
          transition: color 0.2s;
          background: none;
          border: none;
          padding: 0;
        }

        .spin-hint:hover { color: var(--red); }
      `}</style>

      <div className="page">
        <nav className="navbar">
          <h1>teeeheee</h1>
          <span className="navbar-tag">Vol. 12 — 2025</span>
        </nav>

        <div className="main">
          <div className="left-col">
            <div className="artwork-stack">
              <div className="vinyl-wrap" onClick={toggleSpin}>
                <div className={`vinyl ${spinning ? "spinning" : ""}`}>
                  <div className="vinyl-label">
                    <span>BMR</span>
                    <div className="dot" />
                  </div>
                </div>
              </div>
              <img
                src="/tmp_album.jpeg"
                alt="Album cover"
                className="album-cover"
              />
            </div>
          </div>

          <div className="right-col">
            <div className="review-card">
              <span className="category-tag">Album Review</span>

              <h2 className="review-title">
                <em>Josh Ta</em>
                <br />
                Da Most Beautiful Art
              </h2>

              <p className="review-author">
                Reviewed by <strong>Bryan Chung @ MIT '29</strong>
                <br />
                Minor UI Contribution by{" "}
                <strong>Jennifer Park @ Tufts '29</strong>
              </p>

              <div className="divider" />

              <div className="rating-row">
                <svg width="0" height="0" style={{ position: "absolute" }}>
                  <defs>
                    <linearGradient
                      id="half-grad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="50%" stopColor="#e01010" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="stars">
                  {[0, 1, 2, 3].map((i) => (
                    <svg key={i} className="star" viewBox="0 0 24 24">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                  <svg
                    className="star"
                    viewBox="0 0 24 24"
                    style={{ fill: "url(#half-grad)" }}
                  >
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                </div>
                <span className="rating-label">5 / 5</span>
              </div>

              {/* Player */}
              <div className="player-section">
                <div className="player-top">
                  <button
                    className={`play-btn ${spinning ? "active" : ""}`}
                    onClick={toggleSpin}
                    title={spinning ? "Pause" : "Play"}
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

                {/* Progress bar */}
                <div className="progress-row">
                  <span className="time-label">{formatTime(currentTime)}</span>
                  <div className="progress-wrap">
                    <div className="progress-fill-track" />
                    <div
                      className="progress-fill-bar"
                      style={{ width: `${progress * 100}%` }}
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

                {/* Volume */}
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
                <button className="read-more">Read Full Review</button>
                <button className="spin-hint" onClick={toggleSpin}>
                  {spinning ? "⏸ Stop" : "▶ Spin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
