# Wadhaya Store — React + Vite

A luxury bilingual (Arabic/English) perfume storefront prepared for Cloudflare Pages.

## Features
- Arabic RTL / English LTR language toggle
- Home, collection, product detail, story and contact views
- Product cards and shopping bag with quantity controls
- WhatsApp order handoff with customer name, phone and delivery address
- Responsive dark and champagne-gold design
- Vite production build and Cloudflare Pages SPA fallback

## Requirements
- Node.js LTS
- npm

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```
The production site is generated in `dist/`.

## Before publishing
1. Open `src/main.jsx` and replace every `971500000000` placeholder with your actual WhatsApp number in international format, digits only (no plus sign or spaces).
2. Replace demo product prices, names, sizes, notes and descriptions with your real product information.
3. Replace demo Unsplash image URLs with product photography you own or have permission to use.
4. Update Instagram and contact links in the footer.
5. The newsletter form is a front-end demo only; connect a mailing-list service if you want to store subscriptions.
6. This storefront does not collect online payments or automatically manage stock. Orders are handed off to WhatsApp.
7. Review shipping, returns, privacy and business/legal information before launching.

## Deploy to Cloudflare Pages
1. Push this project to a GitHub repository.
2. In Cloudflare Dashboard, open **Workers & Pages** and create a Pages project connected to your repository.
3. Use build command `npm run build` and output directory `dist`.
4. Deploy, then add your domain under **Custom domains** and follow Cloudflare's DNS instructions.

The `public/_redirects` file enables SPA fallback routing on Cloudflare Pages.

## Notes
- Product images are loaded from Unsplash URLs and require internet access.
- Google Fonts are loaded from Google Fonts.
- No Base44 SDK or Base44 services are used.
