import { NextResponse } from "next/server";
import { addPlan } from "@/lib/portfolio-repo";
import { handleRepoError, parsePlanInput } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const input = parsePlanInput(body);
  if (!input) {
    return NextResponse.json({ error: "Nome e preço são obrigatórios." }, { status: 400 });
  }

  try {
    const data = await addPlan(input);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
