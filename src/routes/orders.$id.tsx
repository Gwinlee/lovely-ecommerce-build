import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { formatNaira } from "@/lib/format";
import { getMyOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order placed — Kasuwa Market" },
      { name: "description", content: "Your Kasuwa Market order confirmation." },
      { property: "og:title", content: "Order placed — Kasuwa Market" },
      { property: "og:description", content: "Your Kasuwa Market order confirmation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const fetchOrder = useServerFn(getMyOrder);
  const order = useQuery({
    queryKey: ["order", id, user?.id],
    queryFn: () => fetchOrder({ data: { id: Number(id) } }),
    enabled: !!user,
  });

  if (loading || (user && order.isPending)) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-48 animate-pulse rounded-xl bg-muted" />
      </main>
    );
  }

  if (!user) {
    return <Message title="Please sign in" body="Sign in to see your order." />;
  }
  if (order.isError) {
    return <Message title="Something went wrong" body="We couldn't load your order. Please refresh the page." />;
  }
  if (!order.data) {
    return <Message title="Order not found" body="We couldn't find this order on your account." />;
  }

  const o = order.data;
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-16 sm:px-6">
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <p className="text-sm font-medium text-primary">Thank you{o.customer_name ? `, ${o.customer_name}` : ""}!</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">Order #{o.id} placed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Status: <span className="font-medium capitalize text-foreground">{o.status}</span> · {o.customer_email}
        </p>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {o.items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                {i.imageUrl && <img src={i.imageUrl} alt={i.name} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{i.name}</p>
                <p className="text-sm text-muted-foreground">
                  {i.quantity} × {formatNaira(i.unitPrice)}
                </p>
              </div>
              <p className="font-semibold text-foreground">{formatNaira(i.unitPrice * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between text-lg font-semibold text-foreground">
          <span>Total</span>
          <span>{formatNaira(o.total_amount)}</span>
        </div>
        <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16 text-center sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground">
        Back to the shop
      </Link>
    </main>
  );
}
