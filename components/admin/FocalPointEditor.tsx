"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import type { Photo, PortfolioData } from "@/lib/types";

export default function FocalPointEditor({
  photo,
  categoryId,
  onClose,
  onSaved,
}: {
  photo: Photo;
  categoryId: string;
  onClose: () => void;
  onSaved: (data: PortfolioData) => void;
}) {
  const [focalX, setFocalX] = useState(photo.focalX ?? 50);
  const [focalY, setFocalY] = useState(photo.focalY ?? 50);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickPoint(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setFocalX(Math.round(((e.clientX - rect.left) / rect.width) * 100));
    setFocalY(Math.round(((e.clientY - rect.top) / rect.height) * 100));
  }

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/photos/${photo.id}/focal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, focalX, focalY }),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(body.error);
      return;
    }
    onSaved(body.data);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="w-full max-w-sm border border-panel-2 bg-panel p-4">
        <p className="mb-1 text-xs uppercase tracking-widest text-foreground">Enquadrar foto</p>
        <p className="mb-3 text-xs leading-relaxed text-muted">
          Clique no ponto da foto que deve ficar sempre visível quando ela for usada como capa.
        </p>

        <div
          onClick={pickPoint}
          className="relative aspect-[4/5] w-full cursor-crosshair overflow-hidden border border-panel-2 bg-background"
        >
          <Image
            src={photo.url}
            alt=""
            fill
            sizes="360px"
            className="object-cover"
            style={{ objectPosition: `${focalX}% ${focalY}%` }}
          />
          <div
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.6)]"
            style={{ left: `${focalX}%`, top: `${focalY}%` }}
          />
        </div>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-muted hover:text-foreground"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="border border-foreground px-4 py-2 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
