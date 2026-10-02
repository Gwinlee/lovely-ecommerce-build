import type { Route } from "./routes/products.$id";
type H = Parameters<NonNullable<typeof Route.options.head>>[0];
type A = H["loaderData"];
declare const a: A;
const t: { product: unknown } | undefined = a;
