import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const placeOrderInput = z.object({
  customerName: z.string().trim().min(1, "Please enter your full name").max(120),
  customerEmail: z.string().trim().email("Please enter a valid email").max(255),
  items: z
    .array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().positive().max(1000) }))
    .min(1, "Your cart is empty")
    .max(100),
});

function friendlyError(message: string): string {
  if (message.includes("INSUFFICIENT_STOCK")) {
    const [, name, stock] = message.match(/INSUFFICIENT_STOCK:([^:]*):(\d+)/) ?? [];
    return name
      ? `Sorry, only ${stock} of "${name}" left in stock. Please update your cart.`
      : "Some items don't have enough stock. Please update your cart.";
  }
  if (message.includes("PRODUCT_NOT_FOUND")) return "One of the products in your cart is no longer available.";
  if (message.includes("CART_EMPTY")) return "Your cart is empty.";
  if (message.includes("INVALID_QUANTITY")) return "One of the quantities in your cart is invalid.";
  if (message.includes("EMAIL_REQUIRED")) return "Please enter your email.";
  if (message.includes("NOT_SIGNED_IN")) return "Please sign in to place your order.";
  return "We couldn't place your order. Please try again.";
}

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => placeOrderInput.parse(data))
  .handler(async ({ data, context }) => {
    // Caller identity was verified by requireSupabaseAuth; the database
    // routine reads prices/stock itself and runs in a single transaction.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rpc = supabaseAdmin.rpc as unknown as (
      fn: string,
      args: Record<string, unknown>,
    ) => Promise<{ data: unknown; error: { message: string } | null }>;
    const { data: orderId, error } = await rpc.call(supabaseAdmin, "place_order", {
      p_user_id: context.userId,
      p_items: data.items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
      p_customer_name: data.customerName,
      p_customer_email: data.customerEmail,
    });
    if (error) {
      console.error("place_order failed:", error.message);
      return { ok: false as const, error: friendlyError(error.message) };
    }
    return { ok: true as const, orderId: Number(orderId) };
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.coerce.number().int().positive() }).parse(data))
  .handler(async ({ data, context }) => {
    // RLS limits these reads to the signed-in user's own order.
    const { data: order, error } = await context.supabase
      .from("orders")
      .select("id, customer_name, customer_email, status, total_amount, created_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error("Could not load your order.");
    if (!order) return null;

    const { data: items, error: itemsError } = await context.supabase
      .from("order_items")
      .select("id, product_id, quantity, unit_price")
      .eq("order_id", order.id)
      .order("id");
    if (itemsError) throw new Error("Could not load your order items.");

    const ids = (items ?? []).map((i) => i.product_id);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: products } = ids.length
      ? await supabaseAdmin.from("products").select("id, name, image_url").in("id", ids)
      : { data: [] as { id: number; name: string; image_url: string | null }[] };
    const byId = new Map((products ?? []).map((p) => [p.id, p]));

    return {
      ...order,
      total_amount: Number(order.total_amount),
      items: (items ?? []).map((i) => ({
        id: i.id,
        productId: i.product_id,
        quantity: i.quantity,
        unitPrice: Number(i.unit_price),
        name: byId.get(i.product_id)?.name ?? `Product #${i.product_id}`,
        imageUrl: byId.get(i.product_id)?.image_url ?? null,
      })),
    };
  });
