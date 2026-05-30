"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};

const BASE_SIZE = 30;

function getRectState(element: HTMLElement | null): CursorState | null {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const borderRadius = Number.parseFloat(style.borderRadius || "16");

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    width: Math.max(BASE_SIZE, rect.width + 14),
    height: Math.max(BASE_SIZE, rect.height + 10),
    radius: Number.isNaN(borderRadius) ? 16 : borderRadius + 4
  };
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringElementRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef<HTMLElement | null>(null);
  const ringRef = useRef<
    CursorState & {
      velocityX: number;
      velocityY: number;
      velocityWidth: number;
      velocityHeight: number;
      velocityRadius: number;
    }
  >({
    x: 0,
    y: 0,
    width: BASE_SIZE,
    height: BASE_SIZE,
    radius: BASE_SIZE,
    velocityX: 0,
    velocityY: 0,
    velocityWidth: 0,
    velocityHeight: 0,
    velocityRadius: 0
  });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const allowed = fine && !reduced;
    setEnabled(allowed);

    if (!allowed) {
      return;
    }

    const updateElements = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointerRef.current.x}px, ${pointerRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `translate3d(${pointerRef.current.x + 18}px, ${pointerRef.current.y - 18}px, 0)`;
      }
    };

    let frameId = 0;

    const animate = () => {
      const target =
        getRectState(hoveredRef.current) ?? {
          x: pointerRef.current.x,
          y: pointerRef.current.y,
          width: BASE_SIZE,
          height: BASE_SIZE,
          radius: BASE_SIZE
        };

      const spring = 0.16;
      const damping = 0.72;

      ringRef.current.velocityX =
        (ringRef.current.velocityX + (target.x - ringRef.current.x) * spring) * damping;
      ringRef.current.velocityY =
        (ringRef.current.velocityY + (target.y - ringRef.current.y) * spring) * damping;
      ringRef.current.velocityWidth =
        (ringRef.current.velocityWidth + (target.width - ringRef.current.width) * spring) *
        damping;
      ringRef.current.velocityHeight =
        (ringRef.current.velocityHeight + (target.height - ringRef.current.height) * spring) *
        damping;
      ringRef.current.velocityRadius =
        (ringRef.current.velocityRadius + (target.radius - ringRef.current.radius) * spring) *
        damping;

      ringRef.current.x += ringRef.current.velocityX;
      ringRef.current.y += ringRef.current.velocityY;
      ringRef.current.width += ringRef.current.velocityWidth;
      ringRef.current.height += ringRef.current.velocityHeight;
      ringRef.current.radius += ringRef.current.velocityRadius;

      if (ringElementRef.current) {
        ringElementRef.current.style.transform = `translate3d(${ringRef.current.x - ringRef.current.width / 2}px, ${ringRef.current.y - ringRef.current.height / 2}px, 0)`;
        ringElementRef.current.style.width = `${ringRef.current.width}px`;
        ringElementRef.current.style.height = `${ringRef.current.height}px`;
        ringElementRef.current.style.borderRadius = `${ringRef.current.radius}px`;
      }

      updateElements();
      frameId = window.requestAnimationFrame(animate);
    };

    const handleMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      // Disable cursor snapping/annotations inside the floating header navbar
      if (target?.closest(".site-header") || target?.closest("header")) {
        pointerRef.current = { x: event.clientX, y: event.clientY };
        hoveredRef.current = null;
        setVisible(true);
        setLabel("");
        return;
      }

      const actionable = target?.closest("[data-cursor]") as HTMLElement | null;
      const nextLabel = actionable?.getAttribute("data-cursor") ?? "";

      pointerRef.current = { x: event.clientX, y: event.clientY };
      hoveredRef.current = actionable;
      setVisible(true);
      setLabel(nextLabel);
    };

    const handleWindowOut = (event: MouseEvent) => {
      if (event.relatedTarget) {
        return;
      }

      hoveredRef.current = null;
      setLabel("");
      setVisible(false);
    };

    const handleBlur = () => {
      hoveredRef.current = null;
      setLabel("");
      setVisible(false);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        hoveredRef.current = null;
        setLabel("");
        setVisible(false);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseout", handleWindowOut);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseout", handleWindowOut);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div className={`cursor-shell ${visible ? "cursor-shell-visible" : ""}`} aria-hidden="true">
      <div
        className={`cursor-ring ${label ? "cursor-ring-active" : ""}`}
        ref={ringElementRef}
      />
      <div className="cursor-dot" ref={dotRef} />
      {label ? (
        <div className="cursor-tooltip" ref={tooltipRef}>
          [{label.toUpperCase()}]
        </div>
      ) : null}
    </div>
  );
}
