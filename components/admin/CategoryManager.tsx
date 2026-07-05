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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

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

  function startEdit(id: string, currentName: string) {
    setError(null);
    setEditingId(id);
    setEditValue(currentName);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function saveEdit(id: string) {
    const name = editValue.trim();
    if (!name) return;
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
    setEditingId(null);
    setEditValue("");
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

      {sorted.map((cat, i) => {
        const isEditing = editingId === cat.id;
        return (
          <div key={cat.id} className="flex flex-wrap items-center gap-3 border border-panel-2 bg-panel px-4 py-3">
            {isEditing ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(cat.id);
                  if (e.key === "Escape") cancelEdit();
                }}
                disabled={busyId === cat.id}
                className="min-w-0 flex-1 border border-panel-2 bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground"
              />
            ) : (
              <span className="min-w-0 flex-1 truncate text-sm">{cat.name}</span>
            )}

            <span className="whitespace-nowrap text-[10px] uppercase tracking-widest text-muted">
              {cat.photos.length} fotos
            </span>

            {isEditing ? (
              <>
                <button
                  disabled={busyId === cat.id}
                  onClick={() => saveEdit(cat.id)}
                  className="text-xs uppercase tracking-widest text-foreground hover:underline disabled:opacity-40"
                >
                  Salvar
                </button>
                <button
                  disabled={busyId === cat.id}
                  onClick={cancelEdit}
                  className="text-xs uppercase tracking-widest text-muted hover:text-foreground disabled:opacity-40"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
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
                  onClick={() => startEdit(cat.id, cat.name)}
                  className="text-xs uppercase tracking-widest text-muted hover:text-foreground"
                >
                  Editar
                </button>
                <button
                  disabled={busyId === cat.id}
                  onClick={() => remove(cat.id)}
                  title={cat.photos.length > 0 ? "Remova as fotos antes de excluir" : "Excluir categoria"}
                  className="text-xs uppercase tracking-widest text-muted hover:text-foreground disabled:opacity-40"
                >
                  Excluir
                </button>
              </>
            )}
          </div>
        );
      })}

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
