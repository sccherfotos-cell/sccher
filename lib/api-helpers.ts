import { NextResponse } from "next/server";
import { CategoryNotEmptyError, NotFoundError } from "./portfolio-repo";

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
