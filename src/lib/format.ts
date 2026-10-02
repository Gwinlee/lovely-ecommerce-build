const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

/**
 * Prices come from PostgREST numeric columns as strings; normalize to a
 * number first so "59.00" renders as ₦59.00.
 */
export function formatNaira(price: string | number): string {
  const value = typeof price === "string" ? Number.parseFloat(price) : price;
  if (Number.isNaN(value)) return "₦—";
  return nairaFormatter.format(value);
}
