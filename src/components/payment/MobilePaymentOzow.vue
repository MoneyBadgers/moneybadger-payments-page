<template>
  <p class="my-8 text-left">Open {{wallet.scanner}} to complete payment</p>
  <div class="text-white rounded-lg w-full pb-6">
    <!-- Payment Button -->
    <a
      :href="currentDeeplink"
      target="_blank"
      @click="onOpenWallet"
      class="button main primary py-5 px-4 w-full !flex items-center !justify-center gap-2 transition"
    >
      Open {{wallet.scanner}}
      <ArrowRightIcon class="w-5 h-5" />
    </a>
  </div>
</template>

<script lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { mapStores } from 'pinia'
import { usePaymentStore } from '../../stores/payments'
import { AnalyticsEvent } from '../../types/analytics_events'
import { defaultAnalyticproperties } from '../../types/analytics_default_properties'
export default {
  name: 'PaymentCard',
  components: {
    ArrowRightIcon
  },
  data() {
    return {
      walletOpens: 0
    }
  },
  computed: {
    ...mapStores(usePaymentStore),
    wallet() {
      return this.paymentsStore.wallet
    },
    paymentRequestDeepLink(): string {
      if (this.paymentsStore.invoice.payment_request?.deeplink) {
        return this.paymentsStore.invoice.payment_request.deeplink
      }

      const ps = this.paymentsStore as any

      // if this is VALR and we have defined a payment currency to use,
      // then select the payment data for that currency
      if (ps.wallet.valueStore === 'valr' && ps.getPaymentCurrency) {
        let key = `valr|${ps.getPaymentCurrency}`
        let pm = this.paymentsStore.invoice.payment_request?.payment_methods
        if (pm && pm[key]) {
          let link = this.paymentsStore.wallet.generateLink(pm[key] as unknown as string)
          // This is a workaround for VALR's deeplink format
          // which currently does not support /en in the URL
          let valrFixedLink = link.replace(/(valr\.com)\/en(?=\/payments)/, '$1')
          return valrFixedLink
        }
      }
      const wallet = this.paymentsStore.wallet
      return wallet.generateLink(ps.paymentRequest.data)
    },
    customProtocolDeeplink(): string {
      if (this.paymentsStore.wallet.valueStore === 'valr') {
        // VALR uses a custom protocol for deep linking
        return this.paymentRequestDeepLink.replace('https://', 'valr://')
      }
      return ''
    },
    currentDeeplink(): string {
      let deeplinks = [this.customProtocolDeeplink, this.paymentRequestDeepLink]
      // remove empty deeplinks
      deeplinks = deeplinks.filter((link) => link.length > 0)
      // index by walletOpens to cycle through deeplinks
      return deeplinks[this.walletOpens % deeplinks.length] || ''
    }
  },
  methods: {
    onOpenWallet() {
      this.trackAnalytics(AnalyticsEvent.OpenWalletButtonClicked, {
        walletOpens: this.walletOpens,
        deeplink: this.currentDeeplink
      })
      setTimeout(() => {
        this.walletOpens = this.walletOpens + 1
      }, 100)
      return true
    },
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
    }
  }
}
</script>
