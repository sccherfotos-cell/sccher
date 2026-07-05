"use client";

import { useState } from "react";
import Image from "next/image";
import type { LogoRef, PortfolioData } from "@/lib/types";

export default function LogoManager({
  logo,
  onUpdate,
}: {
  logo: LogoRef | null;
  onUpdate: (d: PortfolioData) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [removeBg, setRemoveBg] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    form.append("removeBackground", removeBg ? "true" : "false");
    const res = await fetch("/api/admin/logo", { method: "POST", body: form });
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
    <div className="flex flex-col gap-4 border border-panel-2 bg-panel p-4 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-panel-2 bg-background">
        {logo ? (
          <Image src={logo.url} alt="Logo atual" width={56} height={56} className="h-14 w-14 object-contain" />
        ) : (
          <span className="text-center text-[9px] uppercase tracking-widest text-muted">sem logo</span>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="flex-1 text-sm text-muted file:mr-3 file:border file:border-panel-2 file:bg-background file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-widest"
      />

      <label className="flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-widest text-muted">
        <input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} />
        Remover fundo
      </label>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="border border-foreground px-6 py-2 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
      >
        {uploading ? "Enviando..." : "Trocar logo"}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
