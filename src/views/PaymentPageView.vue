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
  mounted: function () {
    const paymentVerification = setInterval(() => {
      // this.paymentsStore.pollPaymentStatus('')
    }, 1000)
  },
  computed: {
    ...mapStores(usePaymentStore),
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
  <AwaitingPayment v-if="awaitingPayment"></AwaitingPayment>
  <PaymentConfirmed v-else-if="paymentSuccessful"></PaymentConfirmed>
</template>

<style scoped></style>
