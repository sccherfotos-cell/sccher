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
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function selectTab(id: TabId) {
    setTab(id);
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-12 md:px-10">
      <header className="mb-10 flex items-center justify-between border-b border-panel-2 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-muted">Admin</span>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">Painel do Portfólio</h1>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={`h-px w-5 bg-foreground transition-transform duration-200 ${
              menuOpen ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-foreground transition-transform duration-200 ${
              menuOpen ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </header>

      {/* Desktop tab nav */}
      <nav className="mb-10 hidden gap-2 border-b border-panel-2 lg:flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTab(t.id)}
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

      {/* Mobile/tablet tab nav, collapsed behind the hamburger */}
      {menuOpen && (
        <nav className="mb-10 flex flex-col border-b border-panel-2 pb-2 lg:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTab(t.id)}
              className={`py-3 text-left text-xs uppercase tracking-[0.3em] ${
                tab === t.id ? "text-foreground" : "text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      )}

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

      <div className="mt-16 border-t border-panel-2 pt-6 text-center">
        <button
          onClick={logout}
          className="text-xs uppercase tracking-[0.3em] text-muted transition-colors hover:text-foreground"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
