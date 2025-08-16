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
          <QrCodeIcon class="w-4 h-4 text-orange-400" />
          Use QR code
        </button>
        <button
          v-else
          class="w-full flex items-center gap-2 px-4 py-2 bg-[#3a3a3c] text-sm rounded mb-2"
          @click="$emit('use-deeplink')"
        >
          <ArrowRightIcon class="w-4 h-4 text-orange-400" />
          Open in wallet app
        </button>

        <button
          class="w-full flex items-center gap-2 px-4 py-2 bg-[#3a3a3c] text-sm rounded"
        >
          <LinkIcon class="w-4 h-4 text-orange-400" />
          Copy payment link
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ChevronUpIcon, QrCodeIcon, LinkIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'MorePaymentOptions',
  components: {
    ChevronUpIcon,
    QrCodeIcon,
    LinkIcon,
    ArrowRightIcon
  },
  props: {
    showingDeeplinkButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: false,
    }
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded
    },
  },
}
</script>