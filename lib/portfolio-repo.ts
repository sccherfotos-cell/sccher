import sharp from "sharp";
import { getPortfolioData, savePortfolioData, slugify, uploadFile, deleteFile } from "./blob-store";
import { removeBackground } from "./chroma-key";
import type { Category, Photo, Plan, PlanDetail, PortfolioData } from "./types";

export class CategoryNotEmptyError extends Error {
  constructor() {
    super("Esta categoria ainda tem fotos. Mova ou exclua as fotos antes de excluir a categoria.");
  }
}

export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} não encontrado(a).`);
  }
}

function uniqueSlug(data: PortfolioData, name: string, excludeId?: string): string {
  const base = slugify(name) || "categoria";
  let candidate = base;
  let n = 2;
  while (data.categories.some((c) => c.slug === candidate && c.id !== excludeId)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

function findCategory(data: PortfolioData, id: string): Category {
  const category = data.categories.find((c) => c.id === id);
  if (!category) throw new NotFoundError("Categoria");
  return category;
}

function findPlan(data: PortfolioData, id: string): Plan {
  const plan = data.plans.find((p) => p.id === id);
  if (!plan) throw new NotFoundError("Plano");
  return plan;
}

export async function addCategory(name: string): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const order = data.categories.length ? Math.max(...data.categories.map((c) => c.order)) + 1 : 0;
  const category: Category = {
    id: crypto.randomUUID(),
    name,
    slug: uniqueSlug(data, name),
    coverPhotoId: null,
    photos: [],
    order,
  };
  data.categories.push(category);
  await savePortfolioData(data);
  return data;
}

export async function renameCategory(id: string, name: string): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const category = findCategory(data, id);
  category.name = name;
  category.slug = uniqueSlug(data, name, id);
  await savePortfolioData(data);
  return data;
}

export async function deleteCategory(id: string): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const category = findCategory(data, id);
  if (category.photos.length > 0) throw new CategoryNotEmptyError();
  data.categories = data.categories.filter((c) => c.id !== id);
  await savePortfolioData(data);
  return data;
}

export async function reorderCategories(orderedIds: string[]): Promise<PortfolioData> {
  const data = await getPortfolioData();
  orderedIds.forEach((id, index) => {
    const category = data.categories.find((c) => c.id === id);
    if (category) category.order = index;
  });
  await savePortfolioData(data);
  return data;
}

export async function addPhoto(
  categoryId: string,
  fileBuffer: Buffer,
  originalFilename: string,
  contentType: string
): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const category = findCategory(data, categoryId);

  const metadata = await sharp(fileBuffer).metadata();
  const ext = (originalFilename.split(".").pop() || "jpg").toLowerCase();
  const id = crypto.randomUUID();
  const uploaded = await uploadFile(`photos/${categoryId}/${id}.${ext}`, fileBuffer, contentType);

  const photo: Photo = {
    id,
    url: uploaded.url,
    blobPathname: uploaded.pathname,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    createdAt: new Date().toISOString(),
  };

  category.photos.push(photo);
  if (!category.coverPhotoId) category.coverPhotoId = photo.id;

  await savePortfolioData(data);
  return data;
}

export async function deletePhoto(categoryId: string, photoId: string): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const category = findCategory(data, categoryId);
  const photo = category.photos.find((p) => p.id === photoId);
  if (!photo) throw new NotFoundError("Foto");

  category.photos = category.photos.filter((p) => p.id !== photoId);
  await deleteFile(photo.url);

  if (category.coverPhotoId === photoId) {
    category.coverPhotoId = category.photos[0]?.id ?? null;
  }

  await savePortfolioData(data);
  return data;
}

export async function movePhoto(
  categoryId: string,
  photoId: string,
  direction: "up" | "down"
): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const category = findCategory(data, categoryId);
  const index = category.photos.findIndex((p) => p.id === photoId);
  if (index === -1) throw new NotFoundError("Foto");

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= category.photos.length) return data;

  const photos = category.photos;
  [photos[index], photos[swapWith]] = [photos[swapWith], photos[index]];

  await savePortfolioData(data);
  return data;
}

export async function setPhotoFocalPoint(
  categoryId: string,
  photoId: string,
  focalX: number,
  focalY: number
): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const category = findCategory(data, categoryId);
  const photo = category.photos.find((p) => p.id === photoId);
  if (!photo) throw new NotFoundError("Foto");

  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  photo.focalX = clamp(focalX);
  photo.focalY = clamp(focalY);

  await savePortfolioData(data);
  return data;
}

export async function setCoverPhoto(categoryId: string, photoId: string): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const category = findCategory(data, categoryId);
  if (!category.photos.some((p) => p.id === photoId)) throw new NotFoundError("Foto");
  category.coverPhotoId = photoId;
  await savePortfolioData(data);
  return data;
}

export async function replaceLogo(
  fileBuffer: Buffer,
  removeBg: boolean
): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const previousLogoUrl = data.logo?.url ?? null;

  const processed = removeBg
    ? await removeBackground(fileBuffer)
    : await sharp(fileBuffer).png().toBuffer();

  // Unique pathname per upload (not a fixed, overwritten one): Vercel Blob's
  // public URLs are CDN-cached, so reusing the same URL could keep serving
  // the old logo for a while after replacing it.
  const uploaded = await uploadFile(`logo/logo-${crypto.randomUUID()}.png`, processed, "image/png");

  data.logo = {
    url: uploaded.url,
    blobPathname: uploaded.pathname,
    updatedAt: new Date().toISOString(),
  };

  await savePortfolioData(data);

  if (previousLogoUrl) {
    await deleteFile(previousLogoUrl).catch(() => {});
  }

  return data;
}

export interface PlanInput {
  name: string;
  price: string;
  priceNote: string | null;
  details: PlanDetail[];
}

export async function addPlan(input: PlanInput): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const order = data.plans.length ? Math.max(...data.plans.map((p) => p.order)) + 1 : 0;
  const plan: Plan = { id: crypto.randomUUID(), order, ...input };
  data.plans.push(plan);
  await savePortfolioData(data);
  return data;
}

export async function updatePlan(id: string, input: PlanInput): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const plan = findPlan(data, id);
  plan.name = input.name;
  plan.price = input.price;
  plan.priceNote = input.priceNote;
  plan.details = input.details;
  await savePortfolioData(data);
  return data;
}

export async function deletePlan(id: string): Promise<PortfolioData> {
  const data = await getPortfolioData();
  findPlan(data, id);
  data.plans = data.plans.filter((p) => p.id !== id);
  await savePortfolioData(data);
  return data;
}

export async function reorderPlans(orderedIds: string[]): Promise<PortfolioData> {
  const data = await getPortfolioData();
  orderedIds.forEach((id, index) => {
    const plan = data.plans.find((p) => p.id === id);
    if (plan) plan.order = index;
  });
  await savePortfolioData(data);
  return data;
}
