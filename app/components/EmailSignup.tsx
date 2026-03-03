"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: Connect to mailing list service (Mailchimp, Buttondown, etc.)
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <section style={{
      width: "100%",
      padding: "60px 48px",
      borderTop: "1.5px solid #0a0a0a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.6rem",
        fontWeight: 700,
        color: "#0a0a0a",
        margin: 0,
      }}>
        Never Miss a Review
      </h2>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.7rem",
        letterSpacing: "0.1em",
        color: "#888",
        margin: 0,
      }}>
        Subscribe to get the latest from Brown Music Review
      </p>

      {status === "success" ? (
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          color: "#e01010",
          letterSpacing: "0.1em",
        }}>
          ✓ You're subscribed!
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          gap: "8px",
          marginTop: "8px",
          width: "100%",
          maxWidth: "460px",
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === "loading"}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "1.5px solid #0a0a0a",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              outline: "none",
              background: "#fff",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              padding: "12px 24px",
              background: "#0a0a0a",
              color: "#fff",
              border: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
    </section>
  );
}