<template>
  <svg v-if="isOzowTheme" width="122" height="106" viewBox="0 0 122 106" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M51.199 7.98033L4.15063 86.09C3.1806 87.7606 2.66734 89.6547 2.66191 91.5838C2.65648 93.5129 3.15907 95.4098 4.11967 97.0857C5.08028 98.7617 6.46542 100.158 8.13729 101.137C9.80916 102.115 11.7095 102.641 13.6492 102.662H107.746C109.686 102.641 111.586 102.115 113.258 101.137C114.93 100.158 116.315 98.7617 117.275 97.0857C118.236 95.4098 118.739 93.5129 118.733 91.5838C118.728 89.6547 118.215 87.7606 117.245 86.09L70.1961 7.98033C69.2059 6.35685 67.8116 5.01459 66.1478 4.08304C64.4841 3.15149 62.6069 2.66211 60.6976 2.66211C58.7882 2.66211 56.9111 3.15149 55.2473 4.08304C53.5835 5.01459 52.1893 6.35685 51.199 7.98033Z" fill="url(#paint0_linear_450_2022)" stroke="white" stroke-width="5.32394" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M59.8062 79.4487H59.994" stroke="white" stroke-width="9.10824" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M59.8062 34.8047V58.019" stroke="white" stroke-width="9.10824" stroke-linecap="round" stroke-linejoin="round"/>
    <defs>
    <linearGradient id="paint0_linear_450_2022" x1="2.66187" y1="2.66211" x2="101.561" y2="117.456" gradientUnits="userSpaceOnUse">
    <stop stop-color="#00E587"/>
    <stop offset="1" stop-color="#00B8AD"/>
    </linearGradient>
    </defs>
  </svg>
  <svg v-else id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178 158.61">
    <path class="cls-1" d="M74.45,8.4L2.28,133.41c-6.47,11.2,1.62,25.21,14.55,25.21H161.17c12.94,0,21.02-14,14.55-25.21L103.55,8.4c-6.47-11.2-22.64-11.2-29.1,0L2.28,133.41c-6.47,11.2,1.62,25.21,14.55,25.21H161.17c12.94,0,21.02-14,14.55-25.21L103.55,8.4c-6.47-11.2-22.64-11.2-29.1,0Z"/>
    <g>
      <path class="cls-2" d="M103.81,67.75h-11.33c3.51-9.73,2.43-25.05-3.59-32.94-.02,4.78-.15,7.56-2.1,15.53-3.08,12.58-5.44,15.48-12.6,27.8h11.33c-3.47,9.68-2.39,24.87,3.6,32.71,.02-4.76,.15-7.52,2.09-15.44,3.02-12.34,5.36-15.33,12.25-27.17l.36-.48Zm-7.26,10.38h-.58l.20-.27,.37,.27Z"/>
      <circle class="cls-2" cx="89" cy="131.69" r="8.11"/>
    </g>
  </svg>
</template>

<script lang="ts">
import { useThemeStore } from '../stores/theme'
export default {
  name: 'ErrorSymbol',
  computed: {
    isOzowTheme() {
      return useThemeStore().current === 'ozow'
    },
  }
}
</script>

<style scoped>
.cls-1 {
  fill: var(--color-amber-med);
}

.cls-2 {
  fill: var(--color-white);
}
</style>