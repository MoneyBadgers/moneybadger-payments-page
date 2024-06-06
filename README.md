# moneybadger-payments-page

This template should help get you started developing with Vue 3 in Vite.

## Setup

1. Run `npm install`
2. Copy .env.example to .env
3. Run `npm run dev`

## Generate API bindings

`sta -p https://api.cryptoqr.co.za/api/v2/swagger.json generate-templates -o ./src/api/swagger/ -n api.ts --extract-enums --api-class-name InvoiceApi`

## TODO (stack ranked)

1. Add in the UI to change Wallet type
2. Make it work on mobile (deep links)
3. Don't break on reuse of orderId (for unexpired/unpaid invoices)
4. Error handling for API errors
5. Copy payment address to clipboard