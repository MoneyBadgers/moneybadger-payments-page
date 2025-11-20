<script lang="ts">
import ErrorSymbol from './ErrorSymbol.vue';
import OzowRedirect from './ozow/OzowRedirect.vue'
import { useThemeStore } from '../stores/theme';
export default {
    name: 'PaymentCancelled',
    components: { ErrorSymbol, OzowRedirect, },
    data() {
      return {
        ozow: useThemeStore().current === 'ozow',
      }
    },
}
</script>

<template>
  <div class="error-page font-bold">
    <p class="font-bold">Your payment has been cancelled.</p>
    <div class="error-symbol">
      <ErrorSymbol class="my-4" />
    </div>
    <OzowRedirect v-if="ozow" />
    <div class="error-message">
      <ul>
        <li>
            Please request a new payment.
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.error-symbol {
  width: 50%;
  height: auto;
}

.error-message {
  color: var(--error);
}
</style>