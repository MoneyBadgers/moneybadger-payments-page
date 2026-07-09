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

<style scoped>
.step-indicator {
  position: relative;
  width: 100px;
  height: 25px;
}

/* Connectors — match Figma top/bottom percentages exactly */
.joiner {
  position: absolute;
  top: 37.69%;
  bottom: 38.19%;
  box-sizing: border-box;
  background: #F9F9F9;
  border: 1px solid #CACFDE;
}
.joiner--left  { left: 21%; right: 59%; }
.joiner--right { left: 59%; right: 21%; }
.joiner--active {
  background: #C7FFE8;
  border: 1.5px solid #00B8AD;
}

/* Step circles */
.step {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.step--check {
  background: #F9F9F9;
  border: 1px solid #CACFDE;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.12));
}

.step--current {
  background: #C7FFE8;
  border: 1.5px solid #00B8AD;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.12));
  color: #1E2330;
}

.step--later {
  background: #F9F9F9;
  border: 1px solid #95A0BD;
  color: #3F4A65;
}

.step-number {
  font-size: 15px;
  font-weight: 600;
  font-family: Gordita, sans-serif;
  line-height: 1;
  padding-top: 2px;
}
</style>
