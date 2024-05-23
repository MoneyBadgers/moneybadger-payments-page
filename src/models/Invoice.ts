export default class Invoice {
  private conversion: number
  private cryptoCurrency: String
  private expiresAt: String
  private fiatCurrency: String
  private id: String
  private lndPaymentRequest: String
  private lndPaymentRequestQrCodeUrl: String
  private orderDescription: String
  private paidAt: String
  private status: String
  private statusWebhookUrl: String

  constructor(data: any) {
    this.conversion = data.conversion
    this.cryptoCurrency = data.cryptoCurrency
    this.expiresAt = data.expires_at
    this.fiatCurrency = data.currency
    this.id = data.id
    this.lndPaymentRequest = data.payment_request.data
    this.lndPaymentRequestQrCodeUrl = data.payment_request.qr_code_url.replace('/qr/v2', '/services/v2/qr/')
    this.orderDescription = data.orderDescription
    this.paidAt = data.paid_at
    this.status = data.status
    this.statusWebhookUrl = data.statusWebhookUrl
  }

  get invoiceId() {
    return this.id
  }

  get qrCodeUrl() {
    return this.lndPaymentRequestQrCodeUrl
  }
}
