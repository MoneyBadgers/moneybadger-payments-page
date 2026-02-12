<template>
  <div v-if="remainingSeconds <= 90" class="box">
    <div class="flex flex-col items-center text-center justify-between my-3
    ">
      <div class="flex items-baseline justify-between">
        <h5 class="font-bold">Payment Expires Soon</h5>
      </div>

      <p class="text-sm text-right py-2">
          <span class="expiry-time">{{ expiresIn }}</span>
      </p>

      <p class="mb-4">Make payment before this screen expires.</p>

      <FeedbackForm
        :feedbackType="FeedbackType.ISSUE"
        walletPrompt="Are you struggling to make payment?"
      />
    </div>
  </div>
</template>

<style>
.expiry-time {
  font-weight: 500;
  font-size: 20px;
}
</style>

<script lang="ts">
import { formatDistanceStrict } from 'date-fns'
import FeedbackForm from '../FeedbackForm.vue'
import { FeedbackType } from '../../api/feedback'

export default {
  name: 'PaymentExpiryHelp',
  components: {
    FeedbackForm
  },
  props: {
    expiresAt: {
      type: String, // timestamp in RFC3339 format
      required: true
    }
  },
  data() {
    return {
      currentTime: Date.now(),
      timer: null as any,
      FeedbackType: FeedbackType
    }
  },
  computed: {
    expiryTime() {
      return new Date(this.expiresAt).getTime()
    },
    remainingSeconds() {
      return Math.max(0, Math.floor((this.expiryTime - this.currentTime) / 1000))
    },
    expiresIn() {
      return formatDistanceStrict(new Date(this.expiryTime), this.currentTime)
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.currentTime = Date.now()
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
