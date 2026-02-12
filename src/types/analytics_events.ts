export enum AnalyticsEvent {
  ViewPaymentsPage = 'View Payments Page',
  WalletSelected = 'Wallet Selected',
  WalletSelectedBeforeTerms = 'Tried selecting Wallet before Terms',
  TermsAccepted = 'Accepted Terms',
  ValrCurrencySelected = 'VALR: Currency Selected',
  LightningSetRecipient = 'Lightning: Set Recipient',
  LightningSetRecipientSkipped = 'Lightning: Set Recipient Skipped',
  WaitingForPayment = 'Waiting for Payment',
  ShowQrCodeButtonClicked = 'Show QR Code Button Clicked',
  TimedOut = 'Timed Out',
  PaymentSuccess = 'Payment Success',
  PaymentFailure = 'Payment Failure',
  ChangeWallet = 'Change Wallet',
  OpenWalletButtonClicked = 'OpenWalletButtonClicked',
  CopyPaymentRequest = 'CopyPaymentRequest',
  ShowOpenWalletButtonClicked = 'ShowOpenWalletButtonClicked',
  WalletFeedback = 'WalletFeedback'
}
