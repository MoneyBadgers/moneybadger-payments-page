<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 modal-bg flex flex-col items-center justify-center">
      <OzowBanner v-if="isOzowTheme" :showBackButton="true" @back="cancel"/>
      <div class="h-[100%] w-[100%] overflow-y-auto p-6 justify-center">
        <div  class="mx-auto">
          <ReviewPageHeader v-if="isOzowTheme" :wallet="lightning" @change-wallet="$emit('cancel')" />
          <template v-else>
            <div class="wallet-logo valr h-12 bg-no-repeat bg-center mx-auto"></div>
          </template>
          <p class="mb-4 text-left mt-6">
            Provide your Lightning Address in the event that you need a refund
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
            <div class="text-white rounded-lg w-80 pb-6 pt-4 text-center mx-auto">
              <!-- Payment Button -->
              <a
                target="_blank"
                @click="submit"
                class="button main primary font-bold h-16 px-4 w-full flex items-center justify-center gap-2 transition"
              >
                Continue to payment
              </a>
            </div>
          </div>
          <div class="text-bg-color flex justify-center">
            <a class="underline font-bold skip" @click="skip">Skip this step</a>
          </div>       
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { ref } from 'vue'
import { usePaymentStore } from '../../stores/payments'
import LightningAddress from '../../models/lightning_address'
import { useThemeStore } from '../../stores/theme'
import Wallet from '../../models/wallet';
import ReviewPageHeader from "../payment/ReviewPageHeader.vue"
import OzowBanner from '../ozow/OzowBanner.vue'

export default {
  name: 'LightningAddressModal',
  props: {
    open: { type: Boolean, required: true }
  },
   components: {
    ReviewPageHeader,
    OzowBanner,
  },
  computed: {
    isOzowTheme() {
      return useThemeStore().current === 'ozow'
    },
    lightning() {
      return Wallet.wallets['lightning'];
    }
  },
  emits: ['submit', 'skip', 'cancel'],
  setup(props, { emit }) {
    const paymentsStore = usePaymentStore()
    const address = ref("") 
    address.value = usePaymentStore().refundRecipientAddress
    const verifying = ref(false)
    const error = ref(false)

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
  z-index: 1000;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
a.skip {
  cursor: pointer;
}
</style>