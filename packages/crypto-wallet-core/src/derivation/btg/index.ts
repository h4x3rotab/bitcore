const BitcoreLibBtg = require('bitcore-lib-btg');
import { IDeriver } from "..";
export abstract class AbstractBitcoreLibBtgDeriver implements IDeriver {
  public abstract bitcoreLibBtg;

  deriveAddress(network, pubKey, addressIndex, isChange) {
    const xpub = new this.bitcoreLibBtg.HDPublicKey(pubKey, network);
    const changeNum = isChange ? 1 : 0;
    const path = `m/${changeNum}/${addressIndex}`;
    return this.bitcoreLibBtg
      .Address(xpub.derive(path).publicKey, network)
      .toString();
  }

  derivePrivateKey(network, xPriv, addressIndex, isChange) {
    const xpriv = new BitcoreLibBtg.HDPrivateKey(xPriv, network);
    const changeNum = isChange ? 1 : 0;
    const path = `m/${changeNum}/${addressIndex}`;
    const privKey = xpriv.derive(path).privateKey;
    const pubKey = privKey.publicKey;
    const address = this.bitcoreLibBtg.Address(pubKey, network).toString();
    return { address, privKey: privKey.toString(), pubKey: pubKey.toString() };
  }
}
export class BtgDeriver extends AbstractBitcoreLibBtgDeriver {
  bitcoreLibBtg = BitcoreLibBtg;
}
