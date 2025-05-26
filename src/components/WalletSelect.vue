<script lang="ts">
import Wallet from "../models/wallet"
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'

export default {
  name: 'WalletSelect',
  components: {
  },
  props: {
    requireTermsAccepted: {
      type: Boolean,
      default: false,
    },
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
    },
  },
  methods: {
    checkTermsAccepted() {
      if (!this.requireTermsAccepted) {
        return true
      }
      return this.termsAccepted
    },
    setWallet(wallet: Wallet) {
      if (!this.checkTermsAccepted()) {
        this.highlightTerms()
        return
      }
      this.paymentsStore.setWallet(wallet)
    },
    chooseValr() {
      if (!this.checkTermsAccepted()) {
        this.highlightTerms()
        return
      }
      this.valrSelected = true
    },
    setValr(currency: string) {
      this.paymentsStore.setPaymentCurrency(currency)
      this.paymentsStore.setWallet(Wallet.wallets['valr'])
    },
    openTermsModal() {
      this.termsModalOpen = true
    },
    closeTermsModal() {
      this.termsModalOpen = false
    },
    acceptTerms() {
      this.termsAccepted = true
      localStorage.setItem('termsAccepted', 'true')
      this.closeTermsModal()
    },
    toggleTerms() {
      this.termsAccepted = !this.termsAccepted
      localStorage.setItem('termsAccepted', 'true')
    },
    highlightTerms() {
      // wobble the terms container
      const termsContainer = document.getElementById('terms-container')
      termsContainer?.classList.add('highlight')
      setTimeout(() => {
        termsContainer?.classList.remove('highlight')
      }, 500)
    },
  },
  data() {
    return {
        valrSelected: false,
        termsModalOpen: false,
        Wallet: Wallet,
        // These are all the VALR currencies that have ZAR markets. Sorted alphabetically but with BTC first and ZAR added
        // curl -s https://api.valr.com/v1/public/pairs | jq -r '.[] | select(.quoteCurrency == "ZAR" and .currencyPairType == "SPOT") | .baseCurrency' | sort
        valrCurrencies: ["BTC","AVAX", "BNB", "ETH", "EURC", "PYUSD", "SHIB", "SOL", "USDC", "USDT", "XRP", "ZAR"],
        termsAccepted: localStorage.getItem('termsAccepted') === 'true',
    }
  },
}
</script>

<template>
  <div>
    <div>
      <div id="terms-container" class="flex justify-center my-5" v-if="requireTermsAccepted" @click="toggleTerms">
          <label class="custom-checkbox">
            <input type="checkbox" id="terms-checkbox" :checked="termsAccepted" @click="toggleTerms">
            <span class="checkmark"></span>
          </label>
          I acknowledge and accept the
          <a @click="openTermsModal" class="terms-link ml-1"><strong>terms of use.</strong>
          </a>
        </div>
        <p>Choose the wallet you want to pay with</p>
        <div>
            <ul class="available-wallets">
                <li>
                   <button class="choose-wallet-btn lightning my-3 py-2 rounded w-[300px]" @click="setWallet(Wallet.wallets['lightning'])" :disabled="lightningDisabled">
                      <img src="@/assets/wallets/lightning.png" class="object-contain w-full h-full"></img>
                   </button>
                   <div v-if="lightningDisabled" class="overlay">Not available</div>
                </li>
                <li>
                   <button class="choose-wallet-btn valr my-3 py-3 rounded w-[300px]" @click="chooseValr()" :disabled="valrDisabled">
                      <img src="@/assets/wallets/valr.png" class="object-contain w-full h-full"></img>
                   </button>
                   <div v-if="valrDisabled" class="overlay">Not available</div>
                </li>
                <li>
                   <button class="choose-wallet-btn binance my-3 py-3 px-4 rounded w-[300px]" @click="setWallet(Wallet.wallets['binance'])" :disabled="binanceDisabled">
                      <img src="@/assets/wallets/binance.png" class="object-contain w-full h-full"></img>
                   </button>
                   <div v-if="binanceDisabled" class="overlay">Not available</div>
                </li>
                <li>
                   <button class="choose-wallet-btn luno my-3 py-2 rounded w-[300px]" @click="setWallet(Wallet.wallets['luno'])" :disabled="lunoDisabled">
                      <img src="@/assets/wallets/luno.png" class="object-contain w-full h-full"></img>
                   </button>
                   <div v-if="lunoDisabled" class="overlay">Not available</div>
                </li>
            </ul>
        </div>
    </div>
    <transition name="fade">
      <div v-if="valrSelected" class="fixed inset-0 modal-bg flex items-center justify-center">
        <div class="w-1/2 h-[100%] overflow-y-auto p-6 rounded-lg shadow-lg justify-center">
          <img src="@/assets/wallets/valr.png" class="w-40 mx-auto"></img>
          <p class="font-semibold mb-4">Please choose the currency you want to pay with:</p>
          <div class="grid grid-cols-1 gap-3">
            <button v-for="currency in valrCurrencies" :key="currency"
              class="mx-auto px-4 py-1 w-[10rem] rounded choose-currency-btn"
             @click="setValr(currency)">
              {{ currency }}
            </button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="termsModalOpen" class="terms-modal fixed inset-0 modal-bg flex items-center justify-center">
        <div class="w-1/2 h-[100%] overflow-y-auto p-6 rounded-lg shadow-lg">
          <h2 class="text-xl font-bold mb-4">Crypto Payment Terms</h2>
          <p class=""><strong>By selecting MoneyBadger, you acknowledge and accept:</strong></p>
          <ol class="list-decimal pl-6 mb-4">
            <li class="mb-2">
              <strong>Volatility Risks:</strong>
              <ol class="list-decimal pl-6 mb-4">
                <li>Crypto assets carry a risk due to its high volatility which may affect the value of price fluctuating from time of checkout to conclusion of payment;</li>
                <li>Past performance relating to the value of the crypto asset is not an indicator of future value;</li>
                <li>The customer understands the risks involved in using crypto assets as a payment method. They acknowledge that the value of the crypto asset converted to ZAR may vary from the time of the original transaction until the processing of a refund.
                </li>
              </ol>
            </li>
            <li class="mb-2">
              <strong>Refunds:</strong>
              <ol class="list-decimal pl-6 mb-4">
                <li>Customers may be entitled to initiate refunds which shall be approved by the Merchant in accordance with its refund terms and conditions;</li>
                <li>Approved refunds shall be processed directly to the customer at the original transaction price calculated in ZAR, subject to the necessary wallet information being provided by the customer to MoneyBadger.</li>
              </ol>
            </li>
          </ol>
          <div class="flex justify-end">
            <button class="close-modal-btn" @click="closeTermsModal">Close</button>
            <button class="accept-terms-btn close-modal-btn mr-2" @click="acceptTerms">Accept and Continue</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-bg {
  background-color: var(--color-background);
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
  background-color: var(--color-black);
  font-weight: bold;
  color: var(--color-light-grey);
  text-align: center;
  &:hover {
    color: var(--color-amber-light);
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
  &:hover{
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
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

.close-modal-btn {
  background-color: var(--color-black);
  color: var(--color-light-grey);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: bold;
  &:hover {
    color: var(--color-amber-light);
  }
}
.accept-terms-btn {
  background-color: var(--color-amber-light);
  color: var(--color-black);
  &:hover {
    background-color: var(--color-amber-light);
  }
}
.terms-modal {
  text-align: left;
}

.terms-link {
  cursor: pointer;
  text-decoration: underline;
  color: var(--color-amber-light);
  &:hover {
    color: var(--color-amber-light);
  }
}

#terms-container.highlight {
  border: 1px solid var(--color-amber-light);
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
  100% { transform: translateX(0); }
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
  border: 2px solid var(--color-light-grey);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.custom-checkbox:hover input ~ .checkmark {
  border-color: var(--color-amber-light);
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: var(--color-amber-light);
  border-color: var(--color-amber-light);
}

.checkmark:after {
  content: "";
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
