"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.33, 1, 0.68, 1],
        }}
        className="flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
