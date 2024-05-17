import { Configuration } from './swagger/configuration'
import { InvoiceApi } from './swagger/api'
import type { Currency } from '@/types/Currency'

const apiKey = import.meta.env.VITE_API_KEY

export default class Api {
  private config = new Configuration({ apiKey: apiKey })
  private _invoiceApi = new InvoiceApi(this.config)

  requestInvoice(
    amountCents: number,
    currency: Currency = 'ZAR',
    orderDescription: string,
    orderId: string
  ) {
    this._invoiceApi.requestInvoice({
      amountCents,
      currency,
      orderDescription,
      orderId
    })
  }
}
