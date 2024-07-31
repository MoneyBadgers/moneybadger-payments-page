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
  },
  methods: {
    setWallet(wallet: Wallet) {
      this.paymentsStore.setWallet(wallet)
    }
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
      <h4 class="font-bold">Select Wallet</h4>
    </div>
    <div>
        <p>Choose a wallet to pay with</p>
        <div>
            <ul>
              <li>
                   <button class="choose-wallet-btn lightning my-3 py-2 rounded w-[300px]" @click="setWallet(Wallet.wallets['lightning'])">
                      <img src="@/assets/wallets/lightning.png" class="object-contain w-full h-full"></img>
                   </button>
                </li>
                <li>
                   <button class="choose-wallet-btn luno my-3 rounded w-[300px]" @click="setWallet(Wallet.wallets['luno'])">
                      <img src="@/assets/wallets/luno.png" class="object-contain w-full h-full"></img>
                   </button>
                </li>
                <li>
                   <button class="choose-wallet-btn valr my-3 rounded w-[300px]" @click="setWallet(Wallet.wallets['valr'])">
                      <img src="@/assets/wallets/valr.png" class="object-contain w-full h-full"></img>
                   </button>
                </li>
                <li>
                   <button class="choose-wallet-btn binance my-3 rounded w-[300px]" @click="setWallet(Wallet.wallets['binance'])">
                      <img src="@/assets/wallets/binance.png" class="object-contain w-full h-full"></img>
                   </button>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<style scoped>
.choose-wallet-btn {
  height: 70px;
  width: 100%;
  font-weight: bold;
  color: var(--color-black);
  text-align: center;
  &:hover {
    transform: translateX(10px);
  }
}
.luno {
  background-color: #051478;
}
.valr {
  background-color: #1123dc;
}
.binance {
  background-color: #eeb80d;
}
.lightning {
  background-color: black;
  border: 1px solid white;
}
</style>
