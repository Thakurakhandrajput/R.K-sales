# R.K Sales — Hardware Catalog Website

A catalog-only website (no shopping cart / checkout) for a door fittings,
locks & hardware shop, built with Node.js + Express + EJS.

## What's inside

- `views/index.ejs` — Home page: hero banner, categories, promo tiles,
  "why choose us", and an endless **Flipkart-style infinite scroll** product feed.
- `views/products.ejs` — Full catalog grid with category filter chips + search.
- `views/shop.ejs` — Single product page: specs, description, **Inquire on
  WhatsApp**, **Email Inquiry**, and **Save to Wishlist** — no "Buy" button anywhere.
- `public/css/style.css` — All styling (brick-red + brass palette, matching
  the reference screenshot's layout).
- `public/js/main.js` — Drawer menu, wishlist (saved in the browser's
  localStorage, no login needed), scroll-reveal animation, infinite scroll,
  and the products-page filters.
- `data/products.json` — Sample catalog (locks, handles, hinges, drawer
  slides, accessories). Edit this file to add your real products.

## Run it locally

```bash
npm install
npm start
```

Then open **http://localhost:3000**

## Things to customize before going live

1. **WhatsApp / phone number** — search the project for `910000000000`
   (in `views/partials/header.ejs`, `views/partials/bottomnav.ejs`,
   `views/shop.ejs`) and replace with your real WhatsApp number
   (country code + number, no `+` or spaces).
2. **Email** — replace `orders@rksales.example` in `views/shop.ejs`.
3. **Real product photos** — right now each product shows a themed icon
   placeholder. To use real photos, add an `image` field per product in
   `data/products.json` (e.g. `"image": "/images/lock-001.jpg"`), drop the
   file in `public/images/`, and swap the `<svg>` in `p-thumb` /
   `pd-gallery` for an `<img>` tag.
4. **Shop name / tagline** — edit the brand block in
   `views/partials/header.ejs`.
5. **Categories** — edit the `CATEGORIES` array at the top of `server.js`.

## Notes on the infinite scroll

The homepage feed calls `/api/feed?page=N&limit=8`. Since the sample
catalog only has ~20 products, the API cycles back through them (like a
real "browse feed") so scrolling never visibly runs out — swap in your
full product list in `data/products.json` and it'll behave the same way,
just with more real variety before it starts repeating.
