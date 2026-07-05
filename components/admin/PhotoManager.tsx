"use client";

import { useState } from "react";
import Image from "next/image";
import type { PortfolioData } from "@/lib/types";

export default function PhotoManager({
  data,
  onUpdate,
}: {
  data: PortfolioData;
  onUpdate: (d: PortfolioData) => void;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState(data.categories[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);

  const category = data.categories.find((c) => c.id === activeCategoryId);

  async function del(photoId: string) {
    if (!category) return;
    const res = await fetch(`/api/admin/photos/${photoId}?categoryId=${category.id}`, {
      method: "DELETE",
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error);
      return;
    }
    onUpdate(body.data);
  }

  async function move(photoId: string, direction: "up" | "down") {
    if (!category) return;
    const res = await fetch(`/api/admin/photos/${photoId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: category.id, direction }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error);
      return;
    }
    onUpdate(body.data);
  }

  async function setCover(photoId: string) {
    if (!category) return;
    const res = await fetch(`/api/admin/photos/${photoId}/cover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: category.id }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error);
      return;
    }
    onUpdate(body.data);
  }

  if (data.categories.length === 0) {
    return <p className="text-sm text-muted">Crie uma categoria primeiro.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {data.categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategoryId(c.id)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-colors ${
              c.id === activeCategoryId
                ? "bg-foreground text-background"
                : "border border-panel-2 text-muted hover:text-foreground"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

      {category && category.photos.length === 0 && (
        <p className="text-sm text-muted">Nenhuma foto nesta categoria ainda.</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {category?.photos.map((photo, i) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden border border-panel-2 bg-panel">
            <Image src={photo.url} alt="" fill sizes="240px" className="object-cover" />

            {category.coverPhotoId === photo.id && (
              <span className="absolute left-2 top-2 bg-foreground px-2 py-0.5 text-[9px] uppercase tracking-widest text-background">
                Capa
              </span>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => setCover(photo.id)}
                className="text-[10px] uppercase tracking-widest text-white hover:underline"
              >
                Definir capa
              </button>
              <div className="flex gap-3">
                <button
                  disabled={i === 0}
                  onClick={() => move(photo.id, "up")}
                  className="text-white disabled:opacity-30"
                  aria-label="Mover para cima"
                >
                  ↑
                </button>
                <button
                  disabled={i === category.photos.length - 1}
                  onClick={() => move(photo.id, "down")}
                  className="text-white disabled:opacity-30"
                  aria-label="Mover para baixo"
                >
                  ↓
                </button>
              </div>
              <button
                onClick={() => del(photo.id)}
                className="text-[10px] uppercase tracking-widest text-white hover:underline"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
