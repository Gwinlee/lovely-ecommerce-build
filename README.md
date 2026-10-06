# Oja Oba — E-commerce Shop

Live site: https://lovely-ecommerce-build.vercel.app

## Features
- Product listing and product details pages (data from Supabase)
- Shopping cart saved in the browser
- Google sign-in (Supabase Auth); checkout requires sign-in
- Secure order creation on the server with price and stock checks
- Order success page
- Order confirmation email via Mailgun (Supabase Edge Function)

## Tech stack
React / TanStack Start, Tailwind CSS, Supabase (Postgres, Auth,
Edge Functions, Row Level Security), Mailgun, Vercel, GitHub. Built with Lovable.

## Notes
- Mailgun is on a sandbox domain, so emails only reach authorized recipients.
- Payments are not implemented yet.
