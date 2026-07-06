"use client";

import { useEffect, useMemo, useRef } from "react";

const BLADES = 6;
const R = 100; // pivot radius (rim where each blade hinges)
const BLADE_LENGTH = 112; // reach toward center
const BLADE_WIDTH = 118; // width at the hinge, tuned to overlap neighbors

function buildBlades() {
  return Array.from({ length: BLADES }, (_, i) => {
    const theta = (i * 360) / BLADES;
    const rad = (theta * Math.PI) / 180;
    const x = R * Math.cos(rad);
    const y = R * Math.sin(rad);
    const d = `M0,${-BLADE_WIDTH / 2} L${-BLADE_LENGTH},0 L0,${BLADE_WIDTH / 2} Z`;
    return { key: i, x, y, theta, d };
  });
}

/**
 * A decorative camera lens: concentric barrel rings around an iris
 * diaphragm whose blades continuously breathe open and closed.
 */
export default function ApertureLens({ className = "" }: { className?: string }) {
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const blades = useMemo(buildBlades, []);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const PERIOD = 5200; // ms per full breathe cycle
    const MAX_SPIN = 34; // degrees

    const tick = (now: number) => {
      const t = ((now - start) % PERIOD) / PERIOD;
      const spin = MAX_SPIN * (0.5 - 0.5 * Math.cos(t * Math.PI * 2));
      groupRefs.current.forEach((g, i) => {
        if (!g) return;
        const b = blades[i];
        g.setAttribute(
          "transform",
          `translate(${b.x} ${b.y}) rotate(${b.theta + spin})`
        );
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [blades]);

  return (
    <svg
      viewBox="-120 -120 240 240"
      className={className}
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <circle r="118" fill="none" stroke="var(--muted)" strokeWidth="0.5" opacity="0.5" />

      <g>
        {blades.map((b, i) => (
          <g
            key={b.key}
            ref={(el) => {
              groupRefs.current[i] = el;
            }}
          >
            <path
              d={b.d}
              fill="var(--aperture-fill)"
              stroke="var(--muted)"
              strokeWidth="0.5"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
