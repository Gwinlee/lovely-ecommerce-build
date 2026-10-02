import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"];

/**
 * The products table currently has no read policies, so it is only readable
 * with the service-role key. These server functions perform READ-ONLY
 * queries with an explicit, narrow column projection — the key never
 * reaches the browser.
 */
const PRODUCT_COLUMNS = "id, name, description, price, image_url, stock_quantity";

async function getReadOnlyClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabaseAdmin = await getReadOnlyClient();
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("id", { ascending: true });
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return (data ?? []) as Product[];
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ id: z.coerce.number().int().positive() }).parse(data))
  .handler(async ({ data }) => {
    const supabaseAdmin = await getReadOnlyClient();
    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(`Could not load the product: ${error.message}`);
    return (product ?? null) as Product | null;
  });

export const productsQueryOptions = () =>
  queryOptions({ queryKey: ["products"], queryFn: () => listProducts() });

