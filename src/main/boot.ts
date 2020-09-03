import { Getter } from './getter'
import { Sender } from './sender'
import * as R from 'ramda'

import BigNumber from 'bignumber.js'
import { BalanceItem } from './types/remote'
const $ = (e) => new BigNumber(e)
const currencyPairs = [
  'EURGBP',
  'EURUSD',
  'EURCHF',
  'EURPLN',
  'GBPUSD',
  'GBPCHF',
  'GBPPLN',
  'USDCHF',
  'USDPLN',
  'CHFPLN',
]
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}
async function cancelAllActiveOrders(getter: Getter, sender: Sender) {
  const activeOrdersIds: string[] = R.pipe(
    R.path(['result']),
    R.map((e) => e.orderId),
  )(await getter.getActiveOrders())

  await sender.closeOrders(activeOrdersIds)
}

async function placeRidiculousOrder(balanceItem: BalanceItem, getter: Getter, sender: Sender) {
  const { currency, balanceAvailable } = balanceItem
  const availablePairs: string[] = currencyPairs.filter((e) => e.includes(currency))
  const currencyPair = randomElement(availablePairs)
  const bidsAsks = currencyPair.slice(0, 3) === currency ? 'bids' : 'asks'
  const offers = await getter.getBestOffers(currencyPair)
  const limitPrice = R.path(['result', bidsAsks, 0, 'price'], offers)
  await sender.placeOrder({
    currencyPair,
    buySell: 'SELL',
    volume: balanceAvailable,
    volumeCurrency: currency,
    limitPrice,
  })
}

async function main() {
  const getter = new Getter()
  const sender = new Sender()
  while (true) {
    const areAllLessThanOne = R.pipe(
      R.path(['result']),
      R.map((e) => $(e.balanceTotal).lt(1)),
      R.all(R.identity),
    )(await getter.getBalance())

    if (areAllLessThanOne) {
      // tslint:disable-next-line:no-console
      console.log('Oi, you broke, mate')
      break
    }
    await cancelAllActiveOrders(getter, sender)
    const balance: BalanceItem[] = R.pipe(
      R.path(['result']),
      R.filter((e) => $(e.balanceTotal).gte(1)),
    )(await getter.getBalance())
    await Promise.all(R.forEach((e) => placeRidiculousOrder(e, getter, sender), balance))
  }
}

main()
