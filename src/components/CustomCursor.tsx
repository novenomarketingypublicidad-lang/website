"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor({ activeIndex }: { activeIndex: number }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const springX = useSpring(0, { stiffness: 500, damping: 28 });
    const springY = useSpring(0, { stiffness: 500, damping: 28 });

    // Map indexes to the static N-O-V-E-N-O letters
    const staticLetters = ["N", "O", "V", "E", "N", "O"];
    const currentLetter = staticLetters[activeIndex] || "N";

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            springX.set(e.clientX);
            springY.set(e.clientY);
        };

        window.addEventListener("mousemove", updateMousePosition);
        return () => window.removeEventListener("mousemove", updateMousePosition);
    }, [springX, springY]);

    return (
        <div className="hidden md:block">
        <motion.div
            className="fixed top-0 left-0 w-12 h-12 rounded-full border border-sand bg-foreground/10 backdrop-blur-md mix-blend-difference pointer-events-none z-[9999] flex items-center justify-center text-sand font-lovelo text-xl pointer-events-none"
            style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
            }}
        >
            <motion.span
                key={currentLetter}
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, type: "spring" }}
            >
                {currentLetter}
            </motion.span>
        </motion.div>
        </div>
    );
}
