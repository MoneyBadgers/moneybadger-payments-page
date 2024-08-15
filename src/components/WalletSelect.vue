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
  },
  data() {
    return {
        Wallet: Wallet
    }
  }
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
                   <button class="choose-wallet-btn valr my-3 py-3 rounded w-[300px]" @click="setWallet(Wallet.wallets['valr'])" :disabled="valrDisabled">
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
  </div>
</template>

<style scoped>
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
</style>
