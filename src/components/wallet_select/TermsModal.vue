<template>
  <transition name="fade">
    <div v-if="terms.modalOpen" class="terms-modal fixed inset-0 modal-bg flex items-center justify-center">
      <div class="w-200 h-[100%] overflow-y-auto p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Crypto Payment Terms</h2>
        <p>
          <strong>
            By selecting MoneyBadger, you acknowledge and accept the terms and conditions below.
          </strong>
        </p>
        <div class="flex my-2">
          <button class="primary rounded basis-3/4" @click="terms.accept">
            Accept and Continue
          </button>
          <button class="secondary-outline ml-2 basis-1/4" @click="terms.closeModal(false)">Cancel</button>
        </div>
        <ol class="list-decimal pl-6 mb-4">
          <li class="mb-2">
            <strong>Volatility Risks:</strong>
            <ol class="list-decimal pl-6 mb-4">
              <li>
                Crypto assets carry a risk due to its high volatility which may affect the value
                of price fluctuating from time of checkout to conclusion of payment;
              </li>
              <li>
                Past performance relating to the value of the crypto asset is not an indicator of
                future value;
              </li>
              <li>
                The customer understands the risks involved in using crypto assets as a payment
                method. They acknowledge that the value of the crypto asset converted to ZAR may
                vary from the time of the original transaction until the processing of a refund.
              </li>
            </ol>
          </li>
          <li class="mb-2">
            <strong>Refunds:</strong>
            <ol class="list-decimal pl-6 mb-4">
              <li>
                Customers may be entitled to initiate refunds which shall be approved by the
                Merchant in accordance with its refund terms and conditions;
              </li>
              <li>
                Approved refunds shall be processed directly to the customer at the original
                transaction price calculated in ZAR, subject to the necessary wallet information
                being provided by the customer to MoneyBadger.
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { useTermsStore } from '../../stores/terms'
export default {
  name: 'TermsModal',
  setup() {
    const terms = useTermsStore()
    return { terms }
  }
}
</script>

<style scoped>
.terms-modal {
  text-align: left;
}
.modal-bg {
  background-color: var(--secondary-bg);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>