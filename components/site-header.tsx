"use client";

import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/data/portfolio";

const navItems = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Tools", href: "#tools" },
  { label: "Playground", href: "#playground" },
  { label: "Contact", href: "#contact" }
] as const;

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? latest;
    if (latest < 80) {
      setHidden(false);
      return;
    }

    setHidden(latest > previous);
    if (latest > previous) {
      setMobileMenuOpen(false); // Auto close mobile menu on scroll down
    }
  });

  return (
    <>
      <motion.header
        className="site-header"
        animate={{ y: hidden ? -110 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="site-header-inner">
          <a className="site-brand" href="#top" aria-label={profile.name}>
            <span className="site-brand-logo site-brand-logo-light">
              <Image
                src="/yb-logo-light.png?v=3"
                alt={profile.name}
                fill
                sizes="120px"
                className="site-brand-image"
              />
            </span>
            <span className="site-brand-logo site-brand-logo-dark">
              <Image
                src="/yb-logo-dark.png?v=3"
                alt={profile.name}
                fill
                sizes="60px"
                className="site-brand-image"
              />
            </span>
          </a>

          <nav className="site-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                className="site-nav-link"
                href={item.href}
                key={item.label}
              >
                <span>{item.label}</span>
                <span className="site-nav-underline" />
              </a>
            ))}
          </nav>

          <div className="site-actions">
            <ThemeToggle />
            <button
              type="button"
              className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              data-cursor="Toggle"
            >
              <span className="hamburger-line line-1" />
              <span className="hamburger-line line-2" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu-links">
              {navItems.map((item) => (
                <a
                  href={item.href}
                  key={item.label}
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
