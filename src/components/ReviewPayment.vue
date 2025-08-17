<template>
  <div class="text-white px-4 h-full">
    <!-- Back Button + Header -->
    <div class="flex items-center mb-2">
      <button @click="$emit('change-wallet')" class="mr-2">
        <span class="w-6 h-6 rounded-full flex items-center justify-center bg-primary-color text-bg-color">
          <ChevronLeftIcon class="w-5 h-5 mr-0.5" />
        </span>
      </button>
      <h2 class="text-lg font-semibold">Review your payment</h2>
    </div>

    <div class="flex flex-col items-center my-2">
        <!-- Help Text -->
        <p class="text-sm text-gray-300">
        We will take you to your wallet to finish the payment.
        <HowToPayModal />
        </p>
    </div>

    <div class="flex flex-col items-center my-2 box">
        <PaymentDetails :amountCents="invoice.amount_cents" :logo="wallet.valueStore"/>
        <MobilePayment v-if="showDeeplinkButton" :invoice="invoice" :wallet="wallet"/>
        <QrDisplay v-else :invoice="invoice" :wallet="wallet"/>
    </div>

    <Expiry :expiresAt="invoice.expires_at || ''" />

    <div class="flex flex-col items-center my-4 box">           
        <MorePaymentOptions @use-qr-code="viewMode = 'qr'" @use-deeplink="viewMode='deeplink'" :showingDeeplinkButton="showDeeplinkButton"/>
    </div>
  </div>
</template>

<script lang="ts">
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import MorePaymentOptions from './payment/MorePaymentOptions.vue' 
import MobilePayment from './payment/MobilePayment.vue' 
import PaymentDetails from './payment/PaymentDetails.vue'
import QrDisplay from './payment/QrDisplay.vue'
import type { PropType } from 'vue'
import Wallet from '../models/wallet'
import type { Invoice } from '../api/cryptoqr/api'
import HowToPayModal from './payment/HowToPayModal.vue'
import Expiry from './payment/Expiry.vue'

export default {
  name: 'ReviewPayment',
  components: {
    ChevronLeftIcon,
    MorePaymentOptions,
    MobilePayment,
    PaymentDetails,
    QrDisplay,
    HowToPayModal,
    Expiry,
  },
  props: {
    invoice: { type: Object as PropType<Invoice>, required: true },
    wallet: { type: Object as PropType<Wallet>, required: true }
  },
  computed: {
    showDeeplinkButton() { 
      if (this.viewMode === 'deeplink') {
        return true
      }
      if (this.viewMode === 'qr') {
        return false
      }
      return this.isMobileDevice
    },
    isMobileDevice() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    },
    isDesktopDevice() {
        return !this.isMobileDevice
    },
  },
  data() {
    return {
      viewMode: '',
    }
  }
}
</script>