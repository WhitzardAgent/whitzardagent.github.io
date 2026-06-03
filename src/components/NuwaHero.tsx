import { motion, useReducedMotion } from "framer-motion";
import HeroBackdropNuwa from "./HeroBackdropNuwa";
import FloatingResearchCards from "./FloatingResearchCards";

const CONCEPTS = [
  { title: "Repair", desc: "Identify and fix safety gaps" },
  { title: "Boundary", desc: "Define safe operational limits" },
  { title: "Prudence", desc: "Cautious evaluation of risks" },
  { title: "Guided", desc: "Evidence-based governance" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function NuwaHero() {
  const reduced = useReducedMotion();

  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* Left: Text + CTAs */}
          <motion.div
            className="md:col-span-6 max-w-2xl"
            variants={containerVariants}
            initial={reduced ? "visible" : "hidden"}
            animate="visible"
          >
            {/* Mini arc SVG */}
            <motion.div variants={itemVariants} className="mb-6">
              <svg
                width="48"
                height="20"
                viewBox="0 0 48 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 16 Q24 -4 46 16"
                  stroke="#2F7F7A"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="3 2"
                />
                <circle cx="14" cy="10" r="2.5" fill="#5CA89B" />
                <circle cx="24" cy="6" r="2.5" fill="#B35A4A" />
                <circle cx="34" cy="10" r="2.5" fill="#C7A46A" />
              </svg>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-nw-ink font-semibold tracking-tight mb-5"
              style={{ fontSize: "var(--text-hero)", lineHeight: 1.05 }}
            >
              Nuwa{" "}
              <span
                className="text-nw-muted font-normal"
                style={{ fontSize: "0.4em" }}
              >
                女娲
              </span>
              <br />
              <span style={{ fontSize: "0.45em" }}>
                Frontier AI Safety Lab
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-nw-body text-lg md:text-xl leading-relaxed mb-3"
            >
              Transparent, third-party, open infrastructure for frontier AI
              safety evaluation and governance.
            </motion.p>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-nw-muted text-base leading-relaxed mb-3 max-w-xl"
            >
              Nuwa studies frontier AI risks, agent safety, autonomy risks,
              deception, scheming, and loss-of-control. Supported by Whitzard,
              Nuwa develops open evaluation frameworks, benchmarks, technical
              notes, and governance evidence for safe and controllable AI.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-nw-jade text-sm font-medium mb-7"
            >
              Supported by Whitzard
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 mb-8"
            >
              <motion.a
                href="/research"
                className="inline-flex items-center bg-nw-ink text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-nw-deep-blue transition-colors no-underline"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Read Research
              </motion.a>
              <motion.a
                href="https://nuwasafety.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-nw-ink border border-nw-hairline rounded-full px-5 py-2.5 text-sm font-semibold hover:border-nw-subtle transition-colors no-underline"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe to Nuwa Brief
              </motion.a>
            </motion.div>

            {/* Conceptual cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-2"
            >
              {CONCEPTS.map((c) => (
                <div
                  key={c.title}
                  className="bg-nw-jade-pale/50 border border-nw-hairline rounded-lg px-3 py-2"
                >
                  <p className="text-nw-ink font-semibold text-xs">
                    {c.title}
                  </p>
                  <p className="text-nw-muted text-[10px] leading-snug">
                    {c.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Animated visual */}
          <motion.div
            className="md:col-span-6 hidden md:block relative"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <HeroBackdropNuwa />
            <FloatingResearchCards />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
