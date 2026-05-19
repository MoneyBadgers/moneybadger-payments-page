import { defineStore } from 'pinia'

export const useDevModeStore = defineStore('devMode', {
  state: () => ({
    enabled: false,
    clickCount: 0,
  }),
  actions: {
    logoClick() {
      this.clickCount++
      if (this.clickCount >= 10) {
        this.enabled = true
      }
    }
  }
})
