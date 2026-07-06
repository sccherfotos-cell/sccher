@AGENTS.md

# SCCHER — Portfólio da fotógrafa Cinthia Scalese Cherfen

Site de portfólio + painel administrativo para a fotógrafa Cinthia Scalese
Cherfen (marca "SCCHER"). Next.js 16 (App Router) + TypeScript + Tailwind v4,
hospedado na Vercel, com fotos/categorias/planos/logo geridos via um painel
admin próprio (sem CMS externo).

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript.
- Tailwind CSS v4 (`@theme inline` em `app/globals.css` mapeia tokens de cor pro Tailwind).
- Framer Motion (transições/carrossel).
- `sharp` — processamento de imagem (remoção de fundo do logo, leitura de dimensões de fotos).
- `@vercel/blob` — armazenamento de arquivos (fotos, logo) e do JSON de dados (`data/portfolio.json`).

## Rodando localmente

```
npm install
npm run dev
```

Precisa de um `.env.local` com (veja `.env.local.example`):
- `ADMIN_PASSWORD` — senha do painel `/admin`.
- `SESSION_SECRET` — string aleatória, assina o cookie de sessão do admin.
- `BLOB_READ_WRITE_TOKEN` — token do Blob Store da Vercel (Dashboard → Storage). Sem ele, o site público funciona normalmente (com fallbacks), mas o painel admin não consegue ler/gravar dados.

## Estrutura

- `app/page.tsx` — Home (hero, lente com diafragma animado via `components/ApertureLens.tsx`).
- `app/portfolio/page.tsx` — grade de categorias (usa a foto-capa de cada uma); `app/portfolio/[slug]/page.tsx` — galeria de uma categoria.
- `app/valores/page.tsx` — planos/preços (grade no desktop, carrossel de 1-por-vez com autoplay de 5s no mobile via `components/PlansCarousel.tsx`) + como funciona + formas de pagamento.
- `app/contato/page.tsx` — dados de contato (telefone/Instagram apontam pro WhatsApp/Instagram real).
- `app/admin/` — painel protegido por senha (`login/page.tsx` + `page.tsx` com abas Categorias/Fotos/Planos/Logo em `components/admin/AdminDashboard.tsx`).
- `app/api/admin/**` — rotas de mutação do painel (categorias, fotos, planos, logo, login/logout). Todas `runtime = "nodejs"` (usam `sharp`/`@vercel/blob`).
- `app/api/portfolio/route.ts` — leitura pública dos dados (JSON).
- `proxy.ts` (era `middleware.ts` — renomeado por causa da depreciação no Next 16) — protege `/admin/*` e `/api/admin/*` checando o cookie de sessão.

## Dados e armazenamento (`lib/`)

- `lib/types.ts` — modelo: `PortfolioData { categories, logo, plans }`, cada `Category` tem `photos[]` + `coverPhotoId`.
- `lib/blob-store.ts` — persistência no Vercel Blob. **Importante**: URLs públicas do Blob são cacheadas por CDN (mínimo 1 min, não dá pra desativar) — por isso cada save do JSON de dados escreve um pathname novo (`data/portfolio-<sufixo>.json`) e a leitura sempre resolve o mais recente via `list()` (chamada de metadata, não sofre cache); snapshots antigos são apagados logo depois de cada save. O mesmo vale pro logo (`replaceLogo` em `lib/portfolio-repo.ts`) — nunca reescreve o mesmo pathname.
- `lib/portfolio-repo.ts` — operações de domínio (CRUD de categoria/foto/plano, capa, troca de logo com remoção de fundo opcional).
- `lib/chroma-key.ts` — remoção de fundo por distância de cor (amostra o canto da imagem).
- `lib/auth.ts` — sessão do admin assinada com **Web Crypto** (`crypto.subtle`), não o módulo `crypto` do Node — necessário porque isso roda tanto em `proxy.ts` (Edge) quanto nas rotas de API (Node).
- `lib/whatsapp.ts` — monta links `wa.me` (número/mensagem do site + `buildWhatsAppUrl` genérico, usado também pelo crédito da desenvolvedora no rodapé).

## Tema claro/escuro

Tokens semânticos em `app/globals.css`: `--bg`, `--fg`, `--panel`, `--panel-2`, `--muted`, com override em `:root[data-theme="light"]`. Mapeados no Tailwind via `@theme inline` → usar sempre as classes `bg-background`, `text-foreground`, `bg-panel`, `border-panel-2`, `text-muted` (nunca cores hardcoded tipo `bg-black`/`text-white`). Toggle em `components/ThemeToggle.tsx`; script inline em `app/layout.tsx` evita flash do tema errado no load.

## Deploy

Projeto Vercel: `sccherfotos-2829s-projects/sccher` (conta `sccherfotos@gmail.com`). Push em `master` dispara deploy automático. Variáveis de ambiente (`ADMIN_PASSWORD`, `SESSION_SECRET`, `BLOB_READ_WRITE_TOKEN`) já configuradas lá — se precisar mudar, usar `vercel env add`/`vercel env rm` (não editar o Blob na mão; use as próprias rotas `/api/admin/*` autenticadas, ou o painel).

## Convenções

- Sem comentários explicando "o quê" — só quando há uma decisão não-óbvia (ex.: por que o pathname do Blob é sempre novo).
- Componentes de página que dependem de dados do Blob sempre tratam falha de leitura com fallback gracioso (nunca derrubar o site público por falta de `BLOB_READ_WRITE_TOKEN` ou erro do Blob).
- Categorias/planos/fotos são geridos via o painel — não há mais conteúdo hardcoded nessas áreas (era assim antes da feature de admin).
