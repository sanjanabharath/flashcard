"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useAnimation } from "framer-motion";

// Note: Framer Motion is not installed yet, we'll add it to package.json

export default function HeroCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const flipInterval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 3000);

    return () => clearInterval(flipInterval);
  }, []);

  useEffect(() => {
    controls.start({
      rotateY: isFlipped ? 180 : 0,
      transition: { duration: 0.6, ease: "easeInOut" }
    });
  }, [isFlipped, controls]);

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <motion.div
        className="relative w-full h-64 preserve-3d"
        animate={controls}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <Card className="absolute w-full h-full backface-hidden shadow-xl border-2 border-orange-300 dark:border-orange-700">
          <CardContent className="p-6 h-full flex flex-col items-center justify-center gap-4">
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              What is the capital of France?
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tap to flip
            </div>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full h-full backface-hidden shadow-xl border-2 border-orange-300 dark:border-orange-700" 
              style={{ transform: "rotateY(180deg)" }}>
          <CardContent className="p-6 h-full flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-900">
            <div className="text-lg font-bold text-orange-600 dark:text-orange-300">
              Paris
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tap to flip
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}