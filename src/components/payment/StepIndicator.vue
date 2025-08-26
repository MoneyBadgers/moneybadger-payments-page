<script lang="ts">
import { CheckIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'StepIndicator',
  props: {
    currentStep: { type: Number, required: true },
  },
  data() {
    return {
      steps: ['1', '2', '3'],
    }
  },
  components: {
    CheckIcon,
  },
}
</script>

<template>
  <div class="flex items-right justify-center">
    <div v-for="(step, index) in steps" :key="index" class="flex items-center">
      <span
          class="w-6 h-6 rounded-full flex items-center justify-center bg-primary-color"
        >
          <CheckIcon class="w-4 h-4 mr-0" v-if="currentStep >= index" />
          <span v-else class="font-semibold">{{ step }}</span>
      </span>
      <div
        v-if="index < steps.length - 1"
        class="flex-1 h-1 w-3 mx-0 bg-primary-color"
      ></div>
    </div>
  </div>
</template>