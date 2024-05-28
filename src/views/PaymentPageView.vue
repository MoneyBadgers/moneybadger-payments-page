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
    },
    // TODO: use these parameters (and others) for generating the invoice
    // e.g. page can be opened with http://localhost:5173/?merchantCode=bork&orderId=foo&amountCents=100
    param1() {
      return this.$route.query.merchantCode || 'TODO: FAIL HERE and show error page';
    },
    param2() {
      return this.$route.query.orderId || 'TODO: FAIL HERE and show error page';
    },
    param3() {
      return this.$route.query.amountCents || 'TODO: FAIL HERE and show error page';
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
  {{ param1 }}
  {{ param2 }}
  {{ param3 }}
</template>

<style scoped></style>
