"use client"
import Link from "next/link";
import { Search } from "lucide-react";

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

export default function Navbar() {
  return (
    <div className="w-full bg-black relative overflow-hidden flex flex-col items-center">
      <div className="w-full relative py-10 px-10">
        {/* Search Icon */}
        <div className="absolute right-10 bottom-6 text-white">
          <button aria-label="Search">
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
  );
}
