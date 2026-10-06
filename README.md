# SupaShop Express

Build a modern, mobile-friendly online shop using my connected Supabase project. Pages: a homepage with a hero and product grid, and a product details page. Read products from my EXISTING table public.products with columns: id, name, description, price (numeric), image_url, stock_quantity. Do NOT create tables, add columns, or change the database in any way. Show an image, name, price (in Naira, ₦) and Add to Cart on each card. Show description and stock on the details page. Add a loading state, an error message, and a "No products yet" message. Disable Add to Cart and show "Out of stock" when stock_quantity is 0. No login, checkout, or emails yet.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lovely-ecommerce-build.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b5ec8aa8-6ded-41d7-ad18-1b85de8f81a4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
