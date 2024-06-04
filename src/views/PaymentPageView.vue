<script lang="ts">
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'
import AwaitingPayment from '@/components/AwaitingPayment.vue'
import PaymentConfirmed from '@/components/PaymentConfirmed.vue'
import ErrorPage from '@/components/ErrorPage.vue'
import Logo from '@/components/Logo.vue'

export default {
  name: 'PaymentPageView',
  components: {
    AwaitingPayment,
    PaymentConfirmed,
    ErrorPage,
    Logo
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
      return this.paymentsStore.invoice.payment_request?.qr_code_url || '' // TODO: show an image to make it obvious this failed
    },
    awaitingPayment: function (): boolean {
      if (this.missingParams) {
        return false
      }
      return this.paymentsStore.awaitPayment
    },
    paymentSuccessful: function (): boolean {
      return this.paymentsStore.confirmed
    },
    amountPaid: function (): number {
      return this.paymentsStore.amountPaid || 0
    },
    paymentTimeStamp: function (): string {
      return this.paymentsStore.paidAt || ''
    },
    referenceId: function (): string {
      return this.paymentsStore.referenceId || ''
    },
    statusMessage: function (): string {
      if (this.paymentSuccessful) {
        return 'Payment Successful'
      } else if (this.awaitingPayment) {
        return 'Waiting for Payment...'
      } else {
        return 'Error'
      }
    },
    missingParams: function (): boolean {
      return !this.merchantCode || !this.orderId || !this.amountCents
    },
    errorMessage: function (): Array<string> {
      const errors = [];
      // required params
      if (!this.merchantCode) {
        errors.push('Merchant Code is missing.');
      }
      if (!this.orderId) {
        errors.push('Order ID is missing.');
      }
      if (!this.amountCents) {
        errors.push('Amount Cents is missing.');
      }
      return errors;
    },
    // TODO: use these parameters (and others) for generating the invoice
    // e.g. page can be opened with http://localhost:5173/?merchantCode=bork&orderId=foo&amountCents=100
    merchantCode() {
      return this.$route.query.merchantCode || null;
    },
    orderId() {
      return this.$route.query.orderId || null;
    },
    amountCents() {
      return this.$route.query.amountCents || null;
    },
    orderDescription() {
      return this.$route.query.orderDescription || null;
    },
    statusWebhookUrl() {
      return this.$route.query.statusWebhookUrl || null;
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
  <div class="mx-auto text-center">
    <div class="status-bar py-2">
      <span class="text">{{statusMessage}}</span>
    </div>
    <div class="container mx-auto text-center payment-card">
      <h1 class="py-4 font-bold flex justify-center items-center">
      Lightning
        <Logo class="mx-1 lightning-logo"/>
      Payment
    </h1>
      <ErrorPage v-if="!paymentSuccessful && errorMessage.length > 0" :errors="errorMessage"></ErrorPage>
    <PaymentConfirmed
      v-if="paymentSuccessful"
      :timeStamp="paymentTimeStamp"
      :paymentAmount="amountPaid"
      :referenceId="referenceId"
    ></PaymentConfirmed>
    <AwaitingPayment v-if="awaitingPayment" :qrCodeUrl="paymentQrCodeUrl"></AwaitingPayment>
      <div>
        <img src="@/assets/secure-payment-money-badger.png" alt="Secure Payment" class="mx-auto py-4"  />
      </div>
    </div>
    <div :style="{ display: 'none' }">
      <p>From Params:</p>
      <p>Merchant Code: {{ merchantCode }}</p>
      <p>Order ID: {{ orderId }}</p>
      <p>Amount Cents: {{ amountCents }}</p>
      <p>Order Description: {{ orderDescription }}</p>
      <p>Status Webhook URL: {{ statusWebhookUrl }}</p>
    </div>
  </div>
</template>

<style scoped>

.lightning-logo {
  width: 20px;
  height: auto;
}

.payment-card {
  width: 30%;
}
.status-bar, .status-bar .text, .open-wallet-btn {
  background-color: var(--color-amber-med);
  font-weight: bold;
  color: var(--color-black);
  text-align: center;
}

button:hover {
  background-color: var(--color-amber-light);
}
</style>
