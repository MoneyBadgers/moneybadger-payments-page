import { defineStore } from 'pinia'
import { PaymentStatus } from '@/types/PaymentStatus'

export const usePaymentStore = defineStore('payments', {
  state: () => ({
    status: PaymentStatus.Waiting as PaymentStatus
  }),
  getters: {
    paymentStatus: (state): PaymentStatus => state.status
  },
  actions: {
    pollPaymentStatus(uuid: String) {
      // TODO: Add API call here
      console.log('Polling...' + this.status)
    }
  }
})
