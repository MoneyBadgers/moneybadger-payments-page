<template>
  <div class="box text-white rounded-lg w-80 p-4">
    <!-- Toggle Header -->
    <div class="flex justify-between items-center cursor-pointer" @click="toggle">
      <span class="text-sm font-medium text-gray-300">More payment options</span>
      <ChevronUpIcon
        class="w-4 h-4 transition-transform duration-200 primary-color"
        :class="{ 'rotate-180': !expanded }"
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
          class="w-full flex items-center gap-2 px-4 py-2 bg-[#3a3a3c] text-sm rounded mb-2"
          @click="$emit('use-qr-code')"
        >
          <QrCodeIcon class="w-4 h-4 text-primary-color" />
          Use QR code
        </button>
        <button
          v-else
          class="w-full flex items-center gap-2 px-4 py-2 bg-[#3a3a3c] text-sm rounded mb-2"
          @click="$emit('use-deeplink')"
        >
          <ArrowRightIcon class="w-4 h-4 text-primary-color" />
          Open in wallet app
        </button>
        
        <div v-if="showCopyHint" class="flex justify-left w-300 text-xs text-gray-300">
          <ClipboardDocumentCheckIcon class="mx-2 size-4 text-primary-color" />
          <span>Payment details copied to clipboard!</span>
        </div>

        <button
          @click="copyPaymentRequest"
          class="w-full flex items-center gap-2 px-4 py-2 bg-[#3a3a3c] text-sm rounded"
        >
          <LinkIcon class="w-4 h-4 text-primary-color" />
          Copy payment link
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ChevronUpIcon, QrCodeIcon, LinkIcon, ArrowRightIcon, ClipboardDocumentCheckIcon } from '@heroicons/vue/24/solid'
import { mapStores } from 'pinia'
import { usePaymentStore } from '../../stores/payments'
import { AnalyticsEvent } from '../../types/analytics_events'
import { defaultAnalyticproperties } from '../../types/analytics_default_properties'

export default {
  name: 'MorePaymentOptions',
  components: {
    ChevronUpIcon,
    QrCodeIcon,
    LinkIcon,
    ArrowRightIcon,
    ClipboardDocumentCheckIcon,
  },
  props: {
    showingDeeplinkButton: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapStores(usePaymentStore),
  },
  data() {
    return {
      expanded: false,
      showCopyHint: false,
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
          ? this.paymentsStore.paymentRequestDeepLink
          : this.paymentsStore.paymentRequestQrData
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
    },
  },
}
</script>