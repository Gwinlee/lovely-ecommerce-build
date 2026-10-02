import type { Route } from "./routes/products.$id";
type L = typeof Route.types.loaderData;
type H = Parameters<NonNullable<(typeof Route)["options"]["head"]>>[0]["loaderData"];
declare const l: L; declare const h: H;
const a: string = l;
const b: string = h;
