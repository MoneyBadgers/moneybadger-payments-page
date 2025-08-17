<script lang="ts">
import { FeedbackService, FeedbackType } from '../api/feedback'
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'

const feedbackService = new FeedbackService()

export default {
  name: 'GenericFeedbackForm',
  props: {
    feedbackType: {
      type: String as () => FeedbackType,
      required: true
    },
    walletPrompt: {
      type: String,
      default: 'Which wallet would you like to use?'
    }
  },
  data() {
    return {
      message: '',
      error: '',
      outcome: '',
      sent: false,
      showing: false,
      maxLength: 500,
      minLength: 3
    }
  },
  computed: {
    ...mapStores(usePaymentStore),
    charsLeft(): number {
      return this.maxLength - this.message.length
    },
    isValid(): boolean {
      return this.message.trim().length >= this.minLength
    }
  },
  methods: {
    sanitize(text: string): string {
      const trimmed = (text || '').trim()
      return trimmed.length <= this.maxLength ? trimmed : trimmed.slice(0, this.maxLength)
    },
    async submit() {
      this.outcome = ''
      this.error = ''
      this.sent = true
      try {
        const safeMessage = this.sanitize(this.message)
        await feedbackService.submitFeedback({
          feedbackType: this.feedbackType,
          message: safeMessage,
          orderId: this.paymentsStore.invoice.order_id || this.paymentsStore.invoiceParams.orderId || 'unknown',
          merchantCode: this.paymentsStore.invoice.merchant_code || this.paymentsStore.invoiceParams.merchantCode || 'unknown'
        })
        this.outcome = 'Thank you for your feedback!'
        this.$emit('submitted')
        this.showing = false
        this.message = ''
      } catch (e: any) {
        this.error = e?.message || 'Something went wrong, please try again.'
      } finally {
        this.sent = false
      }
    },
    toggle() {
      this.showing = !this.showing
    },
    close() {
      this.showing = false
    }
  },
}
</script>

<template>
  <div>
    <div @click="toggle">
      <slot name="trigger"></slot>
    </div>

    <transition name="fade">
      <div v-if="showing" class="modal-overlay" @click.self="close">
        <div class="modal-box m-3">
          <h5 class="font-bold mb-2 text-lg">{{ walletPrompt }}</h5>

          <textarea
            class="w-full p-3 rounded border border-gray-300 text-black"
            placeholder="Please let us know what could be improved"
            v-model="message"
            :maxlength="maxLength"
            rows="4"
          ></textarea>

          <div class="flex items-center justify-between mt-1 text-sm">
            <span
              v-if="message.trim().length >= minLength"
              class="opacity-70"
              :class="{ 'text-red-400': charsLeft < 0 }"
            >
              {{ Math.max(charsLeft, 0) }} characters left
            </span>
            <span v-else-if="message.trim().length" class="text-red-400">
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
            <button type="button" class="skip-btn w-full my-3" @click="close">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-box {
  background-color: #1e1e1e;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  color: white;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
}

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
}
.skip-btn:hover {
  color: var(--color-amber-med);
  border-color: var(--color-amber-med);
}

/* fade-in/out transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>