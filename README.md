# moneybadger-payments-page

This template should help get you started developing with Vue 3 in Vite.

## Setup

1. Run `npm install`
2. Copy .env.example to .env
3. Run `npm run dev`

## Generate API bindings

`sta -p https://api.staging.cryptoqr.co.za/api/v2/swagger.json generate-templates -o ./src/api/cryptoqr/ -n api.ts --extract-enums --api-class-name InvoiceApi`

## TODO (stack ranked)

- make QR code work for Luno
- Error handling for API errors (including expired invoice)
- Fix copy in various places (says Lightning, should say Binance/VALR/Luno)
- Properly style the Wallet selection
- Make it match the designs