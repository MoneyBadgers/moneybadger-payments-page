type properties = {
  wallet?: string | undefined
  currency?: string | undefined
  merchant?: string | undefined
  merchantCode?: string | undefined
  amount?: number | undefined
}

export const defaultAnalyticproperties = (properties: properties) => {
  return {
    'Wallet': properties.wallet,
    'Currency': properties.currency,
    'Merchant': properties.merchant,
    'Merchant Code': properties.merchant,
    'Amount': properties.amount
  }
}