<script lang="ts">
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import LoadingSpinner from './LoadingSpinner.vue'
import ClipboardJS from 'clipboard'

export default {
  name: 'AwaitingPayment',
  emits: ['change-wallet'],
  components: {
    ClipboardDocumentIcon,
    ClipboardDocumentCheckIcon,
    LoadingSpinner
  },
  props: {
    qrCodeUrl: { type: String, default: '' },
    paymentRequest: { type: String, default: '' }
  },
  data() {
    return {
      showCopyHint: false,
      clipboard: null as any
    }
  },
  computed: {
    paymentRequestLink() {
      if (this.paymentRequest) {
        return `lightning:${this.paymentRequest}`
      }
      return ''
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
  },
  beforeDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy()
    }
  },
  methods: {
    openWallet() {
      if (!this.paymentRequestLink || this.paymentRequestLink === '') {
        return
      }
      const newWindow = window.open(this.paymentRequestLink, '_blank')
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined' || newWindow.location.href === 'about:blank') {
        alert('Failed to open wallet. Please ensure you have a compatible lightning wallet installed.')
      }
    },
    copyPaymentRequest() {
      if (!this.paymentRequest) {
        return
      }
      navigator.clipboard.writeText(this.paymentRequest).then(() => {
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
      <h4 class="text-gray-200 font-bold py-2">Scan QR code with Lightning Wallet</h4>
      <h5 class="text-gray-200 font-bold py-2 text-sm" @click="copyPaymentRequest">
        <div v-if="!showCopyHint" class="flex justify-center mx-4 w-300">
          <span class="tap-to-copy">Or tap to copy Lightning invoice (BOLT11)</span>
          <ClipboardDocumentIcon class="mx-2 size-6 text-yellow-500" />
        </div>
        <div v-if="showCopyHint" class="flex justify-center mx-4 w-300">
          <span>Payment details copied to clipboard!</span>
          <ClipboardDocumentCheckIcon class="mx-2 size-6 text-yellow-500" />
        </div>
      </h5>
    </div>
    <div @click="copyPaymentRequest">
      <img v-if="qrCodeUrl" class="payment-qr-code mx-auto py-2" :src="qrCodeUrl" />
      <div v-else class="mx-auto w-10 py-2">
        <LoadingSpinner />
      </div>
    </div>
    <div class="flex justify-center py-2 mx-4">
      <button v-if="paymentRequestLink && paymentRequestLink !== ''" @click="openWallet"
        class="open-wallet-btn py-2 px-4 rounded w-300">
        Open Wallet
      </button>
      <button @click="$emit('change-wallet')"
        class="open-wallet-btn py-2 px-4 rounded w-300">
        Change Wallet
      </button>
    </div>
  </div>
</template>

<style scoped>
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
}

button:hover {
  background-color: var(--color-amber-light);
}
</style>
