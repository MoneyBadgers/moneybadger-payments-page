<template>
  <!-- Ozow theme header -->
  <template v-if="isOzowTheme">
    <div id="review-payment-header" class="flex items-right mb-2">
      <div :class="`wallet-logo ${wallet.valueStore}`" class="h-6 w-1/4 bg-no-repeat bg-left"></div>
      <StepIndicator :currentStep="3" id="step-indicator" />
    </div>
  </template>
  <!-- Default theme header -->
  <template v-else>
    <button @click="$emit('change-wallet')" class="top-back-button mr-3">
      <span class="w-6 h-6 rounded-full flex items-center justify-center bg-primary-color">
        <ChevronLeftIcon class="w-5 h-5 mr-0.5" />
      </span>
    </button>
    <h1>Review payment</h1>
    <div class="flex flex-col items-center my-4">
      <!-- Help Text -->
      <p class="text-sm text-gray-500 text-left">
        We will take you to your wallet to finish the payment.
        <HowToPayModal />
      </p>
    </div>
  </template>
</template>

<script lang="ts">
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import StepIndicator from './StepIndicator.vue'
import type { PropType } from 'vue'
import { useThemeStore } from '../../stores/theme'
import HowToPayModal from '@/components/payment/HowToPayModal.vue'
import Wallet from '../../models/wallet'

export default {
  name: 'ReviewPageHeader',
  components: {
    HowToPayModal,
    ChevronLeftIcon,
    StepIndicator
  },
  props: {
    wallet: { type: Object as PropType<Wallet>, required: true }
  },
  emits: ['change-wallet'],
  computed: {
    isOzowTheme() {
      return useThemeStore().current === 'ozow'
    }
  }
}
</script>

<style scoped></style>