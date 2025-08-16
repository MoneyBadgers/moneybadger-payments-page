<template>
  <div class="box text-white rounded-lg w-80 p-6 text-center">
    <!-- Logo and Brand -->
    <div class="flex justify-center mb-4">
      <img src="@/assets/wallets/binance-yellow.png" alt="Payment provider logo" class="h-6" />
    </div>

    <!-- Payment Message -->
    <p class="text-sm text-gray-300 mb-1">You will be making a payment of</p>
    <p class="text-3xl font-semibold text-white mb-6">{{ formattedAmount }}</p>

    <!-- Payment Button -->
    <button
      class="solid-btn text-black font-medium py-2 px-4 rounded-full w-full flex items-center justify-center gap-2 transition"
    >
      Make payment
      <ArrowRightIcon class="w-4 h-4" />
    </button>
  </div>
</template>

<script>
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'PaymentCard',
  components: {
    ArrowRightIcon
  },
  props: {
    logoUrl: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedAmount() {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2
      }).format(this.amount)
    }
  }
}
</script>