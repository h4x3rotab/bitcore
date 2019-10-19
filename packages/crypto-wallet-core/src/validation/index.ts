import { BchValidation } from './bch';
import { BtgValidation } from './btg';
import { BtcValidation } from './btc';
import { EthValidation } from './eth';

export interface IValidation {
  validateAddress(network: string, address: string): boolean;
  validateUri(addressUri: string): boolean;
}

const validation: { [chain: string]: IValidation } = {
  BTC: new BtcValidation(),
  BTG: new BtgValidation(),
  BCH: new BchValidation(),
  ETH: new EthValidation()
};

export class ValidationProxy {
  get(chain) {
    const normalizedChain = chain.toUpperCase();
    return validation[normalizedChain];
  }

  validateAddress(chain, network, address) {
    return this.get(chain).validateAddress(network, address);
  }

  validateUri(chain, addressUri) {
    return this.get(chain).validateUri(addressUri);
  }
}

export default new ValidationProxy();
