import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/blob-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
