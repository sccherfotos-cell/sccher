"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Plan } from "@/lib/types";

const AUTO_ADVANCE_MS = 5000;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="h-[15px] w-[15px] sm:h-[18px] sm:w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PlansCarousel({
  plans,
  fullWidth = false,
}: {
  plans: Plan[];
  fullWidth?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (plans.length <= 1) return;
    const id = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % plans.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
    // Restart the countdown whenever the slide changes (manual or automatic).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, plans.length]);

  if (plans.length === 0) return null;

  const plan = plans[index];

  function go(dir: 1 | -1) {
    setDirection(dir);
    setIndex((i) => (i + dir + plans.length) % plans.length);
  }

  return (
    <div className={fullWidth ? "" : "sm:hidden"}>
      <div
        className={`relative mx-auto border border-panel-2 bg-panel ${
          fullWidth ? "sm:max-w-xl" : ""
        }`}
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-foreground/50" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: direction * 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -14 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col bg-background px-9 py-7"
            >
              <h2 className="text-xs uppercase tracking-[0.35em] text-muted">{plan.name}</h2>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-3xl font-medium tracking-tight">{plan.price}</span>
                {plan.priceNote && <span className="text-xs text-muted">{plan.priceNote}</span>}
              </div>

              <dl className="mt-6 flex flex-col gap-4 border-t border-panel-2 pt-6 text-sm">
                {plan.details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-muted">
                      {detail.label}
                    </dt>
                    <dd className="mt-1 leading-relaxed">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => go(-1)}
          aria-label="Plano anterior"
          className="absolute left-1 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-2 text-muted transition-colors hover:bg-panel-2 hover:text-foreground sm:-left-14 sm:h-10 sm:w-10"
        >
          <ChevronIcon direction="left" />
        </button>

        <button
          onClick={() => go(1)}
          aria-label="Próximo plano"
          className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-2 text-muted transition-colors hover:bg-panel-2 hover:text-foreground sm:-right-14 sm:h-10 sm:w-10"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      {plans.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {plans.map((p, i) => (
            <button
              key={p.id}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Ver plano ${p.name}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-foreground" : "w-1.5 bg-panel-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
