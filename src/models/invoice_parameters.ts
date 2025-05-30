import type { LocationQuery } from "vue-router"

class InvoiceParameters {

    constructor(
        public amountCentsAsString: string,
        public amountRandsAsString: string,
        public currency: string = 'ZAR',
        public merchantCode: string,
        public orderDescription: string,
        public orderId: string,
        public statusWebhookUrl: string,
        public timeoutInSecondsString: string,
        public autoConfirm: boolean = false,
        public reset: boolean = false,
        public requireTermsAccepted: boolean = false,
    ){}

    static createFromQueryParams(queryParams: LocationQuery) : InvoiceParameters {
        return new InvoiceParameters(
            queryParams.amountCents as string || '',
            queryParams.amountRands as string || '',
            'ZAR',
            queryParams.merchantCode as string || '',
            queryParams.orderDescription as string || '',
            queryParams.orderId as string || '',
            queryParams.statusWebhookUrl as string || '',
            queryParams.timeoutInSeconds as string || '',
            queryParams.autoConfirm === 'true',
            queryParams.reset === 'true',
            queryParams.requireTermsAccepted === 'true',
        )
    }

    get timeoutInSeconds(): number {
        const timeout = parseInt(this.timeoutInSecondsString)
        return isNaN(timeout) ? 180 : timeout
    }

    get amountCents(): number {
        if(this.amountCentsAsString){
            return parseInt(this.amountCentsAsString)
        } else {
            return Math.round(parseFloat(this.amountRandsAsString) * 100)
        }
    }

    get errors(): string[] {
        const errors = []
        if (!this.amountCentsAsString && !this.amountRandsAsString) {
            errors.push('Amount is required')
        }
        if (this.amountCentsAsString && this.amountRandsAsString) {
            errors.push('Please specify only one of amountCents or amountRands')
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