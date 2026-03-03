"use client";

import { useState, useEffect, useRef } from "react";

export default function VinylScroller() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const vinylRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef(0);

  // Update rotation based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!isDragging) {
        const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const newRotation = scrollPercentage * 360 * 3; // Multiple rotations
        setRotation(newRotation);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDragging]);

  // Handle mouse/touch drag to control scroll
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    if (vinylRef.current) {
      const rect = vinylRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
      lastAngleRef.current = angle;
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !vinylRef.current) return;

    const rect = vinylRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    
    let deltaAngle = angle - lastAngleRef.current;
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;
    
    lastAngleRef.current = angle;
    
    // Scroll based on rotation
    const scrollDelta = deltaAngle * 5;
    window.scrollBy(0, scrollDelta);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={vinylRef}
      className="fixed right-8 top-8 cursor-grab active:cursor-grabbing z-40"
      style={{ transform: `rotate(${rotation}deg)` }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
    >
      {/* Vinyl Record */}
      <div className="relative w-32 h-32">
        {/* Outer Circle */}
        <div className="absolute inset-0 rounded-full bg-black border-4 border-white" />
        
        {/* Grooves with gradient */}
        <div 
          className="absolute inset-3 rounded-full border-2 border-white"
          style={{ 
            background: `conic-gradient(from 0deg, #ffab40 0%, #ee1c24 50%, #ffab40 100%)` 
          }}
        />
        <div 
          className="absolute inset-6 rounded-full border-2 border-white"
          style={{ 
            background: `conic-gradient(from 90deg, #ee1c24 0%, #ffab40 50%, #ee1c24 100%)` 
          }}
        />
        <div 
          className="absolute inset-9 rounded-full border-2 border-white"
          style={{ 
            background: `conic-gradient(from 180deg, #ffab40 0%, #ee1c24 50%, #ffab40 100%)` 
          }}
        />
        
        {/* Center Label */}
        <div className="absolute inset-12 rounded-full bg-black border-2 border-white" />
        
        {/* Center Hole */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-white" />
      </div>
    </div>
  );
}
