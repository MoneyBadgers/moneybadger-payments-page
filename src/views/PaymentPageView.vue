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
import PaymentCancelled from '../components/PaymentCancelled.vue';
import { useDevModeStore } from '../stores/devMode';

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
    PaymentCancelled,
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
    onChangeWallet() {
      this.trackAnalytics(AnalyticsEvent.ChangeWallet)
      this.paymentsStore.changeWallet()
    },
  },
  watch: {
    status(newStatus: PaymentStatus) {
      if (newStatus === PaymentStatus.WaitForPayment) {
        this.trackAnalytics(AnalyticsEvent.WaitingForPayment)
      } else if (newStatus === PaymentStatus.Expired && !this.isOzowTheme) {
        this.trackAnalytics(AnalyticsEvent.TimedOut)
      } else if (newStatus === PaymentStatus.Successful && !this.isOzowTheme) {
        this.trackAnalytics(AnalyticsEvent.PaymentSuccess)
      }
    },
    'paymentsStore.errors': {
      handler(errors: string[]) {
        if (errors.length > 0) {
          this.trackAnalytics(AnalyticsEvent.PaymentFailure, { error: errors[0] })
        }
      }
    }
  },
  computed: {
    ...mapStores(usePaymentStore),
    ...mapStores(useThemeStore),
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
      if (this.paymentsStore.status == PaymentStatus.Expired) return true
      if (this.paymentsStore.invoice.expires_at == null) return false
      return new Date(this.paymentsStore.invoice.expires_at) < new Date()
    },
    isOzowTheme() {
      return useThemeStore().current === 'ozow'
    }
  },
  data() {
    return {
      queryReturn: '',
      Status: PaymentStatus,
      devModeStore: useDevModeStore()
    }
  },
  created() {
    this.paymentsStore.initialiseFromQueryParams(this.$route.query)
    if (this.paymentsStore.status === PaymentStatus.Error) {
      // don't try creating an invoice if we have errors
      return
    }
    this.queryReturn = this.$route.query.return as string
    this.paymentsStore.checkForExistingInvoice()
  },
  mounted() {
    this.trackAnalytics(AnalyticsEvent.ViewPaymentsPage, defaultAnalyticproperties())
    peachInit()
  }
}
</script>

<template>
  <div id="payment-page" class="mx-auto text-center flex flex-col min-h-screen">
    <OzowBanner v-if="isOzowTheme"
      :showBackButton="status !== Status.SelectWallet && status !== Status.Loading"
      @back="paymentsStore.changeWallet"/>
    <div class="mb-container mx-auto px-2 my-2 text-center">
      <ErrorPage v-if="status === Status.Error" :errors="paymentsStore.errors"></ErrorPage>
      <Expired v-if="status === Status.Expired" :errors="paymentsStore.errors"></Expired>
      <LoadingSpinner v-if="status === Status.Loading" />
      <WalletSelect
        v-if="status === Status.SelectWallet"
        :requireTermsAccepted="(paymentsStore as any).requireTermsAccepted"
        :requireRefunds="(paymentsStore as any).requireRefunds || (themeStore as any).requireRefunds"
      />
      <ReviewPayment
        v-if="status === Status.WaitForPayment"
        :wallet="paymentsStore.wallet"
        :invoice="paymentsStore.invoice"
        @change-wallet="onChangeWallet"
      ></ReviewPayment>
      <PaymentConfirmed
        v-if="status === Status.Successful"
        :timeStamp="paymentTimeStamp"
        :paymentAmount="amountPaid"
        :referenceId="referenceId"
        :returnUrl="paymentsStore.invoice.redirect_url || queryReturn"
      ></PaymentConfirmed>
      <PaymentCancelled
        v-if="status === Status.Cancelled">
      </PaymentCancelled>
    </div>
    <OzowTnCs v-if="isOzowTheme" class="mt-auto"/>
    <div class="secure-payment-logo px-16">
      <div class="mx-auto py-4 money-badger-logo" alt="Secure Payment" role="image" @click="devModeStore.logoClick()"></div>
    </div>
  </div>
</template>

<style scoped>
.lightning-logo {
  width: 20px;
  height: auto;
}

.mb-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
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
