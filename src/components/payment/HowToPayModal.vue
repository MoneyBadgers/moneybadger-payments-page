<template>
  <span class="text-primary-color underline cursor-pointer" @click="showModal = true">Learn more</span>
  <div
    v-if="showModal"
    class="modal-overlay"
  >
    <div
      class="box p-6 w-[90%] flex flex-col justify-center"
    >
      <h5 class="text-md font-bold mb-3">How to pay</h5>

      <div class="mb-4">
        <p class="font-semibold text-sm">On mobile:</p>
        <ul class="text-sm list-decimal ml-5 mt-1">
          <li>Tap the button to open your wallet app.</li>
          <li>Approve the payment in your wallet.</li>
        </ul>
      </div>

      <div>
        <p class="font-semibold text-sm">On desktop:</p>
        <ul class="text-sm list-decimal ml-5 mt-1">
          <li>Open your wallet app</li>
          <li>Go to your wallet's QR scanner</li>
          <li>Scan the QR code</li>
          <li>Approve payment in your wallet</li>
        </ul>
      </div>

      <button
        class="primary mt-6"
        @click="showModal = false"
      >
        Got it
      </button>
      <FeedbackForm
        :feedbackType="FeedbackType.WALLET_NOT_SUPPORTED"
        walletPrompt="Tell us how we can help you"
        class="mt-4"
      >
        <template #trigger>
          <button
            class="text-primary-color font-medium hover:underline flex items-center gap-1 mx-auto"
          >
            I need more help
            <QuestionMarkCircleIcon class="w-5 h-5" />
          </button>
        </template>
      </FeedbackForm>
    </div>
  </div>
</template>

<script lang="ts">
import FeedbackForm from '../FeedbackForm.vue'
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/solid'
import { FeedbackType } from '../../api/feedback'
export default {
  name: 'HowToPayModal',
  components: {
    FeedbackForm: FeedbackForm,
    QuestionMarkCircleIcon: QuestionMarkCircleIcon
  },
  data() {
    return {
      showModal: false,
      FeedbackType: FeedbackType
    }
  }
}
</script>
