import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth, displayName } from "@/lib/auth";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function SiteHeader() {
  const { count } = useCart();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setBusy(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch {
      setAuthError("Sign-in failed. Please try again.");
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Kasuwa
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            Market
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? null : user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className="hidden max-w-40 truncate text-sm font-medium text-foreground sm:inline"
                title={displayName(user)}
              >
                {displayName(user)}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={busy}
                className="inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary disabled:opacity-60"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={busy}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary disabled:opacity-60"
            >
              <GoogleIcon />
              <span>{busy ? "Signing in…" : "Sign in"}</span>
            </button>
          )}

          <Link
            to="/"
            aria-label={`Cart with ${count} item${count === 1 ? "" : "s"}`}
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        </div>
      </div>
      {authError && (
        <p className="border-t border-border bg-destructive/10 px-4 py-1.5 text-center text-xs text-destructive">
          {authError}
        </p>
      )}
    </header>
  );
}
