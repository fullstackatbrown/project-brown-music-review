"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

/**
 * Recreating the provided design with a dynamic horizontal scale to ensure it fits any browser screen.
 */
const Navbar = () => (
  <div className="w-[1440px] h-[246px] bg-black relative overflow-hidden flex flex-col items-center">
    <div className="w-full h-full relative">
      {/* Search Icon */}
      <div className="absolute right-[40px] top-[185px] text-white">
        <Search size={29} strokeWidth={2.5} />
      </div>

      {/* Navigation Links */}
      <div className="absolute left-[329px] top-[174px] flex gap-[50px] items-center">
        {["Home", "Deep Dive", "Narratives", "Hot Topics", "Opinions", "About Us"].map((link) => (
          <div key={link} className="text-white text-[20px] font-medium leading-[30px] hover:text-[#D20000] transition-colors cursor-pointer">
            {link}
          </div>
        ))}
      </div>

      {/* Subscribe Button */}
      <div className="absolute right-[40px] top-[65px] bg-[#D20000] px-6 h-[52px] rounded-lg shadow-sm flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
        <span className="text-white text-base font-medium">Subscribe</span>
      </div>

      {/* Logo Placeholder */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[40px] w-[674px] h-[103px] bg-white/10 flex items-center justify-center text-white text-4xl font-bold tracking-widest italic border border-white/20 uppercase">
        BROWN MUSIC REVIEW
      </div>

      {/* Divider */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[160px] w-[468px] h-0 border-t-4 border-white opacity-80"></div>
    </div>
  </div>
);

const DecorativeCircles = () => (
  <>
    {/* Black large circle */}
    <div className="absolute w-[687.66px] h-[662.49px] left-[-240px] top-[305.75px] bg-black rounded-full" />
    
    {/* Red inner circle */}
    <div className="absolute w-[194.53px] h-[194.53px] left-[6.90px] top-[539.73px] bg-[#D20000] rounded-full" />

    {/* Smaller black circle */}
    <div className="absolute w-[110.19px] h-[108.15px] left-[49.08px] top-[582.58px] bg-black rounded-full" />
  </>
);

const ArticleCard = ({ title, author, blurb }: { title: string, author: string, blurb: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="w-[431px] h-[639px] relative overflow-hidden flex flex-col items-center p-8 group bg-white"
  >
    <div className="relative w-[373px] h-[373px] rounded-[30px] overflow-hidden mb-6 bg-neutral-200">
      <div className="absolute inset-0 rounded-[30px] border-2 border-black -m-[1px]" />
    </div>
    
    <div className="text-center w-[351px]">
      <h3 className="text-[32px] font-bold leading-[34px] tracking-[0.64px] mb-4 group-hover:text-[#D20000] transition-colors whitespace-pre-wrap">
        {title}
      </h3>
      <p className="text-[16px] leading-[17px] tracking-[0.32px] text-neutral-600 mb-8 max-w-[340px] mx-auto overflow-hidden text-ellipsis line-clamp-3 h-[66px]">
        {blurb}
      </p>
      <p className="text-2xl italic">
        by {author}
      </p>
    </div>

    {/* Exact position structural border */}
    <div className="absolute left-[26px] top-[32px] w-[374px] h-[580px] rounded-[30px] border-2 border-black pointer-events-none" />
  </motion.div>
);

export default function Home() {
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const targetWidth = 1440;
      if (windowWidth < targetWidth) {
        setScaleFactor(windowWidth / targetWidth);
      } else {
        setScaleFactor(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full bg-white relative overflow-x-hidden min-h-screen">
      
      {/* Scaled Wrapper to ensure "horizontal fit" while keeping design identical */}
      <div 
        className="origin-top flex flex-col items-center"
        style={{ scale: scaleFactor }}
      >
        <div className="w-[1440px] relative min-h-[3892px]">
          <Navbar />
          
          {/* Circular accents MUST be above NAVBAR/HEADER in the DOM order or handle stacking correctly */}
          <DecorativeCircles />

          {/* Hero Rotated Image (exactly as snippet) */}
          <div 
            className="absolute left-[504.6px] top-[240px] w-[204px] h-[369px] bg-neutral-200 rotate-[63deg] origin-top-left shadow-[0px_4.2px_4.2px_rgba(0,0,0,0.25)_inset,0px_4.2px_4.2px_rgba(0,0,0,0.25)]" 
          />

          {/* Latest From Section */}
          <div className="absolute left-[719px] top-[283px] w-[621px] text-right">
            <h2 className="text-[97px] font-medium text-[#D20000] leading-none mb-0">Latest From</h2>
          </div>
          <div className="absolute left-[707px] top-[422px] w-[647px] h-0 border-t-[5px] border-black" />

          {/* Featured Rows Grouped per snippet logic but spaced for visual identity */}
          <div className="absolute left-[602px] top-[482px] flex items-start gap-[37px]">
            <div className="flex flex-col items-center">
              <div className="w-[315px] h-[51px] bg-[#D20000] rounded-full flex items-center justify-center mb-[24px]">
                <span className="text-white text-[32px] font-semibold">Deep Dive</span>
              </div>
              <div className="w-[315px] h-[315px] bg-neutral-200 rounded-[30px] mb-[75px]" />
              <div className="text-center w-[312px]">
                <p className="text-[32px] font-bold leading-tight">ARTICLE TITLE?<br/></p>
                <p className="text-[20px] font-normal italic text-neutral-800">author</p>
              </div>
            </div>

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

            <div className="flex flex-col items-center mt-[75px]">
               <div className="w-[315px] h-[315px] bg-neutral-200 rounded-[30px]" />
            </div>
          </div>

          {/* Black Section Article Grid */}
          <div className="absolute top-[1057px] left-0 w-[1440px] h-[1063px] bg-black">
            <div className="relative w-full h-full p-24">
              {/* Left Column (exactly as snippet positions) */}
              <div className="absolute left-[48px] top-[99px] space-y-[100px]">
                {[ "Rihanna Unharmed after", "ARTICLE TITLE!", "ARTICLE TITLE!" ].map((title) => (
                   <div key={title} className="w-[423px] text-center">
                    <h4 className="text-white text-[40px] font-bold mb-4 uppercase">{title}</h4>
                    <p className="text-white/80 text-[32px] font-normal leading-[48px]">description description description description description description</p>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="absolute right-[54px] top-[99px] space-y-[100px]">
                {[ "ARTICLE TITLE!", "ARTICLE TITLE!", "ARTICLE TITLE!" ].map((title, i) => (
                   <div key={i} className="w-[423px] text-center">
                    <h4 className="text-white text-[40px] font-bold mb-4 uppercase">{title}</h4>
                    <p className="text-white/80 text-[32px] font-normal leading-[48px]">description description description description description description</p>
                  </div>
                ))}
              </div>

              {/* Center Featured Deep Dive in Black Section */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[85px] w-[372px] flex flex-col items-center">
                <div className="w-[372px] h-[372px] bg-neutral-700 rounded-[30px] mb-12 shadow-xl" />
                <div className="w-[372px] h-[51px] bg-[#D20000] rounded-[30px] flex items-center justify-center mb-8">
                  <span className="text-white text-[32px] font-normal">Deep Dive</span>
                </div>
                <h2 className="text-white text-[45px] font-bold mb-4">title</h2>
                <p className="text-white/80 text-[28px] font-medium text-center leading-normal">
                  short description short description short description short description short description short description
                </p>
              </div>
            </div>
          </div>

          {/* Lower Grid (exactly as snippet positions) */}
          <div className="absolute left-[74px] top-[2179px] w-[1293px] flex flex-col gap-[0px]">
            <div className="flex">
               {[1,2,3].map((i) => (
                <ArticleCard key={i} title={`article title\narticle title`} author="author" blurb="short blurb about the article short blurb about the article short blurb about the article short blurb about the article short blurb about the article short blurb about" />
               ))}
            </div>
            <div className="flex">
               {[4,5,6].map((i) => (
                <ArticleCard key={i} title={`article title\narticle title`} author="author" blurb="short blurb about the article short blurb about the article short blurb about the article short blurb about the article short blurb about the article short blurb about" />
               ))}
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[3481px] w-[407px] text-center">
             <span className="text-[40px] font-bold font-inter cursor-pointer hover:text-[#D20000] transition-colors">see all</span>
          </div>
        </div>
      </div>
    </div>
  );
}
