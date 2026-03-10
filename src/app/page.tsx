"use client";

import { useState } from "react";
import { useAgencyData } from "@/hooks/useAgencyData";
import BidirectionalSlider from "@/components/BidirectionalSlider";
import TopNavigation from "@/components/TopNavigation";
import CustomCursor from "@/components/CustomCursor";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { sectors, isLoading } = useAgencyData();
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return <div className="w-full h-screen bg-black flex items-center justify-center font-lovelo text-white text-3xl tracking-widest animate-pulse">CARGANDO...</div>;
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Custom Global Cursor - Static Letter Mode */}
      <CustomCursor activeIndex={activeIndex} />

      {/* Top Header Navigation replacing side dots */}
      <TopNavigation sectors={sectors} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      {/* Main content: Horizontal & Vertical Sliders */}
      <BidirectionalSlider sectors={sectors} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      {/* Brand Identity Overlay - Only visible if we are NOT on the first sector down-scroll 
          (Inicio hero has its own massive branding) */}
      <div className={`absolute top-8 left-8 pointer-events-none z-40 max-w-sm mix-blend-difference opacity-0 md:opacity-100 transition-opacity duration-500 ${activeIndex === 0 ? 'hidden' : 'block'}`}>
        <h2 className="text-white/80 font-Montserrat text-[10px] md:text-xs tracking-[0.3em] font-semibold mb-1">
          MARKETING & CONTENT CREATOR
        </h2>
        <h1 className="text-white font-lovelo text-3xl md:text-5xl tracking-widest leading-none">
          NOVENO
        </h1>
      </div>

      {/* Admin Panel Trigger - Now points to the dedicated /admin route */}
      <Link
        href="/admin"
        className="fixed bottom-4 left-4 z-50 p-2 text-white/20 hover:text-white/60 transition-colors rounded-full mix-blend-difference"
        aria-label="Open Admin Dashboard"
      >
        <Settings className="w-5 h-5" />
      </Link>
    </main>
  );
}


