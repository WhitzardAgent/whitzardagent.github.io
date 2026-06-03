import { motion, useReducedMotion } from "framer-motion";

const STONES = [
  { cx: 120, cy: 240, color: "#1B2430", label: "Ink" },
  { cx: 180, cy: 200, color: "#5CA89B", label: "Jade" },
  { cx: 250, cy: 175, color: "#B35A4A", label: "Vermilion" },
  { cx: 320, cy: 200, color: "#C7A46A", label: "Ochre" },
  { cx: 380, cy: 240, color: "#E8E2D3", label: "Ivory" },
];

/** Diamond shape centered at (0,0) with given size */
function Diamond({ size = 10 }: { size?: number }) {
  const half = size / 2;
  return <polygon points={`0,${-half} ${half},0 0,${half} ${-half},0`} />;
}

export default function AnimatedStoneSequence() {
  const reduced = useReducedMotion();

  return (
    <g>
      {/* Arc path the stones sit on */}
      <motion.path
        d="M 80 280 Q 200 120 320 160 Q 400 190 440 260"
        stroke="#2F7F7A"
        strokeWidth={1}
        fill="none"
        strokeDasharray="4 4"
        opacity={0.3}
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Five colored stones */}
      {STONES.map((stone, i) => (
        <motion.g
          key={stone.label}
          style={{ transformOrigin: `${stone.cx}px ${stone.cy}px` }}
          initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          animate={
            reduced
              ? { opacity: 1, scale: 1 }
              : {
                  opacity: [0.85, 1, 0.85],
                  scale: [0.95, 1.05, 0.95],
                }
          }
          transition={
            reduced
              ? { duration: 0 }
              : {
                  opacity: { duration: 6, repeat: Infinity, delay: i * 1.2, ease: "easeInOut" },
                  scale: {
                    duration: 6,
                    repeat: Infinity,
                    delay: i * 1.2,
                    ease: "easeInOut",
                  },
                }
          }
          transform={`translate(${stone.cx}, ${stone.cy})`}
        >
          <Diamond size={12} />
          <motion.path
            d={`M 0 -6 L 6 0 L 0 6 L -6 0 Z`}
            fill={stone.color}
            stroke={stone.color}
            strokeWidth={0.5}
            whileHover={{
              scale: 1.4,
              filter: `drop-shadow(0 0 6px ${stone.color})`,
            }}
            style={{ cursor: "pointer" }}
          />
        </motion.g>
      ))}
    </g>
  );
}
