import { NextResponse } from "next/server";
import { replaceLogo } from "@/lib/portfolio-repo";
import { handleRepoError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const removeBg = form?.get("removeBackground") === "true";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo é obrigatório." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await replaceLogo(buffer, removeBg);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
