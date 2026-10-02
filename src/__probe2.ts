import type { Route } from "./routes/products.$id";
type H = Parameters<NonNullable<typeof Route.options.head>>[0];
type A = H["loaderData"];
// force reveal
declare const a: A;
const t: number = a;
