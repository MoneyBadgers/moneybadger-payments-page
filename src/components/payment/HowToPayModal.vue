<template>
  <span class="text-orange-400 underline cursor-pointer" @click="showModal = true">Learn more</span>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 text-left"
  >
    <div class="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg text-black relative">
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        @click="showModal = false"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h3 class="text-md font-bold mb-3">How to pay</h3>

      <div class="mb-4">
        <p class="font-semibold text-sm">On mobile:</p>
        <ul class="text-sm list-decimal ml-5 mt-1">
          <li>Tap the button to open your wallet app.</li>
          <li>Approve the payment in your wallet.</li>
        </ul>
      </div>

      <div>
        <p class="font-semibold text-sm">On desktop:</p>
        <ul class="text-sm list-decimal ml-5 mt-1">
          <li>Open your wallet app</li>
          <li>Go to your wallet's QR scanner</li>
          <li>Scan the QR code</li>
          <li>Approve payment in your wallet</li>
        </ul>
      </div>

      <button
        class="mt-6 w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded"
        @click="showModal = false"
      >
        Got it
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HowToPayModal',
  data() {
    return {
      showModal: false,
    }
  }
}
</script>