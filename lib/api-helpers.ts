import { NextResponse } from "next/server";
import { CategoryNotEmptyError, NotFoundError, type PlanInput } from "./portfolio-repo";

export function handleRepoError(err: unknown): NextResponse {
  if (err instanceof CategoryNotEmptyError) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  if (err instanceof NotFoundError) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
  const message = err instanceof Error ? err.message : "Erro inesperado.";
  return NextResponse.json({ error: message }, { status: 500 });
}

export function parsePlanInput(body: unknown): PlanInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const price = typeof b.price === "string" ? b.price.trim() : "";
  if (!name || !price) return null;

  const priceNote = typeof b.priceNote === "string" && b.priceNote.trim() ? b.priceNote.trim() : null;

  const details = Array.isArray(b.details)
    ? b.details
        .map((d) => {
          if (!d || typeof d !== "object") return null;
          const label = typeof (d as Record<string, unknown>).label === "string" ? (d as Record<string, unknown>).label as string : "";
          const value = typeof (d as Record<string, unknown>).value === "string" ? (d as Record<string, unknown>).value as string : "";
          return label.trim() && value.trim() ? { label: label.trim(), value: value.trim() } : null;
        })
        .filter((d): d is { label: string; value: string } => d !== null)
    : [];

  return { name, price, priceNote, details };
}
