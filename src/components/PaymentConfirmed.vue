<script lang="ts">
import { format } from 'date-fns'
import LogoCircle from '@/components/LogoCircle.vue'
import { useThemeStore } from '../stores/theme'
import OzowRedirect from './ozow/OzowRedirect.vue'

export default {
  name: 'PaymentConfirmed',
  props: {
    paymentAmount: Number,
    referenceId: String,
    timeStamp: String,
    returnUrl: String,
  },
  components: {
    LogoCircle,
    OzowRedirect,
  },
  data() {
    return {
      ozow: useThemeStore().current === 'ozow',
    }
  },
  computed: {
    currency() {
      return 'R'
    },
    paidAt() {
      return this.timeStamp
    },
  },
  methods: {
    formatTime(timeString: String) {
      const timeStamp = new Date(timeString.toString())
      return format(timeStamp, 'HH:mm MMM dd, yyyy')
    },
    redirectToReturnUrl() {
      if (this.returnUrl) {
        window.location.href = decodeURIComponent(this.returnUrl)
      }
    },
    autoRedirect() {
      if(this.ozow) {
        return; // Ozow handles its own redirect
      }
      if (this.returnUrl) {
        // Peach says that they think maybe the combination of the postmessage and the redirect is causing issues.
        // peachComplete(this.returnUrl) // this is a peach-specific function, but unless there's a listener, it will just be a nop
        setTimeout(() => {
          this.redirectToReturnUrl()
        }, 2000)
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
  <div v-if="ozow" class="ozow-background-container">
    <div class="py-6 justify-center items-center flex flex-col relative z-10">
      <img src="@/assets/partners/ozow/ozow_logo.svg" alt="Ozow Logo" class="ozow-logo mb-0 mt-10" />
      <img src="@/assets/partners/ozow/confetti_once.gif" alt="Payment Success" style="width: 80%"/>
      <div class="ozow-success-text">Payment Successful</div>
      <div>
        <button @click="redirectToReturnUrl"
                class="ozow-done-btn py-4 mt-20 px-4 rounded w-[300px]">Return to Merchant</button>
      </div>
    </div>
    <OzowRedirect />
  </div>
  <div v-else class="py-6">
    <div>
      <h4 class="font-bold">Payment Successful</h4>
    </div>
    <div class="py-6 logo-circle">
      <LogoCircle class="payment-success-logo" />
    </div>
    <div>
      <h1 class="payment-amount">{{ currency }} {{ paymentAmount?.toFixed(2) }}</h1>
      <h4 class="time-stamp">{{ timeStamp ? formatTime(timeStamp) : '' }}</h4>
      <h4 class="reference-id">{{ referenceId }}</h4>
    </div>
    <div>
      <button @click="redirectToReturnUrl" v-if="returnUrl"
        class="primary py-2 mt-5 px-4 rounded w-[300px]">Done</button>
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
  color: var(--secondary-text);
  font-weight: bold;
}

.payment-amount {
  font-size: 3em;
}

.time-stamp {
  font-size: 1.25em;
}

.reference-id {
  color: var(--success);
  font-size: 0.8em;
  font-weight: bold;
}

.ozow-done-btn {
  background-color: white;
  font-weight: bold;
  color: black;
  text-align: center;
  border: none;
  cursor: pointer;
  border-radius: 50px;
  &:hover {
    background-color: #f5f5f5;
  }
}

.ozow-background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/partners/ozow/ozow_background.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-y: auto;
}

.ozow-success-text {
  font-family: 'Gordita', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 34px;
  letter-spacing: 0px;
  text-align: center;
  text-transform: capitalize;
  color: #FFFFFF;
}
</style>
