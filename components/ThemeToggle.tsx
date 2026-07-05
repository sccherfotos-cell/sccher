"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = document.documentElement.getAttribute("data-theme");
    if (stored === "light") setThemeState("light");
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Alternar tema claro ou escuro">
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Tema claro"
        aria-pressed={theme === "light"}
        className="p-1 text-foreground transition-opacity duration-300"
        style={{ opacity: theme === "light" ? 1 : 0.35 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Tema escuro"
        aria-pressed={theme === "dark"}
        className="p-1 text-foreground transition-opacity duration-300"
        style={{ opacity: theme === "dark" ? 1 : 0.35 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
        </svg>
      </button>
    </div>
  );
}
