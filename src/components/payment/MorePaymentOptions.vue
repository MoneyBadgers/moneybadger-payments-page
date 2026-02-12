<template>
  <div class="box rounded-lg w-full p-4" :class="{ 'ozow-border': isOzowTheme }">
    <!-- Toggle Header -->
    <div class="flex flex-row justify-between items-right cursor-pointer" @click="toggle">
      <span style="font-size: 16px" class="font-medium">More payment options</span>
      <ChevronUpIcon
        class="w-6 h-6 transition-transform duration-200"
        :class="{
          'rotate-180': !expanded,
          'ozow-chevron': isOzowTheme,
          'text-primary-accent': !isOzowTheme
        }"
      />
    </div>

    <!-- Expandable Content -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-40 opacity-100"
      leave-from-class="max-h-40 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-show="expanded" class="overflow-hidden mt-2 space-y-4">
        <button
          v-if="showingDeeplinkButton"
          class="payment-option w-full flex items-center gap-2 px-4 py-2 text-sm rounded mb-2"
          :class="{ 'ozow-payment-option': isOzowTheme }"
          @click="$emit('use-qr-code')"
        >
          <QrCodeIcon class="w-4 h-4 text-secondary-accent" />
          Use QR code
        </button>
        <button
          v-else
          class="payment-option w-full flex items-center gap-2 px-4 py-2 text-sm rounded mb-2"
          :class="{ 'ozow-payment-option': isOzowTheme }"
          @click="$emit('use-deeplink')"
        >
          <ArrowRightIcon class="w-4 h-4 text-secondary-accent" />
          Open in wallet app
        </button>

        <div v-if="showCopyHint" class="flex justify-left w-300 text-xs" :class="{ 'ozow-copy-hint': isOzowTheme, 'text-gray-300': !isOzowTheme }">
          <ClipboardDocumentCheckIcon class="mx-2 size-4 text-secondary-accent" />
          <span>Payment details copied to clipboard!</span>
        </div>

        <button
          @click="copyPaymentRequest"
          class="payment-option w-full flex items-center gap-2 px-4 py-2 text-sm rounded"
          :class="{ 'ozow-payment-option': isOzowTheme }"
        >
          <LinkIcon class="w-4 h-4 text-secondary-accent" />
          Copy payment link
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {
  ChevronUpIcon,
  QrCodeIcon,
  LinkIcon,
  ArrowRightIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/solid'
import { mapStores } from 'pinia'
import { usePaymentStore } from '../../stores/payments'
import { useThemeStore } from '../../stores/theme'
import { AnalyticsEvent } from '../../types/analytics_events'
import { defaultAnalyticproperties } from '../../types/analytics_default_properties'

export default {
  name: 'MorePaymentOptions',
  components: {
    ChevronUpIcon,
    QrCodeIcon,
    LinkIcon,
    ArrowRightIcon,
    ClipboardDocumentCheckIcon
  },
  props: {
    showingDeeplinkButton: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapStores(usePaymentStore, useThemeStore),
    isOzowTheme() {
      return this.themeStore.current === 'ozow'
    }
  },
  data() {
    return {
      expanded: false,
      showCopyHint: false
    }
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded
    },
    copyPaymentRequest() {
      // not really sure what makes sense to copy for Binance
      const content =
        this.paymentsStore.wallet.valueStore == 'binance'
          ? (this.paymentsStore as any).paymentRequestDeepLink
          : (this.paymentsStore as any).paymentRequestQrData
      this.trackAnalytics(AnalyticsEvent.CopyPaymentRequest, {
        content: content
      })
      navigator.clipboard
        .writeText(content)
        .then(() => {
          this.flashCopyHint()
        })
        .catch((err) => {
          console.error('Failed to copy: ', err)
        })
    },
    flashCopyHint() {
      this.showCopyHint = true
      setTimeout(() => {
        this.showCopyHint = false
      }, 3000)
    },
    trackAnalytics(event: AnalyticsEvent, additionalProps?: Record<string, any>) {
      this.$mixpanel.trackEvent(event, {
        ...defaultAnalyticproperties({
          wallet: this.paymentsStore.wallet.name,
          currency: this.paymentsStore.invoice.currency,
          merchant: this.paymentsStore.invoice.merchant_name,
          amount: this.paymentsStore.invoice.amount_cents
        }),
        ...additionalProps
      })
    }
  }
}
</script>

<style scoped>
.ozow-border {
  border: 1px solid #E4E7EE;
}

.ozow-chevron {
  color: #95A0BD;
}

.ozow-payment-option {
  background: #F1F3F6;
  font-size: 16px;
}

.ozow-payment-option .text-secondary-accent {
  color: #1E2330;
}

.ozow-copy-hint {
  color: #1E2330;
}
</style>
