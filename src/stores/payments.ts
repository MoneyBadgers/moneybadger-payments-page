import { defineStore } from 'pinia'
import { PaymentStatus } from '@/types/PaymentStatus'
import Api from '../api/api'
import Invoice from '../models/Invoice'

export const usePaymentStore = defineStore('payments', {
  state: () => ({
    status: PaymentStatus.None as PaymentStatus,
    invoice: {} as Invoice
  }),
  getters: {
    paymentStatus: (state): PaymentStatus => state.status
  },
  actions: {
    async pollPaymentStatus() {
      const response = await Api.fetchInvoiceStatus(this.invoice.invoiceId)
      if (response.data.status === 'paid') {
        this.status = PaymentStatus.Successful
      }

      return this.status
    },
    async generateInvoice() {
      this.status = PaymentStatus.Waiting
      const invoice = await Api.invoice(100, 'ZAR', 'testiasddng12362', 'atefsfdtsa-id')
      if (invoice.data) {
        this.invoice = new Invoice(invoice.data)
      }
    }
  }
})
