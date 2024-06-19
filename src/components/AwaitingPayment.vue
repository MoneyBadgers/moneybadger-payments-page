<script lang="ts">
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import LoadingSpinner from './LoadingSpinner.vue'
import ClipboardJS from 'clipboard'
import QrcodeVue from 'qrcode.vue'
import type { PropType } from 'vue'
import { Invoice } from '../api/cryptoqr/api'
import Wallet from '../models/wallet'

export default {
  name: 'AwaitingPayment',
  emits: ['change-wallet'],
  components: {
    ClipboardDocumentIcon,
    ClipboardDocumentCheckIcon,
    LoadingSpinner,
    QrcodeVue
  },
  props: {
    invoice: { type: Object as PropType<Invoice>, required: true },
    wallet: { type: Object as PropType<Wallet>, required: true},
  },
  data() {
    return {
      showCopyHint: false,
      clipboard: null as any
    }
  },
  computed: {
    paymentRequest(): string {
      return this.invoice.payment_request?.data || ''
    },
    paymentRequestQrData(): string {
      if(this.invoice.payment_request?.qr_code_content) {
        return this.invoice.payment_request.qr_code_content
      }
      return this.wallet.generateCopyableRequest(this.paymentRequest)
    },
    paymentRequestDeepLink(): string {
      if(this.invoice.payment_request?.deeplink) {
        return this.invoice.payment_request.deeplink
      }
      return this.wallet.generateLink(this.paymentRequest)
    },
  },
  mounted() {
    this.clipboard = new ClipboardJS('.copy-btn')
    this.clipboard.on('success', (e: ClipboardJS.Event) => {
      e.clearSelection()
    })
    this.clipboard.on('error', (e: ClipboardJS.Event) => {
      console.error('Failed to copy: ', e)
    })
  },
  beforeDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy()
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
    }
  }
}
</script>

<template>
  <div>
    <div>
      <h4 class="text-gray-200 font-bold py-2">Scan QR code with {{ wallet.scanner }}</h4>
      <h5 class="text-gray-200 font-bold py-2 text-sm" @click="copyPaymentRequest">
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
      <qrcode-vue :value="paymentRequestQrData" :size="300" :margin="3" level="L" />
    </div>
    <div class="flex flex-col items-center py-3 mx-4">
      <button @click="openWallet"
        class="open-wallet-btn py-2 px-4 rounded w-[300px]">
        Open Wallet
      </button>
      <button @click="$emit('change-wallet')"
        class="change-wallet-btn py-2 mt-5 px-4 rounded w-[300px]">
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
