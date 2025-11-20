<script lang="ts">
export default {
  name: 'StepIndicator',
  props: {
    currentStep: { type: Number, required: true },
  },
  data() {
    return {
      steps: [1, 2, 3],
    }
  },
}
</script>

<template>
  <div class="step-indicator flex items-right justify-center">
    <div v-for="(step, index) in steps" :key="index" class="flex items-center">
      <span
           v-if="step < currentStep"
          class="step check w-6 h-6 rounded-full flex items-center justify-center bg-primary-color"
        >
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.25 1.25L4.375 8.25L1.25 5.06818" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span><span
          v-else
          class="step number w-6 h-6 rounded-full flex items-center justify-center bg-primary-color"
          :class="{'later' : step > currentStep}"
        >
          <span class="font-semibold">{{ step }}</span>
      </span>
      <div
        v-if="index < steps.length - 1"
        class="joiner flex-1 h-1 w-3 mx-0 bg-primary-color"
        :class="{'later' : step >= currentStep}"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.later {
  border: 1px solid #E4E7EE99;
  background: none;
}
.step-indicator {
  color: var(--primary-bg);
  .step.number.later {
    border: 1px solid #E4E7EE99;
    color: var(--secondary-text);
    background: none;
  }
}
</style>