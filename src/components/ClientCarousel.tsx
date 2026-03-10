"use client";

import { ClientLogo } from "@/hooks/useAgencyData";
import { motion } from "framer-motion";

export default function ClientCarousel({ clients }: { clients?: ClientLogo[] }) {
    if (!clients || clients.length === 0) return null;

    // Clone array to create a seamless infinite loop purely through CSS / Framer Motion
    const duplicatedClients = [...clients, ...clients, ...clients];

    return (
        <div className="w-full overflow-hidden mt-16 relative py-8">
            {/* Edge gradient masks for smooth fade in/out */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex gap-16 md:gap-32 w-max"
                animate={{
                    x: ["0%", "-33.33%"], // Move exactly one third of the duplicated list to be seamless
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 15, // Speed of the marquee
                }}
            >
                {duplicatedClients.map((client, index) => (
                    <div key={`${client.id}-${index}`} className="flex flex-col items-center gap-4 opacity-60 hover:opacity-100 transition-opacity duration-300">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-sand/10 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 bg-white/5">
                            <img src={client.logoUrl} alt={client.brandName} className="w-full h-full object-cover mix-blend-screen" />
                        </div>
                        <span className="font-Montserrat font-semibold uppercase tracking-widest text-[10px] md:text-xs text-sand">{client.brandName}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
