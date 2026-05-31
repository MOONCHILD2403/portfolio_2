"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { experiences } from "@/data/portfolio";

export function TimelineBeam() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const updateHeight = () => {
      if (ref.current) {
        setHeight(ref.current.scrollHeight || ref.current.getBoundingClientRect().height);
      }
    };

    // Initial measurement
    updateHeight();

    // ResizeObserver tracks dynamic updates cleanly
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    resizeObserver.observe(ref.current);

    // Event listeners to handle lazy-loaded elements
    window.addEventListener("load", updateHeight);
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("load", updateHeight);
      window.removeEventListener("resize", updateHeight);
    };
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 30%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="timeline-shell w-full font-sans relative">
      <div ref={ref} className="relative w-full pb-20">
        {experiences.map((experience) => (
          <article
            key={`${experience.company}-${experience.duration}`}
            className="timeline-entry"
            style={{ ["--entry-accent" as string]: experience.accent }}
          >
            {/* Sticky Marker Block */}
            <div className="timeline-header-block z-40">
              {/* Timeline Dot */}
              <div 
                className="timeline-dot"
                style={{
                  backgroundColor: "var(--entry-accent)",
                  boxShadow: "0 0 0 8px color-mix(in srgb, var(--entry-accent) 16%, transparent)"
                }}
              />
              <div className="timeline-sticky">
                <span className="meta">{experience.duration}</span>
                <a
                  href={experience.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="timeline-company-link block"
                  data-cursor="Linkedin"
                >
                  <h3 className="timeline-company">{experience.company}</h3>
                </a>
                <p className="timeline-role">{experience.role}</p>
              </div>
            </div>

            {/* Content card */}
            <div className="relative w-full">
              <div className="timeline-card">
                <p className="timeline-summary">{experience.summary}</p>
                <ul className="timeline-list">
                  {experience.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}

        {/* Vertical Progress Line & Scroll Beam */}
        <div
          style={{
            height: height + "px",
          }}
          className="timeline-progress-track"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="timeline-progress-beam"
          />
        </div>
      </div>
    </div>
  );
}
