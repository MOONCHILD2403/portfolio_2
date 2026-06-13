"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

class RaveSynth {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private tempo = 120.0; // 120 BPM for Dance Till You're Dead Remix
  private audioCtx: AudioContext | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private bassFilter: BiquadFilterNode | null = null;

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (!this.audio) {
      this.audio = new Audio("/rave.mp3");
      this.audio.loop = true;
      this.audio.volume = 1.0; // Boosted volume
    } else {
      this.audio.volume = 1.0;
    }

    // Set up Web Audio context for bass boost
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      this.source = this.audioCtx.createMediaElementSource(this.audio);

      // Create a low-shelf filter for bass boost
      this.bassFilter = this.audioCtx.createBiquadFilter();
      this.bassFilter.type = "lowshelf";
      this.bassFilter.frequency.value = 150; // Boost frequencies below 150 Hz
      this.bassFilter.gain.value = 12; // Boost bass by +12 dB

      // Connect source -> bassFilter -> destination
      this.source.connect(this.bassFilter);
      this.bassFilter.connect(this.audioCtx.destination);
    }

    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }

    this.audio.play().catch(err => {
      console.error("Audio playback failed:", err);
    });

    // Dispatch the first beat immediately
    window.dispatchEvent(new CustomEvent("rave-beat"));

    const beatInterval = 60000 / this.tempo; // 500ms
    const scheduler = () => {
      if (!this.isPlaying) return;
      window.dispatchEvent(new CustomEvent("rave-beat"));
      this.timerId = window.setTimeout(scheduler, beatInterval);
    };
    this.timerId = window.setTimeout(scheduler, beatInterval);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if (this.audioCtx && this.audioCtx.state === "running") {
      this.audioCtx.suspend();
    }
  }
}

export function RaveParty() {
  const [active, setActive] = useState(false);
  const [beatPulse, setBeatPulse] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [scubaPositions, setScubaPositions] = useState<{ top: string; left: string }[]>([]);
  const synthRef = useRef<RaveSynth | null>(null);
  const timeoutRef = useRef<number | null>(null);

  if (!synthRef.current) {
    synthRef.current = new RaveSynth();
  }

  // Helper function to generate 50 random positions in a donut shape around the center (50%, 50%)
  // The cats must spawn outside the center 35% of the screen (radius >= 17.5%) and inside the center 80% of the screen (radius <= 40%).
  const generateRandomPositions = () => {
    return Array.from({ length: 50 }, () => {
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * 22.5 + 17.5; // radius between 17.5% and 40%
      return {
        top: `${50 + r * Math.sin(angle)}%`,
        left: `${50 + r * Math.cos(angle)}%`
      };
    });
  };

  useEffect(() => {
    const handleSetRave = (e: Event) => {
      const activeState = (e as CustomEvent).detail?.active ?? false;
      setActive(activeState);
      if (activeState) {
        setScubaPositions(generateRandomPositions());
        synthRef.current?.start();
      } else {
        synthRef.current?.stop();
        setBeatCount(0);
        setScubaPositions([]);
      }
    };

    const handleRaveBeat = () => {
      setBeatPulse(true);
      setBeatCount(prev => {
        const nextCount = prev + 1;
        setScubaPositions(generateRandomPositions());
        return nextCount;
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setBeatPulse(false);
      }, 140);
    };

    window.addEventListener("set-rave", handleSetRave);
    window.addEventListener("rave-beat", handleRaveBeat);
    return () => {
      window.removeEventListener("set-rave", handleSetRave);
      window.removeEventListener("rave-beat", handleRaveBeat);
      synthRef.current?.stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!active) return null;

  // Scuba counts sequence: 2 -> 4 -> 6 -> 10 -> 20 -> 50 -> 2
  const SCUBA_COUNTS = [2, 4, 6, 10, 20, 50];
  const visibleScubaCount = SCUBA_COUNTS[beatCount % SCUBA_COUNTS.length];

  return (
    <>
      <style>{`
        @keyframes rave-strobe {
          0% { background-color: rgba(255, 0, 128, 0.28); }
          10% { background-color: rgba(0, 0, 0, 0.0); }
          20% { background-color: rgba(0, 255, 255, 0.28); }
          30% { background-color: rgba(0, 0, 0, 0.0); }
          40% { background-color: rgba(0, 255, 0, 0.28); }
          50% { background-color: rgba(0, 0, 0, 0.0); }
          60% { background-color: rgba(255, 255, 0, 0.28); }
          70% { background-color: rgba(0, 0, 0, 0.0); }
          80% { background-color: rgba(128, 0, 255, 0.28); }
          90% { background-color: rgba(0, 0, 0, 0.0); }
          100% { background-color: rgba(255, 0, 128, 0.28); }
        }
        @keyframes laser-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .rave-overlay {
          animation: rave-strobe 0.12s infinite linear;
        }
        .laser-beam {
          position: absolute;
          width: 200%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #00ffff, #ff00ff, #00ffff, transparent);
          top: 50%;
          left: -50%;
          animation: laser-spin 2s infinite linear;
          opacity: 0.65;
          pointer-events: none;
        }
        .laser-beam-alt {
          animation: laser-spin 1.5s infinite linear reverse;
          background: linear-gradient(90deg, transparent, #ffff00, #00ff00, #ffff00, transparent);
        }
      `}</style>
      
      <div className="rave-overlay fixed inset-0 z-[30] pointer-events-none select-none overflow-hidden">
        {/* Lasers */}
        <div className="laser-beam" />
        <div className="laser-beam laser-beam-alt" />

        {/* Vibing Cats in all 4 Corners - Always Active */}
        <div 
          className={`absolute top-4 left-4 w-28 h-28 pointer-events-none transition-all duration-300 ease-out ${
            beatPulse ? "scale-110" : "scale-100"
          }`}
        >
          <img
            src="https://media.tenor.com/ULt1QoO_tc0AAAAj/cat-vibe-vibe-cat.gif"
            alt="Cat Vibe"
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,255,255,0.7)]"
          />
        </div>
        <div 
          className={`absolute top-4 right-4 w-28 h-28 pointer-events-none transition-all duration-300 ease-out ${
            beatPulse ? "scale-110" : "scale-100"
          }`}
        >
          <img
            src="https://media.tenor.com/ULt1QoO_tc0AAAAj/cat-vibe-vibe-cat.gif"
            alt="Cat Vibe"
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,0,255,0.7)]"
          />
        </div>
        <div 
          className={`absolute bottom-4 left-4 w-28 h-28 pointer-events-none transition-all duration-300 ease-out ${
            beatPulse ? "scale-110" : "scale-100"
          }`}
        >
          <img
            src="https://media.tenor.com/ULt1QoO_tc0AAAAj/cat-vibe-vibe-cat.gif"
            alt="Cat Vibe"
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,255,0,0.7)]"
          />
        </div>
        <div 
          className={`absolute bottom-4 right-4 w-28 h-28 pointer-events-none transition-all duration-300 ease-out ${
            beatPulse ? "scale-110" : "scale-100"
          }`}
        >
          <img
            src="https://media.tenor.com/ULt1QoO_tc0AAAAj/cat-vibe-vibe-cat.gif"
            alt="Cat Vibe"
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,0,0.7)]"
          />
        </div>

        {/* Center Group: Enlarged Dancing Dog + 4 Spinning Cats in Corners */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 flex items-center justify-center transition-all duration-300 ease-out ${
            beatPulse ? "scale-115" : "scale-100"
          }`}
        >
          {/* Center Dog */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            <img
              src="https://media.tenor.com/Ez8G-p1fYLMAAAAj/emote-dog.gif"
              alt="Dancing Dog"
              className="w-full h-full object-contain filter drop-shadow-[0_0_32px_rgba(255,255,255,0.95)]"
            />
          </div>

          {/* 4 Corner Spinning Cats */}
          {/* Top-Left */}
          <div className="absolute -top-2 -left-2 w-24 h-24">
            <img
              src="https://media.tenor.com/blwK0rdIId8AAAAj/cat-oiiaoiia-cat.gif"
              alt="Spinning Cat TL"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,255,255,0.7)]"
            />
          </div>
          {/* Top-Right */}
          <div className="absolute -top-2 -right-2 w-24 h-24">
            <img
              src="https://media.tenor.com/blwK0rdIId8AAAAj/cat-oiiaoiia-cat.gif"
              alt="Spinning Cat TR"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,0,255,0.7)]"
            />
          </div>
          {/* Bottom-Left */}
          <div className="absolute -bottom-2 -left-2 w-24 h-24">
            <img
              src="https://media.tenor.com/blwK0rdIId8AAAAj/cat-oiiaoiia-cat.gif"
              alt="Spinning Cat BL"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,255,0,0.7)]"
            />
          </div>
          {/* Bottom-Right */}
          <div className="absolute -bottom-2 -right-2 w-24 h-24">
            <img
              src="https://media.tenor.com/blwK0rdIId8AAAAj/cat-oiiaoiia-cat.gif"
              alt="Spinning Cat BR"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,0,0.7)]"
            />
          </div>
        </div>

        {/* Spawn and Despawn Scuba Cats Scattered All Over the Screen */}
        {scubaPositions.map((pos, idx) => {
          const isVisible = idx < visibleScubaCount;
          return (
            <div
              key={idx}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-[opacity,transform] duration-300 ease-out ${
                isVisible ? `opacity-100 ${beatPulse ? "scale-110" : "scale-100"}` : "opacity-0 scale-50"
              }`}
            >
              <img
                src="https://media.tenor.com/OoG1CF2T3QIAAAAj/kucing-scuba-scuba-cat.gif"
                alt="Scuba Cat"
                className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,255,255,0.6)]"
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
