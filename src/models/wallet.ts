class Wallet {
    constructor(
        public valueStore: string,
        public name: string,
    ) {}

    static wallets = [
        new Wallet('valr', 'VALR'),
        new Wallet('luno', 'Luno'),
        new Wallet('binance', 'Binance'),
        new Wallet('lightning', 'Lightning'),
    ]
}

export default Wallet