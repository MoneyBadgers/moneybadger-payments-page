<template>
  <transition name="fade">
    <div v-if="open" class="luno-limit-modal fixed inset-0 modal-bg flex items-center justify-center">
      <div class="modal-card p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <div class="error-banner mb-4">
          <span class="error-icon">⚠</span>
          <h2>Payment Limit Exceeded</h2>
        </div>
        <p class="modal-body mb-4">
          Luno cannot be used for payments over <strong>R100,000</strong>. Please select a different wallet to complete your payment.
        </p>
        <div class="amount-comparison mb-6">
          <div class="amount-row over-limit">
            <span class="label">Your payment</span>
            <span class="amount over">{{ formattedAmount }}</span>
          </div>
          <div class="amount-row">
            <span class="label">Luno limit</span>
            <span class="amount limit">R100,000.00</span>
          </div>
        </div>
        <button class="primary rounded w-full" @click="$emit('close')">
          OK
        </button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
export default {
  name: 'LunoLimitModal',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    amountCents: {
      type: Number,
      default: 0
    }
  },
  emits: ['close'],
  computed: {
    formattedAmount(): string {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2
      }).format(this.amountCents / 100)
    }
  }
}
</script>

<style scoped>
.modal-bg {
  background-color: rgba(0, 0, 0, 0.75);
}
.modal-card {
  background-color: var(--secondary-bg);
  color: var(--primary-text);
  border: 1px solid var(--border-color);
}
.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background-color: rgba(231, 29, 36, 0.12);
  border: 1px solid rgba(231, 29, 36, 0.4);
  border-radius: 8px;
  margin-bottom: 16px;
}
.error-banner h2 {
  color: var(--color-red);
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}
.error-icon {
  color: var(--color-red);
  font-size: 1.2rem;
  line-height: 1;
}
.modal-body {
  color: var(--secondary-text);
  font-size: 0.9rem;
}
.amount-comparison {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}
.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 14px;
}
.amount-row + .amount-row {
  border-top: 1px solid var(--border-color);
}
.amount-row.over-limit {
  background-color: rgba(231, 29, 36, 0.08);
}
.label {
  font-size: 0.85rem;
  color: var(--secondary-text);
}
.amount {
  font-weight: 700;
  font-size: 0.95rem;
}
.amount.over {
  color: var(--color-red);
}
.amount.limit {
  color: var(--primary-text);
  opacity: 0.45;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
