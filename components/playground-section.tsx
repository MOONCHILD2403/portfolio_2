"use client";

import { useEffect, useMemo, useState } from "react";
import { MotionSection } from "@/components/motion-section";
import { SectionHeader } from "@/components/section-header";
import { contactLinks } from "@/data/portfolio";
import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid";

const GRID_SIZE = 10;
const HIGHSCORE_KEY = "snake-highscore";
const RICKROLL_KEY = "rickroll-count";

const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
} as const;

type Cell = { x: number; y: number };

const initialSnake = [
  { x: 3, y: 5 },
  { x: 2, y: 5 },
  { x: 1, y: 5 }
] as const;

function sameCell(a: Cell, b: Cell) {
  return a.x === b.x && a.y === b.y;
}

function nextApple(snake: Cell[]): Cell {
  const emptyCells: Cell[] = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const candidate = { x, y };
      if (!snake.some((segment) => sameCell(segment, candidate))) {
        emptyCells.push(candidate);
      }
    }
  }

  if (emptyCells.length === 0) {
    return { x: 0, y: 0 };
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

export function PlaygroundSection() {
  const [snake, setSnake] = useState<Cell[]>([...initialSnake]);
  const [cameraActive, setCameraActive] = useState(false);
  const [direction, setDirection] = useState<Cell>({ x: 1, y: 0 });
  const [apple, setApple] = useState<Cell>({ x: 7, y: 5 });
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [rickrollCount, setRickrollCount] = useState<number | null>(null);
  const [showRickrollCount, setShowRickrollCount] = useState(false);
  const [partyActive, setPartyActive] = useState(false);

  useEffect(() => {
    const handleRaveStatus = (e: Event) => {
      const active = (e as CustomEvent).detail?.active ?? false;
      setPartyActive(active);
    };
    window.addEventListener("rave-status", handleRaveStatus);
    return () => window.removeEventListener("rave-status", handleRaveStatus);
  }, []);

  const handlePartyToggle = () => {
    const nextActive = !partyActive;
    setPartyActive(nextActive);
    window.dispatchEvent(new CustomEvent("set-rave", { detail: { active: nextActive } }));
  };

  useEffect(() => {
    const savedHighscore = window.localStorage.getItem(HIGHSCORE_KEY);
    const savedRickrolls = window.localStorage.getItem(RICKROLL_KEY);
    setHighscore(savedHighscore ? Number(savedHighscore) : 0);
    setRickrollCount(savedRickrolls ? Number(savedRickrolls) : null);
  }, []);

  const resetGame = () => {
    setSnake([...initialSnake]);
    setDirection({ x: 1, y: 0 });
    setApple({ x: 7, y: 5 });
    setScore(0);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSnake((current) => {
        const head = current[0];
        const nextHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE
        };

        if (current.slice(0, -1).some((segment) => sameCell(segment, nextHead))) {
          window.setTimeout(() => {
            resetGame();
          }, 0);
          return [...initialSnake];
        }

        const grown = [nextHead, ...current];

        if (sameCell(nextHead, apple)) {
          setScore((value) => {
            const nextScore = value + 1;
            if (nextScore > highscore) {
              setHighscore(nextScore);
              window.localStorage.setItem(HIGHSCORE_KEY, String(nextScore));
            }
            return nextScore;
          });
          setApple(nextApple(grown));
          return grown;
        }

        grown.pop();
        return grown;
      });
    }, 170);

    return () => window.clearInterval(intervalId);
  }, [apple, direction, highscore, isRunning]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.key in directions)) {
        return;
      }

      event.preventDefault();
      const next = directions[event.key as keyof typeof directions];
      setDirection((current) => {
        if (current.x + next.x === 0 && current.y + next.y === 0) {
          return current;
        }

        return next;
      });
      setIsRunning(true);
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMove = (dirKey: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") => {
    const next = directions[dirKey];
    setDirection((current) => {
      if (current.x + next.x === 0 && current.y + next.y === 0) {
        return current;
      }
      return next;
    });
    setIsRunning(true);
  };

  const cells = useMemo(() => {
    return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
      const x = index % GRID_SIZE;
      const y = Math.floor(index / GRID_SIZE);
      const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
      const isApple = apple.x === x && apple.y === y;

      return { x, y, isSnake, isApple };
    });
  }, [apple, snake]);

  const triggerRickroll = () => {
    const nextCount = (rickrollCount ?? 0) + 1;
    setRickrollCount(nextCount);
    setShowRickrollCount(true);
    window.localStorage.setItem(RICKROLL_KEY, String(nextCount));
    window.open(contactLinks.easterEgg, "_blank", "noopener,noreferrer");
  };

  return (
    <MotionSection className="section-shell" id="playground">
      <SectionHeader
        kicker="Playground"
        title="Optional interactions, kept compact."
        copy="A camera experiment if someone wants it, a small persistent snake score, and one suspicious button that tracks local damage after the click."
      />

      <div className="playground-layout playground-balanced">
        <div className="playground-column">
          <div className="webcam-grid-card">
            <div className="snake-header">
              <div>
                <p className="meta">Optional live mode</p>
                <h3 className="snake-title">Webcam pixel grid</h3>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="section-inline-button"
                  onClick={() => setCameraActive(true)}
                  disabled={cameraActive}
                  data-cursor="Camera"
                  style={{ minHeight: "2.1rem", padding: "0 0.75rem", fontSize: "0.7rem" }}
                >
                  [ ENABLE ]
                </button>
                <button
                  type="button"
                  className="section-inline-button"
                  onClick={() => setCameraActive(false)}
                  disabled={!cameraActive}
                  data-cursor="Kill"
                  style={{ minHeight: "2.1rem", padding: "0 0.75rem", fontSize: "0.7rem" }}
                >
                  [ KILL_SWITCH ]
                </button>
              </div>
            </div>
            <p className="playground-copy mt-2 text-xs leading-relaxed" style={{ fontSize: "0.78rem" }}>
              Camera access is optional, browser-local, and easy to disable. Try it only if you want the live 3D pixel grid.
            </p>
            <div className="relative w-full rounded-xl overflow-hidden bg-black/40 border border-neutral-850 mt-4" style={{ height: "360px" }}>
              {cameraActive ? (
                <WebcamPixelGrid />
              ) : (
                <div className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-mono text-neutral-500">
                    [ WEBCAM_FEED_KILLED ]
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="playground-card playground-rickroll-card">
            <p className="meta">Do not click</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <button
                type="button"
                className="tempt-button"
                onClick={triggerRickroll}
                data-cursor="Risky"
              >
                [ FREE_PERFORMANCE_PATCH ]
              </button>
              <button
                type="button"
                className="tempt-button"
                onClick={handlePartyToggle}
                data-cursor="Epilepsy Warning"
              >
                {partyActive ? "[ STOP ]" : "[ PARTY ]"}
              </button>
            </div>
            {showRickrollCount && rickrollCount !== null ? (
              <p className="playground-copy mt-2">
                Local damage report: {rickrollCount + Math.floor(Math.random() * (200)) + 1} &quot;people&quot; rickrolled so far.
              </p>
            ) : null}
          </div>
        </div>

        <div className="playground-column">
          <div className="snake-panel">
            <div className="snake-header">
              <div>
                <p className="meta">Side quest</p>
                <h3 className="snake-title">Snake, quietly tucked away.</h3>
              </div>
              <div className="snake-score">
                Score / {score}
                <br />
                High / {highscore}
              </div>
            </div>

            <div className="snake-grid" role="img" aria-label="Small snake game">
              {cells.map((cell) => (
                <div
                  className={`snake-cell ${cell.isSnake ? "snake-cell-snake" : ""} ${cell.isApple ? "snake-cell-apple" : ""}`}
                  key={`${cell.x}-${cell.y}`}
                />
              ))}
            </div>

            {/* Mobile On-Screen D-Pad Cross */}
            <div className="mobile-dpad">
              <div className="dpad-row">
                <button
                  type="button"
                  className="dpad-btn"
                  onClick={() => handleMove("ArrowUp")}
                  data-cursor="Up"
                >
                  ▲
                </button>
              </div>
              <div className="dpad-row">
                <button
                  type="button"
                  className="dpad-btn"
                  onClick={() => handleMove("ArrowLeft")}
                  data-cursor="Left"
                >
                  ◀
                </button>
                <div className="dpad-spacer" />
                <button
                  type="button"
                  className="dpad-btn"
                  onClick={() => handleMove("ArrowRight")}
                  data-cursor="Right"
                >
                  ▶
                </button>
              </div>
              <div className="dpad-row">
                <button
                  type="button"
                  className="dpad-btn"
                  onClick={() => handleMove("ArrowDown")}
                  data-cursor="Down"
                >
                  ▼
                </button>
              </div>
            </div>

            <div className="snake-actions">
              <button
                type="button"
                className="section-inline-button"
                onClick={() => setIsRunning((current) => !current)}
                data-cursor="Start"
              >
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                className="section-inline-button"
                onClick={resetGame}
                data-cursor="Reset"
              >
                Reset
              </button>
              <span className="snake-hint">Arrow keys move. Page scroll is blocked.</span>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
