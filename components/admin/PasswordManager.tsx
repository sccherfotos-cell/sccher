"use client";

import { useState, type FormEvent } from "react";

export default function PasswordManager() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("As senhas novas não coincidem.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const body = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(body.error);
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-sm flex-col gap-4 border border-panel-2 bg-panel p-4"
    >
      <div>
        <label className="text-xs uppercase tracking-widest text-muted">Senha atual</label>
        <input
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1 w-full border border-panel-2 bg-background px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-muted">Nova senha</label>
        <input
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          className="mt-1 w-full border border-panel-2 bg-background px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-muted">Confirmar nova senha</label>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={8}
          className="mt-1 w-full border border-panel-2 bg-background px-3 py-2 text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="border border-foreground px-6 py-2 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
      >
        {saving ? "Salvando..." : "Alterar senha"}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-emerald-500">Senha alterada com sucesso.</p>}
    </form>
  );
}
