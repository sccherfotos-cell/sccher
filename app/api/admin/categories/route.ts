import { NextResponse } from "next/server";
import { addCategory } from "@/lib/portfolio-repo";
import { handleRepoError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Informe um nome para a categoria." }, { status: 400 });
  }

  try {
    const data = await addCategory(name);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
