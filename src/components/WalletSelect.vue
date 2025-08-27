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

export default {
  name: 'WalletSelect',
  components: {
    FeedbackForm,
    StepIndicator,
    QuestionMarkCircleIcon,
    ChevronRightIcon,
    TermsModal,
    LightningAddressModal,
    ValrCurrencyModal
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
        class="my-5 w-[300px] flex flex-row text-left"
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
          <a @click.stop="terms.openModal(()=>{})" class="terms-link ml-1">
            <strong>the terms of use.</strong>
          </a>
        </div>
      </div>
      <div id="wallet-select-header" class="flex items-right mb-6">
        <h1>Select Wallet</h1>
        <StepIndicator v-if="ozow" :currentStep="2" id="step-indicator"/>
      </div>
      <div>
        <ul class="available-wallets">
          <li>
            <button
              class="choose-wallet-btn lightning my-3 py-2 rounded w-[300px]"
              @click="chooseLightning()"
              :disabled="lightningDisabled"
            >
              <img src="@/assets/wallets/lightning.png" class="object-contain w-full h-full" />
            </button>
            <div v-if="lightningDisabled" class="overlay">Not available</div>
          </li>
          <li>
            <button
              class="choose-wallet-btn valr my-3 py-3 rounded w-[300px]"
              @click="chooseValr()"
              :disabled="valrDisabled"
            >
              <img src="@/assets/wallets/valr.png" class="object-contain w-full h-full" />
            </button>
            <div v-if="valrDisabled" class="overlay">Not available</div>
          </li>
          <li>
            <button
              class="choose-wallet-btn binance my-3 py-4 px-10 rounded w-[300px]"
              @click="setWallet(Wallet.wallets['binance'])"
              :disabled="binanceDisabled"
            >
              <img src="@/assets/wallets/binance-promo.png" class="object-contain w-full" />
            </button>
            <div v-if="binanceDisabled" class="overlay">Not available</div>
          </li>
          <li>
            <button
              class="choose-wallet-btn luno my-3 py-2 rounded w-[300px]"
              @click="setWallet(Wallet.wallets['luno'])"
              :disabled="lunoDisabled"
            >
              <img src="@/assets/wallets/luno.png" class="object-contain w-full h-full" />
            </button>
            <div v-if="lunoDisabled" class="overlay">Not available</div>
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
.choose-wallet-btn {
  height: 70px;
  font-weight: bold;
  color: var(--color-black);
  text-align: center;
  &:hover {
    transform: translateX(10px);
  }
}
.choose-currency-btn {
  background-color: var(--primary-bg);
  font-weight: bold;
  
  text-align: center;
  &:hover {
    color: var(--primary-accent);
    transform: translateX(2px);
  }
  border: 1px solid var(--color-light-grey);
}

.available-wallets {
  min-height: 30vh;
}
.luno {
  background-color: #051478;
  &:hover {
    border: 2px solid #1127b4;
  }
}
.valr {
  background-color: #1123dc;
  &:hover {
    border: 2px solid #3645f1;
  }
}

.binance {
  background-color: #eeb80d;
  &:hover {
    border: 2px solid #fadc7a;
  }
}

.lightning {
  background-color: #4a4a4a;
  &:hover {
    border: 2px solid #6b6b6b;
  }
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

.terms-btn {
  width: 300px;
  color: #ccc;
  margin-top: 20px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.cancel-btn {
  background-color: var(--color-black);
  text-decoration: underline;
  color: var(--color-light-grey);
  &:hover {
    color: var(--color-amber-light);
  }
}

.skip-btn {
  background-color: var(--color-black);
  color: var(--color-amber-light);
  border: 1px solid var(--color-amber-light);
  font-weight: bold;
  padding: 0.5rem 2rem;
  &:hover {
    color: var(--color-amber-med);
    border: 1px solid var(--color-amber-med);
  }
}

.confirm-btn {
  display: block;
  background-color: var(--color-amber-med);
  font-weight: bold;
  color: var(--color-black);
  padding: 0.5rem 1rem;
  text-decoration: none;
  text-align: center;
  border-radius: 0.5rem;
  &:hover {
    background-color: var(--color-amber-light);
    color: var(--color-black);
  }
}

.terms-modal {
  text-align: left;
}

.terms-link {
  cursor: pointer;
  text-decoration: underline;
  color: var(--primary-accent);
  &:hover {
    color: var(--primary-accent-hover);
  }
}

#terms-container.highlight {
  border: 1px solid var(--primary-accent-hover);
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8px);
  }
  40% {
    transform: translateX(8px);
  }
  60% {
    transform: translateX(-6px);
  }
  80% {
    transform: translateX(6px);
  }
  100% {
    transform: translateX(0);
  }
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
