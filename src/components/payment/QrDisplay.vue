<template>
  <div class="w-full flex flex-col justify-center items-center pb-6">
    <p class="text-gray-200 font-bold mb-2">Scan QR code with {{ wallet.scanner }}</p>
    <div v-if="paymentRequestQrUrl && !qrLoadError" class="center">
      <LoadingSpinner v-if="qrLoading" />
      <img
        :src="paymentRequestQrUrl"
        alt="Payment Request QR Code"
        class="payment-qr-code"
        @load="onQrLoad"
        @error="onQrLoadError"
        :class="{ hidden: qrLoading }"
      />
    </div>
    <div v-else>
      <qrcode-vue :value="paymentRequestQrData" :size="300" :margin="3" level="L" />
    </div>
  </div>
</template>

<script lang="ts">
import QrcodeVue from 'qrcode.vue'
import LoadingSpinner from '../LoadingSpinner.vue'
import { mapStores } from 'pinia'
import { usePaymentStore } from '../../stores/payments'
import type { PropType } from 'vue'
import Wallet from '../../models/wallet'
import type { Invoice } from '../../api/cryptoqr/api'

export default {
  name: 'QrCodeDisplay',
  components: {
    QrcodeVue,
    LoadingSpinner
  },
  props: {
    invoice: { type: Object as PropType<Invoice>, required: true },
    wallet: { type: Object as PropType<Wallet>, required: true }
  },
  data() {
    return {
      qrLoading: true,
      qrLoadError: false
    }
  },
  computed: {
    ...mapStores(usePaymentStore),
    paymentRequestQrData(): string {
      return this.paymentsStore.paymentRequestQrData
    },
    paymentRequestQrUrl(): string | null {
      return this.paymentsStore.paymentRequestQrUrl
    }
  },
  methods: {
    onQrLoad() {
      this.qrLoading = false
    },
    onQrLoadError() {
      this.qrLoadError = true
    }
  }
}
</script>

<style scoped>
.payment-qr-code {
  cursor: pointer;
  max-width: 300px;
}

.payment-qr-code.hidden {
  display: none;
}
</style>