import { buildWhatsAppUrl } from "@/lib/whatsapp";

const CREATOR_WHATSAPP_URL = buildWhatsAppUrl(
  "5516996052610",
  "Oi, Ana Lívia! Tudo bem? Vim através do site Sccher e gostaria de um orçamento de um site profissional."
);

export default function CreatorCredit() {
  return (
    <div className="pb-2 pt-10 text-center">
      <a
        href={CREATOR_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-foreground"
      >
        Criado por Ana Lívia Brandelli
      </a>
    </div>
  );
}
