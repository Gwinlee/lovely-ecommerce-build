import { createFileRoute, Link } from "@tanstack/react-router";
import { getProduct } from "@/lib/products.functions";
import { formatNaira } from "@/lib/format";
import { AddToCartButton } from "@/components/product-card";
import type { Product } from "@/lib/products.functions";

function detailHead(loaderData?: { product: Product | null }) {
  const product = loaderData?.product;
  if (!product) {
    return {
      meta: [
        { title: "Product not found — Kasuwa Market" },
        { name: "robots", content: "noindex" },
      ],
    };
  }
  const blurb =
    product.description?.slice(0, 160) ??
    `Buy ${product.name} at Kasuwa Market — ${formatNaira(product.price)}.`;
  return {
    meta: [
      { title: `${product.name} — Kasuwa Market` },
      { name: "description", content: blurb },
      { property: "og:title", content: `${product.name} — Kasuwa Market` },
      { property: "og:description", content: blurb },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}


export const Route = createFileRoute("/products/$id")({
  head: () => detailHead(undefined),
  loader: async ({ params }) => {
    const id = Number(params.id);
    const product = await getProduct({ data: { id } });
    return { product };
  },
  pendingComponent: DetailSkeleton,
  errorComponent: DetailError,
  notFoundComponent: ProductNotFound,
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product } = Route.useLoaderData();

  if (!product) return <ProductNotFound />;

  const outOfStock = product.stock_quantity <= 0;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <nav className="mt-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">
          Shop
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center text-sm text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-medium text-foreground">{formatNaira(product.price)}</p>

          <div className="mt-4">
            {outOfStock ? (
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                Out of stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                In stock — {product.stock_quantity} available
              </span>
            )}
          </div>

          {product.description && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </h2>
              <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-foreground/90">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-8 max-w-sm">
            <AddToCartButton
              product={product}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg text-base font-semibold transition-colors"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailSkeleton() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6" aria-live="polite" aria-busy="true">
      <div className="mt-6 h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-7 w-1/4 animate-pulse rounded bg-muted" />
          <div className="h-7 w-32 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-12 w-full max-w-sm animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </main>
  );
}

function DetailError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <div className="mt-10 rounded-2xl border border-destructive/30 bg-card px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          We couldn't load this product
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Back to the shop
          </Link>
        </div>
      </div>
    </main>
  );
}

function ProductNotFound() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <div className="mt-10 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold text-foreground">Product not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This item may have been removed or the link is out of date.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to the shop
        </Link>
      </div>
    </main>
  );
}
