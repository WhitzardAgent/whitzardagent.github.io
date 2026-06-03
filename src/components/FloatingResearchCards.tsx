import { motion, useReducedMotion } from "framer-motion";

const CARDS = [
  {
    title: "Autonomy Risks",
    desc: "Self-replication & resource acquisition",
    x: "55%",
    y: "12%",
  },
  {
    title: "Agent Safety",
    desc: "Behavioral safety & runtime defense",
    x: "10%",
    y: "50%",
  },
  {
    title: "Evaluation",
    desc: "Benchmarks & risk assessment",
    x: "65%",
    y: "70%",
  },
];

export default function FloatingResearchCards() {
  const reduced = useReducedMotion();

  return (
    <>
      {CARDS.map((card, i) => (
        <motion.div
          key={card.title}
          className="absolute bg-nw-jade-pale/80 border border-nw-hairline rounded-lg px-3 py-2 backdrop-blur-sm hidden md:block"
          style={{ left: card.x, top: card.y, maxWidth: 140 }}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={
            reduced
              ? { opacity: 1, y: 0 }
              : {
                  opacity: 1,
                  y: [0, -4, 0],
                }
          }
          transition={
            reduced
              ? {}
              : {
                  opacity: { duration: 0.5, delay: 0.7 + i * 0.15 },
                  y: {
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 3,
                  },
                }
          }
          whileHover={{
            y: -6,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <p className="text-nw-ink font-semibold text-xs mb-0.5">
            {card.title}
          </p>
          <p className="text-nw-muted text-[10px] leading-snug">{card.desc}</p>
        </motion.div>
      ))}
    </>
  );
}
