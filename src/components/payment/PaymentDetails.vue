<template>
  <div class="box rounded-lg w-80 px-6 mb-4 text-center">
    <!-- Logo and Brand -->
    <div class="flex justify-center my-4">
      <div :class="`wallet-logo ${logo}`" class="h-12 w-3/4 bg-no-repeat bg-center"></div>
    </div>

    <!-- Payment Message -->
    <p class="text-sm mb-1">You will be making a payment of</p>
    <p class="text-3xl font-semibold">{{ formattedAmount }}</p>
  </div>
</template>

<script>
export default {
  name: 'PaymentCard',
  props: {
    logo: {
      type: String,
      required: true
    },
    amountCents: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedAmount() {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2
      }).format(this.amountCents / 100.0)
    }
  }
}
</script>
