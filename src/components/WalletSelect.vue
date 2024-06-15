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
                <li v-for="wallet in Wallet.wallets">
                   <button @click="setWallet(wallet)">{{ wallet.name }}</button>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<style scoped>
</style>
