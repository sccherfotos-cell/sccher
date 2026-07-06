import type { Metadata } from "next";
import { getPortfolioData } from "@/lib/blob-store";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import PlansCarousel from "@/components/PlansCarousel";
import type { Plan } from "@/lib/types";

export const metadata: Metadata = {
  title: "Valores — SCCHER",
};

async function loadPlans(): Promise<Plan[]> {
  try {
    const data = await getPortfolioData();
    return [...data.plans].sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

const GRID_COLS_CLASS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

export default async function Valores() {
  const plans = await loadPlans();
  const useCarouselOnDesktop = plans.length > 3;
  const gridColsClass = GRID_COLS_CLASS[Math.min(plans.length, 3)] ?? "sm:grid-cols-3";

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <header className="mb-14 max-w-2xl">
        <span className="text-xs uppercase tracking-[0.4em] text-muted">
          Orçamento
        </span>
        <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-5xl">
          Investimento e pacotes.
        </h1>
      </header>

      {/* Pricing tiers */}
      {plans.length > 0 && (
        <>
          <PlansCarousel plans={plans} fullWidth={useCarouselOnDesktop} />

          {!useCarouselOnDesktop && (
            <div className={`hidden gap-px overflow-hidden border border-panel-2 bg-panel-2 sm:grid ${gridColsClass}`}>
              {plans.map((plan) => (
                <div key={plan.id} className="flex flex-col bg-background p-6 md:p-8">
                  <h2 className="text-xs uppercase tracking-[0.35em] text-muted">
                    {plan.name}
                  </h2>

                  <dl className="mt-6 flex flex-1 flex-col gap-4 text-sm">
                    {plan.details.map((detail) => (
                      <div key={detail.label}>
                        <dt className="text-[10px] uppercase tracking-[0.25em] text-muted">
                          {detail.label}
                        </dt>
                        <dd className="mt-1 leading-relaxed">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8 border-t border-panel-2 pt-6">
                    <span className="text-2xl font-medium tracking-tight">{plan.price}</span>
                    {plan.priceNote && (
                      <span className="ml-2 text-xs text-muted">{plan.priceNote}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-muted">
            * Orçamento válido por 30 dias após o envio.
          </p>
        </>
      )}

      {/* Como funciona */}
      <section className="mt-24 grid gap-12 md:grid-cols-2">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-muted">
            Como funciona
          </span>
          <h3 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
            O processo do envio das fotos consiste em 2 etapas.
          </h3>

          <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-muted">
            <div>
              <span className="text-foreground">Etapa 1 — </span>
              As fotos serão tratadas e entregues por link para a seleção do
              cliente em até 7 dias úteis após o ensaio. Prazo de 30 dias para
              o cliente selecionar as fotos desejadas.
            </div>
            <div>
              <span className="text-foreground">Etapa 2 — </span>
              Entrega de todas as fotos editadas e selecionadas pelo cliente
              em até 7 dias úteis a partir da seleção, em arquivo digital,
              por email.
            </div>
          </div>

          <div className="mt-10 border-t border-panel-2 pt-6">
            <span className="text-xs uppercase tracking-[0.35em] text-muted">
              Fotos extras
            </span>
            <p className="mt-3 text-sm leading-relaxed">
              R$17 / foto — ou pacote com 10 fotos extras por R$132.
            </p>
          </div>
        </div>

        {/* Formas de pagamento */}
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-muted">
            Formas de pagamento
          </span>

          <div className="mt-8 flex flex-col gap-8">
            <div>
              <h4 className="text-sm uppercase tracking-[0.25em]">Entrada</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                PIX: 30% do valor na reserva da data (valor não reembolsável).
              </p>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-[0.25em]">Restante do Pagamento</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                70% no dia das fotos.
                <br />
                Cartão de crédito: em até 4 vezes; pix 10% de desconto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-24 border-t border-panel-2 pt-10">
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.3em] text-muted transition-colors hover:text-foreground"
        >
          Fale comigo →
        </a>
      </div>
    </div>
  );
}
