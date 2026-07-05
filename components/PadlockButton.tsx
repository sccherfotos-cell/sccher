import Link from "next/link";

export default function PadlockButton() {
  return (
    <Link
      href="/admin"
      aria-label="Admin"
      className="fixed bottom-4 right-4 z-40 text-muted opacity-30 transition-opacity hover:text-foreground hover:opacity-100"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="11" width="14" height="10" rx="1.5" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    </Link>
  );
}
