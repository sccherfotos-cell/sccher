import { put, list, del } from "@vercel/blob";
import type { Plan, PortfolioData } from "./types";

// Vercel Blob's public URLs are CDN-cached (minimum 1 minute, can't be
// disabled) — reading the same fixed pathname right after writing it can
// return a stale copy, which would silently revert admin edits. So every
// save writes a brand-new, uniquely-named blob (never previously cached)
// and reads always resolve the latest one via list() (a metadata call,
// not a cached file fetch). Older snapshots are deleted right after each
// save so the store doesn't grow unbounded.
const DATA_PREFIX = "data/portfolio";

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

function seedPlans(): Plan[] {
  const plans: Array<Omit<Plan, "id" | "order">> = [
    {
      name: "Individual",
      price: "R$275",
      priceNote: null,
      details: [
        { label: "Duração", value: "1 hora de sessão" },
        { label: "Entregas", value: "10 fotos digitais editadas em alta resolução" },
        { label: "Locação", value: "Externa ou em estúdio (combinada com o cliente)" },
        { label: "Prazo de entrega", value: "Até 7 dias úteis" },
      ],
    },
    {
      name: "Equipe 1",
      price: "R$275",
      priceNote: "+ R$66 / pessoa",
      details: [
        { label: "Grupo", value: "No máximo 5 pessoas" },
        { label: "Duração", value: "2 a 3 horas de sessão" },
        { label: "Entregas", value: "10 fotos digitais editadas em alta resolução por pessoa" },
        { label: "Locação", value: "Externa ou em estúdio (combinada com o cliente)" },
        { label: "Prazo de entrega", value: "Até 10 dias úteis" },
      ],
    },
    {
      name: "Equipe 2",
      price: "R$330",
      priceNote: "+ R$88 / pessoa",
      details: [
        { label: "Grupo", value: "6 ou mais pessoas" },
        { label: "Duração", value: "4 horas de sessão" },
        { label: "Entregas", value: "10 fotos digitais editadas em alta resolução por pessoa" },
        { label: "Locação", value: "Externa ou em estúdio (combinada com o cliente)" },
        { label: "Prazo de entrega", value: "Até 15 dias úteis" },
      ],
    },
  ];
  return plans.map((p, i) => ({ ...p, id: crypto.randomUUID(), order: i }));
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
    plans: seedPlans(),
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const token = requireToken();
  const { blobs } = await list({ prefix: DATA_PREFIX, token });

  if (blobs.length === 0) {
    const seeded = seedData();
    await savePortfolioData(seeded);
    return seeded;
  }

  const latest = [...blobs].sort(
    (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
  )[0];

  const res = await fetch(latest.url, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao buscar dados do portfólio no Blob.");
  const data = (await res.json()) as PortfolioData;

  // Backward-compat: data saved before `plans` existed won't have the field.
  if (!data.plans) data.plans = seedPlans();

  return data;
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  const token = requireToken();
  const result = await put(`${DATA_PREFIX}.json`, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
    token,
  });

  const { blobs } = await list({ prefix: DATA_PREFIX, token });
  const stale = blobs.filter((b) => b.pathname !== result.pathname).map((b) => b.url);
  if (stale.length > 0) await del(stale, { token });
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
