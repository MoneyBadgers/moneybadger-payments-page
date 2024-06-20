<script lang="ts">
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'
import AwaitingPayment from '@/components/AwaitingPayment.vue'
import Logo from '@/components/Logo.vue'
import PaymentConfirmed from '@/components/PaymentConfirmed.vue'
import ErrorPage from '../components/ErrorPage.vue'
import WalletSelect from '../components/WalletSelect.vue'
import { PaymentStatus } from '../types/PaymentStatus'
import Wallet from '../models/wallet'

export default {
  name: 'PaymentPageView',
  components: {
    WalletSelect,
    AwaitingPayment,
    Logo,
    PaymentConfirmed,
    ErrorPage,
  },
  methods: {
  },
  computed: {
    ...mapStores(usePaymentStore),
    wallet: function (): Wallet {
      return this.paymentsStore.wallet
    },
    status: function (): PaymentStatus {
      return this.paymentsStore.status
    },
    paymentQrCodeUrl: function (): string {
      return this.paymentsStore.invoice.payment_request?.qr_code_url || '' // TODO: show an image to make it obvious this failed
    },
    paymentRequest: function (): string {
      return this.paymentsStore.lnPaymentRequest || ''
    },
    amountPaid: function (): number {
      return this.paymentsStore.amountPaidCents / 100.0
    },
    paymentTimeStamp: function (): string {
      return this.paymentsStore.paidAt || ''
    },
    referenceId: function (): string {
      return this.paymentsStore.referenceId || ''
    },
    statusMessage: function (): string {
      if (this.paymentsStore.errors.length > 0) {
        return this.paymentsStore.errors[0]
      } else if (this.paymentsStore.status === PaymentStatus.Successful) {
        return 'Payment Successful'
      } else if (this.paymentsStore.status === PaymentStatus.SelectWallet) {
        return 'Select Wallet'
      } else if (this.paymentsStore.status === PaymentStatus.WaitForPayment) {
        return 'Waiting for Payment...'
      } else {
        return 'Loading...'
      }
    },
    statusStyle: function (): string {
      if (this.paymentsStore.errors.length > 0) {
        return 'bg-red-500'
      } else {
        return ''
      }
    },
  },
  data() {
    return {
      Status: PaymentStatus
    }
  },
  created() {
    this.paymentsStore.initialiseFromQueryParams(this.$route.query)
    if (this.paymentsStore.status === PaymentStatus.Error) {
      // don't try creating an invoice if we have errors
      return
    }
    this.paymentsStore.checkForExistingInvoice()
}
}
</script>

<template>
  <div class="mx-auto text-center">
    <div class="status-bar py-2" :class="statusStyle">
      <span class="text" :class="statusStyle">{{statusMessage}}</span>
    </div>
    <div class="container mx-auto text-center">
      <h1 class="py-2 font-bold flex justify-center items-center">
        {{ wallet.name }}
          <Logo class="mx-1 lightning-logo"/>
        Payment
      </h1>
      <ErrorPage v-if="status === Status.Error" :errors="paymentsStore.errors"></ErrorPage>
      <p v-if="status === Status.Loading">Loading</p>
      <WalletSelect v-if="status === Status.SelectWallet"></WalletSelect>
      <AwaitingPayment
        v-if="status === Status.WaitForPayment"
        :wallet="paymentsStore.wallet"
        :invoice="paymentsStore.invoice"
        @change-wallet="paymentsStore.changeWallet"
      ></AwaitingPayment>
      <PaymentConfirmed
        v-if="status === Status.Successful"
        :timeStamp="paymentTimeStamp"
        :paymentAmount="amountPaid"
        :referenceId="referenceId"
      ></PaymentConfirmed>
      <div class="secure-payment-logo">
        <img src="@/assets/secure-payment-money-badger.png" alt="Secure Payment" class="mx-auto py-4"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

.lightning-logo {
  width: 20px;
  height: auto;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .container {
    width: 100%;
  }
}

@media (max-width: 992px) {
  .container {
    width: 60%;
  }
}
.status-bar, .status-bar .text {
  background-color: var(--color-amber-med);
  font-weight: bold;
  color: var(--color-black);
  text-align: center;
  &.bg-red-500 {
    background-color: var(--color-red);
  }
}

.secure-payment-logo {
  max-width: 300px;
}

button:hover {
  background-color: var(--color-amber-light);
}
</style>
