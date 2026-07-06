"use client";

import { useState } from "react";
import type { Plan, PlanDetail, PortfolioData } from "@/lib/types";

type FormState = {
  name: string;
  price: string;
  priceNote: string;
  details: PlanDetail[];
};

const EMPTY_FORM: FormState = { name: "", price: "", priceNote: "", details: [{ label: "", value: "" }] };

export default function PlanManager({
  data,
  onUpdate,
}: {
  data: PortfolioData;
  onUpdate: (d: PortfolioData) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sorted = [...data.plans].sort((a, b) => a.order - b.order);

  function startEdit(plan: Plan) {
    setError(null);
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      price: plan.price,
      priceNote: plan.priceNote ?? "",
      details: plan.details.length ? plan.details.map((d) => ({ ...d })) : [{ label: "", value: "" }],
    });
  }

  function startNew() {
    setError(null);
    setEditingId("__new__");
    setForm(EMPTY_FORM);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function updateDetail(i: number, field: "label" | "value", val: string) {
    setForm((f) => ({
      ...f,
      details: f.details.map((d, idx) => (idx === i ? { ...d, [field]: val } : d)),
    }));
  }

  function addDetailRow() {
    setForm((f) => ({ ...f, details: [...f.details, { label: "", value: "" }] }));
  }

  function removeDetailRow(i: number) {
    setForm((f) => ({ ...f, details: f.details.filter((_, idx) => idx !== i) }));
  }

  async function save() {
    const name = form.name.trim();
    const price = form.price.trim();
    if (!name || !price) {
      setError("Nome e preço são obrigatórios.");
      return;
    }
    const details = form.details
      .map((d) => ({ label: d.label.trim(), value: d.value.trim() }))
      .filter((d) => d.label && d.value);
    const priceNote = form.priceNote.trim() || null;

    setBusy(true);
    const body = JSON.stringify({ name, price, priceNote, details });
    const res =
      editingId === "__new__"
        ? await fetch("/api/admin/plans", { method: "POST", headers: { "Content-Type": "application/json" }, body })
        : await fetch(`/api/admin/plans/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body,
          });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error);
      return;
    }
    onUpdate(json.data);
    cancelEdit();
  }

  async function remove(id: string) {
    setBusy(true);
    const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error);
      return;
    }
    onUpdate(json.data);
  }

  async function move(id: string, direction: "up" | "down") {
    const index = sorted.findIndex((p) => p.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    const reordered = [...sorted];
    [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];
    const res = await fetch("/api/admin/plans/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((p) => p.id) }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      return;
    }
    onUpdate(json.data);
  }

  function renderForm() {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nome do plano"
            className="flex-1 border border-panel-2 bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          <input
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="Preço (ex: R$250)"
            className="w-full border border-panel-2 bg-background px-3 py-2 text-sm outline-none focus:border-foreground sm:w-40"
          />
          <input
            value={form.priceNote}
            onChange={(e) => setForm((f) => ({ ...f, priceNote: e.target.value }))}
            placeholder="Observação (opcional, ex: + R$60 / pessoa)"
            className="w-full border border-panel-2 bg-background px-3 py-2 text-sm outline-none focus:border-foreground sm:w-64"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted">Itens do plano</span>
          {form.details.map((d, i) => (
            <div key={i} className="flex flex-col gap-2 sm:flex-row">
              <input
                value={d.label}
                onChange={(e) => updateDetail(i, "label", e.target.value)}
                placeholder="Rótulo (ex: Duração)"
                className="w-full border border-panel-2 bg-background px-3 py-2 text-sm outline-none focus:border-foreground sm:w-1/3"
              />
              <div className="flex gap-2">
                <input
                  value={d.value}
                  onChange={(e) => updateDetail(i, "value", e.target.value)}
                  placeholder="Valor (ex: 1 hora de sessão)"
                  className="flex-1 border border-panel-2 bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
                <button
                  onClick={() => removeDetailRow(i)}
                  aria-label="Remover item"
                  className="px-2 text-muted hover:text-foreground"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addDetailRow}
            className="self-start text-xs uppercase tracking-widest text-muted hover:text-foreground"
          >
            + Adicionar item
          </button>
        </div>

        <div className="flex gap-3">
          <button
            disabled={busy}
            onClick={save}
            className="border border-foreground px-6 py-2 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
          >
            Salvar
          </button>
          <button
            disabled={busy}
            onClick={cancelEdit}
            className="text-xs uppercase tracking-widest text-muted hover:text-foreground disabled:opacity-40"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-xs text-red-400">{error}</p>}

      {sorted.map((plan, i) => (
        <div key={plan.id} className="border border-panel-2 bg-panel p-4">
          {editingId === plan.id ? (
            renderForm()
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium">{plan.name}</span>
                <span className="ml-3 text-sm text-muted">
                  {plan.price}
                  {plan.priceNote ? ` ${plan.priceNote}` : ""}
                </span>
                <div className="mt-1 text-xs text-muted">{plan.details.length} itens</div>
              </div>
              <button
                disabled={i === 0}
                onClick={() => move(plan.id, "up")}
                className="text-muted hover:text-foreground disabled:opacity-20"
                aria-label="Mover para cima"
              >
                ↑
              </button>
              <button
                disabled={i === sorted.length - 1}
                onClick={() => move(plan.id, "down")}
                className="text-muted hover:text-foreground disabled:opacity-20"
                aria-label="Mover para baixo"
              >
                ↓
              </button>
              <button
                onClick={() => startEdit(plan)}
                className="text-xs uppercase tracking-widest text-muted hover:text-foreground"
              >
                Editar
              </button>
              <button
                disabled={busy}
                onClick={() => remove(plan.id)}
                className="text-xs uppercase tracking-widest text-muted hover:text-foreground disabled:opacity-40"
              >
                Excluir
              </button>
            </div>
          )}
        </div>
      ))}

      {editingId === "__new__" ? (
        <div className="border border-panel-2 bg-panel p-4">{renderForm()}</div>
      ) : (
        <button
          onClick={startNew}
          className="self-start border border-foreground px-6 py-3 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background"
        >
          Adicionar plano
        </button>
      )}
    </div>
  );
}
