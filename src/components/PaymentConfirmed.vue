<script lang="ts">
import { format } from 'date-fns'
import LogoCircle from '@/components/LogoCircle.vue'
import { peachComplete } from '../partner/peach'

export default {
  name: 'PaymentConfirmed',
  props: {
    paymentAmount: Number,
    referenceId: String,
    timeStamp: String,
    returnUrl: String,
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
    },
    returnUrl(): string {
      return this.returnUrl
    }
  },
  methods: {
    formatTime(timeString: String) {
      const timeStamp = new Date(timeString.toString())
      return format(timeStamp, 'HH:mm MMM dd, yyyy')
    },
    redirectToReturnUrl() {
      if (this.returnUrl) {
        window.location.href = this.returnUrl
      }
    },
    autoRedirect() {
      if (this.returnUrl) {
        peachComplete(this.returnUrl) // this is a peach-specific function, but unless there's a listener, it will just be a nop
        setTimeout(() => {
          this.redirectToReturnUrl()
        }, 3000)
      }
    }
  },
  // automatically call redirect to returnUrl after a small delay
  mounted() {
    this.autoRedirect()
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
      <h1 class="payment-amount">{{ currency }} {{ paymentAmount?.toFixed(2) }}</h1>
      <h4 class="time-stamp">{{ timeStamp ? formatTime(timeStamp) : '' }}</h4>
      <h4 class="reference-id">{{ referenceId }}</h4>
    </div>
    <div>
      <button @click="redirectToReturnUrl" v-if="returnUrl"
        class="done-btn py-2 mt-5 px-4 rounded w-[300px]">Done</button>
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

.payment-amount,
.time-stamp {
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
  font-size: 0.8em;
  font-weight: bold;
}

.done-btn {
  background-color: var(--color-amber-med);
  font-weight: bold;
  color: var(--color-black);
  text-align: center;

  &:hover {
    background-color: var(--color-amber-light);
  }
}
</style>
