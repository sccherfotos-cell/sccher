import Link from "next/link";
import ApertureLens from "@/components/ApertureLens";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 pt-28 pb-16 text-center">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, transparent 40%, color-mix(in srgb, var(--bg) 60%, transparent) 100%)",
        }}
        aria-hidden
      />

      <ApertureLens className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 opacity-[0.2] sm:h-[460px] sm:w-[460px] md:h-[540px] md:w-[540px]" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-8">
        <h1 className="text-4xl font-medium leading-tight tracking-tight sm:text-6xl md:text-7xl">
          A experiência de se olhar através de lentes que revelam a sua
          melhor versão.
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Retratos profissionais, ensaios pessoais, corporativos e infantis,
          registrados com excelência técnica e uma estética clean, minimalista
          e atemporal.
        </p>

        <span className="text-xs uppercase tracking-[0.5em] text-muted">
          Cinthia Scalese Cherfen — Fotografia
        </span>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/portfolio"
            className="border border-foreground px-8 py-3 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background"
          >
            Ver Portfólio
          </Link>
          <Link
            href="/valores"
            className="px-8 py-3 text-xs uppercase tracking-[0.3em] text-muted transition-colors hover:text-foreground"
          >
            Ver Valores
          </Link>
        </div>
      </div>
    </div>
  );
}
