"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MotionSection } from "@/components/motion-section";
import { SectionHeader } from "@/components/section-header";
import { projectCards } from "@/data/portfolio";

function getCircularDistance(i: number, centerIndex: number, total: number) {
  let diff = i - centerIndex;
  while (diff < -total / 2) diff += total;
  while (diff > total / 2) diff -= total;
  return diff;
}

export function ProjectsSection() {
  const router = useRouter();
  const [centerIndex, setCenterIndex] = useState(0);
  const [loadingProject, setLoadingProject] = useState<string | null>(null);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  const total = projectCards.length;

  const goNext = () => setCenterIndex((current) => (current + 1) % total);
  const goPrev = () => setCenterIndex((current) => (current - 1 + total) % total);

  const handleDocs = (href: string, id: string) => {
    setLoadingProject(id);
    window.setTimeout(() => {
      router.push(href);
    }, 900);
  };

  return (
    <MotionSection className="section-shell" id="projects">
      <SectionHeader
        kicker="Projects"
        title="Selected builds, from product systems to infrastructure work."
        copy="A tight loop of projects, each reduced to the technical outcome that mattered most."
      />

      <div className="kinetic-carousel">
        <button
          type="button"
          className="carousel-nav carousel-nav-left"
          onClick={goPrev}
          aria-label="Previous project"
          data-cursor="Prev"
        >
          [ PREV ]
        </button>

        <div
          className="kinetic-stage"
          onWheel={(event) => {
            const now = Date.now();
            if (now - lastScrollTime < 1100) {
              return; // Cooldown throttle for smooth deliberate movement
            }

            const deltaY = event.deltaY;
            const deltaX = event.deltaX;

            if (Math.abs(deltaY) > Math.abs(deltaX)) {
              if (Math.abs(deltaY) > 35) { // Substantial threshold to filter accidental swipes
                if (deltaY > 0) {
                  goNext();
                  setLastScrollTime(now);
                } else {
                  goPrev();
                  setLastScrollTime(now);
                }
              }
            } else if (Math.abs(deltaX) > 35) {
              if (deltaX > 0) {
                goNext();
                setLastScrollTime(now);
              } else {
                goPrev();
                setLastScrollTime(now);
              }
            }
          }}
        >
          {projectCards.map((card, index) => {
            const diff = getCircularDistance(index, centerIndex, total);
            const isCenter = diff === 0;
            const isSide = Math.abs(diff) === 1;

            return (
              <motion.article
                className={`kinetic-card kinetic-card-${isCenter ? "center" : diff < 0 ? "left" : "right"}`}
                key={card.id}
                style={{ ["--project-accent" as string]: card.accent }}
                animate={{
                  opacity: isCenter ? 1 : isSide ? 0.35 : 0,
                  scale: isCenter ? 1.15 : isSide ? 0.8 : 0.6,
                  x: `${diff * 48}%`,
                  zIndex: isCenter ? 3 : isSide ? 2 : 1,
                  filter: isCenter ? "blur(0px)" : isSide ? "blur(0.8px)" : "blur(2px)",
                  pointerEvents: isCenter ? "auto" : isSide ? "auto" : "none"
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 28,
                  mass: 0.8
                }}
                whileHover={isCenter ? { scale: 1.13 } : undefined}
                onClick={() => {
                  if (diff === -1) goPrev();
                  if (diff === 1) goNext();
                }}
              >
                <div className="kinetic-card-body">
                  <div>
                    <span className="meta" style={{ color: "var(--text-soft)" }}>{card.category}</span>
                    <h3 className="kinetic-card-title">{card.name}</h3>
                  </div>

                  <p className="kinetic-card-copy">{card.description}</p>

                  <div className="kinetic-card-actions">
                    <a
                      className="kinetic-trigger"
                      href={card.liveHref}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="Live"
                      onClick={(event) => event.stopPropagation()}
                    >
                      [ LIVE ]
                    </a>
                    <a
                      className="kinetic-trigger"
                      href={card.codeHref}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="Code"
                      onClick={(event) => event.stopPropagation()}
                    >
                      [ CODE ]
                    </a>
                    <button
                      type="button"
                      className="kinetic-trigger"
                      data-cursor="Docs"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDocs(card.docsHref, card.id);
                      }}
                    >
                      [ READ_MORE ]
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <button
          type="button"
          className="carousel-nav carousel-nav-right"
          onClick={goNext}
          aria-label="Next project"
          data-cursor="Next"
        >
          [ NEXT ]
        </button>
      </div>

      <div className="projects-footer">
        <div className="projects-note">Preview loop loaded. Full grid will live on the projects subdomain.</div>
      </div>

      <AnimatePresence>
        {loadingProject ? (
          <motion.div
            className="system-error-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="system-error-card"
              initial={{ scale: 0.96, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
            >
              <span className="meta">System loading error</span>
              <div className="system-error-code">DOCS_MODULE_NOT_READY</div>
              <p>Escalating to temporary construction route.</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MotionSection>
  );
}
