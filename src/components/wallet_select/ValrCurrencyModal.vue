<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 modal-bg flex items-center justify-center">
      <div class="h-[100%] overflow-y-auto p-6 rounded-lg shadow-lg justify-center">
        <div class="wallet-logo valr h-12 bg-no-repeat bg-center"></div>
        <h1 class="my-4">Select Currency</h1>
        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="currency in currencies"
            :key="currency"
            class="button mx-auto px-4 py-1 w-[10rem]"
            @click="select(currency)"
          >
            {{ currency }}
          </button>
        </div>
        <div class="flex justify-center mt-4">
          <button class="text-btn" @click="$emit('cancel')">Cancel</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
const valrCurrencies = [
  'BTC', 'AVAX', 'BNB', 'ETH', 'EURC', 'PYUSD', 'SHIB', 'SOL', 'USDC', 'USDT', 'XRP', 'ZAR'
];

export default {
  name: 'ValrCurrencyModal',
  props: {
    open: { type: Boolean, required: true },
  },
  emits: ['select', 'cancel'],
  methods: {
    select(currency: string) {
      this.$emit('select', currency)
    }
  },
  data() {
    return {
      currencies: valrCurrencies
    }
  },
}
</script>