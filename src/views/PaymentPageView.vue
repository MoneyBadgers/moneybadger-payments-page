<script lang="ts">
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'
import { PaymentStatus } from '../types/PaymentStatus'
import AwaitingPayment from '@/components/AwaitingPayment.vue'
import PaymentConfirmed from '@/components/PaymentConfirmed.vue'

export default {
  name: 'PaymentPageView',
  components: {
    AwaitingPayment,
    PaymentConfirmed
  },
  methods: {
    generateInvoice() {
      this.paymentsStore.generateInvoice()
    },
    async fetchStatus() {
      if (this.awaitingPayment) {
        await this.paymentsStore.pollPaymentStatus()
        setTimeout(() => {
          this.fetchStatus()
        }, 500)
      }
    }
  },
  computed: {
    ...mapStores(usePaymentStore),
    paymentQrCodeUrl: function (): String {
      return this.paymentsStore.invoice.qrCodeUrl
    },
    awaitingPayment: function (): boolean {
      return this.paymentsStore.status === PaymentStatus.Waiting
    },
    paymentSuccessful: function (): boolean {
      return this.paymentsStore.status === PaymentStatus.Successful
    }
  }
}
</script>

<template>
  <button
    @click="generateInvoice"
    class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
  >
    Gen Invoice
  </button>
  <button
    @click="fetchStatus"
    class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
  >
    Fetch Invoice
  </button>

  <AwaitingPayment v-if="awaitingPayment" :qrCodeUrl="paymentQrCodeUrl"></AwaitingPayment>
  <PaymentConfirmed v-else-if="paymentSuccessful"></PaymentConfirmed>
</template>

<style scoped></style>
