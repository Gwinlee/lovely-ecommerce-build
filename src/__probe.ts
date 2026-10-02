import { getProduct } from "@/lib/products.functions";
type R = Awaited<ReturnType<typeof getProduct>>;
declare const r: R;
const n: number = r;
