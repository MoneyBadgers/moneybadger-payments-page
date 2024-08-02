<script lang="ts">
import ErrorSymbol from './ErrorSymbol.vue';

export default {
    name: 'Expired',
    components: { ErrorSymbol }
}
</script>

<template>
  <div class="error-page font-bold">
    <h4>Your payment has expired.</h4>
    <div class="error-symbol">
      <ErrorSymbol class="my-4" />
    </div>
    <div class="error-message">
      <ul>
        <li class="font-bold">
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
  color: var(--color-red);
  font-size: 1.2em;
}
</style>