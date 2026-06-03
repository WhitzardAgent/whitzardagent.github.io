import { motion, useReducedMotion } from "framer-motion";

const nodes = [
  { cx: 80, cy: 60, delay: 0 },
  { cx: 200, cy: 40, delay: 0.8 },
  { cx: 320, cy: 80, delay: 1.6 },
  { cx: 140, cy: 180, delay: 2.4 },
  { cx: 260, cy: 200, delay: 3.2 },
  { cx: 380, cy: 160, delay: 4.0 },
];

const COLORS = ["#164A8B", "#2F7F7A", "#164A8B", "#2F7F7A", "#164A8B", "#2F7F7A"];

export default function SignalNodes() {
  const reduced = useReducedMotion();

  return (
    <g>
      {nodes.map((node, i) => (
        <g key={i}>
          {/* Outer glow ring */}
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r={reduced ? 8 : 6}
            fill="none"
            stroke={COLORS[i]}
            strokeWidth={0.5}
            opacity={reduced ? 0.2 : undefined}
            animate={
              reduced
                ? { opacity: 0.2 }
                : {
                    opacity: [0, 0.4, 0],
                    scale: [0.8, 1.5, 0.8],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: node.delay,
              ease: "easeInOut",
            }}
          />
          {/* Core dot */}
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r={3}
            fill={COLORS[i]}
            opacity={reduced ? 0.7 : undefined}
            animate={
              reduced
                ? { opacity: 0.7 }
                : {
                    opacity: [0.4, 1, 0.4],
                    scale: [0.85, 1.15, 0.85],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: node.delay,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.5,
              filter: `drop-shadow(0 0 6px ${COLORS[i]})`,
            }}
            style={{ cursor: "pointer" }}
          />
        </g>
      ))}
    </g>
  );
}
