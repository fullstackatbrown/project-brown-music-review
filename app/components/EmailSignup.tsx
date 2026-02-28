"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // TODO: Add backend API call here later
    // Simulating a submission for now
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => {
        setStatus("idle");
        setIsOpen(false);
      }, 2000);
    }, 1000);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-8 px-6 py-3 rounded-lg font-semibold bg-black border-2 border-white text-white hover:bg-white hover:text-black transition-colors"
      >
        Subscribe to Updates
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div 
            className="bg-background border border-current rounded-lg p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-2xl hover:opacity-70 transition-opacity"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">Stay Updated</h2>
            <p className="text-center mb-6 opacity-70">
              Subscribe to get the latest music reviews and updates
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-4 py-3 border border-current rounded-lg focus:outline-none focus:ring-2 focus:ring-current bg-background text-foreground opacity-80 focus:opacity-100"
                disabled={status === "loading"}
              />
              
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="px-6 py-3 border border-current rounded-lg font-semibold hover:bg-foreground hover:text-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === "loading" && "Subscribing..."}
                {status === "success" && "✓ Subscribed!"}
                {status === "idle" && "Subscribe"}
                {status === "error" && "Try Again"}
              </button>
            </form>
            
            {status === "success" && (
              <p className="mt-3 text-sm text-center opacity-70">
                Thanks for subscribing! We'll be in touch soon.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
