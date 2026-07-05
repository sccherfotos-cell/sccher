"use client";

import { useState } from "react";
import type { PortfolioData } from "@/lib/types";

export default function CategoryManager({
  data,
  onUpdate,
}: {
  data: PortfolioData;
  onUpdate: (d: PortfolioData) => void;
}) {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const sorted = [...data.categories].sort((a, b) => a.order - b.order);

  async function addCategory() {
    const name = newName.trim();
    if (!name) return;
    setError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error);
      return;
    }
    onUpdate(body.data);
    setNewName("");
  }

  async function rename(id: string, name: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error);
      return;
    }
    onUpdate(body.data);
  }

  async function remove(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error);
      return;
    }
    onUpdate(body.data);
  }

  async function move(id: string, direction: "up" | "down") {
    const index = sorted.findIndex((c) => c.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    const reordered = [...sorted];
    [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];
    const res = await fetch("/api/admin/categories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((c) => c.id) }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error);
      return;
    }
    onUpdate(body.data);
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-xs text-red-400">{error}</p>}

      {sorted.map((cat, i) => (
        <div key={cat.id} className="flex flex-wrap items-center gap-3 border border-panel-2 bg-panel px-4 py-3">
          <input
            defaultValue={cat.name}
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value && value !== cat.name) rename(cat.id, value);
            }}
            disabled={busyId === cat.id}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <span className="whitespace-nowrap text-[10px] uppercase tracking-widest text-muted">
            {cat.photos.length} fotos
          </span>
          <button
            disabled={i === 0}
            onClick={() => move(cat.id, "up")}
            className="text-muted hover:text-foreground disabled:opacity-20"
            aria-label="Mover para cima"
          >
            ↑
          </button>
          <button
            disabled={i === sorted.length - 1}
            onClick={() => move(cat.id, "down")}
            className="text-muted hover:text-foreground disabled:opacity-20"
            aria-label="Mover para baixo"
          >
            ↓
          </button>
          <button
            disabled={busyId === cat.id}
            onClick={() => remove(cat.id)}
            title={cat.photos.length > 0 ? "Remova as fotos antes de excluir" : "Excluir categoria"}
            className="text-xs uppercase tracking-widest text-muted hover:text-foreground disabled:opacity-40"
          >
            Excluir
          </button>
        </div>
      ))}

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nova categoria"
          className="flex-1 border border-panel-2 bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        <button
          onClick={addCategory}
          className="border border-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
