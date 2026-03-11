"use client";

import { Sector } from "@/hooks/useAgencyData";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import UniversalFooter from "./UniversalFooter";
import ClientCarousel from "./ClientCarousel";
import PortfolioCarousel from "./PortfolioCarousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Horizontal Slide Component (Now every slide scroll vertically)
function HorizontalSlide({
    sector,
    isActive,
    isBefore,
    isAfter,
}: {
    sector: Sector;
    isActive: boolean;
    isBefore: boolean;
    isAfter: boolean;
}) {
    const isInicio = sector.id === "inicio";

    // Parallax Background Setup (Opposite to Mouse X/Y) — desktop only
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const smoothY = useSpring(mouseY, { stiffness: 100, damping: 30 });
    const moveX = useTransform(smoothX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [-15, 15]);
    const moveY = useTransform(smoothY, [0, typeof window !== "undefined" ? window.innerHeight : 1000], [-15, 15]);

    useEffect(() => {
        if (!isActive) return;
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isActive, mouseX, mouseY]);

    return (
        <motion.div
            initial={false}
            animate={{
                x: isBefore ? "-100%" : isAfter ? "100%" : "0%",
                opacity: isActive ? 1 : 0.4,
                scale: isActive ? 1 : 0.9,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-0 left-0 w-[100vw] h-[100vh] will-change-transform flex overflow-hidden ${isActive ? "overflow-y-auto" : "overflow-y-hidden"
                }`}
            style={{ touchAction: isActive ? "pan-y" : "none" }}
        >
            {/* Background Parallax Layer */}
            <motion.div
                style={{ x: moveX, y: moveY }}
                className="fixed top-[-5%] left-[-5%] w-[110%] h-[110%] -z-10 object-cover pointer-events-none"
            >
                {sector.mediaType === "video" ? (
                    <video
                        src={sector.mediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img src={sector.mediaUrl} alt={sector.title} className="w-full h-full object-cover" />
                )}
            </motion.div>

            {/* Main Content Render */}
            <div className="relative w-full min-h-full">
                {isInicio ? (
                    <InicioVerticalFlow sector={sector} />
                ) : (
                    <SectorVerticalFlow sector={sector} />
                )}
            </div>
        </motion.div>
    );
}

// Sub-Component: Vertical Sections for Index 0 (Inicio)
function InicioVerticalFlow({ sector }: { sector: Sector }) {
    return (
        <div className="w-full flex flex-col items-center">
            {/* 1. Hero */}
            <section className="w-full h-screen flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-24 relative snap-start">
                {/* Heavy Top Gradient & Lower Scrim for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none -z-1" />

                <h2 className="relative z-10 text-white/45 mix-blend-difference font-lovelo text-4xl sm:text-6xl md:text-8xl lg:text-9xl tracking-widest uppercase mb-4 leading-none max-w-5xl">
                    {sector.title}
                </h2>
                <div className="relative z-10 h-1 w-16 sm:w-24 bg-terracotta my-4 sm:my-6" />
                <p className="relative z-10 text-white font-Montserrat text-base sm:text-lg md:text-2xl font-light tracking-wide max-w-2xl drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                    {sector.description}
                </p>

                {/* Scroll affordance */}
                <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50 flex flex-col items-center">
                    <span className="text-xs font-Montserrat tracking-[0.3em] uppercase mb-2">Deslizar para explorar</span>
                    <div className="w-[1px] h-8 sm:h-12 bg-white" />
                </div>
            </section>

            {/* 2. Quienes Somos */}
            <section className="w-full min-h-[70vh] flex items-center bg-black/80 backdrop-blur-md relative snap-start z-10 p-6 sm:p-10 md:p-12 lg:p-24">
                <div className="max-w-4xl">
                    <h3 className="text-teal font-lovelo text-2xl sm:text-3xl md:text-4xl mb-6 md:mb-8 uppercase tracking-widest">Quiénes Somos</h3>
                    <p className="text-sand/90 font-Montserrat text-xl sm:text-2xl lg:text-4xl leading-relaxed font-light">
                        {sector.aboutText}
                    </p>
                </div>
            </section>

            {/* 3. Team & Colaboraciones (Split View) */}
            <section className="w-full min-h-[80vh] bg-sand text-foreground relative snap-start z-10 p-6 sm:p-10 md:p-12 lg:p-24 py-16 sm:py-24 lg:py-32 flex flex-col justify-center">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-24 max-w-[1600px] mx-auto w-full">
                    {/* Lado Izquierdo: Team Noveno */}
                    <div>
                        <h3 className="text-terracotta font-lovelo text-2xl sm:text-3xl md:text-4xl mb-8 md:mb-12 uppercase tracking-widest text-center xl:text-left">Team Noveno</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            {sector.teamMembers?.map((member) => (
                                <div key={member.id} className="group relative overflow-hidden rounded-xl aspect-[4/5] shadow-lg">
                                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                                    <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                                        <h4 className="text-white font-lovelo text-xl sm:text-2xl drop-shadow-lg">{member.name}</h4>
                                        <p className="text-sand/90 font-Montserrat tracking-widest text-xs uppercase mt-1 drop-shadow-md">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lado Derecho: Colaboraciones */}
                    <div>
                        <h3 className="text-teal font-lovelo text-2xl sm:text-3xl md:text-4xl mb-8 md:mb-12 uppercase tracking-widest text-center xl:text-left">Colaboraciones</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            {sector.collaborators?.map((collab) => (
                                <div key={collab.id} className="group relative overflow-hidden rounded-xl aspect-[4/5] shadow-lg">
                                    <img src={collab.imageUrl} alt={collab.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                                    <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                                        <h4 className="text-white font-lovelo text-xl sm:text-2xl drop-shadow-lg">{collab.name}</h4>
                                        <p className="text-sand/90 font-Montserrat tracking-widest text-xs uppercase mt-1 drop-shadow-md">{collab.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <UniversalFooter />
        </div>
    );
}

// Sub-Component: Vertical Sections for Sectors 1-5 (Hotelero, Gastronomía, etc.)
function SectorVerticalFlow({ sector }: { sector: Sector }) {
    return (
        <div className="w-full flex flex-col">
            {/* Sector Hero */}
            <section className="w-full min-h-screen flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-24 relative snap-start">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none -z-1" />

                <div className="relative z-10 max-w-5xl">
                    <h2 className="text-white/45 mix-blend-difference font-lovelo text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-wider uppercase mb-4 leading-none">
                        {sector.title}
                    </h2>
                    <div className="h-1 w-16 sm:w-24 bg-terracotta my-4 sm:my-6" />
                    <p className="text-white font-Montserrat text-base sm:text-lg md:text-xl lg:text-3xl font-light tracking-wide drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] max-w-3xl leading-relaxed">
                        {sector.description}
                    </p>
                </div>
            </section>

            {/* Infinte Clients Logo Carousel Segment */}
            {sector.clients && sector.clients.length > 0 && (
                <section className="w-full relative z-10 bg-black/90 backdrop-blur-md pb-24 border-t border-white/5">
                    <ClientCarousel clients={sector.clients} />
                </section>
            )}

            {/* Portfolio Media Swiper via Vertical Scroll translation */}
            {sector.portfolio && sector.portfolio.length > 0 && (
                <PortfolioCarousel items={sector.portfolio} />
            )}

            <UniversalFooter />
        </div>
    );
}

// Main Coordinator: Controls Horizontal Switching & Wraps everything
export default function BidirectionalSlider({
    sectors,
    activeIndex,
    setActiveIndex,
}: {
    sectors: Sector[];
    activeIndex: number;
    setActiveIndex: (idx: number) => void;
}) {
    const [isScrollingX, setIsScrollingX] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    // Desktop: trackpad horizontal scroll
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            const isHorizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY);

            if (typeof window === "undefined" || isScrollingX) return;

            if (isHorizontalIntent) {
                setIsScrollingX(true);
                setTimeout(() => setIsScrollingX(false), 800);

                if (e.deltaX > 20 && activeIndex < sectors.length - 1) {
                    setActiveIndex(activeIndex + 1);
                } else if (e.deltaX < -20 && activeIndex > 0) {
                    setActiveIndex(activeIndex - 1);
                }
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [activeIndex, isScrollingX, sectors.length, setActiveIndex]);

    // Mobile: touch swipe horizontal to change sector
    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (touchStartX.current === null || touchStartY.current === null) return;
            const deltaX = e.changedTouches[0].clientX - touchStartX.current;
            const deltaY = e.changedTouches[0].clientY - touchStartY.current;

            // Only trigger horizontal swipe when it's clearly more horizontal than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 60) {
                if (deltaX < 0 && activeIndex < sectors.length - 1) {
                    setActiveIndex(activeIndex + 1);
                } else if (deltaX > 0 && activeIndex > 0) {
                    setActiveIndex(activeIndex - 1);
                }
            }

            touchStartX.current = null;
            touchStartY.current = null;
        };

        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });
        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [activeIndex, sectors.length, setActiveIndex]);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black touch-pan-y">
            {sectors.map((sector, index) => {
                return (
                    <HorizontalSlide
                        key={sector.id}
                        sector={sector}
                        isActive={index === activeIndex}
                        isBefore={index < activeIndex}
                        isAfter={index > activeIndex}
                    />
                );
            })}

            {/* Mobile Arrow Buttons — subtle, only md:hidden */}
            <button
                onClick={() => activeIndex > 0 && setActiveIndex(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Sector anterior"
                className="md:hidden fixed left-2 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 disabled:opacity-0 transition-opacity duration-300"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={() => activeIndex < sectors.length - 1 && setActiveIndex(activeIndex + 1)}
                disabled={activeIndex === sectors.length - 1}
                aria-label="Sector siguiente"
                className="md:hidden fixed right-2 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 disabled:opacity-0 transition-opacity duration-300"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
