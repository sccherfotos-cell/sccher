import { NextResponse } from "next/server";
import { renameCategory, deleteCategory } from "@/lib/portfolio-repo";
import { handleRepoError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Informe um nome para a categoria." }, { status: 400 });
  }

  try {
    const data = await renameCategory(id, name);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await deleteCategory(id);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
