import { motion, useReducedMotion } from "framer-motion";
import AnimatedStoneSequence from "./AnimatedStoneSequence";

const CONCENTRIC_ARCS = [
  "M 100 300 Q 250 50 400 300",
  "M 80 310 Q 250 30 420 310",
  "M 60 320 Q 250 10 440 320",
];

export default function HeroBackdropNuwa() {
  const reduced = useReducedMotion();

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <svg
        viewBox="0 0 500 350"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Point grid dots */}
        {Array.from({ length: 15 }).map((_, i) => (
          <circle
            key={`dot-${i}`}
            cx={50 + (i % 5) * 100}
            cy={40 + Math.floor(i / 5) * 110}
            r={1}
            fill="#2F7F7A"
            opacity={0.08}
          />
        ))}

        {/* Concentric broken arcs (repairing the sky) */}
        {CONCENTRIC_ARCS.map((d, i) => (
          <motion.path
            key={`conc-${i}`}
            d={d}
            stroke="#2F7F7A"
            strokeWidth={0.6}
            fill="none"
            strokeDasharray={i === 0 ? "6 4" : i === 1 ? "8 6" : "4 8"}
            animate={
              reduced
                ? { opacity: 0.2 }
                : {
                    opacity: [0.15, 0.35, 0.15],
                  }
            }
            transition={
              reduced
                ? {}
                : {
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 6,
                  }
            }
          />
        ))}

        {/* Jade repair curve — draw-on */}
        <motion.path
          d="M 80 280 Q 200 120 320 160 Q 400 190 440 260"
          stroke="#2F7F7A"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Five-stone sequence on arc */}
        <AnimatedStoneSequence />
      </svg>
    </div>
  );
}
