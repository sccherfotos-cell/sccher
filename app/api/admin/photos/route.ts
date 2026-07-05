import { NextResponse } from "next/server";
import { addPhoto } from "@/lib/portfolio-repo";
import { handleRepoError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const categoryId = form?.get("categoryId");

  if (!(file instanceof File) || typeof categoryId !== "string" || !categoryId) {
    return NextResponse.json({ error: "Arquivo e categoria são obrigatórios." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await addPhoto(categoryId, buffer, file.name, file.type || "image/jpeg");
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
