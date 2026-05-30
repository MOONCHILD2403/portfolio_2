"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  SiApachekafka,
  SiDocker,
  SiGithubactions,
  SiMongodb,
  SiNeo4J,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiTypescript
} from "react-icons/si";
import { TbBrandAws } from "react-icons/tb";
import { MotionSection } from "@/components/motion-section";
import { SectionHeader } from "@/components/section-header";
import { toolPanels, toolSphere } from "@/data/portfolio";

const iconMap: Record<string, IconType> = {
  aws: TbBrandAws,
  docker: SiDocker,
  "github-actions": SiGithubactions,
  kafka: SiApachekafka,
  mongo: SiMongodb,
  neo4j: SiNeo4J,
  next: SiNextdotjs,
  node: SiNodedotjs,
  postgres: SiPostgresql,
  prisma: SiPrisma,
  python: SiPython,
  typescript: SiTypescript
};

type NodeData = {
  x: number;
  y: number;
  z: number;
  item: (typeof toolSphere)[number];
};

export function SkillsSection() {
  const [frame, setFrame] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const nodes = useMemo<NodeData[]>(() => {
    return toolSphere.map((item, index) => {
      const count = toolSphere.length;
      const offset = 2 / count;
      const increment = Math.PI * (3 - Math.sqrt(5));
      const y = index * offset - 1 + offset / 2;
      const radius = Math.sqrt(1 - y * y);
      const phi = index * increment;

      return {
        item,
        x: Math.cos(phi) * radius,
        y,
        z: Math.sin(phi) * radius
      };
    });
  }, []);

  useEffect(() => {
    let frameId = 0;
    const tick = () => {
      setMouse((current) => ({
        x: current.x + (mouseTargetRef.current.x - current.x) * 0.08,
        y: current.y + (mouseTargetRef.current.y - current.y) * 0.08
      }));
      setFrame((current) => current + 1);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const renderedNodes = useMemo(() => {
    const time = frame * 0.012;
    const rotationY = time + mouse.x * 0.24;
    const rotationX = mouse.y * 0.16;
    const sinX = Math.sin(rotationX);
    const cosX = Math.cos(rotationX);
    const sinY = Math.sin(rotationY);
    const cosY = Math.cos(rotationY);

    return nodes
      .map((node) => {
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;
        const y1 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;
        const depth = (z2 + 1) / 2;

        return {
          ...node,
          x: x1 * 144,
          y: y1 * 144,
          scale: 0.72 + depth * 0.45,
          opacity: 0.3 + depth * 0.7,
          zIndex: Math.round(depth * 100)
        };
      })
      .sort((left, right) => left.zIndex - right.zIndex);
  }, [frame, mouse.x, mouse.y, nodes]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    mouseTargetRef.current = { x, y: -y };
  };

  return (
    <MotionSection className="section-shell" id="tools">
      <SectionHeader
        kicker="Tools"
        title="Stack used to ship practical backend systems."
        copy="TypeScript, Python, AWS, data stores, and delivery tooling used where they make operations cleaner, not louder."
      />

      <div className="tools-layout">
        <div
          className="icon-sphere"
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            mouseTargetRef.current = { x: 0, y: 0 };
          }}
        >
          <div className="icon-sphere-glow" />
          {renderedNodes.map((node) => {
            const Icon = iconMap[node.item.icon];

            return (
              <div
                className="icon-orbit-node"
                key={node.item.name}
                style={{
                  transform: `translate3d(${node.x}px, ${node.y}px, 0) scale(${node.scale})`,
                  opacity: node.opacity,
                  zIndex: node.zIndex
                }}
              >
                <Icon style={{ color: node.item.color }} />
                <span>{node.item.name}</span>
              </div>
            );
          })}
        </div>

        <div className="tools-panel-grid">
          {toolPanels.map((panel) => (
            <article className="tools-panel" key={panel.title}>
              <span className="tools-panel-title">{panel.title}</span>
              <p>{panel.body}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
