<script lang="ts">
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'
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
      return this.paymentsStore.generateInvoice()
    },
    async fetchStatus() {
      if (this.awaitingPayment) {
        await this.paymentsStore.updateInvoice()
        setTimeout(() => {
          this.fetchStatus()
        }, 500)
      }
    }
  },
  computed: {
    ...mapStores(usePaymentStore),
    paymentQrCodeUrl: function (): String {
      return this.paymentsStore.invoice.payment_request?.qr_code_url || '' // todo: show an image to make it obvious this failed
    },
    awaitingPayment: function (): boolean {
      return this.paymentsStore.awaitPayment
    },
    paymentSuccessful: function (): boolean {
      return this.paymentsStore.confirmed
    }
  },
  created() {
    this.generateInvoice().then(() => {
      this.fetchStatus()
    })
    this.fetchStatus()
  }
}
</script>

<template>
  <PaymentConfirmed v-if="paymentSuccessful"></PaymentConfirmed>
  <AwaitingPayment v-if="awaitingPayment" :qrCodeUrl="paymentQrCodeUrl"></AwaitingPayment>
</template>

<style scoped></style>
