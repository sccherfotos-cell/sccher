# PRD: Portfólio SCCHER — Cinthia Scalese Cherfen

> Este documento reflete o site **como ele existe hoje**, não a proposta
> original. O projeto começou a partir de um briefing com uma proposta mais
> conceitual ("experiência imersiva", efeito de lente em Three.js) que foi
> simplificada e evoluiu bastante ao longo do desenvolvimento — ganhou um
> painel administrativo completo, planos editáveis, integração com
> WhatsApp/Instagram, tema claro/escuro e um layout mobile próprio, entre
> outras coisas que não estavam no briefing inicial.

## 1. Visão Geral

Site de portfólio para a fotógrafa Cinthia Scalese Cherfen (marca "SCCHER"),
com estética clean, técnica e monocromática (referência de câmera/lente),
onde a própria cliente consegue gerenciar fotos, categorias, planos e logo
sem depender de alteração de código.

## 2. Público-Alvo

Clientes em busca de ensaios fotográficos (pessoais, corporativos, infantis,
eventos). Linguagem visual assertiva e técnica, mas o conteúdo/copy foca em
gerar desejo de agendar um ensaio, não em ser puramente conceitual.

## 3. Estrutura do Site

- **Home (`/`)** — hero com frase de efeito, lente de câmera com diafragma
  animado ao fundo (SVG, não Three.js), botões para Portfólio e Valores.
- **Portfólio (`/portfolio`)** — grade de categorias (cada uma com uma foto de
  capa escolhida no painel); `/portfolio/[categoria]` abre a galeria completa
  daquela categoria.
- **Valores (`/valores`)** — planos e preços. No desktop, grade lado a lado;
  no mobile, carrossel de 1 plano por vez com setas finas sobre o card e
  troca automática a cada 5s. Também tem "Como funciona", "Fotos extras" e
  "Formas de pagamento".
- **Contato (`/contato`)** — telefone (abre WhatsApp), email, Instagram
  (`@sccher.fotografia`, link direto pro perfil).
- **Admin (`/admin`)** — painel protegido por senha (ver seção 5).

Elementos presentes em todas as páginas: cabeçalho com logo (editável) e
navegação (menu hamburguer em mobile/tablet, nav horizontal em desktop),
botão flutuante de WhatsApp, toggle de tema claro/escuro, cadeado discreto
(acesso ao admin) e crédito da desenvolvedora no rodapé.

## 4. Identidade Visual / UX

- Paleta monocromática com tokens semânticos (`--bg`, `--fg`, `--panel`,
  `--panel-2`, `--muted`), com **tema claro e escuro** alternável pelo
  visitante (toggle sol/lua no header), persistido em `localStorage`.
- Tipografia técnica monoespaçada (JetBrains Mono).
- Motivo visual de câmera: lente com diafragma animado na Home (SVG +
  `requestAnimationFrame`, não WebGL/Three.js — decisão tomada por
  simplicidade e performance).
- Responsivo, com atenção específica ao mobile: menu hamburguer, carrossel
  de planos, textos/espaçamentos ajustados.

## 5. Painel Administrativo

Acesso: ícone de cadeado discreto no rodapé → `/admin/login` (senha única,
não é multi-usuário) → sessão via cookie assinado (7 dias).

Abas do painel (`/admin`):
- **Categorias** — criar, editar (nome), excluir (bloqueado se tiver fotos),
  reordenar.
- **Fotos** — upload por categoria, excluir, reordenar, marcar como
  foto-capa da categoria.
- **Planos** — nome, preço, observação opcional, lista livre de itens
  (rótulo + valor), criar/editar/excluir/reordenar.
- **Logo** — trocar o logo do site, com opção de remover o fundo
  automaticamente (chroma-key por cor do canto da imagem).

## 6. Integrações

- **WhatsApp**: botão flutuante (todas as páginas), "Fale comigo" (Valores) e
  telefone (Contato) abrem `wa.me` com mensagem pré-definida indicando que a
  pessoa veio pelo site.
  Mensagem atual: *"Olá! Conheci seu trabalho através do seu site e
  gostaria de mais informações sobre como funciona um ensaio com você."*
- **Instagram**: handle em Contato (`@sccher.fotografia`) linka direto pro
  perfil.
- **Crédito da desenvolvedora**: rodapé de todas as páginas ("Criado por Ana
  Lívia Brandelli"), linka pro WhatsApp dela com mensagem própria de
  orçamento.

## 7. Especificações Técnicas

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TypeScript,
  Tailwind CSS v4.
- **Animações**: Framer Motion (transições, carrossel de planos).
- **Imagens**: `next/image` com otimização; fotos/logo hospedados no Vercel
  Blob (`images.remotePatterns` liberado pro domínio do Blob).
- **Processamento de imagem**: `sharp` (dimensões, conversão, remoção de
  fundo do logo).

## 8. Armazenamento de Dados

Sem banco de dados tradicional — tudo vive no **Vercel Blob**:
- Um JSON de dados (`data/portfolio.json`, versionado por pathname único a
  cada save — necessário porque URLs públicas do Blob são cacheadas por CDN
  e reescrever o mesmo arquivo podia devolver uma versão antiga).
- Arquivos de fotos e logo, cada upload com pathname próprio.

## 9. Autenticação

Senha única (`ADMIN_PASSWORD`, variável de ambiente) + cookie de sessão
assinado com HMAC via Web Crypto (`SESSION_SECRET`), verificado em
`proxy.ts` (roda em toda rota `/admin/*` e `/api/admin/*`).

## 10. Hospedagem

Vercel (`sccherfotos-2829s-projects/sccher`), deploy automático a cada push
na branch `master` do GitHub (`sccherfotos-cell/sccher`). Variáveis de
ambiente configuradas diretamente no projeto Vercel.

## 11. Status

Tudo descrito acima está implementado e em produção em
`https://sccher.vercel.app`. Não há fotos reais carregadas ainda — as
categorias existem (Ensaios Pessoais, Ensaios Corporativos, Ensaios
Infantis, Eventos) mas aguardam upload via o painel.

### Fora do escopo atual (não implementado)

- Efeito de lente/distorção em Three.js/WebGL da proposta original — foi
  substituído por uma versão em SVG/CSS, mais leve e com o mesmo efeito
  visual pretendido (diafragma animado).
- Multi-usuário no admin (é uma senha única, compartilhada).
- Reordenação de fotos por arrastar-e-soltar (hoje é por setas ↑/↓).
