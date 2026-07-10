<script lang="ts">
import ErrorSymbol from './ErrorSymbol.vue';
import { useThemeStore } from '../stores/theme';
import { usePaymentStore } from '../stores/payments';

export default {
    name: 'ErrorPage',
    props: {
        errors: {
            type: Array,
            required: true
        }
    },
    components: { ErrorSymbol },
    methods: {
      goBack() {
        usePaymentStore().changeWallet()
      }
    },
    data() {
        return {
            ozow: useThemeStore().current === 'ozow',
        }
    }
}
</script>

<template>
  <div class="error-page font-bold">
    <h4>Oops! Something went wrong.</h4>
    <div class="error-symbol">
      <img v-if="ozow" src="@/assets/partners/ozow/red_sad_face.svg" alt="Error" class="my-4" />
      <ErrorSymbol v-else class="my-4" />
    </div>
    <div class="error-message">
      <ul>
        <li v-for="(error, index) in errors" :key="index" class="font-bold">
          {{ error }}
        </li>
      </ul>
    </div>
    <button v-if="ozow" class="ozow-done-btn mt-8" @click="goBack">Return to Payment Methods</button>
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