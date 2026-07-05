"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PortfolioData } from "@/lib/types";
import CategoryManager from "./CategoryManager";
import PhotoManager from "./PhotoManager";
import PhotoUploadForm from "./PhotoUploadForm";
import LogoManager from "./LogoManager";

export default function AdminDashboard({ initialData }: { initialData: PortfolioData }) {
  const [data, setData] = useState(initialData);
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-12 md:px-10">
      <header className="mb-12 flex items-center justify-between border-b border-panel-2 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-muted">Admin</span>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">Painel do Portfólio</h1>
        </div>
        <button
          onClick={logout}
          className="text-xs uppercase tracking-[0.3em] text-muted transition-colors hover:text-foreground"
        >
          Sair
        </button>
      </header>

      <div className="flex flex-col gap-16">
        <section>
          <h2 className="mb-6 text-xs uppercase tracking-[0.35em] text-muted">Categorias</h2>
          <CategoryManager data={data} onUpdate={setData} />
        </section>

        <section>
          <h2 className="mb-6 text-xs uppercase tracking-[0.35em] text-muted">Fotos</h2>
          <PhotoUploadForm categories={data.categories} onUpdate={setData} />
          <PhotoManager data={data} onUpdate={setData} />
        </section>

        <section>
          <h2 className="mb-6 text-xs uppercase tracking-[0.35em] text-muted">Logo</h2>
          <LogoManager logo={data.logo} onUpdate={setData} />
        </section>
      </div>
    </div>
  );
}
