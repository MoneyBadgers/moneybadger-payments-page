<script lang="ts">
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'
import router from '../router'
import AwaitingPayment from '@/components/AwaitingPayment.vue'
import Logo from '@/components/Logo.vue'
import PaymentConfirmed from '@/components/PaymentConfirmed.vue'
import ErrorPage from '../components/ErrorPage.vue'

export default {
  name: 'PaymentPageView',
  components: {
    AwaitingPayment,
    Logo,
    PaymentConfirmed,
    ErrorPage,
  },
  methods: {
    initializeFromQueryParams() {
      return this.paymentsStore.initializeFromQueryParams(this.$route.query)
    },
    findOrCreateInvoice() {
      return this.paymentsStore.findOrCreateInvoice()
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
    paymentQrCodeUrl: function (): string {
      return this.paymentsStore.invoice.payment_request?.qr_code_url || '' // TODO: show an image to make it obvious this failed
    },
    paymentRequest: function (): string {
      return this.paymentsStore.lnPaymentRequest || ''
    },
    awaitingPayment: function (): boolean {
      if (this.missingParams) {
        return false
      }
      return this.paymentsStore.awaitPayment
    },
    errors: function (): string[] {
      return this.paymentsStore.errors
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
      if (this.paymentsStore.errorWhileUpdatingInvoice) {
        return 'Network Error'
      } else if (this.paymentSuccessful) {
        return 'Payment Successful'
      } else if (this.awaitingPayment) {
        return 'Waiting for Payment...'
      } else {
        return 'Loading...'
      }
    },
    statusStyle: function (): string {
      if (this.paymentsStore.errorWhileUpdatingInvoice) {
        return 'bg-red-500'
      } else {
        return ''
      }
    },
    missingParams: function (): boolean {
      return this.paymentsStore.errors.length > 0
    }
  },
  created() {
    const initSuccess = this.initializeFromQueryParams()
    this.findOrCreateInvoice().then(() => {
      this.fetchStatus()
    })
    this.fetchStatus()
  }
}
</script>

<template>
  <div class="mx-auto text-center">
    <div class="status-bar py-2" :class="statusStyle">
      <span class="text" :class="statusStyle">{{statusMessage}}</span>
    </div>
    <div class="container mx-auto text-center">
      <h1 class="py-4 font-bold flex justify-center items-center">
        Lightning
          <Logo class="mx-1 lightning-logo"/>
        Payment
      </h1>
      <ErrorPage v-if="errors.length > 0" :errors="errors"></ErrorPage>
      <div v-else>
        <AwaitingPayment
          v-if="awaitingPayment"
          :qrCodeUrl="paymentQrCodeUrl"
          :paymentRequest="paymentRequest",
          :errorWhileUpdatingInvoice="paymentsStore.errorWhileUpdatingInvoice"
        ></AwaitingPayment>
        <PaymentConfirmed
          v-if="paymentSuccessful"
          :timeStamp="paymentTimeStamp"
          :paymentAmount="amountPaid"
          :referenceId="referenceId"
        ></PaymentConfirmed>
      </div>
      <div class="secure-payment-logo">
        <img src="@/assets/secure-payment-money-badger.png" alt="Secure Payment" class="mx-auto py-4"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

.lightning-logo {
  width: 20px;
  height: auto;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .container {
    width: 100%;
  }
}

@media (max-width: 992px) {
  .container {
    width: 60%;
  }
}
.status-bar, .status-bar .text {
  background-color: var(--color-amber-med);
  font-weight: bold;
  color: var(--color-black);
  text-align: center;
  &.bg-red-500 {
    background-color: var(--color-red);
  }
}

.secure-payment-logo {
  max-width: 300px;
}

button:hover {
  background-color: var(--color-amber-light);
}
</style>
