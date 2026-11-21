# Stock Tracker

A Vue 3 + Vuetify app for watching products across e-commerce stores. Add a
product, set the price you are willing to pay, and track its availability,
price history and discounts. Get an in-app alert when it comes back in stock or
drops to your target price.

## Features

- **Watchlist with target prices** — add products from Amazon, Best Buy,
  Target, Walmart, or any custom store.
- **Manual refresh** — re-check one product or the whole list, with a
  "last checked" timestamp for every item.
- **Alerts** — an in-app alert fires when an item is back in stock or reaches
  your target price.
- **Price history** — every check is stored, shown as a sparkline in the table
  and a full chart on the product page.
- **Search, filter and sort** — by name, store, status (in stock / on sale /
  at target), price, discount or date added.
- **Light / dark theme** and a responsive Vuetify layout.
- **Local persistence** — the watchlist and alerts are saved in `localStorage`.

## Tech stack

- [Vue 3](https://vuejs.org/) with `<script setup>` and TypeScript
- [Vuetify 4](https://vuetifyjs.com/) for the UI
- [Pinia](https://pinia.vuejs.org/) for state management
- [Vue Router](https://router.vuejs.org/) for routing
- [Vite](https://vite.dev/) for dev/build
- [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/) for tests

## Getting started

```sh
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173). On the empty watchlist
click **Load demo data** to populate a few sample products.

## Scripts

```sh
npm run dev          # start the dev server
npm run build        # type-check and build for production
npm run preview      # preview the production build
npm run test:unit    # run unit tests (Vitest)
npm run test:e2e     # run end-to-end tests (Playwright)
npm run lint         # lint and auto-fix (oxlint + ESLint)
npm run format       # format with Prettier
```

> First time running e2e tests, install the browser: `npx playwright install chromium`.

## Project structure

```
src/
├─ components/
│  ├─ ProductDialog.vue      # add / edit product dialog
│  ├─ PriceSparkline.vue     # small trend line in the table
│  ├─ PriceHistoryChart.vue  # full price chart on the detail page
│  └─ StatCard.vue           # dashboard stat tile
├─ plugins/vuetify.ts        # Vuetify config, theme and icons
├─ router/index.ts           # routes
├─ services/mockStore.ts     # simulated price/stock source (swap for a real API)
├─ stores/watchlist.ts       # Pinia store: products, alerts, persistence
├─ types/index.ts            # shared TypeScript types
├─ utils/format.ts           # currency / date helpers
└─ views/
   ├─ HomeView.vue           # dashboard: stats, filters, table
   ├─ ProductDetailView.vue  # price history and product details
   └─ AboutView.vue
```

## About the data source

Product prices and availability are **simulated** by `src/services/mockStore.ts`.
Browsers can't scrape store pages directly because of CORS, so a real version
of this app would need a small backend (or a third-party price API) to fetch
data from the stores. The app is structured so that only `fetchQuote()` in the
mock service needs to be replaced to use real data.

## Recommended IDE setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar).
