import { getPortfolioData } from "@/lib/blob-store";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  try {
    const data = await getPortfolioData();
    return <AdminDashboard initialData={data} />;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao carregar dados.";
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md border border-panel-2 bg-panel p-8">
          <span className="text-xs uppercase tracking-[0.4em] text-muted">Configuração pendente</span>
          <p className="mt-4 text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    );
  }
}
