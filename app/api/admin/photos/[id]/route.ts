import { NextResponse } from "next/server";
import { deletePhoto } from "@/lib/portfolio-repo";
import { handleRepoError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryId = new URL(request.url).searchParams.get("categoryId");
  if (!categoryId) {
    return NextResponse.json({ error: "categoryId é obrigatório." }, { status: 400 });
  }

  try {
    const data = await deletePhoto(categoryId, id);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
