<script lang="ts">
export default {
  name: 'StepIndicator',
  data() {
    return {
      currentStep: 1,
      steps: ['Step 1', 'Step 2', 'Step 3'],
    }
  },
  methods: {
    nextStep() {
      this.currentStep++;
    },
    prevStep() {
      this.currentStep--;
    },
  },
}
</script>

<template>
  <div class="flex items-center justify-center w-full max-w-md mx-auto">
    <div v-for="(step, index) in steps" :key="index" class="flex items-center">
      <!-- Step Circle -->
      <div
        class="relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300"
        :class="{
          'border-blue-500 bg-blue-500 text-white': currentStep === index + 1,
          'border-green-500 bg-green-500 text-white': currentStep > index + 1,
          'border-gray-300 text-gray-500': currentStep < index + 1,
        }"
      >
        <span v-if="currentStep <= index + 1">{{ index + 1 }}</span>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <!-- Connecting Line -->
      <div
        v-if="index < steps.length - 1"
        class="w-16 h-1 transition-all duration-300"
        :class="{
          'bg-blue-500': currentStep > index + 1,
          'bg-gray-300': currentStep <= index + 1,
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* Tailwind is used in template, so no additional CSS is needed here */
</style>