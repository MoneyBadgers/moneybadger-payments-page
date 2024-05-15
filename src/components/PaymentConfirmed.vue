<script lang="ts">
export default {
  name: 'PaymentConfirmed',
  props: {
    paymentAmount: Number,
    referenceId: String,
    timeStamp: String
  },
  components: {}
}
</script>

<template>
  <div class="text-center bg-amber-400 text-black">
    <span>Payment Complete!</span>
  </div>
  <div class="container mx-auto text-center">
    <div class="columns-auto">
      <h4 class="text-gray-200 font-bold py-4">Payment Successfull</h4>
    </div>
    <div class="columns-auto">
      <img class="payment-qr-code mx-auto py-5" src="../assets/payment-success.png" />
    </div>
    <div class="columns-auto">
      <h1 class="text-gray-200 font-bold py-4">R200</h1>
      <h4 class="text-gray-200 font-bold py-2">12:05, 13 March 2024</h4>
      <h4 class="text-green-600 font-bold py-4">Reference ID</h4>
    </div>
    <div class="columns-auto py-4 mx-4">
      <button
        class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded w-full max-w-90"
      >
        Close Screen
      </button>
    </div>
  </div>
</template>

<style scoped>
.payment-qr-code {
  max-width: 300px;
}
</style>
