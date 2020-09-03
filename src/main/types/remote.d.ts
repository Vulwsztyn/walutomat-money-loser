export interface WalutomatError {
  key: string
  description: string
  errorData: Array<any>
}
export interface GenericResponse {
  success: boolean
  errors?: Array<WalutomatError>
}
export interface BalanceItem {
  currency: string
  balanceTotal: string
  balanceAvailable: string
  balanceReserved: string
}

export interface OrderItem {
  orderId: string
  submitId: string
  submitTs: string
  updateTs: string
  status: string
  completion: number
  currencyPair: string
  buySell: string
  volume: string
  volumeCurrency: string
  limitPrice: string
  soldAmount: string
  soldCurrency: string
  boughtAmount: string
  boughtCurrency: string
  commissionAmount: string
  commissionCurrency: string
  commissionRate: string
}

export interface BidAsk {
  price: number
  volume: number
  valueInOppositeCurrency: number
}

export interface OfferItem {
  ts: string
  currencyPair: string
  bids: BidAsk[]
  asks: BidAsk[]
}

export interface AccountBalancesResponse extends GenericResponse {
  result?: Array<BalanceItem>
}

export interface OrdersRespones extends GenericResponse {
  result?: Array<OrderItem>
}

export interface OffersRespones extends GenericResponse {
  result?: Array<OfferItem>
}