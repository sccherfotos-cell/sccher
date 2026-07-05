import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Valores — SCCHER",
};

const PACKAGES = [
  {
    name: "Individual",
    price: "R$250",
    priceNote: null,
    details: [
      ["Duração", "1 hora de sessão"],
      ["Entregas", "10 fotos digitais editadas em alta resolução"],
      ["Locação", "Externa ou em estúdio (combinada com o cliente)"],
      ["Prazo de entrega", "Até 7 dias úteis"],
    ],
  },
  {
    name: "Equipe 1",
    price: "R$250",
    priceNote: "+ R$60 / pessoa",
    details: [
      ["Grupo", "No máximo 5 pessoas"],
      ["Duração", "2 a 3 horas de sessão"],
      ["Entregas", "10 fotos digitais editadas em alta resolução por pessoa"],
      ["Locação", "Externa ou em estúdio (combinada com o cliente)"],
      ["Prazo de entrega", "Até 10 dias úteis"],
    ],
  },
  {
    name: "Equipe 2",
    price: "R$300",
    priceNote: "+ R$80 / pessoa",
    details: [
      ["Grupo", "6 ou mais pessoas"],
      ["Duração", "4 horas de sessão"],
      ["Entregas", "10 fotos digitais editadas em alta resolução por pessoa"],
      ["Locação", "Externa ou em estúdio (combinada com o cliente)"],
      ["Prazo de entrega", "Até 15 dias úteis"],
    ],
  },
];

export default function Valores() {
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
      <div className="grid gap-px overflow-hidden border border-panel-2 bg-panel-2 sm:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <div key={pkg.name} className="flex flex-col bg-background p-6 md:p-8">
            <h2 className="text-xs uppercase tracking-[0.35em] text-muted">
              {pkg.name}
            </h2>

            <dl className="mt-6 flex flex-1 flex-col gap-4 text-sm">
              {pkg.details.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 leading-relaxed">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-t border-panel-2 pt-6">
              <span className="text-2xl font-medium tracking-tight">{pkg.price}</span>
              {pkg.priceNote && (
                <span className="ml-2 text-xs text-muted">
                  {pkg.priceNote}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-muted">
        * Orçamento válido por 30 dias após o envio.
      </p>

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
              R$15 / foto — ou pacote com 10 fotos extras por R$120.
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
              <h4 className="text-sm uppercase tracking-[0.25em]">Restante</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                PIX: 70% no dia das fotos.
                <br />
                Cartão de crédito: em até 4 vezes (acréscimo de 10% do valor).
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-24 border-t border-panel-2 pt-10">
        <Link
          href="/contato"
          className="text-xs uppercase tracking-[0.3em] text-muted transition-colors hover:text-foreground"
        >
          Fale comigo →
        </Link>
      </div>
    </div>
  );
}
