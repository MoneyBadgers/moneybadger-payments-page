<script lang="ts">
import Wallet from '../models/wallet'
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'
import LightningAddress from '../models/lightning_address'
import { AnalyticsEvent } from '../types/analytics_events'
import { defaultAnalyticproperties } from '../types/analytics_default_properties'
import FeedbackForm from './FeedbackForm.vue'
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/solid'
import { FeedbackType } from '../api/feedback'
import { useThemeStore } from '../stores/theme';
import StepIndicator from './payment/StepIndicator.vue'
import TermsModal from './TermsModal.vue'
import { useTermsStore } from '../stores/terms'

export default {
  name: 'WalletSelect',
  components: {
    FeedbackForm,
    StepIndicator,
    QuestionMarkCircleIcon,
    TermsModal
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
    setLightningAddressAndWallet() {
      this.lightningAddressError = false
      this.verifyingLightningAddress = true
      const address = new LightningAddress(this.lightningAddress)
      address
        .valid()
        .then((valid) => {
          if (valid) {
            localStorage.setItem('RefundRecipientAddress', this.lightningAddress)
            this.paymentsStore.setRefundRecipientAddress(this.lightningAddress)
            this.paymentsStore.setWallet(Wallet.wallets['lightning'])
            this.cancelLightningAddressEntry()

            this.trackAnalytics(AnalyticsEvent.LightningSetRecipient)

            return
          } else {
            this.lightningAddressError = true
            this.verifyingLightningAddress = false
            return
          }
        })
        .catch(() => {
          this.lightningAddressError = true
          this.verifyingLightningAddress = false
          return
        })
    },
    skipLightningAddressEntry() {
      this.paymentsStore.setWallet(Wallet.wallets['lightning'])
      this.trackAnalytics(AnalyticsEvent.LightningSetRecipientSkipped, {
        Wallet: this.paymentsStore.wallet.name
      })
      this.cancelLightningAddressEntry()
    },
    cancelLightningAddressEntry() {
      this.lightningAddressEntry = false
      this.lightningAddressError = false
      this.verifyingLightningAddress = false
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
    walletFeedbackSubmitted() {
      setTimeout(() => {
        this.wallletFeedback = false
      }, 1000)
      console.log('Wallet feedback submitted')
    }
  },
  data() {
    return {
      ozow: useThemeStore().current === 'ozow',
      lightningAddressEntry: false,
      verifyingLightningAddress: false,
      lightningAddressError: false,
      lightningAddress: localStorage.getItem('RefundRecipientAddress') || '',
      valrSelected: false,
      Wallet: Wallet,
      // These are all the VALR currencies that have ZAR markets. Sorted alphabetically but with BTC first and ZAR added
      // curl -s https://api.valr.com/v1/public/pairs | jq -r '.[] | select(.quoteCurrency == "ZAR" and .currencyPairType == "SPOT") | .baseCurrency' | sort
      valrCurrencies: [
        'BTC',
        'AVAX',
        'BNB',
        'ETH',
        'EURC',
        'PYUSD',
        'SHIB',
        'SOL',
        'USDC',
        'USDT',
        'XRP',
        'ZAR'
      ],
      wallletFeedback: false,
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
    <transition name="fade">
      <div v-if="valrSelected" class="fixed inset-0 modal-bg flex items-center justify-center">
        <div class="w-1/2 h-[100%] overflow-y-auto p-6 rounded-lg shadow-lg justify-center">
          <img src="@/assets/wallets/valr.png" class="w-40 mx-auto" />
          <p class="font-semibold mb-4">Please choose the currency you want to pay with:</p>
          <div class="grid grid-cols-1 gap-3">
            <button
              v-for="currency in valrCurrencies"
              :key="currency"
              class="mx-auto px-4 py-1 w-[10rem] rounded choose-currency-btn"
              @click="setValr(currency)"
            >
              {{ currency }}
            </button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="lightningAddressEntry"
        class="fixed inset-0 modal-bg flex items-center justify-center"
      >
        <div class="w-200 h-[100%] overflow-y-auto p-6 rounded-lg shadow-lg justify-center">
          <img src="@/assets/wallets/lightning.png" class="w-40 mx-auto mb-4" />
          <p class="font-semibold mb-4 text-center">
            To process a refund later (if needed), we require your
            <strong>Lightning Address</strong>.
          </p>
          <div
            v-if="verifyingLightningAddress"
            class="text-center mb-4 info flex items-center justify-center"
          >
            <div class="spinner mr-4" role="status" aria-label="Loading"></div>
            <p class="m-0">Verifying your Lightning Address...</p>
          </div>
          <div v-if="lightningAddressError" class="text-center mb-4 error">
            <p>That doesn't seem to be a valid Lightning Address.</p>
          </div>
          <input
            v-model="lightningAddress"
            type="email"
            placeholder="e.g. satoshi@wallet.co"
            class="w-full border border-gray-300 rounded p-2 mb-4 text-black"
          />
          <div class="flex justify-between items-center">
            <button class="secondary-outline mr-2" @click="cancelLightningAddressEntry">Cancel</button>
            <div class="flex">
              <button class="secondary-outline mr-2 rounded" @click="skipLightningAddressEntry">Skip</button>
              <button class="primary rounded" @click="setLightningAddressAndWallet">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <TermsModal />
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
