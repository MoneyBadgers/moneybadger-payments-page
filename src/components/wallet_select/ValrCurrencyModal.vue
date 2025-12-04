<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 modal-bg flex items-center justify-center">
      <div class="h-[100%] w-[100%] overflow-y-auto p-6 justify-center">
        <div  class="mx-auto">
          <ReviewPageHeader v-if="isOzowTheme" :wallet="valr" @change-wallet="$emit('cancel')" />
          <template v-else>
            <div class="wallet-logo valr h-12 bg-no-repeat bg-center mx-auto"></div>
          </template>
          <h1 class="my-4 text-left">Select Currency</h1>
          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="currency in currencies"
              :key="currency"
              class="button currency-select mx-auto pl-4 pr-1 py-1.5 w-[100%] flex items-center justify-between"
              @click="select(currency)"
            >
              <span class="font-medium tracking-wide">{{ currency }}</span>
              <ChevronRightIcon class="w-6 h-6" />
            </button>
          </div>
          <div class="text-bg-color flex justify-center mt-8">
            <a class="underline font-bold" @click="$emit('cancel')">Go Back</a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">

import { ChevronRightIcon } from '@heroicons/vue/24/solid'
import { useThemeStore } from '../../stores/theme'
import ReviewPageHeader from "../payment/ReviewPageHeader.vue"
import Wallet from '../../models/wallet';

const valrCurrencies = [
  'BTC', 'AVAX', 'BNB', 'ETH', 'SOL', 'USDC', 'USDT', 'XRP', 'ZAR'
];

export default {
  name: 'ValrCurrencyModal',
  props: {
    open: { type: Boolean, required: true },
  },
  components: {
    ChevronRightIcon,
    ReviewPageHeader,
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
  computed: {
    isOzowTheme() {
      return useThemeStore().current === 'ozow'
    },
    valr() {
      return Wallet.wallets['valr'];
    }
  }
}
</script>

<style scoped>
.modal-bg {
  background-color: var(--secondary-bg);
  z-index: 1000;
}
</style>