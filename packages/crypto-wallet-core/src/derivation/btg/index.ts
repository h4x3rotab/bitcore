const BitcoreLibBtg = require('bitcore-lib-btg');
import { AbstractBitcoreLibDeriver } from '../btc';
export class BtgDeriver extends AbstractBitcoreLibDeriver {
  bitcoreLib = BitcoreLibBtg;
}
