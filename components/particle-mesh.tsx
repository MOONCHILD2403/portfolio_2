"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type ParticleRuntime = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  base: Float32Array;
  current: Float32Array;
  frameId: number;
  mouse: THREE.Vector2;
  target: THREE.Vector3;
  cursor: THREE.Vector3;
  clock: THREE.Clock;
};

function buildBasePositions(count: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const t = (index / count) * Math.PI * 10;
    const ring = 0.42 + 0.28 * Math.sin(t * 1.7);
    const twist = t * 0.38;
    const x = Math.sin(t * 1.2) * Math.cos(twist) * ring;
    const y = Math.cos(t * 0.9) * Math.sin(twist * 1.2) * ring;
    const z = Math.sin(t * 0.55) * Math.cos(t * 0.32) * 0.7;
    const stride = index * 3;

    positions[stride] = x * 8.8;
    positions[stride + 1] = y * 8.8;
    positions[stride + 2] = z * 8.8;
  }

  return positions;
}

export function ParticleMesh() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const particleCount = prefersReducedMotion ? 1200 : 2600;

    const runtime: Partial<ParticleRuntime> = {
      mouse: new THREE.Vector2(0, 0),
      target: new THREE.Vector3(),
      cursor: new THREE.Vector3(),
      clock: new THREE.Clock()
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const base = buildBasePositions(particleCount);
    const current = new Float32Array(base);
    geometry.setAttribute("position", new THREE.BufferAttribute(current, 3));

    const material = new THREE.PointsMaterial({
      color: "#F3F4F6",
      size: 0.09,
      transparent: true,
      opacity: prefersReducedMotion ? 0.58 : 0.88,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Check initial theme to set correct particle color/blending for Light Mode
    const initialTheme = typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark";
    if (initialTheme === "light") {
      material.color.set("#0d0e10");
      material.blending = THREE.NormalBlending;
      material.needsUpdate = true;
    }

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    scene.add(new THREE.AmbientLight("#ffffff", 0.8));

    // Watch data-theme changes to dynamically toggle particle colors and blending modes
    const themeObserver = new MutationObserver(() => {
      const nextTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      if (nextTheme === "light") {
        material.color.set("#0d0e10");
        material.blending = THREE.NormalBlending;
      } else {
        material.color.set("#F3F4F6");
        material.blending = THREE.AdditiveBlending;
      }
      material.needsUpdate = true;
    });
    
    if (typeof document !== "undefined") {
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"]
      });
    }

    runtime.scene = scene;
    runtime.camera = camera;
    runtime.renderer = renderer;
    runtime.points = points;
    runtime.base = base;
    runtime.current = current;

    let isDocumentVisible = !document.hidden;

    const updateSize = () => {
      if (!runtime.camera || !runtime.renderer) {
        return;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;
      runtime.camera.aspect = width / Math.max(height, 1);
      runtime.camera.updateProjectionMatrix();
      runtime.renderer.setSize(width, height);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      runtime.mouse?.set(x, y);
    };

    const handlePointerLeave = () => {
      runtime.mouse?.set(0, 0);
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };

    const animate = () => {
      if (
        !runtime.points ||
        !runtime.base ||
        !runtime.current ||
        !runtime.renderer ||
        !runtime.scene ||
        !runtime.camera ||
        !runtime.clock ||
        !runtime.mouse ||
        !runtime.target ||
        !runtime.cursor
      ) {
        return;
      }

      if (!isDocumentVisible) {
        runtime.frameId = window.requestAnimationFrame(animate);
        return;
      }

      const elapsed = runtime.clock.getElapsedTime();
      const delta = Math.min(runtime.clock.getDelta(), 0.1);
      const lerpFactor = 1 - Math.exp(-12 * delta); // Frame-rate independent lerp factor

      runtime.target.set(runtime.mouse.x * 6.8, runtime.mouse.y * 4.6, 0);
      runtime.cursor.lerp(runtime.target, 1 - Math.exp(-6 * delta));

      const positions = runtime.current;
      const source = runtime.base;

      for (let index = 0; index < particleCount; index += 1) {
        const stride = index * 3;
        const baseX = source[stride];
        const baseY = source[stride + 1];
        const baseZ = source[stride + 2];
        const dx = baseX - runtime.cursor.x;
        const dy = baseY - runtime.cursor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const falloff = Math.max(0, 1 - distance / 6);
        const wave = Math.sin(elapsed * 1.7 + index * 0.045);
        const offset = falloff * (1.2 + wave * 0.5);
        const directionX = distance === 0 ? 0 : dx / distance;
        const directionY = distance === 0 ? 0 : dy / distance;

        const warpedX =
          baseX +
          directionX * offset +
          Math.sin(elapsed + index * 0.015) * 0.02;
        const warpedY =
          baseY +
          directionY * offset +
          Math.cos(elapsed * 0.9 + index * 0.02) * 0.02;
        const warpedZ =
          baseZ +
          falloff * 1.6 +
          Math.sin(elapsed * 0.7 + index * 0.035) * 0.2;

        positions[stride] += (warpedX - positions[stride]) * lerpFactor;
        positions[stride + 1] += (warpedY - positions[stride + 1]) * lerpFactor;
        positions[stride + 2] += (warpedZ - positions[stride + 2]) * lerpFactor;
      }

      runtime.points.rotation.y = elapsed * 0.14;
      runtime.points.rotation.x = Math.sin(elapsed * 0.28) * 0.12;
      runtime.points.geometry.attributes.position.needsUpdate = true;
      runtime.renderer.render(runtime.scene, runtime.camera);
      runtime.frameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("resize", updateSize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    updateSize();
    animate();

    return () => {
      themeObserver.disconnect();
      window.removeEventListener("resize", updateSize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);

      if (runtime.frameId) {
        window.cancelAnimationFrame(runtime.frameId);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="hero-canvas" ref={containerRef} aria-hidden="true" />;
}
