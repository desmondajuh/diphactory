"use client";

import { motion } from "framer-motion";
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

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      {/* Grain */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero */}
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

      {/* Services Grid */}
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

      {/* CTA */}
      <section className="px-6 md:px-10 pb-32 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-10"
        >
          <h2
            className="font-black"
            style={{
              fontSize: "clamp(2rem,5vw,3rem)",
              fontFamily: "var(--font-display)",
            }}
          >
            Let’s Create Something
            <br />
            Exceptional
            <span className="text-accent-red">*</span>
          </h2>

          <p className="mt-4 text-white/50">
            Whether you&apos;re building a brand, capturing a moment, or telling
            a story — your vision deserves to be executed at the highest level.
          </p>

          <Link
            href="/booking"
            className="inline-flex mt-8 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black hover:bg-white/90 transition-all"
          >
            Book a Session
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
