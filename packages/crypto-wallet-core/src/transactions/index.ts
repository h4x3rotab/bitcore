import { BTCTxProvider } from './btc';
import { BTGTxProvider } from './btg';
import { BCHTxProvider } from './bch';
import { ETHTxProvider } from './eth';

const providers = {
  BTC: new BTCTxProvider(),
  BTG: new BTGTxProvider(),
  BCH: new BCHTxProvider(),
  ETH: new ETHTxProvider()
};

export class TransactionsProxy {
  get({ chain }) {
    return providers[chain];
  }

  create(params) {
    return this.get(params).create(params);
  }

  sign(params): string {
    return this.get(params).sign(params);
  }
}

export default new TransactionsProxy();
