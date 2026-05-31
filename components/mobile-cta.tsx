"use client";

import { useEffect, useState } from "react";

export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`mobile-cta-pill ${visible ? "mobile-cta-pill-visible" : ""}`}
      aria-hidden="true"
    >
      <a
        href="mailto:yashasbajaj2004@gmail.com?subject=Proposal%20%2F%20Collaboration"
        className="mobile-cta-btn mobile-cta-btn-primary"
        data-cursor="Email"
      >
        [ MAIL ]
      </a>
      <div className="mobile-cta-divider" />
      <a
        href="/Yashas-Bajaj-Resume.pdf"
        download
        className="mobile-cta-btn"
        data-cursor="Spec"
      >
        [ SPEC ]
      </a>
    </div>
  );
}
