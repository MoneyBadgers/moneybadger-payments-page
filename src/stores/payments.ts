import { defineStore } from 'pinia'
import Api from '../api/api-cryptoqr'
import { InvoiceStatusEnum, type Invoice } from '../api/cryptoqr/api'

export const usePaymentStore = defineStore('payments', {
  state: () => ({
    invoice: {} as Invoice
  }),
  getters: {
    awaitPayment: (state): boolean =>  (typeof state.invoice.status !== 'undefined') && [InvoiceStatusEnum.REQUESTED, InvoiceStatusEnum.AUTHORIZED].includes(state.invoice.status),
    confirmed: (state): boolean => state.invoice.status === InvoiceStatusEnum.CONFIRMED,
    api: (state): Api =>  new Api()
  },
  actions: {
    async updateInvoice() {
      if (!this.invoice.id) {
        return
      }
      this.invoice = (await this.api.fetchInvoiceStatus(this.invoice.id)).data
    },
    async generateInvoice() {
      this.invoice = (await this.api.requestInvoice(100, 'ZAR', 'test order description', (new Date()).getTime().toString())).data
    }
  }
})
