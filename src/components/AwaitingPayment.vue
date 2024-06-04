<script lang="ts">
import { ClipboardDocumentIcon } from '@heroicons/vue/24/outline'
import LoadingSpinner from './LoadingSpinner.vue'

let t: any

export default {
  name: 'AwaitingPayment',
  components: {
    ClipboardDocumentIcon,
    LoadingSpinner
  },
  props: {
    qrCodeUrl: { type: String, default: '' }
  }
}
</script>

<template>
  <div>
    <h4 class="text-gray-200 font-bold py-4">Scan QR code with Lightning Wallet</h4>
  </div>
  <div class="justify-center text-center">
    <img v-if="qrCodeUrl" class="payment-qr-code mx-auto py-5" :src="qrCodeUrl" />
    <div v-else class="mx-auto w-10 py-5">
      <LoadingSpinner />
    </div>
  </div>
  <div>
    <div class="inline-flex items-center w-100">
      <h5 class="text-gray-200 font-bold py-4">Tap QR Code to copy address</h5> <!-- TODO: do this -->
      <ClipboardDocumentIcon class="mx-2 size-6 text-yellow-500" />
    </div>
  </div>
  <div class="py-4 mx-4">
    <button class="open-wallet-btn py-2 px-4 rounded w-3/4">
      Open Wallet
    </button>
  </div>
</template>

<style scoped>
.payment-qr-code, .open-wallet-btn {
  max-width: 300px;
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
