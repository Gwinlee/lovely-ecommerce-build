import { createFileRoute } from "@tanstack/react-router";
import { getProduct } from "@/lib/products.functions";
export const Route = createFileRoute("/__probe-route")({
  loader: async ({ params }: { params: { id: string } }) => {
    const product = await getProduct({ data: { id: Number(params.id) } });
    if (!product) throw new Error("nf");
    return { product };
  },
  component: () => <div>probe</div>,
});
