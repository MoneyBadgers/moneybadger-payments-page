<script lang="ts">
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'
import PaymentConfirmed from '@/components/PaymentConfirmed.vue'
import ErrorPage from '../components/ErrorPage.vue'
import Expired from '../components/Expired.vue'
import WalletSelect from '../components/WalletSelect.vue'
import { PaymentStatus } from '../types/PaymentStatus'
import Wallet from '../models/wallet'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { peachInit } from '../partner/peach'
import { AnalyticsEvent } from '../types/analytics_events'
import { defaultAnalyticproperties } from '../types/analytics_default_properties'
import ReviewPayment from '../components/ReviewPayment.vue'
import OzowBanner from '../components/ozow/OzowBanner.vue'
import OzowTnCs from '../components/ozow/OzowTnCs.vue'
import { useThemeStore } from '../stores/theme';

export default {
  name: 'PaymentPageView',
  components: {
    WalletSelect,
    LoadingSpinner,
    ReviewPayment,
    PaymentConfirmed,
    ErrorPage,
    Expired,
    OzowBanner,
    OzowTnCs,
  },
  methods: {
    trackAnalytics(event: AnalyticsEvent, additionalProps?: Record<string, any>) {
      this.$mixpanel.trackEvent(event, {
        ...defaultAnalyticproperties({
          wallet: this.paymentsStore.wallet.name,
          currency: this.paymentsStore.invoice.currency,
          merchant: this.paymentsStore.invoice.merchant_name,
          amount: this.paymentsStore.invoice.amount_cents
        }),
        ...additionalProps
      })
    },
  },
  computed: {
    ...mapStores(usePaymentStore),
    wallet: function (): Wallet {
      return this.paymentsStore.wallet
    },
    status: function (): PaymentStatus {
      if (this.expired) {
        return PaymentStatus.Expired
      }
      return this.paymentsStore.status
    },
    paymentQrCodeUrl: function (): string {
      return this.paymentsStore.invoice.payment_request?.qr_code_url || '' // TODO: show an image to make it obvious this failed
    },
    paymentRequest: function (): string {
      return (this.paymentsStore as any).lnPaymentRequest || ''
    },
    amountPaid: function (): number {
      return (this.paymentsStore as any).amountPaidCents / 100.0
    },
    paymentTimeStamp: function (): string {
      return (this.paymentsStore as any).paidAt || ''
    },
    referenceId: function (): string {
      return (this.paymentsStore as any).referenceId || ''
    },
    expired: function (): boolean {
      if (this.paymentsStore.invoice.expires_at == null) return false
      return new Date(this.paymentsStore.invoice.expires_at) < new Date()
    },
    statusMessage: function (): string {
      if (this.paymentsStore.errors.length > 0) {
        this.trackAnalytics(AnalyticsEvent.PaymentFailure, { error: this.paymentsStore.errors[0] })
        return this.paymentsStore.errors[0]
      } else if (this.paymentsStore.status === PaymentStatus.Successful) {
        this.trackAnalytics(AnalyticsEvent.PaymentSuccess)
        return 'Payment Successful'
      } else if (this.paymentsStore.status === PaymentStatus.SelectWallet) {
        return 'Select Wallet'
      } else if (this.paymentsStore.status === PaymentStatus.WaitForPayment) {
        return 'Waiting for Payment...'
      } else {
        return 'Loading...'
      }
    },
    statusStyle: function (): string {
      if (this.paymentsStore.errors.length > 0) {
        return 'bg-red-500'
      } else {
        return ''
      }
    },
    isOzowTheme() {
      return useThemeStore().current === 'ozow'
    }
  },
  data() {
    return {
      Return: '',
      Status: PaymentStatus
    }
  },
  created() {
    this.paymentsStore.initialiseFromQueryParams(this.$route.query)
    if (this.paymentsStore.status === PaymentStatus.Error) {
      // don't try creating an invoice if we have errors
      return
    }
    this.Return = this.$route.query.return as string
    this.paymentsStore.checkForExistingInvoice()
  },
  mounted() {
    this.trackAnalytics(AnalyticsEvent.ViewPaymentsPage, defaultAnalyticproperties())
    peachInit()
  }
}
</script>

<template>
  <div class="mx-auto text-center flex flex-col min-h-screen">
    <OzowBanner v-if="isOzowTheme" :showBackButton="status !== Status.SelectWallet" @back="paymentsStore.changeWallet"/>
    <div class="container mx-auto my-2 text-center">
      <ErrorPage v-if="status === Status.Error" :errors="paymentsStore.errors"></ErrorPage>
      <Expired v-if="status === Status.Expired" :errors="paymentsStore.errors"></Expired>
      <LoadingSpinner v-if="status === Status.Loading" />
      <WalletSelect
        v-if="status === Status.SelectWallet"
        :requireTermsAccepted="(paymentsStore as any).requireTermsAccepted"
        :requireRefunds="(paymentsStore as any).requireRefunds"
      />
      <ReviewPayment
        v-if="status === Status.WaitForPayment"
        :wallet="paymentsStore.wallet"
        :invoice="paymentsStore.invoice"
        @change-wallet="paymentsStore.changeWallet"
      ></ReviewPayment>
      <PaymentConfirmed
        v-if="status === Status.Successful"
        :timeStamp="paymentTimeStamp"
        :paymentAmount="amountPaid"
        :referenceId="referenceId"
        :returnUrl="Return"
      ></PaymentConfirmed>
    </div>
    <OzowTnCs v-if="isOzowTheme" class="mt-auto"/>
    <div class="secure-payment-logo px-16">
      <div class="mx-auto py-4 money-badger-logo" alt="Secure Payment" role="image"></div>
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
  margin: 0 auto;
}

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(to right, var(--secondary-accent), var(--primary-bg));
  z-index: 50;
}

.spacer {
  height: 24px; /* Same height as the top bar */
}

button:hover {
  background-color: var(--color-amber-light);
}
</style>
