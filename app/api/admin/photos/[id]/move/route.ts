import { NextResponse } from "next/server";
import { movePhoto } from "@/lib/portfolio-repo";
import { handleRepoError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const categoryId = typeof body?.categoryId === "string" ? body.categoryId : "";
  const direction = body?.direction === "up" || body?.direction === "down" ? body.direction : null;

  if (!categoryId || !direction) {
    return NextResponse.json({ error: "categoryId e direction são obrigatórios." }, { status: 400 });
  }

  try {
    const data = await movePhoto(categoryId, id, direction);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
