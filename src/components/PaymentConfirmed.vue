<script lang="ts">
import { formatTime } from '@/utils/utils'
import LogoCircle from '@/components/LogoCircle.vue'

export default {
  name: 'PaymentConfirmed',
  props: {
    paymentAmount: Number,
    referenceId: String,
    timeStamp: String,
  },
  components: {
    LogoCircle
  },
  computed: {
    amountCents() {
      return this.paymentAmount;
    },
    currency() {
      return 'R';
    },
    paidAt() {
      return this.timeStamp; 
    }
  },
  methods: {
    formatTime,
  }
}
</script>

<template>
  <div class="container mx-auto text-center payment-success-card">
    <div>
      <h4 class="text-gray-200 font-bold">Payment Successful</h4>
    </div>
    <div class="logo-circle">
      <LogoCircle class="payment-success-logo" />
    </div>
    <div>
      <h1 class="payment-amount">{{currency}} {{paymentAmount}}</h1>
      <h4 class="time-stamp">{{formatTime(timeStamp)}}</h4>
      <h4 class="reference-id">{{ referenceId }}</h4>
    </div>
  </div>
  <div class="columns-auto py-4 mx-4">
    <button
      class="close-screen-btn py-2 px-4 rounded w-1/4"
    >
      Close Screen
    </button>
  </div>
</template>

<style scoped>
.payment-qr-code {
  max-width: 300px;
}

.close-screen-btn {
  background-color: var(--color-amber-med);
  font-weight: bold;
  color: var(--color-black);
  text-align: center;
}

button:hover {
  background-color: var(--color-amber-light);
}

.payment-success-card {
  border-color: var(--color-purple);
  border-width: 1px;
  border-style: dashed;
  border-radius: 10px;
  width: 30%;
}

.logo-circle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.payment-success-logo {
  width: 50%;
  height: auto;
}

.payment-amount, .time-stamp {
  color: var(--color-text);
  font-weight: bold;
}

.payment-amount {
  font-size: 3em;
}

.time-stamp {
  font-size: 1.25em;
}

.reference-id {
  color: var(--color-green);
  font-size: 1em;
  font-weight: bold;
}
</style>
