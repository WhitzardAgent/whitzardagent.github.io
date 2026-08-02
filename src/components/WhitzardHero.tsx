import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import HeroBackdropWhitzard from "./HeroBackdropWhitzard";

const CHIPS = [
  "Runtime Protection",
  "Risk Evaluation",
  "Governance Evidence",
  "Security Monitoring",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function WhitzardHero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 75]);

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* Left: Text + CTAs */}
          <motion.div
            className="md:col-span-6"
            variants={containerVariants}
            initial={reduced ? "visible" : "hidden"}
            animate="visible"
          >
            {/* Logo badge */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-5">
              <img
                src="/assets/logo/whitzard_logo.png"
                alt=""
                className="w-8 h-8 rounded"
              />
              <span className="text-wz-teal text-xs font-medium uppercase tracking-wide">
                AI Safety Infrastructure
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-wz-ink font-semibold tracking-tight mb-5"
              style={{ fontSize: "var(--text-hero)", lineHeight: 1.05 }}
            >
              Whitzard{" "}
              <span
                className="text-wz-muted font-normal"
                style={{ fontSize: "0.45em" }}
              >
                白泽
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-wz-body text-xl md:text-2xl leading-relaxed mb-3 max-w-lg"
            >
              Building generalized safety infrastructure for frontier AI and
              agentic systems.
            </motion.p>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-wz-body text-base leading-relaxed mb-8 max-w-lg"
            >
              Whitzard develops intelligent safety modules that can be deployed
              across real-world vertical scenarios: agent runtime protection,
              risk evaluation, security monitoring, and governance evidence. Our
              goal is to make advanced AI safety more practical, accessible, and
              useful for public safety.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <motion.a
                href="/agentguard"
                className="inline-flex items-center bg-wz-ink text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-wz-navy transition-colors no-underline"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                AgentGuard
              </motion.a>
              <motion.a
                href="/nuwa"
                className="inline-flex items-center bg-white text-wz-ink border border-wz-hairline rounded-full px-5 py-2.5 text-sm font-semibold hover:border-wz-border-strong transition-colors no-underline"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Nuwa
              </motion.a>
            </motion.div>

            {/* Floating capability chips (mobile: inline, desktop: part of right visual) */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 mt-6 md:hidden"
            >
              {CHIPS.map((label, i) => (
                <span
                  key={label}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-wz-panel-blue/40 text-wz-blue border border-wz-hairline"
                >
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Animated visual */}
          <motion.div
            className="md:col-span-6 hidden md:block relative"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={reduced ? {} : { y: parallaxY }}
          >
            <HeroBackdropWhitzard />

            {/* Floating capability chips — absolute positioned over SVG */}
            {CHIPS.map((label, i) => (
              <motion.span
                key={label}
                className="absolute text-xs font-medium px-3 py-1 rounded-full bg-white/90 text-wz-blue border border-wz-hairline backdrop-blur-sm"
                style={{
                  top: `${15 + i * 22}%`,
                  right: i % 2 === 0 ? "5%" : "15%",
                }}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        y: [0, -6, 0],
                      }
                }
                transition={
                  reduced
                    ? {}
                    : {
                        opacity: { duration: 0.5, delay: 0.6 + i * 0.15 },
                        y: {
                          duration: 8 + i,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 2,
                        },
                      }
                }
                whileHover={{ scale: 1.05, borderColor: "#164A8B" }}
              >
                {label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
