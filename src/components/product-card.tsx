import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products.functions";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/lib/cart";

export function AddToCartButton({ product, className }: { product: Product; className?: string }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const outOfStock = product.stock_quantity <= 0;
  if (outOfStock) {
    return (
      <button
        disabled
        className={
          className ??
          "inline-flex h-10 w-full items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground"
        }
      >
        Out of stock
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        addToCart({
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl: product.image_url,
        });
        setAdded(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setAdded(false), 1600);
      }}
      className={
        (className ??
          "inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition-colors") +
        (added ? " bg-primary/85 text-primary-foreground" : " bg-primary text-primary-foreground hover:bg-primary/90")
      }
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link to="/products/$id" params={{ id: String(product.id) }} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-secondary">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
          {product.stock_quantity <= 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-3 py-1 text-xs font-semibold text-background">
              Out of stock
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <Link to="/products/$id" params={{ id: String(product.id) }}>
            <h3 className="font-display text-lg font-semibold leading-snug text-foreground hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-base font-medium text-foreground">{formatNaira(product.price)}</p>
        </div>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
