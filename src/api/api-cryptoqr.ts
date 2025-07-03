import { InvoiceApi, type ApiConfig, type InvoiceUpdatePaymentMethod, type RefundRecipient } from './cryptoqr/api'
import type { Currency } from '../types/Currency'
import { usePaymentStore } from '../stores/payments';

const host = import.meta.env.VITE_HOST
const basePath = '/api/v2'

export default class Api {
  updateInvoicePaymentMethod(id: string, valueStore: string, paymentCurrencies: string[] = [],) {
    const recipientAddress = usePaymentStore().refundRecipientAddress
    let refundRecipient: RefundRecipient | undefined;
    if (recipientAddress) {
      refundRecipient = {
        address: recipientAddress,
      }
    }
    const body: InvoiceUpdatePaymentMethod = {
      payment_method: valueStore,
      transaction_id: id,
      payment_currencies: paymentCurrencies,
      refund_recipient: refundRecipient,
    }
    return this._invoiceApi.invoices.updatePaymentMethod(id, body)
  }

  private fetchWithMerchantCode = async (url: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
    init = init || {}
    init.headers = {
      ...init.headers,
      'x-merchant-code': usePaymentStore().invoiceParams.merchantCode,
    };
    return fetch(url, init)
  }

  private config: ApiConfig = {
    baseUrl: `${host}${basePath}`,
    customFetch: this.fetchWithMerchantCode
  }
  private _invoiceApi = new InvoiceApi(this.config)

  fetchInvoiceStatus(invoiceId: string, wait?: number) {
    return this._invoiceApi.invoices.getInvoice(invoiceId, { wait: wait })
  }

  requestInvoice(
    amountCents: number,
    currency: Currency = 'ZAR',
    orderDescription: string | undefined,
    orderId: string,
    statusWebhookUrl: string | undefined,
    timeoutInSeconds: number,
    paymentMethod: string,
    paymentCurrencies: string[] = [],
  ) {
   return this._invoiceApi.invoice.requestInvoice({
      amount_cents: amountCents,
      currency,
      order_description: orderDescription,
      order_id: orderId,
      allowed_payment_methods: [paymentMethod],
      status_webhook_url: statusWebhookUrl,
      timeout_in_seconds: timeoutInSeconds,
      payment_currencies: paymentCurrencies,
    })
  }
}
