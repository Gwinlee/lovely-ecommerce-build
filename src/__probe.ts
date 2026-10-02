import { getProduct, listProducts } from "@/lib/products.functions";
import type { Product } from "@/lib/products.functions";
type R = Awaited<ReturnType<typeof getProduct>>;
type L = Awaited<ReturnType<typeof listProducts>>;
declare const r: R; declare const l: L;
export type A = R extends Product | null ? "ok" : "bad";
export type B = L extends Product[] ? "ok" : "bad";
export type RShow = R;
