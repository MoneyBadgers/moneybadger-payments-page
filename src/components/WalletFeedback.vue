<!-- WalletFeedback.vue -->
<script lang="ts">
import { FeedbackService, FeedbackType } from '../api/feedback'
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'

const feedbackService = new FeedbackService();

export default {
  name: 'WalletFeedback',
  props: {
    maxLength: { type: Number, default: 500 },
    minLength: { type: Number, default: 3 },
  },
  data() {
    return {
      message: '',
      error: '',
      outcome: '',
      sent: false,
    }
  },
  computed: {
    ...mapStores(usePaymentStore),
    charsLeft(): number {
      return this.maxLength - this.message.length
    },
    isValid(): boolean {
      const hasMsg = this.message.trim().length >= this.minLength
      return hasMsg
    },
  },
  methods: {
    sanitize(text: string): string {
      const trimmed = (text || '').trim()
      if (trimmed.length <= this.maxLength) return trimmed
      return trimmed.slice(0, this.maxLength)
    },
    async submit() {
      this.outcome = ''
      this.error = ''
      this.sent = true
      try {
        const safeMessage = this.sanitize(this.message)
        await feedbackService.submitFeedback({
          feedbackType: FeedbackType.WALLET_NOT_SUPPORTED,
          message: safeMessage,
          orderId: this.paymentsStore.invoice.order_id || this.paymentsStore.invoiceParams.orderId || 'unknown',
          merchantCode: this.paymentsStore.invoice.merchant_code || this.paymentsStore.invoiceParams.merchantCode || 'unknown',
        })
        this.outcome = 'Thank you for your feedback!'
        this.$emit('submitted')
      } catch (e: any) {
        this.error = e?.message || 'Something went wrong, please try again.'
      } finally {
        this.sent = false
      }
    },
  },
}
</script>

<template>
  <div class="mb-4 text-left">
    <label class="block mb-2 font-semibold">Which wallet would you like to use?</label>

    <textarea
      class="w-full p-3 rounded border border-gray-300 text-black"
      placeholder="Please let us know what could be improved"
      v-model="message"
      :maxlength="maxLength"
      rows="4"
    ></textarea>

    <div class="flex items-center justify-between mt-1 text-sm">
      <span v-if="message.trim().length && message.trim().length > minLength" class="opacity-70" :class="{ 'text-red-400': charsLeft < 0 }">
        {{ Math.max(charsLeft, 0) }} characters left
      </span>
      <span v-if="message.trim().length && message.trim().length < minLength" class="text-red-400">
        Minimum {{ minLength }} characters
      </span>
    </div>

    <div class="mt-3 flex flex-col items-center gap-2">
        <div v-if="outcome" class="text-green-400 text-sm w-full text-center">
            {{ outcome }}
        </div>
        <div v-if="error" class="text-red-400 text-sm w-full text-center">
            {{ error }}
        </div>
        <button
            class="feedback-btn w-full"
            :disabled="!isValid || sent"
            @click="submit"
        >
            Send
        </button>
        <button
            type="button"
            class="skip-btn w-full my-3"
            @click="$emit('cancel')"
        >
            Cancel
        </button>
    </div>
  </div>
</template>

<style scoped>
.compact textarea { min-height: 96px; }
.feedback-btn {
  background-color: var(--color-amber-med);
  color: var(--color-black);
  font-weight: bold;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
}
.feedback-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
.skip-btn {
  background-color: var(--color-black);
  color: var(--color-amber-light);
  border: 1px solid var(--color-amber-light);
  border-radius: 0.5rem;
  font-weight: bold;
  padding: 0.5rem 2rem;
  &:hover {
    color: var(--color-amber-med);
    border: 1px solid var(--color-amber-med);
  }
}
</style>