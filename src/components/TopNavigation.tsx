"use client";

import { Sector } from "@/hooks/useAgencyData";
import {
    Home, Hotel, UtensilsCrossed, Dumbbell, Ship, PartyPopper,
    Camera, Briefcase, Coffee, Waves, Music, Star, Globe, Zap,
    Heart, Compass, Mountain, Sun, Moon, Wind, Anchor, Bike,
    Car, Trophy, Film, Mic, Palette, Circle
} from "lucide-react";
import clsx from "clsx";

// Mapa completo de nombre → componente icono. Añade más según necesites.
export const ICON_MAP: Record<string, React.ComponentType<{ strokeWidth?: number; className?: string }>> = {
    Home, Hotel, UtensilsCrossed, Dumbbell, Ship, PartyPopper,
    Camera, Briefcase, Coffee, Waves, Music, Star, Globe, Zap,
    Heart, Compass, Mountain, Sun, Moon, Wind, Anchor, Bike,
    Car, Trophy, Film, Mic, Palette, Circle,
};

export default function TopNavigation({
    sectors,
    activeIndex,
    setActiveIndex,
}: {
    sectors: Sector[];
    activeIndex: number;
    setActiveIndex: (idx: number) => void;
}) {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-center mix-blend-difference pointer-events-none">
            <div className="flex gap-8 items-center bg-transparent pointer-events-auto">
                {sectors.map((sector, idx) => {
                    const IconComponent = ICON_MAP[sector.icon ?? ""] ?? Circle;
                    const isActive = idx === activeIndex;

                    return (
                        <button
                            key={sector.id}
                            onClick={() => setActiveIndex(idx)}
                            className="relative group p-2 outline-none"
                            aria-label={`Ir a ${sector.title}`}
                        >
                            <IconComponent
                                strokeWidth={isActive ? 2.5 : 1.5}
                                className={clsx(
                                    "w-5 h-5 transition-all duration-300",
                                    isActive
                                        ? "text-terracotta scale-125"
                                        : "text-sand/50 hover:text-sand/90 hover:scale-110"
                                )}
                            />
                            {/* Tooltip on hover */}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-Montserrat font-semibold tracking-widest text-sand uppercase pointer-events-none">
                                {sector.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
