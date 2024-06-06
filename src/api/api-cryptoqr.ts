import { InvoiceApi, type ApiConfig } from './cryptoqr/api'
import type { Currency } from '../types/Currency'
import { usePaymentStore } from '../stores/payments';

const host = import.meta.env.VITE_HOST
const basePath = '/api/v2'

export default class Api {

  private fetchWithMerchantCode = async (url: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
    init = init || {}
    init.headers = {
      ...init.headers,
      'x-merchant-code': usePaymentStore().merchantCode,
    };
    return fetch(url, init)
  }

  private config: ApiConfig = {
    baseUrl: `${host}${basePath}`,
    customFetch: this.fetchWithMerchantCode
  }
  private _invoiceApi = new InvoiceApi(this.config)

  fetchInvoiceStatus(invoiceId: string){
    return this._invoiceApi.invoices.getInvoice(invoiceId)
  }

  requestInvoice(
    amountCents: number,
    currency: Currency = 'ZAR',
    orderDescription: string | undefined,
    orderId: string,
    statusWebhookUrl: string | undefined,
    timeoutInSeconds: number
  ) {
   return this._invoiceApi.invoice.requestInvoice({
      amount_cents: amountCents,
      currency,
      order_description: orderDescription,
      order_id: orderId,
      allowed_payment_methods: ['lightning'],
      status_webhook_url: statusWebhookUrl,
      timeout_in_seconds: timeoutInSeconds
    })
  }
}
