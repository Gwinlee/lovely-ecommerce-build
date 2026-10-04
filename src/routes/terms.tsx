import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Kasuwa Market" },
      {
        name: "description",
        content:
          "Terms of Service for Kasuwa Market: orders, pricing in Naira, stock availability, and how to contact us.",
      },
      { property: "og:title", content: "Terms of Service — Kasuwa Market" },
      {
        property: "og:description",
        content:
          "Terms of Service for Kasuwa Market: orders, pricing in Naira, stock availability, and how to contact us.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Legal
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The rules for shopping with Kasuwa Market.
      </p>

      <div className="mt-8 space-y-8">
        <Section title="Orders">
          <p>
            To place an order you must be signed in with your Google account so
            we can confirm your name and email address. When you place an
            order, we check that every item is still in stock and reserve it
            for you. If an item has sold out, the order is not placed and
            nothing is charged. You can review the details of each order on its
            order page after checkout.
          </p>
        </Section>

        <Section title="Pricing">
          <p>
            All prices are shown and charged in Nigerian Naira (₦). The price
            shown at checkout is the price you pay for the items in your order.
            If a price on a product page is out of date, we will confirm the
            correct price with you before processing your order.
          </p>
        </Section>

        <Section title="Stock availability">
          <p>
            We sell physical goods in limited quantities. Product pages show
            the current stock level, and you cannot order more than we have
            available. If an item becomes unavailable after you order it, we
            will contact you and arrange a refund or a replacement.
          </p>
        </Section>

        <Section title="Contact us">
          <p>
            Questions about an order, these terms, or anything else? Email{" "}
            <a
              href="mailto:godwin.adeosun@outlook.com"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              godwin.adeosun@outlook.com
            </a>
            .
          </p>
        </Section>
      </div>

      <div className="mt-10 border-t border-border pt-6 text-sm">
        <Link
          to="/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to the shop
        </Link>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-foreground">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
