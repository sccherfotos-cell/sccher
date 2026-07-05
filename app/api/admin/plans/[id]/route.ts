import { NextResponse } from "next/server";
import { updatePlan, deletePlan } from "@/lib/portfolio-repo";
import { handleRepoError, parsePlanInput } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const input = parsePlanInput(body);
  if (!input) {
    return NextResponse.json({ error: "Nome e preço são obrigatórios." }, { status: 400 });
  }

  try {
    const data = await updatePlan(id, input);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await deletePlan(id);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
