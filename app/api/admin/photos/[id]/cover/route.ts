import { NextResponse } from "next/server";
import { setCoverPhoto } from "@/lib/portfolio-repo";
import { handleRepoError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const categoryId = typeof body?.categoryId === "string" ? body.categoryId : "";

  if (!categoryId) {
    return NextResponse.json({ error: "categoryId é obrigatório." }, { status: 400 });
  }

  try {
    const data = await setCoverPhoto(categoryId, id);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
