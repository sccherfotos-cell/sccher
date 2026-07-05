import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPortfolioData } from "@/lib/blob-store";
import type { PortfolioData } from "@/lib/types";

async function loadData(): Promise<PortfolioData | null> {
  try {
    return await getPortfolioData();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadData();
  const category = data?.categories.find((c) => c.slug === slug);
  return { title: category ? `${category.name} — SCCHER` : "Portfólio — SCCHER" };
}

export default async function CategoryGallery({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadData();
  if (!data) notFound();

  const category = data.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <div className="relative min-h-screen bg-background px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <Link
        href="/portfolio"
        className="text-xs uppercase tracking-[0.3em] text-muted transition-colors hover:text-foreground"
      >
        ← Portfólio
      </Link>

      <header className="mb-14 mt-6 max-w-2xl">
        <h1 className="text-3xl font-medium tracking-tight sm:text-5xl">{category.name}</h1>
      </header>

      {category.photos.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma foto nesta categoria ainda.</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {category.photos.map((photo) => (
            <div key={photo.id} className="relative mb-4 w-full overflow-hidden border border-panel-2 bg-panel">
              <Image
                src={photo.url}
                alt={category.name}
                width={photo.width || 800}
                height={photo.height || 600}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
