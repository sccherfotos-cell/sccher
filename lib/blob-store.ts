import { put, head, del, BlobNotFoundError } from "@vercel/blob";
import type { PortfolioData } from "./types";

const DATA_PATHNAME = "data/portfolio.json";

const COMBINING_DIACRITICS = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g"
);

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function requireToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN não configurado. Crie um Blob Store na Vercel (Dashboard > Storage) e defina essa variável em .env.local."
    );
  }
  return token;
}

function seedData(): PortfolioData {
  const names = ["Ensaios Pessoais", "Ensaios Corporativos", "Ensaios Infantis", "Eventos"];
  return {
    version: 1,
    categories: names.map((name, i) => ({
      id: crypto.randomUUID(),
      name,
      slug: slugify(name),
      coverPhotoId: null,
      photos: [],
      order: i,
    })),
    logo: null,
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const token = requireToken();
  try {
    const info = await head(DATA_PATHNAME, { token });
    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao buscar dados do portfólio no Blob.");
    return (await res.json()) as PortfolioData;
  } catch (err) {
    if (err instanceof BlobNotFoundError) {
      const seeded = seedData();
      await savePortfolioData(seeded);
      return seeded;
    }
    throw err;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  const token = requireToken();
  await put(DATA_PATHNAME, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
  });
}

export async function uploadFile(
  pathname: string,
  body: Buffer,
  contentType: string
): Promise<{ url: string; pathname: string }> {
  const token = requireToken();
  const result = await put(pathname, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
    token,
  });
  return { url: result.url, pathname: result.pathname };
}

export async function deleteFile(url: string): Promise<void> {
  const token = requireToken();
  await del(url, { token });
}
