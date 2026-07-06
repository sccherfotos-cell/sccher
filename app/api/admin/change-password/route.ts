import { NextResponse } from "next/server";
import { checkPassword, hashPassword } from "@/lib/auth";
import { saveStoredPasswordHash } from "@/lib/blob-store";

export const runtime = "nodejs";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (!(await checkPassword(currentPassword))) {
    return NextResponse.json({ error: "Senha atual incorreta." }, { status: 401 });
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `A nova senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` },
      { status: 400 }
    );
  }

  const hash = await hashPassword(newPassword);
  await saveStoredPasswordHash(hash);

  return NextResponse.json({ ok: true });
}
