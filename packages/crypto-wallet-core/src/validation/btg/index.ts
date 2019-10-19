import { IValidation } from '..';
const BitcoreBTG = require('bitcore-lib-btg');

export class BtgValidation implements IValidation {
  validateAddress(network: string, address: string): boolean {
    const AddressBTG = BitcoreBTG.Address;
    // Regular Address: try Bitcoin Cash
    return AddressBTG.isValid(address, network);
  }

  validateUri(addressUri: string): boolean {
    // Check if the input is a valid uri or address
    const URIBTG = BitcoreBTG.URI;
    // Bip21 uri
    return URIBTG.isValid(addressUri);
  }
}
