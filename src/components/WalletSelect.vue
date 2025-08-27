<script lang="ts">
import Wallet from '../models/wallet'
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'
import { AnalyticsEvent } from '../types/analytics_events'
import { defaultAnalyticproperties } from '../types/analytics_default_properties'
import FeedbackForm from './FeedbackForm.vue'
import { QuestionMarkCircleIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { FeedbackType } from '../api/feedback'
import { useThemeStore } from '../stores/theme';
import StepIndicator from './payment/StepIndicator.vue'
import TermsModal from './TermsModal.vue'
import { useTermsStore } from '../stores/terms'
import LightningAddressModal from './LightningAddressModal.vue'
import ValrCurrencyModal from './ValrCurrencyModal.vue'
import WalletButton from './wallet_select/WalletButton.vue'

export default {
  name: 'WalletSelect',
  components: {
    FeedbackForm,
    StepIndicator,
    QuestionMarkCircleIcon,
    TermsModal,
    LightningAddressModal,
    ValrCurrencyModal,
    WalletButton,
  },
  props: {
    requireTermsAccepted: {
      type: Boolean,
      default: false
    },
    requireRefunds: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const terms = useTermsStore()
    return { terms }
  },
  computed: {
    ...mapStores(usePaymentStore),
    lunoDisabled() {
      return !this.paymentsStore.enabledWallets.includes('luno')
    },
    binanceDisabled() {
      return !this.paymentsStore.enabledWallets.includes('binance')
    },
    valrDisabled() {
      return !this.paymentsStore.enabledWallets.includes('valr')
    },
    lightningDisabled() {
      return !this.paymentsStore.enabledWallets.includes('lightning')
    }
  },
  methods: {
    checkTermsAccepted() {
      if (!this.requireTermsAccepted) {
        return true
      }
      return this.terms.accepted
    },
    setWallet(wallet: Wallet) {
      this.$mixpanel.startSessionRecording()
      if (!this.checkTermsAccepted()) {
        this.highlightTerms(() => this.setWallet(wallet))
        return
      }
      this.paymentsStore.setWallet(wallet)
      this.trackAnalytics(AnalyticsEvent.WalletSelected)
    },
    chooseValr() {
      this.$mixpanel.startSessionRecording()
      if (!this.checkTermsAccepted()) {
        this.highlightTerms(this.chooseValr)
        return
      }
      this.valrSelected = true
    },
    setValr(currency: string) {
      this.paymentsStore.setPaymentCurrency(currency)
      this.paymentsStore.setWallet(Wallet.wallets['valr'])
      this.trackAnalytics(AnalyticsEvent.ValrCurrencySelected)
    },
    highlightTerms(callback: () => void) {
      this.trackAnalytics(AnalyticsEvent.WalletSelectedBeforeTerms)
      this.terms.openModal(callback)
    },
    chooseLightning() {
      this.$mixpanel.startSessionRecording()
      if (!this.checkTermsAccepted()) {
        this.highlightTerms(this.chooseLightning)
        return
      }
      if (!this.requireRefunds) {
        this.paymentsStore.setWallet(Wallet.wallets['lightning'])
        return
      }
      this.lightningAddressEntry = true
    },
    onLightningAddressSubmit() {
      this.paymentsStore.setWallet(Wallet.wallets['lightning'])
      this.trackAnalytics(AnalyticsEvent.LightningSetRecipient)
    },
    skipLightningAddressEntry() {
      this.paymentsStore.setWallet(Wallet.wallets['lightning'])
      this.trackAnalytics(AnalyticsEvent.LightningSetRecipientSkipped, {
        Wallet: this.paymentsStore.wallet.name
      })
    },
    trackAnalytics(event: AnalyticsEvent, additionalProps?: Record<string, any>) {
      this.$mixpanel.trackEvent(event, {
        ...defaultAnalyticproperties({
          wallet: this.paymentsStore.wallet.name,
          amount: this.paymentsStore.invoice.amount_cents,
          merchant: this.paymentsStore.invoice.merchant_name,
          currency: this.paymentsStore.invoice.currency
        }),
        ...additionalProps
      })
    },
  },
  data() {
    return {
      ozow: useThemeStore().current === 'ozow',
      lightningAddressEntry: false,
      valrSelected: false,
      Wallet: Wallet,
      FeedbackType: FeedbackType
    }
  }
}
</script>
<template>
  <div>
    <div>
      <div
        id="terms-container"
        class="my-2 w-[300px] flex flex-row text-left"
        v-if="requireTermsAccepted"
        @click="terms.toggle"
      >
        <label class="custom-checkbox">
          <input
            type="checkbox"
            id="terms-checkbox"
            :checked="terms.accepted"
            @click="terms.toggle"
          />
          <span class="checkmark"></span>
        </label>
        <div>
          I acknowledge and accept <br />
          <a @click.stop="terms.openModal(()=>{})" class="text-btn text-left ml-1">
            <strong>the terms of use.</strong>
          </a>
        </div>
      </div>
      <div id="wallet-select-header" class="flex items-right">
        <h1>Select Wallet</h1>
        <StepIndicator v-if="ozow" :currentStep="2" id="step-indicator"/>
      </div>
      <div>
        <ul class="available-wallets">
          <li>
            <WalletButton 
              walletClass="lightning" 
              :disabled="lightningDisabled" 
              @click="chooseLightning"
            />
          </li>
          <li>
            <WalletButton 
              walletClass="valr" 
              :disabled="valrDisabled" 
              @click="chooseValr"
            />
          </li>
          <li>
            <WalletButton 
              walletClass="binance" 
              :disabled="binanceDisabled" 
              subtext="(coming soon)"
              @click="()=>setWallet(Wallet.wallets['binance'])"
            />
          </li>
          <li>
            <WalletButton 
              walletClass="luno" 
              :disabled="lunoDisabled" 
              @click="()=>setWallet(Wallet.wallets['luno'])"
            />
          </li>
          <li class="flex justify-center my-4">
            <FeedbackForm
              :feedbackType="FeedbackType.WALLET_NOT_SUPPORTED"
              walletPrompt="Which wallet would you like to use?"
            >
              <template #trigger>
                <button
                  class="text no-underline font-medium hover:underline flex items-center gap-1"
                >
                  My wallet is not listed
                  <QuestionMarkCircleIcon class="w-5 h-5" />
                </button>
              </template>
            </FeedbackForm>
          </li>
        </ul>
      </div>
    </div>
    <TermsModal />
    <LightningAddressModal
      :open="lightningAddressEntry"
      @submit="onLightningAddressSubmit"
      @skip="skipLightningAddressEntry"
      @cancel="lightningAddressEntry = false"
    />
    <ValrCurrencyModal
      :open="valrSelected"
      @select="setValr"
      @cancel="valrSelected = false"
    />
  </div>
</template>

<style scoped>
.modal-bg {
  background-color: var(--secondary-bg);
}
details {
  width: 300px;
  color: #ccc;
  margin-top: 20px;
  text-align: left;
}

.available-wallets {
  min-height: 30vh;
}

li {
  position: relative;
}

button:disabled {
  display: none;
  &:hover {
    transform: none;
  }
  &:hover {
    border: none;
  }
}

.overlay {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  text-align: center;
  pointer-events: none; /* Allows clicks to pass through the overlay */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.custom-checkbox {
  position: relative;
  top: 3px;
  padding-left: 15px;
  cursor: pointer;
  user-select: none;
  margin-right: 8px;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: transparent;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.custom-checkbox:hover input ~ .checkmark {
  border-color: var(--primary-accent);
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: var(--primary-accent);
  border-color: var(--primary-accent);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
