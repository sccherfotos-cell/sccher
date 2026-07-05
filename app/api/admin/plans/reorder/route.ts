import { NextResponse } from "next/server";
import { reorderPlans } from "@/lib/portfolio-repo";
import { handleRepoError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const orderedIds = Array.isArray(body?.orderedIds) ? (body.orderedIds as string[]) : null;
  if (!orderedIds) {
    return NextResponse.json({ error: "orderedIds inválido." }, { status: 400 });
  }

  try {
    const data = await reorderPlans(orderedIds);
    return NextResponse.json({ data });
  } catch (err) {
    return handleRepoError(err);
  }
}
