import { motion } from "motion/react";
import Link from "next/link";
import { services } from "@/lib/data/services";

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

export const ServicesGrid = () => {
  return (
    <section className="px-6 md:px-10 pb-24 max-w-6xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-2"
      >
        {services.map((service) => (
          <motion.div
            key={service.title}
            variants={item}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/25 hover:bg-white/10"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <span className="text-sm text-white/60">{service.price}</span>
            </div>

            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              {service.description}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <Link
                // href="/booking"
                href={`/services/${service.slug}`}
                className="text-sm font-semibold text-white/60 group-hover:text-white transition-colors"
              >
                Learn More →
              </Link>

              <div className="h-px w-10 bg-white/20 group-hover:w-16 transition-all duration-300" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
