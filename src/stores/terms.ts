import { defineStore } from 'pinia'

export const useTermsStore = defineStore('terms', {
  state: () => ({
    accepted: localStorage.getItem('termsAccepted') === 'true',
    modalOpen: false,
    callback: () => {}
  }),
  actions: {
    openModal(callback?: () => void) {
      this.modalOpen = true
      if (callback) this.callback = callback
    },
    closeModal(invokeCallback = false) {
      if (invokeCallback && this.callback) {
        this.callback()
        this.callback = () => {}
      }
      this.modalOpen = false
    },
    accept() {
      this.accepted = true
      localStorage.setItem('termsAccepted', 'true')
      this.closeModal(true)
    },
    toggle() {
      console.log('toggling terms')
      this.accepted = !this.accepted
      localStorage.setItem('termsAccepted', this.accepted ? 'true' : 'false')
    }
  }
})