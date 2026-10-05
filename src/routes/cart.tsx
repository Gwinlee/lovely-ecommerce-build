import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/format";
import { productsQueryOptions } from "@/lib/products.functions";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Oja Oba" },
      { name: "description", content: "Review the items in your Oja Oba cart, adjust quantities and see your total in Naira." },
      { property: "og:title", content: "Your Cart — Oja Oba" },
      { property: "og:description", content: "Review your cart and total in Naira at Oja Oba." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total, count, hydrated, setQuantity, removeItem, syncWithProducts } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const products = useQuery(productsQueryOptions());
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const onCheckout = async () => {
    if (user) {
      navigate({ to: "/checkout" });
      return;
    }
    setMessage("Please sign in with Google to check out. You'll come back to your cart afterwards.");
    try {
      await signInWithGoogle("/cart");
    } catch {
      setMessage("Sign-in failed. Please try again.");
    }
  };

  // Refresh stock levels and prices from the shop so limits stay accurate.
  useEffect(() => {
    if (hydrated && products.data) syncWithProducts(products.data);
  }, [hydrated, products.data, syncWithProducts]);

  if (!hydrated) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-28 animate-pulse rounded-xl bg-muted" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
      <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight text-foreground">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Nothing here yet — have a look around the shop and add something you love.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((item) => {
              const atMax = item.quantity >= item.stockQuantity;
              return (
                <li key={item.productId} className="flex gap-4 p-4">
                  <Link
                    to="/products/$id"
                    params={{ id: String(item.productId) }}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-24 sm:w-24"
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No image</div>
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to="/products/$id"
                          params={{ id: String(item.productId) }}
                          className="font-display text-base font-semibold text-foreground hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{formatNaira(item.price)} each</p>
                      </div>
                      <p className="shrink-0 font-semibold text-foreground">{formatNaira(item.price * item.quantity)}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-lg border border-border">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          disabled={item.quantity <= 1}
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="h-9 w-9 text-lg text-foreground hover:bg-secondary disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-medium" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={atMax}
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="h-9 w-9 text-lg text-foreground hover:bg-secondary disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-sm font-medium text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    {atMax && (
                      <p className="text-xs text-muted-foreground">Only {item.stockQuantity} in stock</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-2xl border border-border bg-card p-5">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Items</span>
              <span>{count}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-semibold text-foreground">
              <span>Total</span>
              <span>{formatNaira(total)}</span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {user ? "Checkout" : "Sign in to check out"}
            </button>
            {message && (
              <p role="status" className="mt-3 rounded-lg bg-secondary px-3 py-2 text-center text-sm text-secondary-foreground">
                {message}
              </p>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
