<script lang="ts">
import ErrorPage from '@/components/ErrorPage.vue'
import Logo from '@/components/Logo.vue'
import { mapStores } from 'pinia';
import { usePaymentStore } from '../stores/payments';

export default {
  name: 'ErrorPageView',
  components: {
    ErrorPage,
    Logo
  },
  computed: {
    ...mapStores(usePaymentStore),
    errorMessages() {
      return this.paymentsStore.errors
    }
  }
}
</script>

<template>
  <div class="mx-auto text-center">
    <div class="status-bar py-2">
      <span class="text">Error</span>
    </div>
    <div class="container mx-auto text-center">
      <h1 class="py-4 font-bold flex justify-center items-center">
        Lightning
        <Logo class="mx-1 lightning-logo"/>
        Payment
      </h1>
      <ErrorPage :errors="errorMessages"></ErrorPage>
      <div class="secure-payment-logo">
        <img src="@/assets/secure-payment-money-badger.png" alt="Secure Payment" class="mx-auto py-4"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lightning-logo {
  width: 20px;
  height: auto;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .container {
    width: 100%;
  }
}

@media (max-width: 992px) {
  .container {
    width: 60%;
  }
}
.status-bar, .status-bar .text {
  background-color: var(--color-amber-med);
  font-weight: bold;
  color: var(--color-black);
  text-align: center;
}

.secure-payment-logo {
  max-width: 300px;
}

</style>
