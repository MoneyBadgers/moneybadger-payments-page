<template>
  <div class="px-4 pb-4 h-full">
    <!-- Back Button + Header -->
    <div id="review-payment-header" class="flex items-right mb-2">
      <div :class="`wallet-logo ${wallet.valueStore}`" class="h-6 w-1/4 bg-no-repeat bg-left"></div>
      <StepIndicator :currentStep="3" id="step-indicator"/>
    </div>

    <div class="flex flex-col my-2 box">
      <MobilePaymentOzow v-if="showDeeplinkButton" :invoice="invoice" :wallet="wallet" />
      <QrDisplayOzow v-else :invoice="invoice" :wallet="wallet" />
    </div>

    <Expiry :expiresAt="invoice.expires_at || ''" />

    <div class="flex flex-col items-center my-4 box">
      <MorePaymentOptions
        @use-qr-code="viewMode = 'qr'"
        @use-deeplink="viewMode = 'deeplink'"
        :showingDeeplinkButton="showDeeplinkButton"
      />
    </div>

    <a class="text-button" id="bottom-back-link" @click="$emit('change-wallet')">Go Back</a>
  </div>
</template>

<script lang="ts">
import MorePaymentOptions from './payment/MorePaymentOptions.vue'
import type { PropType } from 'vue'
import Wallet from '../models/wallet'
import type { Invoice } from '../api/cryptoqr/api'
import Expiry from './payment/Expiry.vue'
import StepIndicator from './payment/StepIndicator.vue'
import MobilePaymentOzow from '@/components/payment/MobilePaymentOzow.vue'
import QrDisplayOzow from '@/components/payment/QrDisplayOzow.vue'

export default {
  name: 'ReviewPaymentOzow',
  components: {
    MorePaymentOptions,
    MobilePaymentOzow,
    QrDisplayOzow,
    Expiry,
    StepIndicator,
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
    }
  },
  data() {
    return {
      viewMode: '',
    }
  }
}
</script>

<style scoped></style>