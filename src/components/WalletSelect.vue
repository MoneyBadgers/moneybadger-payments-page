<script lang="ts">
import Wallet from "../models/wallet"
import { mapStores } from 'pinia'
import { usePaymentStore } from '../stores/payments'

export default {
  name: 'WalletSelect',
  components: {
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
  },
  methods: {
    setWallet(wallet: Wallet) {
      this.paymentsStore.setWallet(wallet)
    },
    chooseValr() {
      this.valrSelected = true
    },
    setValr(currency: string) {
      this.paymentsStore.setPaymentCurrency(currency)
      this.paymentsStore.setWallet(Wallet.wallets['valr'])
    },
  },
  data() {
    return {
        valrSelected: false,
        Wallet: Wallet,
        // These are all the VALR currencies that have ZAR markets. Sorted alphabetically but with BTC first and ZAR added
        // curl -s https://api.valr.com/v1/public/pairs | jq -r '.[] | select(.quoteCurrency == "ZAR" and .currencyPairType == "SPOT") | .baseCurrency' | sort
        valrCurrencies: ["BTC","AVAX", "BNB", "ETH", "EURC", "PYUSD", "SHIB", "SOL", "USDC", "USDT", "XRP", "ZAR"],

    }
  },
}
</script>

<template>
  <div>
    <div>
        <p>Choose the wallet you want to pay with</p>
        <div>
            <ul>
                <li>
                   <button class="choose-wallet-btn lightning my-3 py-2 rounded w-[300px]" @click="setWallet(Wallet.wallets['lightning'])">
                      <img src="@/assets/wallets/lightning.png" class="object-contain w-full h-full"></img>
                   </button>
                </li>
                <li>
                   <button class="choose-wallet-btn valr my-3 py-3 rounded w-[300px]" @click="chooseValr()" :disabled="valrDisabled">
                      <img src="@/assets/wallets/valr.png" class="object-contain w-full h-full"></img>
                   </button>
                   <div v-if="valrDisabled" class="overlay">Coming Soon</div>
                </li>
                <li>
                   <button class="choose-wallet-btn binance my-3 py-3 px-4 rounded w-[300px]" @click="setWallet(Wallet.wallets['binance'])" :disabled="binanceDisabled">
                      <img src="@/assets/wallets/binance.png" class="object-contain w-full h-full"></img>
                   </button>
                   <div v-if="binanceDisabled" class="overlay">Coming Soon</div>
                </li>
                <li>
                   <button class="choose-wallet-btn luno my-3 py-2 rounded w-[300px]" @click="setWallet(Wallet.wallets['luno'])" :disabled="lunoDisabled">
                      <img src="@/assets/wallets/luno.png" class="object-contain w-full h-full"></img>
                   </button>
                   <div v-if="lunoDisabled" class="overlay">Coming Soon</div>
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
  </div>
</template>

<style scoped>
.modal-bg {
  background-color: var(--color-background);
}
.choose-wallet-btn {
  height: 70px;
  width: 300px;
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
  opacity: 0.25;
  &:hover {
    transform: none;
  }
  &:hover{
    border: none;
  }
}

.overlay {
    opacity: 1;
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
</style>
