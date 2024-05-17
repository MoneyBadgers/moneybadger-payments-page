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
    this.expiresAt = data.expiresAt
    this.fiatCurrency = data.fiatCurrency
    this.id = data.id
    this.lndPaymentRequest = data.lndPaymentRequest
    this.lndPaymentRequestQrCodeUrl = data.lndPaymentRequestQrCodeUrl
    this.orderDescription = data.orderDescription
    this.paidAt = data.paidAt
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
