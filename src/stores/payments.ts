import { defineStore } from 'pinia'
import Api from '../api/api-cryptoqr'
import { InvoiceStatusEnum, type Invoice } from '../api/cryptoqr/api'
import Wallet from '../models/wallet'
import InvoiceParameters from '../models/invoice_parameters'
import type { LocationQuery } from "vue-router"
import { PaymentStatus } from '../types/PaymentStatus'

export const usePaymentStore = defineStore('payments', {
  state: () => ({
    wallet: Wallet.defaultWallet,
    invoiceParams: {} as InvoiceParameters,
    invoice: {} as Invoice,
    errors: [] as string[],
    status: PaymentStatus.Loading,
  }),
  getters: {
    paidAt: (state): string => state.invoice.paid_at || '',
    amountPaidCents: (state): number =>
    {
      if (state.invoice.status === InvoiceStatusEnum.CONFIRMED) {
        return state.invoice.amount_cents || 0
      }
      return 0
    },
    referenceId: (state): string => state.invoice.id || '',
    lnPaymentRequest: (state): string => state.invoice.payment_request?.data || '',
    api: (state): Api =>  new Api()
  },
  actions: {
    initialiseFromQueryParams(queryParams: LocationQuery) {
      this.invoiceParams = InvoiceParameters.createFromQueryParams(queryParams)
      if (this.invoiceParams.errors.length > 0) {
        this.errors = this.invoiceParams.errors
        this.status = PaymentStatus.Error
      }
    },
    async setWallet(wallet: Wallet) {
      this.wallet = wallet
      this.status = PaymentStatus.Loading
      if(this.invoice.id) {
        const resp = await this.api.updateInvoicePaymentMethod(this.invoice.id, wallet.valueStore)
        this.invoice = resp.data
        this.status = PaymentStatus.WaitForPayment
        this.pollStatus()
      }else{
         this.createInvoice()
      }
    },
    async changeWallet() {
      this.status = PaymentStatus.SelectWallet
    },
    async refreshInvoice() {
      if (!this.invoice.id) {
        return
      }
      try {
        this.invoice = (await this.api.fetchInvoiceStatus(this.invoice.id)).data
        this.errors = []
        if (this.invoice.status === InvoiceStatusEnum.CONFIRMED) {
          this.status = PaymentStatus.Successful
        }
      } catch (error: any) {
        this.errors = ['Network Error']
      }
    },
    async pollStatus() {
        setTimeout(async () => {
          await this.refreshInvoice()
          if (this.status === PaymentStatus.WaitForPayment) {
            this.pollStatus()
          }
        }, 500)
    },
    async checkForExistingInvoice() {
      try {
        const invoiceResponse = await this.api.fetchInvoiceStatus(this.invoiceParams.orderId)
        this.invoice = invoiceResponse.data
        if(this.invoice.status === InvoiceStatusEnum.CONFIRMED){
          this.status = PaymentStatus.Successful
          return
        }
        this.wallet = Wallet.wallets[this.invoice.payment_request?.value_store || ''] || Wallet.defaultWallet
        this.status = PaymentStatus.WaitForPayment
        this.pollStatus()
      } catch (error: any) {
          if(error.status === 404){
            this.status = PaymentStatus.SelectWallet
            return
          }
          this.errors = [error.response.data.message]
          this.status = PaymentStatus.Error
      }
    },
    async createInvoice() {
      try {
        const newInvoiceResponse = await this.api.requestInvoice(
          this.invoiceParams.amountCents,
          'ZAR',
          this.invoiceParams.orderDescription,
          this.invoiceParams.orderId,
          this.invoiceParams.statusWebhookUrl,
          this.invoiceParams.timeoutInSeconds,
          this.wallet.valueStore
        )
        this.invoice = newInvoiceResponse.data
        this.status = PaymentStatus.WaitForPayment
        this.pollStatus()
      }
      catch (err: any) {
        this.errors = [`An error occurred while creating the invoice - ${err.error.message}`]
        this.status = PaymentStatus.Error
      }
    }
  }
})


