"use client"
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { HomepageArticle } from "@/lib/types";

interface Page {
  name: string;
  path: string;
}

const pages: Page[] = [
  { name: "Home", path: "/" },
  { name: "Deep Dive", path: "/deepdive" },
  { name: "Narratives", path: "/narratives" },
  { name: "Hot Topics", path: "/hottopics" },
  { name: "Opinions", path: "/opinions" },
  { name: "About Us", path: "/about" },
];

function SearchOverlay({
  onClose,
}: {
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<HomepageArticle[]>([]);
  const [results, setResults] = useState<HomepageArticle[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all articles on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        if (data.articles) {
          setArticles(data.articles);
        }
      } catch {
        // silently fail
      }
    }
    void load();
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Filter articles as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults(articles);
      return;
    }
    const q = query.toLowerCase();
    const filtered = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.reviewer.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.typeLabel.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query, articles]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex flex-col">
      {/* Search header */}
      <div className="w-full max-w-3xl mx-auto pt-16 px-6">
        <div className="flex items-center gap-4 border-b-2 border-white/30 pb-4">
          <Search size={24} className="text-white/60 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 bg-transparent text-white text-2xl font-light outline-none placeholder:text-white/40"
          />
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>
        <p className="text-white/40 text-sm mt-3 font-mono">
          {query.trim()
            ? `${results.length} result${results.length !== 1 ? "s" : ""}`
            : `${articles.length} articles`}
        </p>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto mt-6 px-6 pb-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {results.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              onClick={onClose}
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              {/* Cover thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-700 flex-shrink-0 relative">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-600 to-neutral-800" />
                )}
              </div>
              {/* Article info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg leading-snug group-hover:text-[#D20000] transition-colors truncate">
                  {article.title}
                </h3>
                <p className="text-white/50 text-sm mt-1 truncate">
                  {article.reviewer} &middot; {article.typeLabel}
                </p>
              </div>
              {/* Rating badge */}
              {article.ratingLabel && (
                <span
                  className="text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full text-white flex-shrink-0"
                  style={{ backgroundColor: article.accentColor }}
                >
                  {article.ratingLabel}
                </span>
              )}
            </Link>
          ))}
          {results.length === 0 && query.trim() && (
            <p className="text-white/40 text-center py-12 text-lg">
              No articles match &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <div className="w-full bg-black relative overflow-hidden flex flex-col items-center">
        <div className="w-full relative py-10 px-10">
          {/* Search Icon */}
          <div className="absolute right-10 bottom-6 text-white">
            <button aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={29} strokeWidth={2.5} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="text-white text-4xl font-bold tracking-widest italic uppercase">
              BROWN MUSIC REVIEW
            </div>
          </div>

          {/* Divider */}
          <div className="mx-auto w-[468px] max-w-full border-t-4 border-white opacity-80 mb-4" />

          {/* Navigation Links */}
          <div className="flex justify-center gap-12 items-center">
            {pages.map((page) => (
              <Link
                href={page.path}
                key={page.name}
                className="text-white text-xl font-medium leading-[30px] hover:text-[#D20000] transition-colors"
              >
                {page.name}
              </Link>
            ))}
          </div>

          {/* Subscribe Button */}
          <Link
            href="/subscribe"
            className="absolute right-10 top-10 bg-[#D20000] px-6 h-[52px] rounded-lg shadow-sm flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <span className="text-white text-base font-medium">Subscribe</span>
          </Link>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </>
  );
}
