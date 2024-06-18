import type { StringDecoder } from "string_decoder"

class Wallet {
    constructor(
        public valueStore: string,
        public name: string,
        public link: string,
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

    static wallets = [
        new Wallet('valr', 'VALR', 'https://valr.com/PAYMENT_REQUEST'),
        new Wallet('luno', 'Luno', 'https://luno.com/PAYMENT_REQUEST'),
        new Wallet('binance', 'Binance', 'PAYMENT_REQUEST'),
        new Wallet('lightning', 'Lightning', 'lightning:PAYMENT_REQUEST'),
    ]

    static defaultWallet = Wallet.wallets[0]
}

export default Wallet