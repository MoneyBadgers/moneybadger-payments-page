import { defineStore } from 'pinia'
import Api from '../api/api-cryptoqr'
import { InvoiceStatusEnum, type Invoice } from '../api/cryptoqr/api'
import type { LocationQuery } from 'vue-router'

export const usePaymentStore = defineStore('payments', {
  state: () => ({
    invoice: {} as Invoice,
    errors: [] as string[],
    amountCents: 0,
    currency: '',
    merchantCode: '',
    orderDescription: '',
    orderId: '',
    statusWebhookUrl: '',
    timeoutInSeconds: 60
  }),
  getters: {
    awaitPayment: (state): boolean =>  (typeof state.invoice.status !== 'undefined') && [InvoiceStatusEnum.REQUESTED, InvoiceStatusEnum.AUTHORIZED].includes(state.invoice.status),
    confirmed: (state): boolean => state.invoice.status === InvoiceStatusEnum.CONFIRMED,
    paidAt: (state): string => state.invoice.paid_at || '',
    amountPaid: (state): number => state.invoice.amount_cents || 0,
    referenceId: (state): string => state.invoice.id || '',
    address: (state): string => state.invoice.payment_request?.data || '',
    api: (state): Api =>  new Api()
  },
  actions: {
    initializeFromQueryParams(queryParams: LocationQuery) {
      // Process the query parameters and update the store state
      const amount = queryParams.amountCents as string || null
      this.merchantCode = (queryParams.merchantCode as string) || ''
      this.orderId = (queryParams.orderId as string) || ''
      this.orderDescription = (queryParams.description as string) || ''
      this.statusWebhookUrl = (queryParams.statusWebhookUrl as string) || ''
      this.timeoutInSeconds = parseInt(queryParams.timeout as string) || 60
      // Check if any required data is missing or in an incorrect format
      if (!amount) {
        this.errors.push('Amount is required')
      } else {
        this.amountCents = parseInt(amount)
        if (isNaN(this.amountCents)) {
          this.errors.push('Amount must be a valid number')
        }
      }
      if (!this.orderId) {
        this.errors.push('Order ID is required')
      }
      if (!this.merchantCode) {
        this.errors.push('Merchant Code is required')
      }
      return this.errors.length === 0
    },
    async updateInvoice() {
      if (!this.invoice.id) {
        return
      }
      this.invoice = (await this.api.fetchInvoiceStatus(this.invoice.id)).data
    },
    async generateInvoice() {
      this.invoice = (await this.api.requestInvoice(
        this.amountCents,
        'ZAR',
        this.orderDescription,
        this.orderId,
        this.statusWebhookUrl,
        this.timeoutInSeconds
      )).data
    }
  }
})
