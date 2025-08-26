<template>
  <div v-if="remainingSeconds <= 90" class="box">
    <div class="flex flex-col items-left text-left justify-between my-6 p-4">
      <div class="flex items-baseline justify-between">
        <h5 class="font-bold">Are you stuck?</h5>
        <p class="text-sm text-right">
          Expires in <span class="text-primary-accent">{{ expiresIn }}</span>
        </p>
      </div>

      <p class="mb-4">You need to make payment soon or this screen will expire.</p>

      <FeedbackForm
        :feedbackType="FeedbackType.ISSUE"
        walletPrompt="Are you struggling to make payment?"
      >
        <template #trigger>
          <button class="text-primary-accent font-medium hover:underline flex items-center gap-1">
            I need help
            <QuestionMarkCircleIcon class="w-5 h-5" />
          </button>
        </template>
      </FeedbackForm>
    </div>
  </div>
</template>

<script lang="ts">
import { formatDistanceStrict } from 'date-fns'
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/solid'
import FeedbackForm from '../FeedbackForm.vue'
import { FeedbackType } from '../../api/feedback'

export default {
  name: 'PaymentExpiryHelp',
  components: {
    QuestionMarkCircleIcon,
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
