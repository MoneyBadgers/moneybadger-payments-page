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
    wallet: { type: Object as PropType<Wallet>, required: true},
  },
  data() {
    return {
      showCopyHint: false,
      clipboard: null as any,
      qrLoading: true,
      qrLoadError: false,
      currentTime: Date.now(),
      timer: null as any,
    }
  },
  computed: {
    ...mapStores(usePaymentStore),
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
      if(this.invoice.payment_request?.qr_code_content) {
        return this.invoice.payment_request.qr_code_content
      }
      // if this is VALR and we have defined a payment currency to use,
      // then select the payment data for that currency
      if(this.wallet.valueStore === 'valr' && this.paymentsStore.getPaymentCurrency){
          let key = `valr|${this.paymentsStore.getPaymentCurrency}`
          let pm = this.invoice.payment_request?.payment_methods
          if(pm && pm[key]){
            return this.wallet.generateCopyableRequest(pm[key] as unknown as string)
          }
      }
      return this.wallet.generateCopyableRequest(this.paymentRequest)
    },
    paymentRequestDeepLink(): string {
      if(this.invoice.payment_request?.deeplink) {
        return this.invoice.payment_request.deeplink
      }
      // if this is VALR and we have defined a payment currency to use,
      // then select the payment data for that currency
      if(this.wallet.valueStore === 'valr' && this.paymentsStore.getPaymentCurrency){
        let key = `valr|${this.paymentsStore.getPaymentCurrency}`
          let pm = this.invoice.payment_request?.payment_methods
          if(pm && pm[key]){
            let link = this.wallet.generateLink(pm[key] as unknown as string)
            // This is a workaround for VALR's deeplink format
            // which currently does not support /en in the URL
            let valrFixedLink = link.replace(/(valr\.com)\/en(?=\/payments)/, '$1');
            return valrFixedLink
          }
      }
      return this.wallet.generateLink(this.paymentRequest)
    },
    expiresIn(): string {
      // Use currentTime to force updates
      const expires = new Date(this.invoice.expires_at ?? 0);
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

    // Add this interval
    this.timer = setInterval(() => {
      this.currentTime = Date.now()
    }, 1000)
  },
  beforeDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy()
    }
    // Add this cleanup
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    openWallet() {
      const newWindow = window.open(this.paymentRequestDeepLink, '_blank')
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined'){
        alert('Failed to open wallet. Please ensure you have a compatible lightning wallet installed.')
      }
    },
    copyPaymentRequest() {
      // not really sure what makes sense to copy for Binance
      const content = this.wallet.valueStore == 'binance' ?
        this.paymentRequestDeepLink :
        this.paymentRequestQrData
      navigator.clipboard.writeText(content).then(() => {
        this.flashCopyHint()
      }).catch(err => {
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
    }
  }
}
</script>

<template>
  <div>
    <div>
      <h4 class="text-gray-200 font-bold">Scan QR code with {{ wallet.scanner }}</h4>
      <h5 class="text-gray-200 font-bold py-1 text-sm" @click="copyPaymentRequest">
        <div v-if="!showCopyHint" class="flex justify-center mx-4 w-300">
          <span class="tap-to-copy">Or tap to copy {{ wallet.invoiceType }}</span>
          <ClipboardDocumentIcon class="mx-2 size-6 text-yellow-500" />
        </div>
        <div v-if="showCopyHint" class="flex justify-center mx-4 w-300">
          <span>Payment details copied to clipboard!</span>
          <ClipboardDocumentCheckIcon class="mx-2 size-6 text-yellow-500" />
        </div>
      </h5>
    </div>
    <div @click="copyPaymentRequest" class="flex justify-center mx-4">
      <div v-if="paymentRequestQrUrl && !qrLoadError">
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
    <p>Expires {{ expiresIn }}</p>
    <div class="flex flex-col items-center py-3 mx-4">
      <a
        :href="paymentRequestDeepLink"
        target="_blank"
        class="open-wallet-btn py-2 px-4 rounded w-[300px]"
        :class="{ 'md:hidden': wallet.valueStore == 'binance' }"
      >
        Open Wallet
      </a>
      <button
        @click="$emit('change-wallet')"
        class="change-wallet-btn py-2 mt-5 px-4 rounded w-[300px]"
      >
        Change Wallet
      </button>
    </div>
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
  background-color: var(--color-amber-med);
  font-weight: bold;
  color: var(--color-black);
  text-align: center;
  &:hover {
    background-color: var(--color-amber-light);
  }
}

.change-wallet-btn {
  background-color: var(--color-black);
  font-weight: bold;
  color: var(--color-amber-med);
  text-align: center;
  &:hover {
    color: var(--color-amber-light);
  }
  border: 1px solid var(--color-amber-med);
}
</style>
