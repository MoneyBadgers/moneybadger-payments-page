<template>
    <button
      class="choose-wallet-btn my-2 rounded w-[300px] relative"
      @click="$emit('click')"
      :disabled="disabled"
    >
      <div class="flex flex-row justify-between items-center w-full pl-4">
        <!-- dynamically add walletClass -->
        <div
          class="wallet-logo h-10 bg-no-repeat bg-left"
          :class="walletClass"
        ></div>
        <ChevronRightIcon class="text-bg-color w-6 h-6 absolute right-4" />
      </div>
    </button>
    <div v-if="disabled" class="overlay">Not available</div>
</template>

<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/24/solid'

defineProps<{
  walletClass: string
  disabled?: boolean
  subtext?: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>
<style>
.wallet-logo {
    width: 8rem;
}
.choose-wallet-btn {
  height: 60px;
  font-weight: bold;
  color: var(--color-black);
  text-align: center;
  &:hover {
    transform: translateX(10px);
    background-color: var(--secondary-bg);
  }
  border: 1px solid var(--border-color);
}
</style>