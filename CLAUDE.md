# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Vue 3 + Vite + TypeScript + Tailwind + Pinia single-page payment page for the CryptoQR invoice API (MoneyBadger). A merchant redirects a customer here with query params; the page creates an invoice, lets the user pick a wallet (Lightning, VALR, Binance, Luno, Bybit), shows a QR/payment request, and polls until the invoice settles. Some partners (Peach, Ozow) embed or redirect to it.

## Commands

- Setup: install deps with npm, then copy `.env.example` to `.env` (`VITE_HOST` = API base host, e.g. `https://api.staging.cryptoqr.net`)
- Dev server: `npm run dev` (`./pay.sh` opens localhost:5173 with sample query params)
- Build: `npm run build` (runs `vue-tsc` type-check + `vite build`); `npm run type-check` alone
- Lint: `npm run lint` (eslint with `--fix`); format: `npm run format` (prettier on `src/`)
- Unit tests: `npm run test:unit` (vitest); single file: `npx vitest run src/components/__tests__/HelloWorld.spec.ts`
- E2E: `npm run test:e2e` (playwright; `e2e/`)
- Regenerate API client (do not hand-edit `src/api/cryptoqr/api.ts`):
  `sta -p https://api.staging.cryptoqr.net/api/v2/swagger.json generate-templates -o ./src/api/cryptoqr/ -n api.ts --extract-enums --api-class-name InvoiceApi`

## Deploy

GitHub Actions (`.github/workflows/`) build with `VITE_HOST` per environment, sync `dist` to S3, invalidate CloudFront. Pushing to the `staging` branch deploys staging (`./staging.sh` force-pushes current branch there); production has its own workflow. `VITE_HOST` containing `api.cryptoqr.net` also marks Honeybadger environment as `production` (`src/main.ts`).

## Architecture

- **Single route** (`/` → `views/PaymentPageView.vue`). All input arrives as URL query params, parsed by `models/invoice_parameters.ts` (`amountCents` xor `amountRands`, `merchantCode`, `orderId`, `timeoutInSeconds`, `requireRefunds`, `requireTermsAccepted`, `autoConfirm`, `reset`, `return`, etc.). Validation errors there put the store straight into `PaymentStatus.Error`.
- **`stores/payments.ts` is the core state machine.** `status` (`types/PaymentStatus.ts`: Loading → SelectWallet → WaitForPayment → Successful/Expired/Cancelled/Error) decides which component the view renders. `pollStatus` long-polls `fetchInvoiceStatus(id, wait=10)` and maps `InvoiceStatusEnum` → `PaymentStatus`; a deliberate guard stops polling from overriding `SelectWallet` while the user is changing wallet. `checkForExistingInvoice` resumes an invoice by `orderId`. `setWallet` creates the invoice or updates its payment method.
- **API layer**: `api/api-cryptoqr.ts` wraps the generated swagger client (`api/cryptoqr/api.ts`), injects `x-merchant-code` header on every request and a ClientJS device fingerprint on invoice creation.
- **`models/wallet.ts`** holds per-wallet behaviour (value store id, custom QR, copyable request format). Wallet-specific modals live in `components/wallet_select/`; payment display in `components/payment/`.
- **Partner theming**: `stores/theme.ts` maps `?theme=` or `merchantCode` to a theme (`peach`, `ozow`, `ott`, `shopritetopups`, `default`) with light/dark brightness, and dynamically imports `assets/partners/<theme>.css`. New partner = add entry to `availableThemes` + CSS file. Theme also drives behaviour (`requireRefunds` getter, `isOzow` UI in `components/ozow/`). Merchant-specific hacks exist in the payments store (e.g. merchant `sos` restricts to VALR).
- **Peach integration** (`partner/peach.ts`): when in an iframe, communicates with parent via `postMessage` (origin from base64 location hash, default `secure.peachpayments.com`).
- **Analytics/monitoring**: Mixpanel plugin (`plugins/mixpanel.ts`, event/property types in `types/analytics_*.ts`) and Honeybadger, both wired in `main.ts`.
- `stores/devMode.ts`: clicking the logo 10 times enables dev mode.
