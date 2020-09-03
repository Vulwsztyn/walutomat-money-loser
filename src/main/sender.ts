import { ApiAxios } from './apiAxios'
import { v4 } from 'uuid'
import * as R from 'ramda'

export class Sender {
  private apiAxios = new ApiAxios()
  constructor() {}
  async closeOrder(id) {
    const endpoint = `/api/v2.0.0/market_fx/orders/close`
    const { data } = await this.apiAxios.post(endpoint, { orderId: id })
    return data
  }
  async closeOrders(toBeClosed) {
    const results = await Promise.all(toBeClosed.map((id) => this.closeOrder(id)))
    return R.map((e) => e.data, results)
  }
  async placeOrder({ currencyPair, buySell, volume, volumeCurrency, limitPrice }) {
    const endpoint = `/api/v2.0.0/market_fx/orders`
    const body = {
      currencyPair,
      buySell,
      volume,
      volumeCurrency,
      limitPrice,
      submitId: v4(),
    }
    const { data } = await this.apiAxios.post(endpoint, body).catch(() => {}) || {}
    return data
  }
}
