"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ParticleMesh } from "@/components/particle-mesh";
import { contactLinks, profile } from "@/data/portfolio";
import { fadeUp } from "@/lib/utils";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="hero" id="top">
      <ParticleMesh />
      <div className="hero-backdrop" />

      <div className="section-shell hero-content">
        <motion.div
          className="hero-copy"
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? undefined : "visible"}
        >
          <motion.h1 className="hero-title" variants={fadeUp(0.05)}>
            {profile.name}
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp(0.08)}>
            {profile.title}
          </motion.p>

          <motion.p className="hero-ethos" variants={fadeUp(0.12)}>
            {profile.ethos}
          </motion.p>

          <motion.div className="hero-actions hero-actions-raw" variants={fadeUp(0.16)}>
            <a
              className="hero-trigger hero-trigger-emerald"
              href={contactLinks.calendly}
              target="_blank"
              rel="noreferrer"
              data-cursor="Execute"
            >
              [ INITIATE_CONSULTATION ]
            </a>
            <a
              className="hero-trigger hero-trigger-amber"
              href={contactLinks.resume}
              download
              data-cursor="Spec"
            >
              [ VIEW_TECHNICAL_SPEC ]
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Timestamp-style corner location metadata */}
      <motion.div
        className="hero-location-corner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <span>SYS_LOC // {profile.location.toUpperCase().replace(", ", "_")}</span>
      </motion.div>
    </section>
  );
}
