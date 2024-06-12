<script lang="ts">
import { format } from 'date-fns'
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
    currency() {
      return 'R'
    },
    paidAt() {
      return this.timeStamp
    }
  },
  methods: {
    formatTime(timeString: String) {
      const timeStamp = new Date(timeString.toString())
      return format(timeStamp, 'HH:mm MMM dd, yyyy')
    }
  }
}
</script>

<template>
  <div>
    <div>
      <h4 class="font-bold">Payment Successful</h4>
    </div>
    <div class="logo-circle">
      <LogoCircle class="payment-success-logo" />
    </div>
    <div>
      <h1 class="payment-amount">{{currency}} {{paymentAmount}}</h1>
      <h4 class="time-stamp">{{timeStamp ? formatTime(timeStamp) : ''}}</h4>
      <h4 class="reference-id">{{ referenceId }}</h4>
    </div>
  </div>
</template>

<style scoped>

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
