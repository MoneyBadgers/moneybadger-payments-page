# moneybadger-payments-page

This template should help get you started developing with Vue 3 in Vite.

## Setup

1. Run `npm install`
2. Copy .env.example to .env
3. Run `npm run dev`

## Generate API bindings

`sta -p https://api.cryptoqr.co.za/api/v2/swagger.json generate-templates -o ./src/api/swagger/ -n api.ts --extract-enums --api-class-name InvoiceApi --modular`

## TODO (stack ranked)

1. Make it consume URL parameters as described in the Payment Link section: https://docs.google.com/document/d/1-JkZyinC_gkmv043ud8n6b3ZttURPaFP4lI4nRh2MKw/edit
2. Finish up the styling/make it pretty
    a. update Secure Payment by . . . image with designs from designer
    b. make pages responsive
3. Add in the UI to change Wallet type
4. Make it work on mobile (deep links)
5. Don't break on reuse of orderId (for unexpired/unpaid invoices)
6. Error handling for API errors
7. Copy payment address to clipboard