"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { contactLinks } from "@/data/portfolio";

export function ContactSection() {
  const [purpose, setPurpose] = useState<"work" | "improvement">("work");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dispatching, setDispatching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !note) return;

    setDispatching(true);

    const subject = purpose === "work" 
      ? "Collaboration Proposal // Yashas Bajaj Portfolio" 
      : "Critique & Suggestion // Yashas Bajaj Portfolio";
      
    const body = `Return Coordinate: ${email}\n\nMessage Details:\n${note}\n\n---\nTransmission compiled via yashas.dev Transmission Deck.`;
    
    const mailtoUrl = `mailto:yashasbajaj2403@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.setTimeout(() => {
      setDispatching(false);
      setSubmitted(true);
      
      // Trigger the actual transmission redirection!
      window.location.href = mailtoUrl;

      setEmail("");
      setNote("");
    }, 1100);
  };

  return (
    <section className="section-shell" id="contact">
      <div className="contact-grid">
        <div className="contact-copy">
          <div>
            <span className="section-kicker">Contact</span>
            <h2 className="section-title">Send a note if there is something worth building.</h2>
            <p className="section-copy" style={{ marginTop: "1rem" }}>
              Email remains the cleanest, most standard starting point. If you prefer to jump straight to profiles,
              the raw system nodes are linked below.
            </p>
          </div>

          <div className="contact-actions" style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginTop: "1.5rem" }}>
            <a
              className="hero-link hero-link-primary"
              href={contactLinks.email}
              data-cursor="Email"
            >
              Send an Email
            </a>
            <a
              className="hero-link"
              href={contactLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="Linkedin"
            >
              LinkedIn Profile
            </a>
            <a
              className="hero-link"
              href={contactLinks.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="GitHub"
            >
              GitHub Node
            </a>
          </div>
        </div>

        {/* Suggestion & Work Connection Transmission Deck */}
        <div className="contact-deck-panel">
          <div className="deck-head">
            <span className="meta">Transmission Deck</span>
            <div className="deck-tabs">
              <button
                type="button"
                className={`deck-tab-btn ${purpose === "work" ? "deck-tab-active" : ""}`}
                onClick={() => { setPurpose("work"); setSubmitted(false); }}
                data-cursor="Collab"
              >
                [ WORK_COLLAB ]
              </button>
              <button
                type="button"
                className={`deck-tab-btn ${purpose === "improvement" ? "deck-tab-active" : ""}`}
                onClick={() => { setPurpose("improvement"); setSubmitted(false); }}
                data-cursor="Improve"
              >
                [ SUGGESTIONS ]
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="deck-success-msg"
              >
                <div className="success-code">TRANSMISSION_DISPATCHED // OK</div>
                <p className="playground-copy" style={{ margin: "0.5rem 0" }}>
                  {purpose === "work"
                    ? "Thank you for the proposal. The systems architecture queue will inspect your transmission and reply within 24 hours."
                    : "Your critique/suggestion has been compiled and logged. Constructive refinement keeps the engineering stack robust."}
                </p>
                <button
                  type="button"
                  className="section-inline-button"
                  style={{ marginTop: "1rem", alignSelf: "flex-start" }}
                  onClick={() => setSubmitted(false)}
                >
                  [ Send another node ]
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="deck-form"
              >
                <div className="deck-field">
                  <label htmlFor="deck-email" className="meta" style={{ marginBottom: "0.2rem" }}>Return coordinates (Email)</label>
                  <input
                    id="deck-email"
                    type="email"
                    placeholder="Enter your return email..."
                    className="deck-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="deck-field">
                  <label htmlFor="deck-note" className="meta" style={{ marginBottom: "0.2rem" }}>
                    {purpose === "work" ? "Collaboration Proposal Details" : "Suggestions for Improvement"}
                  </label>
                  <textarea
                    id="deck-note"
                    placeholder={
                      purpose === "work"
                        ? "Briefly outline your systems scale, constraints, budget, or timelines..."
                        : "Highlight any UX friction points, layout refinements, or code improvements..."
                    }
                    className="deck-textarea"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="deck-submit-btn"
                  disabled={dispatching || !email || !note}
                  data-cursor="Submit"
                >
                  {dispatching ? "[ DISPATCHING_TRANSMISSION... ]" : "[ DISPATCH_TRANSMISSION ]"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
