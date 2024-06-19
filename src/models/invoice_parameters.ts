import type { LocationQuery } from "vue-router"

class InvoiceParameters {

    constructor(
        public amountCentsAsString: string,
        public currency: string = 'ZAR',
        public merchantCode: string,
        public orderDescription: string,
        public orderId: string,
        public statusWebhookUrl: string,
        public timeoutInSecondsString: string,
        public autoConfirm: boolean = false,
    ){}

    static createFromQueryParams(queryParams: LocationQuery) : InvoiceParameters {
        return new InvoiceParameters(
            queryParams.amountCents as string || '',
            'ZAR',
            queryParams.merchantCode as string || '',
            queryParams.orderDescription as string || '',
            queryParams.orderId as string || '',
            queryParams.statusWebhookUrl as string || '',
            queryParams.timeoutInSeconds as string || '',
            queryParams.autoConfirm === 'true',
        )
    }

    get timeoutInSeconds(): number {
        const timeout = parseInt(this.timeoutInSecondsString)
        return isNaN(timeout) ? 60 : timeout
    }

    get amountCents(): number {
        return parseInt(this.amountCentsAsString)
    }

    get errors(): string[] {
        const errors = []
        if (!this.amountCentsAsString) {
            errors.push('Amount is required')
        }
        if (isNaN(this.amountCents)) {
            errors.push('Amount must be a valid number')
        }
        if (!this.orderId) {
            errors.push('Order ID is required')
        }
        if (!this.merchantCode) {
            errors.push('Merchant Code is required')
        }
        return errors
    }
}
export default InvoiceParameters