<script lang="ts">
export default {
  name: 'StepIndicator',
  props: {
    currentStep: { type: Number, required: true },
  },
  data() {
    return {
      steps: [1, 2, 3],
      stepPositions: ['0%', '38%', '76%'],
    }
  },
}
</script>

<template>
  <div class="step-indicator">
    <!-- Connectors rendered first so circles paint on top -->
    <div class="joiner joiner--left"  :class="{ 'joiner--active': currentStep === 1 }"></div>
    <div class="joiner joiner--right" :class="{ 'joiner--active': currentStep === 2 }"></div>
    <!-- Step circles -->
    <span
      v-for="(step, index) in steps"
      :key="index"
      class="step"
      :class="{
        'step--check':   step < currentStep,
        'step--current': step === currentStep,
        'step--later':   step > currentStep,
      }"
      :style="{ left: stepPositions[index] }"
    >
      <svg v-if="step < currentStep" width="12" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.25 1.25L4.375 8.25L1.25 5.06818" stroke="#1E2330" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span v-else class="step-number">{{ step }}</span>
    </span>
  </div>
</template>
