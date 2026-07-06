import type { Metadata } from "next";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato — SCCHER",
};

export default function Contato() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-6 py-32 md:px-10">
      <div className="max-w-xl">
        <span className="text-xs uppercase tracking-[0.4em] text-muted">
          Contato
        </span>
        <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-5xl">
          Vamos marcar seu ensaio.
        </h1>

        <div className="mt-12 flex flex-col gap-6 text-sm">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-muted">
              Fotógrafa
            </span>
            <span className="mt-1 block text-lg">Cinthia Scalese Cherfen</span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-muted">
              Telefone
            </span>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-lg text-muted transition-colors hover:text-foreground"
            >
              (35) 99217-4364
            </a>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-muted">
              Email
            </span>
            <a
              href="mailto:cinthiascalese.cs@gmail.com"
              className="mt-1 block text-lg text-muted transition-colors hover:text-foreground"
            >
              cinthiascalese.cs@gmail.com
            </a>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-muted">
              Redes sociais
            </span>
            <div className="mt-1 flex flex-col gap-1 text-lg text-muted">
              <a
                href="https://www.instagram.com/sccher.fotografia"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                @sccher.fotografia
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
