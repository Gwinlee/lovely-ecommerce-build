import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQueryOptions } from "@/lib/products.functions";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { PackageOpen, TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oja Oba — Everyday Goods" },
      {
        name: "description",
        content:
          "Browse everyday essentials — backpacks, ceramics, headphones, homeware and more. Prices in Naira, delivered with care.",
      },
      { property: "og:title", content: "Oja Oba — Everyday Goods" },
      {
        property: "og:description",
        content: "Browse everyday essentials — backpacks, ceramics, headphones, homeware and more. Prices in Naira.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(productsQueryOptions());
  },
  pendingComponent: HomeSkeleton,
  errorComponent: HomeError,
  component: HomePage,
});

function HomePage() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <section className="hero-intro mt-6 rounded-2xl border border-border bg-card px-6 py-12 text-center sm:mt-10 sm:px-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          OJA OBA MARKET
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
          Shop the market. Skip the crowd.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          Everything you need, all in one market.
        </p>
      </section>

      <section className="mt-10 sm:mt-14">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <PackageOpen className="state-icon" aria-hidden="true" />
            <h2 className="font-display text-2xl font-semibold text-foreground">No products yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The shelves are being stocked. Please check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-semibold text-foreground">Shop all</h2>
              <p className="text-sm text-muted-foreground">
                {products.length} item{products.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="product-grid mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function HomeSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6" aria-live="polite" aria-busy="true">
      <div className="mt-6 rounded-2xl border border-border bg-card px-6 py-12 sm:mt-10 sm:py-16">
        <div className="mx-auto h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="mx-auto mt-4 h-10 w-3/4 max-w-xl animate-pulse rounded bg-muted" />
        <div className="mx-auto mt-4 h-4 w-2/3 max-w-md animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-square w-full animate-pulse bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function HomeError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="mt-10 rounded-2xl border border-destructive/30 bg-card px-6 py-16 text-center">
        <TriangleAlert className="state-icon" aria-hidden="true" />
        <h2 className="font-display text-2xl font-semibold text-foreground">
          We couldn't load the shop
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while fetching the products. Please try again.
        </p>
        <Button
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try again
        </Button>
      </div>
    </main>
  );
}
