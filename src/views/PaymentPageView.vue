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
  <button @click="generateInvoice">Gen Invoice</button>
  <button @click="fetchStatus()">Fetch Invoice</button>
  <AwaitingPayment v-if="awaitingPayment" :qrCodeUrl="paymentQrCodeUrl"></AwaitingPayment>
  <PaymentConfirmed v-else-if="paymentSuccessful"></PaymentConfirmed>
</template>

<style scoped></style>
