<script lang="ts">
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import ClipboardJS from 'clipboard'
import QrcodeVue from 'qrcode.vue'
import type { PropType } from 'vue'
import type { Invoice } from '../api/cryptoqr/api'
import Wallet from '../models/wallet'
import { formatDistanceStrict } from 'date-fns'
import LoadingSpinner from './LoadingSpinner.vue'
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'
import { AnalyticsEvent } from '../types/analytics_events'
import { defaultAnalyticproperties } from '../types/analytics_default_properties'

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}
function isDesktopDevice() {
  return !isMobileDevice()
}

export default {
  name: 'AwaitingPayment',
  emits: ['change-wallet'],
  components: {
    ClipboardDocumentIcon,
    ClipboardDocumentCheckIcon,
    QrcodeVue,
    LoadingSpinner
  },
  props: {
    invoice: { type: Object as PropType<Invoice>, required: true },
    wallet: { type: Object as PropType<Wallet>, required: true }
  },
  data() {
    return {
      showQr: isDesktopDevice(), // Detect mobile devices
      showCopyHint: false,
      clipboard: null as any,
      qrLoading: true,
      qrLoadError: false,
      currentTime: Date.now(),
      timer: null as any,
      walletOpens: 0,
      forceShowQr: false // Used to force QR code display on mobile devices
    }
  },
  computed: {
    ...mapStores(usePaymentStore),
    isMobileDevice() {
      return true // ;
    },
    isDesktopDevice() {
      return !this.isMobileDevice
    },
    paymentRequest(): string {
      return this.invoice.payment_request?.data || ''
    },
    paymentRequestQrUrl(): string | null {
      // Only return custom QR code URL for Luno and Binance invoices
      if (this.wallet.valueStore != 'luno' && this.wallet.valueStore != 'binance') {
        return null
      }
      if (this.invoice.payment_request?.qr_code_url) {
        return this.invoice.payment_request.qr_code_url
      }
      return null
    },
    paymentRequestQrData(): string {
      if (this.invoice.payment_request?.qr_code_content) {
        return this.invoice.payment_request.qr_code_content
      }
      // if this is VALR and we have defined a payment currency to use,
      // then select the payment data for that currency
      if (this.wallet.valueStore === 'valr' && this.paymentsStore.getPaymentCurrency) {
        let key = `valr|${this.paymentsStore.getPaymentCurrency}`
        let pm = this.invoice.payment_request?.payment_methods
        if (pm && pm[key]) {
          return this.wallet.generateCopyableRequest(pm[key] as unknown as string)
        }
      }
      return this.wallet.generateCopyableRequest(this.paymentRequest)
    },
    paymentRequestDeepLink(): string {
      if (this.invoice.payment_request?.deeplink) {
        return this.invoice.payment_request.deeplink
      }
      // if this is VALR and we have defined a payment currency to use,
      // then select the payment data for that currency
      if (this.wallet.valueStore === 'valr' && this.paymentsStore.getPaymentCurrency) {
        let key = `valr|${this.paymentsStore.getPaymentCurrency}`
        let pm = this.invoice.payment_request?.payment_methods
        if (pm && pm[key]) {
          let link = this.wallet.generateLink(pm[key] as unknown as string)
          // This is a workaround for VALR's deeplink format
          // which currently does not support /en in the URL
          let valrFixedLink = link.replace(/(valr\.com)\/en(?=\/payments)/, '$1')
          return valrFixedLink
        }
      }
      return this.wallet.generateLink(this.paymentRequest)
    },
    customProtocolDeeplink(): string {
      if (this.wallet.valueStore === 'valr' && this.isMobileDevice) {
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
    },
    expiresIn(): string {
      // Use currentTime to force updates
      const expires = new Date(this.invoice.expires_at ?? 0)
      return formatDistanceStrict(expires, this.currentTime, { addSuffix: true })
    }
  },
  mounted() {
    this.clipboard = new ClipboardJS('.copy-btn')
    this.clipboard.on('success', (e: ClipboardJS.Event) => {
      e.clearSelection()
    })
    this.clipboard.on('error', (e: ClipboardJS.Event) => {
      console.error('Failed to copy: ', e)
    })

    this.trackAnalytics(AnalyticsEvent.WaitingForPayment, {
      isDesktopDevice: this.isDesktopDevice,
      qrVisible: this.showQr,
      forceShowQr: this.forceShowQr
    })

    // Add this interval
    this.timer = setInterval(() => {
      this.currentTime = Date.now()
    }, 1000)
  },
  beforeUnmount() {
    if (this.clipboard) {
      this.clipboard.destroy()
    }
    // Add this cleanup
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    copyPaymentRequest() {
      // not really sure what makes sense to copy for Binance
      const content =
        this.wallet.valueStore == 'binance'
          ? this.paymentRequestDeepLink
          : this.paymentRequestQrData
      this.trackAnalytics(AnalyticsEvent.CopyPaymentRequest, {
        content: content
      })
      navigator.clipboard
        .writeText(content)
        .then(() => {
          this.flashCopyHint()
        })
        .catch((err) => {
          console.error('Failed to copy: ', err)
        })
    },
    flashCopyHint() {
      this.showCopyHint = true
      setTimeout(() => {
        this.showCopyHint = false
      }, 3000)
    },
    onQrLoad() {
      this.qrLoading = false
    },
    onQrLoadError() {
      this.qrLoadError = true
    },
    onOpenWallet() {
      this.trackAnalytics(AnalyticsEvent.OpenWalletButtonClicked, {
        walletOpens: this.walletOpens,
        deeplink: this.currentDeeplink
      })
      // could hook in peach payments postMessage here
      setTimeout(() => {
        this.walletOpens = this.walletOpens + 1
      }, 100)
    },
    trackAnalytics(event: AnalyticsEvent, additionalProps?: Record<string, any>) {
      this.$mixpanel.trackEvent(event, {
        ...defaultAnalyticproperties({
          wallet: this.$props.wallet.name,
          currency: this.$props.invoice.currency,
          merchant: this.$props.invoice.merchant_name,
          amount: this.$props.invoice.amount_cents
        }),
        ...additionalProps
      })
    },
    forceShowQrCode() {
      this.forceShowQr = true
      this.trackAnalytics(AnalyticsEvent.ShowQrCodeButtonClicked)
    },
    forceShowOpenWallet() {
      this.forceShowQr = false
      this.trackAnalytics(AnalyticsEvent.ShowOpenWalletButtonClicked)
    },
    changeWallet() {
      this.trackAnalytics(AnalyticsEvent.ChangeWallet)
      this.$emit('change-wallet')
    }
  }
}
</script>

<template>
  <div>
    <div @click="copyPaymentRequest" class="justify-center">
      <h5 class="text-gray-200 font-bold py-1 text-sm" @click="copyPaymentRequest">
        <div v-if="!showCopyHint" class="flex justify-center mx-4 w-300">
          <span class="tap-to-copy">Tap to copy {{ wallet.invoiceType }}</span>
          <ClipboardDocumentIcon class="mx-2 size-6 text-yellow-500" />
        </div>
        <div v-if="showCopyHint" class="flex justify-center mx-4 w-300">
          <span>Payment details copied to clipboard!</span>
          <ClipboardDocumentCheckIcon class="mx-2 size-6 text-yellow-500" />
        </div>
      </h5>
      <div v-if="showQr" class="w-full flex flex-col justify-center items-center">
        <h4 class="text-gray-200 font-bold mb-2">Scan QR code with {{ wallet.scanner }}</h4>
        <div v-if="paymentRequestQrUrl && !qrLoadError" class="center">
          <LoadingSpinner v-if="qrLoading" />
          <img
            :src="paymentRequestQrUrl"
            alt="Payment Request QR Code"
            class="payment-qr-code"
            @load="onQrLoad"
            @error="onQrLoadError"
            :class="{ hidden: qrLoading }"
          />
        </div>
        <div v-else>
          <qrcode-vue :value="paymentRequestQrData" :size="300" :margin="3" level="L" />
        </div>
      </div>
    </div>
    <div v-if="!showQr" class="w-full">
      <div class="w-full flex flex-col justify-center items-center mt-4">
        <a
          :href="currentDeeplink"
          target="_blank"
          @click="onOpenWallet"
          class="open-wallet-btn w-[300px] flex flex-col items-center justify-center text-center rounded-lg shadow-lg py-8"
          :class="{ 'md:hidden': wallet.valueStore == 'binance' }"
        >
          <div class="text-xl font-bold text-black">Click here to pay</div>
          <div class="text-sm text-black">the {{ wallet.scanner }} will open</div>
        </a>
      </div>
    </div>
  </div>
  <p class="mt-3">This Payment Expires {{ expiresIn }}</p>
  <button @click="changeWallet" class="change-wallet-btn py-2 mt-5 rounded w-[300px]">
    Change Wallet
  </button>
  <a @click="showQr = !showQr" class="text-center mt-3">
    <span v-if="!showQr">Show QR code</span>
    <span v-else>I'm on mobile</span>
  </a>
  <div style="display: none">
    <ul>
      <li>currentDeeplink: {{ currentDeeplink }}</li>
      <li>customProtocolDeeplink: {{ customProtocolDeeplink }}</li>
      <li>paymentRequestDeepLink: {{ paymentRequestDeepLink }}</li>
    </ul>
  </div>
</template>

<style scoped>
h4 {
  font-size: 20px;
}

.tap-to-copy {
  cursor: pointer;
  padding: 3px;
}

.payment-qr-code {
  cursor: pointer;
  max-width: 300px;
}

.payment-qr-code.hidden {
  display: none;
}

.status-bar,
.status-bar .text,
.open-wallet-btn {
  display: block;
  background-color: var(--color-amber-med);
  font-weight: bold;
  color: var(--color-black);
  text-decoration: none;
  text-align: center;
  box-shadow: 0px 0px 2px 1px yellow;
  &:hover {
    background-color: var(--color-amber-light);
    color: var(--color-black);
  }
}

.change-wallet-btn {
  background-color: var(--color-black);
  font-weight: bold;
  text-decoration: none;
  color: var(--color-amber-med);
  text-align: center;
  &:hover {
    color: var(--color-amber-light);
  }
  border: 1px solid var(--color-amber-med);
}

a {
  color: var(--color-amber-med);
  text-decoration: underline;
  font-weight: bold;
  &:hover {
    color: var(--color-amber-light);
  }
  display: block;
}
</style>
