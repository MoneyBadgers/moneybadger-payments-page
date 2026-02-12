<template>
  <div class="w-full text-left">
    <p class="my-4">Scan the QR code with {{ wallet.scanner }} to complete payment</p>
    <div v-if="paymentRequestQrUrl && !qrLoadError" class="flex justify-center items-center">
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
    <div v-else class="flex justify-center items-center">
      <qrcode-vue :value="paymentRequestQrData" :size="300" :margin="3" level="L" />
    </div>
    <p class="my-2 text-center">Payment link expires in 2 minutes</p>
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
      return (this.paymentsStore as any).paymentRequestQrData
    },
    paymentRequestQrUrl(): string | null {
      return (this.paymentsStore as any).paymentRequestQrUrl
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
.instructions {
  max-width: 300px;
}

.payment-qr-code {
  cursor: pointer;
  max-width: 300px;
}

.payment-qr-code.hidden {
  display: none;
}
</style>
