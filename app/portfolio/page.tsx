import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPortfolioData } from "@/lib/blob-store";
import type { PortfolioData } from "@/lib/types";

export const metadata: Metadata = {
  title: "Portfólio — SCCHER",
};

async function loadData(): Promise<PortfolioData> {
  try {
    return await getPortfolioData();
  } catch {
    return { version: 1, categories: [], logo: null, plans: [] };
  }
}

export default async function Portfolio() {
  const data = await loadData();
  const categories = [...data.categories].sort((a, b) => a.order - b.order);

  return (
    <div className="relative min-h-screen bg-background px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <header className="mb-14 max-w-2xl">
        <span className="text-xs uppercase tracking-[0.4em] text-muted">Portfólio</span>
        <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-5xl">
          Um enquadramento por vez.
        </h1>
      </header>

      {categories.length === 0 ? (
        <p className="text-sm text-muted">Em breve, novas categorias.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const cover = category.photos.find((p) => p.id === category.coverPhotoId);
            return (
              <Link
                key={category.id}
                href={`/portfolio/${category.slug}`}
                className="group relative block aspect-[4/5] w-full overflow-hidden border border-panel-2 bg-panel"
              >
                {cover ? (
                  <Image
                    src={cover.url}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="absolute inset-0 opacity-70 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{
                      background:
                        "repeating-linear-gradient(135deg, var(--panel) 0px, var(--panel) 24px, var(--panel-2) 24px, var(--panel-2) 48px)",
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white">
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
