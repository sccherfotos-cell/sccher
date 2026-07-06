// Uses only Web Crypto (crypto.subtle / btoa / atob), never Node's `crypto`
// module — this file runs both in the Edge middleware and in Node.js route
// handlers, and Node's crypto module isn't available on the Edge runtime.

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padLength = (4 - (value.length % 4)) % 4;
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLength);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function getSecretKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não configurado em .env.local.");
  }
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(payload: string): Promise<string> {
  const key = await getSecretKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

/** Builds the signed session token to store in the admin cookie. */
export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `admin:${expiresAt}`;
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(payload));
  const signature = await sign(payload);
  return `${payloadB64}.${signature}`;
}

/** Verifies a session token's signature and expiry. */
export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  let payload: string;
  try {
    payload = new TextDecoder().decode(base64UrlDecode(payloadB64));
  } catch {
    return false;
  }

  const expectedSignature = await sign(payload);
  if (!constantTimeEqual(expectedSignature, signature)) return false;

  const match = /^admin:(\d+)$/.exec(payload);
  if (!match) return false;
  return Date.now() < Number(match[1]);
}

const PBKDF2_ITERATIONS = 120_000;

async function derivePasswordBits(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

/** Hashes a password for storage (PBKDF2-SHA256, random salt). */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await derivePasswordBits(password, salt);
  return `${base64UrlEncode(salt)}.${base64UrlEncode(bits)}`;
}

async function verifyPasswordHash(password: string, stored: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(".");
  if (!saltB64 || !hashB64) return false;
  const bits = await derivePasswordBits(password, base64UrlDecode(saltB64));
  return constantTimeEqual(base64UrlEncode(bits), hashB64);
}

/**
 * Compares a submitted password against the admin password. Checks the
 * hash saved via the admin panel's "change password" form first (Blob
 * storage); falls back to the ADMIN_PASSWORD env var so existing
 * deployments keep working until a custom password is set.
 */
export async function checkPassword(input: string): Promise<boolean> {
  // Dynamic import: this module also loads in the Edge middleware (proxy.ts),
  // which never calls checkPassword — keep @vercel/blob out of that bundle.
  const { getStoredPasswordHash } = await import("./blob-store");
  const stored = await getStoredPasswordHash();
  if (stored) return verifyPasswordHash(input, stored);

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return constantTimeEqual(input, expected);
}
