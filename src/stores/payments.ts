import { defineStore } from 'pinia'
import Api from '../api/api-cryptoqr'
import { InvoiceStatusEnum, type Invoice } from '../api/cryptoqr/api'
import Wallet from '../models/wallet'
import InvoiceParameters from '../models/invoice_parameters'
import type { LocationQuery } from 'vue-router'
import { PaymentStatus } from '../types/PaymentStatus'

export const usePaymentStore = defineStore('payments', {
  state: () => ({
    wallet: Wallet.defaultWallet,
    paymentCurrencies: [] as string[],
    invoiceParams: {} as InvoiceParameters,
    invoice: {} as Invoice,
    errors: [] as string[],
    status: PaymentStatus.Loading,
    refundRecipientAddress: localStorage.getItem('RefundRecipientAddress') || '',
    enabledWallets: ['lightning', 'valr', 'binance', 'luno'] as string[]
  }),
  getters: {
    paidAt: (state): string => state.invoice.paid_at || '',
    amountPaidCents: (state): number => {
      if (state.invoice.status === InvoiceStatusEnum.CONFIRMED) {
        return state.invoice.amount_cents || 0
      }
      return 0
    },
    referenceId: (state): string => state.invoice.id || '',
    lnPaymentRequest: (state): string => state.invoice.payment_request?.data || '',
    api: (state): Api => new Api(),
    getPaymentCurrency: (state) => state.paymentCurrencies[0],
    requireTermsAccepted: (state): boolean => state.invoiceParams.requireTermsAccepted,
    requireRefunds: (state): boolean => state.invoiceParams.requireRefunds,
    paymentRequest(state) {
      return state.invoice?.payment_request
    },
    paymentRequestData(state) {
      return state.invoice?.payment_request?.data || ''
    },
    paymentRequestQrUrl(state) {
      if (state.wallet.valueStore !== 'luno' && state.wallet.valueStore !== 'binance') {
        return null
      }
      return state.invoice?.payment_request?.qr_code_url || null
    },
    paymentRequestQrData(state) {
      const pr = state.invoice?.payment_request
      if (pr?.qr_code_content) {
        return pr.qr_code_content
      }

      if (state.wallet.valueStore === 'valr' && (this as any).getPaymentCurrency) {
        const key = `valr|${(this as any).getPaymentCurrency}`
        const pm = pr?.payment_methods
        if (pm && pm[key]) {
          return state.wallet.generateCopyableRequest(String(pm[key]))
        }
      }

      return state.wallet.generateCopyableRequest((this as any).paymentRequestData)
    },
    cancelable(state): boolean {
      if (!state.invoice.id) {
        return true
      }
      return state.invoice.status === InvoiceStatusEnum.REQUESTED
    }
  },
  actions: {
    initialiseFromQueryParams(queryParams: LocationQuery) {
      this.invoiceParams = InvoiceParameters.createFromQueryParams(queryParams)
      if (this.invoiceParams.errors.length > 0) {
        this.errors = this.invoiceParams.errors
        this.status = PaymentStatus.Error
      }
      if (this.invoiceParams.merchantCode === 'sos') {
        this.enabledWallets = ['valr']
      }
    },
    setRefundRecipientAddress(address: string) {
      localStorage.setItem('RefundRecipientAddress', address)
      this.refundRecipientAddress = address
    },
    async setWallet(wallet: Wallet) {
      this.wallet = wallet
      this.status = PaymentStatus.Loading
      if (this.invoice.id) {
        const resp = await (this as any).api.updateInvoicePaymentMethod(
          this.invoice.id,
          wallet.valueStore,
          this.paymentCurrencies,
          this.refundRecipientAddress
        )
        this.invoice = resp.data
        this.status = PaymentStatus.WaitForPayment
        this.pollStatus()
      } else {
        this.createInvoice()
      }
    },
    async setPaymentCurrency(currency: string) {
      this.paymentCurrencies = [currency]
    },
    async changeWallet() {
      this.status = PaymentStatus.SelectWallet
    },
    async userCancelInvoice() {
      if (!this.invoice.id) {
        return
      }
      try {
        await (this as any).api.userCancelInvoice(this.invoice.id)
      } catch (error: any) {
        console.error('Error cancelling invoice:', error)
      }
      this.refreshInvoice()
    },
    async refreshInvoice(wait?: number) {
      if (!this.invoice.id) {
        return
      }
      try {
        this.invoice = (await (this as any).api.fetchInvoiceStatus(this.invoice.id, wait)).data
        this.errors = []
        if (this.invoice.status === InvoiceStatusEnum.CONFIRMED) {
          this.status = PaymentStatus.Successful
        }
        if (this.invoice.status === InvoiceStatusEnum.CANCELLED) {
          this.status = PaymentStatus.Cancelled
        }
      } catch (error: any) {
        this.errors = ['Network Error']
      }
    },
    async pollStatus() {
      await this.refreshInvoice(10)
      if (this.status === PaymentStatus.Successful) {
        // payment has been confirmed, no need to poll anymore
        return
      } else {
        // invoice is in some other state, so wait before polling again
        setTimeout(async () => {
          this.pollStatus()
        }, 500)
      }
    },
    async checkForExistingInvoice() {
      try {
        const invoiceResponse = await (this as any).api.fetchInvoiceStatus(
          this.invoiceParams.orderId
        )
        this.invoice = invoiceResponse.data
        if (this.invoice.status === InvoiceStatusEnum.CONFIRMED) {
          this.status = PaymentStatus.Successful
          return
        }
        if (this.invoiceParams.reset) {
          // allow URL parameter to force a wallet selection (e.g. if invoice was pre-created)
          this.status = PaymentStatus.SelectWallet
          return
        }
        if (this.invoice.payment_request == null) {
          this.status = PaymentStatus.SelectWallet
          return
        }
        this.wallet =
          Wallet.wallets[this.invoice.payment_request?.value_store || ''] || Wallet.defaultWallet
        this.status = PaymentStatus.WaitForPayment
        this.pollStatus()
      } catch (error: any) {
        if (error.status === 404) {
          this.status = PaymentStatus.SelectWallet
          return
        }
        this.errors = [error.response.data.message]
        this.status = PaymentStatus.Error
      }
    },
    async createInvoice() {
      try {
        const newInvoiceResponse = await (this as any).api.requestInvoice(
          this.invoiceParams.amountCents,
          'ZAR',
          this.invoiceParams.orderDescription,
          this.invoiceParams.orderId,
          this.invoiceParams.statusWebhookUrl,
          this.invoiceParams.timeoutInSeconds,
          this.wallet.valueStore,
          this.paymentCurrencies,
          this.refundRecipientAddress
        )
        this.invoice = newInvoiceResponse.data
        this.status = PaymentStatus.WaitForPayment
        this.pollStatus()
      } catch (err: any) {
        this.errors = [`An error occurred while creating the invoice - ${err.error.message}`]
        this.status = PaymentStatus.Error
      }
    }
  }
})
