<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 modal-bg flex items-center justify-center">
      <div class="w-200 h-[100%] overflow-y-auto p-6 rounded-lg shadow-lg justify-center">
        <div class="wallet-logo lightning h-12 bg-no-repeat bg-center"></div>
        <p class="font-semibold mb-4 text-center">
          To process a refund later (if needed), we require your
          <strong>Lightning Address</strong>.
        </p>
        <div v-if="verifying" class="text-primary-accent text-center mb-4 flex items-center justify-center">
          <div class="spinner mr-4" role="status" aria-label="Loading"></div>
          <p class="m-0">Verifying your Lightning Address...</p>
        </div>
        <div v-if="error" class="text-center mb-4 error">
          <p>That doesn't seem to be a valid Lightning Address.</p>
        </div>
        <input
          v-model="address"
          type="email"
          placeholder="e.g. satoshi@wallet.co"
          class="w-full border border-gray-300 rounded p-2 mb-4 text-black"
        />
        <div class="flex justify-between items-center">
          <button class="secondary-outline mr-2" @click="cancel">Cancel</button>
          <div class="flex">
            <button class="secondary-outline mr-2 rounded" @click="skip">Skip</button>
            <button class="primary rounded" @click="submit">Continue</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { ref } from 'vue'
import { usePaymentStore } from '../stores/payments'
import LightningAddress from '../models/lightning_address'

export default {
  name: 'LightningAddressModal',
  props: {
    open: { type: Boolean, required: true }
  },
  emits: ['submit', 'skip', 'cancel'],
  setup(props, { emit }) {
    const paymentsStore = usePaymentStore()
    const address = ref("") 
    address.value = usePaymentStore().refundRecipientAddress
    const verifying = ref(false)
    const error = ref(true)

    const submit = () => {
      error.value = false
      verifying.value = true
      const addr = new LightningAddress(address.value)
      addr.valid()
        .then((valid: boolean) => {
          verifying.value = false
          if (valid) {
            set(address.value)
            emit('submit')
          } else {
            error.value = true
          }
        })
        .catch(() => {
          verifying.value = false
          error.value = true
        })
    }

    const set = (val: string) => {
      localStorage.setItem('RefundRecipientAddress', val)
      paymentsStore.setRefundRecipientAddress(val)
    }

    const skip = () => {
      emit('skip')
    }

    const cancel = () => {
      emit('cancel')
    }

    return { address, verifying, error, submit, skip, cancel }
  }
}
</script>

<style scoped>
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