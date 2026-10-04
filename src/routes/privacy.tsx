import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Kasuwa Market" },
      {
        name: "description",
        content:
          "How Kasuwa Market collects and uses your personal data: Google sign-in details, order information, and your rights.",
      },
      { property: "og:title", content: "Privacy Policy — Kasuwa Market" },
      {
        property: "og:description",
        content:
          "How Kasuwa Market collects and uses your personal data: Google sign-in details, order information, and your rights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Legal
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        How we handle your personal information at Kasuwa Market.
      </p>

      <div className="mt-8 space-y-8">
        <Section title="What we collect">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-medium text-foreground">
                Your name and email address
              </strong>{" "}
              — collected when you sign in with Google. We receive only the
              basic profile details Google shares with us.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Order details
              </strong>{" "}
              — the items you order, quantities, prices, and the name and email
              you provide at checkout.
            </li>
          </ul>
        </Section>

        <Section title="How we use your information">
          <p>
            We use your name, email address and order details only to:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Process and fulfil your orders.</li>
            <li>Send you order confirmation emails.</li>
          </ul>
          <p className="mt-2">
            We do not use your information for any other purpose.
          </p>
        </Section>

        <Section title="Where your data is stored">
          <p>
            Your data is stored securely in our Supabase database, which
            protects it with encryption in transit and at rest and
            row-level access controls. Order confirmation emails are sent
            through Mailgun, our email delivery provider, which receives only
            the details needed to deliver the email (your email address and the
            message content).
          </p>
        </Section>

        <Section title="We never sell your data">
          <p>
            We never sell, rent, or trade your personal information to anyone.
          </p>
        </Section>

        <Section title="Requesting deletion">
          <p>
            You can ask us to delete your personal data at any time. Email{" "}
            <a
              href="mailto:godwin.adeosun@outlook.com"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              godwin.adeosun@outlook.com
            </a>{" "}
            and we will remove your information from our records.
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
