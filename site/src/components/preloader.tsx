"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setShow(false), reduce ? 0 : 900);
    const safety = setTimeout(() => document.documentElement.setAttribute("data-loaded", ""), 2400);
    return () => { clearTimeout(t); clearTimeout(safety); };
  }, []);

  return (
    <AnimatePresence onExitComplete={() => document.documentElement.setAttribute("data-loaded", "")}>
      {show && (
        <motion.div
          className="preloader"
          aria-hidden="true"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="preloader-mark"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            LAODENIM
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
