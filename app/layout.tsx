import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LensCursor from "@/components/LensCursor";
import SiteNav from "@/components/SiteNav";
import PadlockButton from "@/components/PadlockButton";
import { getPortfolioData } from "@/lib/blob-store";

const technical = JetBrains_Mono({
  variable: "--font-technical",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SCCHER — Cinthia Scalese Cherfen | Fotografia",
  description:
    "Retratos profissionais, ensaios pessoais e corporativos por Cinthia Scalese Cherfen.",
};

const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

async function getLogoUrl(): Promise<string> {
  try {
    const data = await getPortfolioData();
    return data.logo?.url ?? "/logo.png";
  } catch {
    // Blob store not configured yet (BLOB_READ_WRITE_TOKEN missing) — fall
    // back to the static logo so the public site keeps working regardless.
    return "/logo.png";
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoUrl = await getLogoUrl();

  return (
    <html
      lang="pt-BR"
      className={`${technical.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground cursor-none md:cursor-none">
        <LensCursor />
        <SiteNav logoUrl={logoUrl} />
        <main className="flex-1">{children}</main>
        <PadlockButton />
      </body>
    </html>
  );
}
