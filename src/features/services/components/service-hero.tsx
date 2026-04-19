import { motion } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const ServiceHero = () => {
  return (
    <section className="px-6 md:px-10 py-24 max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="max-w-3xl"
      >
        <motion.p
          variants={item}
          className="text-xs uppercase tracking-[0.25em] text-white/40 mb-4"
        >
          Services
        </motion.p>

        <motion.h1
          variants={item}
          className="font-black leading-none"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontFamily: "var(--font-display)",
          }}
        >
          Crafted Visual
          <br />
          Experiences
          <span className="text-accent-red">*</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 text-white/50 text-lg leading-relaxed"
        >
          Every session is intentionally designed — from concept to final
          delivery — to create imagery that feels elevated, personal, and
          unforgettable.
        </motion.p>
      </motion.div>
    </section>
  );
};
