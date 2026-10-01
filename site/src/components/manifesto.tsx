"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { manifesto } from "@/data/content";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = manifesto.split(" ");

  return (
    <section className="manifesto" ref={ref} aria-label="Manifiesto">
      <p>
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]} />
        ))}
      </p>
    </section>
  );
}
