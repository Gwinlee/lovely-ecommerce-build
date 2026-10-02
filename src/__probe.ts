import type { Route } from "./routes/products.$id";
type H = Parameters<NonNullable<typeof Route.options.head>>[0];
declare const h: H;
export type A = typeof h.loaderData;
