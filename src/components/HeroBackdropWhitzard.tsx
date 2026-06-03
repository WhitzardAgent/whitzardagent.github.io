import { motion, useReducedMotion } from "framer-motion";
import SignalNodes from "./SignalNodes";

const FLOW_LINES = [
  "M 60 120 Q 140 60 220 100 Q 300 140 380 80",
  "M 100 200 Q 180 140 260 180 Q 340 220 400 160",
];

const ARC_PATHS = [
  "M 20 280 Q 120 20 250 60 Q 380 100 460 30",
  "M 40 320 Q 160 80 280 120 Q 400 160 480 60",
];

export default function HeroBackdropWhitzard() {
  const reduced = useReducedMotion();

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <svg
        viewBox="0 0 500 350"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Arc curves — slow drift */}
        <motion.g
          animate={reduced ? {} : { rotate: [0, 1.5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "250px 175px" }}
        >
          {ARC_PATHS.map((d, i) => (
            <path
              key={`arc-${i}`}
              d={d}
              stroke={i === 0 ? "#2F7F7A" : "#164A8B"}
              strokeWidth={0.8}
              fill="none"
              opacity={0.2 + i * 0.1}
            />
          ))}
        </motion.g>

        {/* Flow lines — animated dash */}
        {FLOW_LINES.map((d, i) => (
          <motion.path
            key={`flow-${i}`}
            d={d}
            stroke="#2F7F7A"
            strokeWidth={1}
            fill="none"
            strokeDasharray="8 4"
            opacity={0.35}
            animate={reduced ? {} : { strokeDashoffset: [0, -24] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5,
            }}
          />
        ))}

        {/* Point grid dots (subtle background) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={`dot-${i}`}
            cx={40 + (i % 4) * 120}
            cy={40 + Math.floor(i / 4) * 100}
            r={1}
            fill="#164A8B"
            opacity={0.1}
          />
        ))}

        {/* Signal nodes */}
        <SignalNodes />
      </svg>
    </div>
  );
}
