<template>
  <div class="px-4 pb-4 h-full">
      <!-- Back Button + Header -->
      <ReviewPageHeader :wallet="wallet" @change-wallet="$emit('change-wallet')" />

      <div class="flex flex-col items-center my-2 box">
        <PaymentDetails :amountCents="invoice.amount_cents" :logo="wallet.valueStore" v-if="!ozow"/>
        <MobilePayment v-if="showDeeplinkButton" :invoice="invoice" :wallet="wallet" />
        <QrDisplay v-else :invoice="invoice" :wallet="wallet" />
      </div>

    <Expiry :expiresAt="invoice.expires_at || ''" />

    <div class="flex flex-col items-center my-4 box">
      <MorePaymentOptions
        @use-qr-code="viewMode = 'qr'"
        @use-deeplink="viewMode = 'deeplink'"
        :showingDeeplinkButton="showDeeplinkButton"
      />
    </div>

    <a class="text-button" v-if="ozow" id="bottom-back-link" @click="$emit('change-wallet')">Go Back</a>
  </div>
</template>

<script lang="ts">
import MorePaymentOptions from './payment/MorePaymentOptions.vue'
import MobilePayment from './payment/MobilePayment.vue'
import PaymentDetails from './payment/PaymentDetails.vue'
import QrDisplay from './payment/QrDisplay.vue'
import type { PropType } from 'vue'
import Wallet from '../models/wallet'
import type { Invoice } from '../api/cryptoqr/api'
import Expiry from './payment/Expiry.vue'
import { useThemeStore } from '../stores/theme'
import ReviewPageHeader from "./payment/ReviewPageHeader.vue"

export default {
  name: 'ReviewPayment',
  components: {
    MorePaymentOptions,
    MobilePayment,
    PaymentDetails,
    QrDisplay,
    Expiry,
    ReviewPageHeader
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
      ozow: useThemeStore().current === 'ozow',
    }
  }
}
</script>

<style scoped></style>
