<script lang="ts">
import { ClipboardDocumentIcon } from '@heroicons/vue/24/outline'
export default {
  name: 'AwaitingPayment',
  components: {
    ClipboardDocumentIcon
  }
}
</script>

<template>
  <div class="text-center bg-amber-400 text-black">
    <span>Waiting for Payment...</span>
  </div>
  <div class="container mx-auto text-center">
    <div class="columns-auto">
      <h4 class="text-gray-200 font-bold py-4">Scan QR code with Lighting Wallet</h4>
    </div>
    <div class="columns-auto">
      <img class="payment-qr-code mx-auto py-5" src="../assets/mock-qr.png" />
    </div>
    <div class="columns-auto">
      <div class="inline-flex items-center w-100">
        <h5 class="text-gray-200 font-bold py-4">Tap QR Code to copy address</h5>
        <ClipboardDocumentIcon class="mx-2 size-6 text-yellow-500" />
      </div>
    </div>
    <div class="columns-auto py-4 mx-4">
      <button
        class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded w-full max-w-90"
      >
        Open Wallet
      </button>
    </div>
  </div>
</template>

<style scoped>
.payment-qr-code {
  max-width: 300px;
}
</style>
