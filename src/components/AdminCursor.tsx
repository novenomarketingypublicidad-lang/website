"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export default function AdminCursor() {
    const [letterIndex, setLetterIndex] = useState(0);
    const springX = useSpring(-100, { stiffness: 500, damping: 28 }); // Start off-screen
    const springY = useSpring(-100, { stiffness: 500, damping: 28 });

    // Use refs for high-frequency coordinate math without triggering unnecessary React renders
    const lastPos = useRef({ x: 0, y: 0 });
    const accumulatedDistance = useRef(0);

    const THRESHOLD = 100; // Pixels distance threshold to cycle the letter
    const letters = ["N", "O", "V", "E", "N", "O"];
    const currentLetter = letters[letterIndex];

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            springX.set(clientX);
            springY.set(clientY);

            // Calculate Euclidean distance since last poll
            if (lastPos.current.x !== 0 || lastPos.current.y !== 0) {
                const dx = clientX - lastPos.current.x;
                const dy = clientY - lastPos.current.y;
                const distance = Math.hypot(dx, dy);

                accumulatedDistance.current += distance;

                if (accumulatedDistance.current >= THRESHOLD) {
                    setLetterIndex((prev) => (prev + 1) % letters.length);
                    // Subtract threshold to carry over modulo distance smoothly, or reset to 0
                    accumulatedDistance.current = 0;
                }
            }

            lastPos.current = { x: clientX, y: clientY };
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [springX, springY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-12 h-12 rounded-full border border-terracotta bg-terracotta/5 backdrop-blur-sm pointer-events-none z-[999999] flex items-center justify-center text-terracotta font-lovelo text-xl shadow-sm"
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
    );
}
