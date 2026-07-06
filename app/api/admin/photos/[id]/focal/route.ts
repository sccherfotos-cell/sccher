import { NextResponse } from "next/server";
import { setPhotoFocalPoint } from "@/lib/portfolio-repo";
import { handleRepoError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const categoryId = typeof body?.categoryId === "string" ? body.categoryId : "";
  const focalX = typeof body?.focalX === "number" ? body.focalX : NaN;
  const focalY = typeof body?.focalY === "number" ? body.focalY : NaN;

  if (!categoryId || Number.isNaN(focalX) || Number.isNaN(focalY)) {
    return NextResponse.json(
      { error: "categoryId, focalX e focalY são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const data = await setPhotoFocalPoint(categoryId, id, focalX, focalY);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
