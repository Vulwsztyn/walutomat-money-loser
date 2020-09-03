import { ApiAxios } from './apiAxios'
import { AccountBalancesResponse, OrdersRespones, OffersRespones } from './types/remote'

export class Getter {
  private apiAxios = new ApiAxios()
  constructor() {}

  async getBalance(): Promise<AccountBalancesResponse> {
    const endpoint = '/api/v2.0.0/account/balances'
    const { data } = await this.apiAxios.get(endpoint, {})
    return data
  }
  async getActiveOrders(): Promise<OrdersRespones> {
    const endpoint = '/api/v2.0.0/market_fx/orders/active'
    const { data } = await this.apiAxios.get(endpoint, {})
    return data
  }
  async getBestOffers(currencyPair: string): Promise<OffersRespones> {
    const endpoint = '/api/v2.0.0/market_fx/best_offers'
    const { data } = await this.apiAxios.get(endpoint, {
      params: {
        currencyPair,
      },
    })
    return data
  }
}
