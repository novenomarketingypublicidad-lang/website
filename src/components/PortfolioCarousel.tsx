"use client";

import { PortfolioItem } from "@/hooks/useAgencyData";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function PortfolioCarousel({ items }: { items?: PortfolioItem[] }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const [activeProject, setActiveProject] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile to switch between scroll-parallax (desktop) and drag (mobile)
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Create a scroll-linked transformation for true horizontal parallax mapping (desktop only)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    // Moves the inner container horizontally strictly dependent on the pure vertical scroll progression
    const x = useTransform(scrollYProgress, [0, 1], ["20%", "-40%"]);

    if (!items || items.length === 0) return null;

    // Get unique project names
    const projectNames = Array.from(new Set(items.map(item => item.projectName).filter(Boolean))) as string[];

    const filteredItems = activeProject ? items.filter(item => item.projectName === activeProject) : items;

    const FilterPills = () => (
        projectNames.length > 0 ? (
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                    onClick={() => setActiveProject(null)}
                    className={`px-3 sm:px-4 py-1.5 rounded-full font-Montserrat text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeProject === null ? 'bg-terracotta text-white shadow-lg scale-105' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                >
                    Todos
                </button>
                {projectNames.map(name => (
                    <button
                        key={name}
                        onClick={() => setActiveProject(name)}
                        className={`px-3 sm:px-4 py-1.5 rounded-full font-Montserrat text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeProject === name ? 'bg-terracotta text-white shadow-lg scale-105' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                    >
                        {name}
                    </button>
                ))}
            </div>
        ) : null
    );

    // ─── Mobile Mode: draggable horizontal carousel ─────────────────────────────
    if (isMobile) {
        return (
            <section className="relative w-full bg-black overflow-hidden py-12">
                <div className="px-4 sm:px-8 mb-6">
                    <h3 className="text-teal font-lovelo text-3xl uppercase tracking-widest">Portafolio</h3>
                    <p className="text-sand/60 font-Montserrat mt-2 text-sm uppercase tracking-widest">Explora nuestros trabajos recientes.</p>
                    <FilterPills />
                </div>

                <motion.div
                    drag="x"
                    dragConstraints={{
                        left: -(filteredItems.length * (window.innerWidth * 0.82)),
                        right: 0
                    }}
                    dragElastic={0.1}
                    className="flex gap-4 px-4 w-max cursor-grab active:cursor-grabbing"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="relative w-[78vw] aspect-[16/9] group overflow-hidden bg-black/50 flex-shrink-0 rounded-sm"
                            >
                                {item.mediaType === "video" ? (
                                    <video src={item.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                ) : (
                                    <img src={item.mediaUrl} alt={item.title || "Portfolio"} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute bottom-4 left-4 flex flex-col pointer-events-none">
                                    {item.projectName && (
                                        <span className="text-terracotta font-Montserrat text-[10px] uppercase font-bold tracking-widest mb-1 drop-shadow-md">{item.projectName}</span>
                                    )}
                                    {item.title && (
                                        <h4 className="text-white font-lovelo text-lg drop-shadow-lg leading-tight">{item.title}</h4>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </section>
        );
    }

    // ─── Desktop Mode: scroll-linked parallax ────────────────────────────────────
    return (
        <section
            ref={targetRef}
            className="relative w-full h-[150vh] bg-black"
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center">
                <div className="px-12 lg:px-24 mb-8">
                    <h3 className="text-teal font-lovelo text-4xl uppercase tracking-widest">Portafolio</h3>
                    <p className="text-sand/60 font-Montserrat mt-2 text-sm uppercase tracking-widest leading-relaxed max-w-2xl">Explora nuestros trabajos recientes.</p>
                    <FilterPills />
                </div>

                <motion.div style={{ x }} className="flex gap-8 px-12 lg:px-24 min-w-max">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="relative w-[70vw] md:w-[50vw] lg:w-[40vw] aspect-[16/9] group overflow-hidden bg-black/50"
                            >
                                {item.mediaType === "video" ? (
                                    <video src={item.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                ) : (
                                    <img src={item.mediaUrl} alt={item.title || "Portfolio"} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                )}
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-500" />

                                <div className="absolute bottom-6 left-6 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    {item.projectName && (
                                        <span className="text-terracotta font-Montserrat text-[10px] uppercase font-bold tracking-widest mb-1 drop-shadow-md">{item.projectName}</span>
                                    )}
                                    {item.title && (
                                        <h4 className="text-white font-lovelo text-2xl drop-shadow-lg leading-tight">{item.title}</h4>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
