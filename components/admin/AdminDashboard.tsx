"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PortfolioData } from "@/lib/types";
import CategoryManager from "./CategoryManager";
import PhotoManager from "./PhotoManager";
import PhotoUploadForm from "./PhotoUploadForm";
import LogoManager from "./LogoManager";
import PlanManager from "./PlanManager";
import PasswordManager from "./PasswordManager";

const TABS = [
  { id: "categorias", label: "Categorias" },
  { id: "fotos", label: "Fotos" },
  { id: "planos", label: "Planos" },
  { id: "logo", label: "Logo" },
  { id: "senha", label: "Senha" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminDashboard({ initialData }: { initialData: PortfolioData }) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState<TabId>("categorias");
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-12 md:px-10">
      <header className="mb-10 flex items-center justify-between border-b border-panel-2 pb-6">
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

      <nav className="mb-10 flex gap-2 border-b border-panel-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-xs uppercase tracking-[0.3em] transition-colors ${
              tab === t.id
                ? "border-b border-foreground text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "categorias" && (
        <section>
          <CategoryManager data={data} onUpdate={setData} />
        </section>
      )}

      {tab === "fotos" && (
        <section>
          <PhotoUploadForm categories={data.categories} onUpdate={setData} />
          <PhotoManager data={data} onUpdate={setData} />
        </section>
      )}

      {tab === "planos" && (
        <section>
          <PlanManager data={data} onUpdate={setData} />
        </section>
      )}

      {tab === "logo" && (
        <section>
          <LogoManager logo={data.logo} onUpdate={setData} />
        </section>
      )}

      {tab === "senha" && (
        <section>
          <PasswordManager />
        </section>
      )}
    </div>
  );
}
