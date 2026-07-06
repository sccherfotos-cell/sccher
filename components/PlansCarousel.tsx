"use client";

import { useEffect, useState } from "react";
import type { Plan } from "@/lib/types";

const AUTO_ADVANCE_MS = 5000;

export default function PlansCarousel({ plans }: { plans: Plan[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (plans.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % plans.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
    // Restart the countdown whenever the slide changes (manual or automatic).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, plans.length]);

  if (plans.length === 0) return null;

  const plan = plans[index];

  function go(direction: 1 | -1) {
    setIndex((i) => (i + direction + plans.length) % plans.length);
  }

  return (
    <div className="sm:hidden">
      <div className="flex items-center gap-3">
        <button
          onClick={() => go(-1)}
          aria-label="Plano anterior"
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-panel-2 text-foreground transition-colors hover:bg-panel"
        >
          ←
        </button>

        <div className="flex flex-1 flex-col border border-panel-2 bg-background p-6">
          <h2 className="text-xs uppercase tracking-[0.35em] text-muted">{plan.name}</h2>

          <dl className="mt-6 flex flex-1 flex-col gap-4 text-sm">
            {plan.details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-[10px] uppercase tracking-[0.25em] text-muted">
                  {detail.label}
                </dt>
                <dd className="mt-1 leading-relaxed">{detail.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 border-t border-panel-2 pt-6">
            <span className="text-2xl font-medium tracking-tight">{plan.price}</span>
            {plan.priceNote && <span className="ml-2 text-xs text-muted">{plan.priceNote}</span>}
          </div>
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Próximo plano"
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-panel-2 text-foreground transition-colors hover:bg-panel"
        >
          →
        </button>
      </div>

      {plans.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {plans.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIndex(i)}
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
