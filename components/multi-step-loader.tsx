"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { loaderSteps } from "@/data/portfolio";

export function MultiStepLoader() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const seen = window.sessionStorage.getItem("portfolio-loader-seen");

    if (seen) {
      return;
    }

    window.sessionStorage.setItem("portfolio-loader-seen", "1");
    setOpen(true);

    const stepTimer = window.setInterval(() => {
      setIndex((current) => {
        if (current >= loaderSteps.length - 1) {
          return current;
        }

        return current + 1;
      });
    }, 360);

    const closeTimer = window.setTimeout(() => {
      setOpen(false);
    }, 1650);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(closeTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="loader-card">
            <span className="meta">Initial load</span>
            <div className="loader-steps">
              {loaderSteps.map((step, stepIndex) => (
                <div
                  className={`loader-step ${stepIndex <= index ? "loader-step-active" : ""}`}
                  key={step}
                >
                  <span className="loader-step-index">0{stepIndex + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
