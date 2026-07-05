"use client";

import { useState } from "react";
import type { Category, PortfolioData } from "@/lib/types";

export default function PhotoUploadForm({
  categories,
  onUpdate,
}: {
  categories: Category[];
  onUpdate: (d: PortfolioData) => void;
}) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (categories.length === 0) {
    return <p className="mb-8 text-sm text-muted">Crie uma categoria antes de enviar fotos.</p>;
  }

  async function handleUpload() {
    if (!file || !categoryId) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    form.append("categoryId", categoryId);
    const res = await fetch("/api/admin/photos", { method: "POST", body: form });
    const body = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(body.error);
      return;
    }
    onUpdate(body.data);
    setFile(null);
  }

  return (
    <div className="mb-8 flex flex-col gap-3 border border-panel-2 bg-panel p-4 sm:flex-row sm:items-center">
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border border-panel-2 bg-background px-3 py-2 text-sm outline-none"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="flex-1 text-sm text-muted file:mr-3 file:border file:border-panel-2 file:bg-background file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-widest"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="border border-foreground px-6 py-2 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
      >
        {uploading ? "Enviando..." : "Enviar foto"}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
