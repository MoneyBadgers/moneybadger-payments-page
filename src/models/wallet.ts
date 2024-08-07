class Wallet {
    constructor(
        public valueStore: string,
        public name: string,
        public link: string,
        public scanner: string,
        public invoiceType: string
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
            'Lightning Wallet',
            'Lightning Invoice (BOLT11)'
        ),
        'binance': new Wallet(
            'binance',
            'Binance',
            'PAYMENT_REQUEST',
            'Binance App',
            'Binance Payment Link'
        ),
        'luno': new Wallet(
            'luno',
            'Luno',
            'PAYMENT_REQUEST',
            'Luno App',
            'Luno Payment Link'
        ),
        'valr': new Wallet(
            'valr',
            'VALR',
            'https://valr.com/PAYMENT_REQUEST',
            'VALR App',
            'VALR Payment Link'
        ),
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
