import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth, displayName } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/format";
import { placeOrder } from "@/lib/orders.functions";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, UserRound } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Oja Oba" },
      { name: "description", content: "Confirm your details and place your Oja Oba order." },
      { property: "og:title", content: "Checkout — Oja Oba" },
      { property: "og:description", content: "Confirm your details and place your order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const inputCls =
  "mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function CheckoutPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const { items, total, hydrated, clearCart } = useCart();
  const navigate = useNavigate();
  const submit = useServerFn(placeOrder);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !prefilled) {
      const n = displayName(user);
      setName(n === user.email ? "" : n);
      setEmail(user.email ?? "");
      setPrefilled(true);
    }
  }, [user, prefilled]);

  if (loading || !hydrated) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading checkout">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-40 animate-pulse rounded-xl bg-muted" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-16 text-center sm:px-6">
        <UserRound className="state-icon" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold text-foreground">Sign in to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please sign in with Google. We'll bring you back to your cart.</p>
        <Button
          type="button"
          onClick={() => signInWithGoogle("/cart").catch(() => setError("Sign-in failed. Please try again."))}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Sign in with Google
        </Button>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-16 text-center sm:px-6">
        <ShoppingBag className="state-icon" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold text-foreground">Your cart is empty</h1>
        <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground">
          Start shopping
        </Link>
      </main>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email.");
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          customerName: name.trim(),
          customerEmail: email.trim(),
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      clearCart();
      navigate({ to: "/orders/$id", params: { id: String(res.orderId) } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.includes("Unauthorized")
          ? "Your session has expired. Please sign in again."
          : "We couldn't place your order. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
      <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight text-foreground">Checkout</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={onSubmit} aria-busy={submitting} className="h-fit rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Your details</h2>
          <label className="mt-4 block text-sm font-medium text-foreground">
            Full name
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} autoComplete="name" required />
          </label>
          <label className="mt-4 block text-sm font-medium text-foreground">
            Email
            <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} autoComplete="email" required />
          </label>
          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={submitting}
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
            {submitting ? "Placing order…" : "Place order"}
          </Button>
          <Link to="/cart" className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground">
            Back to cart
          </Link>
        </form>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Order summary</h2>
          <ul className="mt-3 divide-y divide-border">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-3 py-2 text-sm">
                <span className="text-foreground">
                  {i.name} <span className="text-muted-foreground">× {i.quantity}</span>
                </span>
                <span className="shrink-0 font-medium text-foreground">{formatNaira(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-semibold text-foreground">
            <span>Total</span>
            <span>{formatNaira(total)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Final prices are confirmed when you place your order.</p>
        </aside>
      </div>
    </main>
  );
}
