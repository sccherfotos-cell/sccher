"use client";

import { useEffect } from "react";

/**
 * A small AF point tracks the pointer — like a camera's live focus sensor
 * scanning the frame. It does NOT blur the surroundings: the visitor is the
 * subject being watched, not the one looking through the lens.
 */
export default function LensCursor() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(apply);
      }
    };

    const apply = () => {
      root.style.setProperty("--mx", `${targetX}px`);
      root.style.setProperty("--my", `${targetY}px`);
      raf = 0;
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="af-point" aria-hidden>
        <span className="c-tl" />
        <span className="c-tr" />
        <span className="c-bl" />
        <span className="c-br" />
      </div>
      <div className="grain" aria-hidden />
    </>
  );
}
