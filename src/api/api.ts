import axios from 'axios'
import type { AxiosInstance } from 'axios'

const host = import.meta.env.VITE_HOST
const basePath = import.meta.env.VITE_BASE_PATH
const apiKey = import.meta.env.VITE_API_KEY

export class Api {
  static _baseUrl = `${host}${basePath}`
  static _instance: AxiosInstance = axios.create({
    baseURL: this._baseUrl,
    timeout: 1000,
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    }
  })

  public static async invoices(invoiceId: String) {
    return this._instance.get(`${this._baseUrl}/invoices/${invoiceId}`)
  }

  public static async invoice() {
    return this._instance.post(`${this._baseUrl}/invoice`)
  }
}
