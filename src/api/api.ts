import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { Currency } from '@/types/Currency'

const host = import.meta.env.VITE_HOST
const basePath = import.meta.env.VITE_BASE_PATH
const apiKey = import.meta.env.VITE_API_KEY
const MAX_TIMEOUT = 30000

export default class Api {
  static _baseUrl = `${host}${basePath}`
  static _instance: AxiosInstance = axios.create({
    baseURL: this._baseUrl,
    timeout: MAX_TIMEOUT,
    httpsAgent: true,
    headers: {
      'x-merchant-code': apiKey,
      'Content-Type': 'application/json'
    }
  })

  public static async fetchInvoiceStatus(invoiceId: String) {
    return this._instance.get(`${this._baseUrl}/invoices/${invoiceId}`)
  }

  public static async invoice(
    amountCents: number,
    currency: Currency = 'ZAR',
    orderDescription: String,
    orderId: String,
    timeoutInSeconds: number = 120
  ) {
    return this._instance.post(`${this._baseUrl}/invoice/`, {
      amount_cents: amountCents,
      currency: currency,
      order_description: orderDescription,
      order_id: orderId,
      allowed_payment_methods: ["lightning"],
      device_id: "web",
      scan_id: "web",
    })
  }
}
