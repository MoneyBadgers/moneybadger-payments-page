class Wallet {
    constructor(
        public valueStore: string,
        public name: string,
        public link: string,
        public scanner: string,
        public invoiceType: string,
        public customQrCode: boolean = false
    ) {}

    generateLink(paymentRequest: string): string {
        return this.link.replace('PAYMENT_REQUEST', paymentRequest)
    }

    generateCopyableRequest(paymentRequest: string): string {
        if(this.valueStore === 'lightning'){
            return paymentRequest
        }
        if(this.valueStore === 'binance'){
            return paymentRequest
        }
        return this.generateLink(paymentRequest)
    }

    static wallets: {
        [key: string]: Wallet
    } = {
        'lightning': new Wallet(
            'lightning',
            'Lightning',
            'lightning:PAYMENT_REQUEST',
            'your Lightning Wallet',
            'Lightning Invoice (BOLT11)'
        ),
        'binance': new Wallet(
            'binance',
            'Binance Pay',
            'PAYMENT_REQUEST',
            'your Binance App',
            'Binance Pay Link',
            true   // Binance Pay uses a custom QR code format
        ),
        'luno': new Wallet(
            'luno',
            'Luno',
            'PAYMENT_REQUEST',
            'your Luno App',
            'Luno Payment Link',
            true   // Luno uses a custom QR code format
        ),
        'valr': new Wallet(
            'valr',
            'VALR',
            'https://valr.com/PAYMENT_REQUEST',
            'your VALR App',
            'VALR Payment Link'
        ),
        'bybit': new Wallet(
            'bybit',
            'Bybit',
            'PAYMENT_REQUEST',
            'Bybit App',
            'Bybit Payment Link',
            true   // Bybit uses a custom QR code format
        )
    }

    // This wallet should not get used but is here as a placeholder.
    static defaultWallet = new Wallet(
        'lightning',
        'Crypto',
        'lightning:PAYMENT_REQUEST',
        'Lightning Wallet',
        'Lightning Invoice (BOLT11)'
    )
}

export default Wallet
