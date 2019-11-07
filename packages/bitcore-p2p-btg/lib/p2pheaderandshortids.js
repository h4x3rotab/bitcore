'use strict';

var bitcore = require('bitcore-lib-btg');
var BloomFilter = require('bloom-filter');
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;

function deserVector(reader, decoder) {
  const n = reader.readVarintNum();
  const vec = []
  for (let i = 0; i < n; i++) {
    vec.push(decoder(reader));
  }
  return vec;
}

function serVector(writer, data, encoder) {
  writer.writeVarintNum(data.length);
  for (let i of data) {
    encoder(writer, i)
  }
}

class PrefilledTransaction {
  constructor (arg, option = {Transaction: bitcore.Transaction}) {
    let {Transaction} = option;
    this.Transaction = Transaction;
    this.index = 0;
    this.tx = null;
  }

  static fromBufferReader(reader) {
    const Transaction = bitcore.Transaction;
    const self = new PrefilledTransaction();
    self.index = reader.readVarintNum();
    self.tx = new Transaction();
    self.tx.fromBufferReader(reader);
    return self;
  }

  toBufferWriter(writer, withWitness = true) {
    writer.writeVarintNum(this.index);
    this.tx.toBufferWriter(writer, !withWitness);
  }
}

class P2PHeaderAndShortIDs {
  constructor (arg, option = {BlockHeader: bitcore.BlockHeader}) {
    let {BlockHeader} = option;
    this.header = BlockHeader()
    this.nonce = 0
    this.shortids_length = 0
    this.shortids = []
    this.prefilled_txn_length = 0
    this.prefilled_txn = []
  }

  static fromBufferReader(reader) {
    const BlockHeader = bitcore.BlockHeader;
    const self = new P2PHeaderAndShortIDs();
    // self.header.deserialize(f, legacy=False)
    self.header = BlockHeader.fromBufferReader(reader);
    // self.nonce = struct.unpack("<Q", f.read(8))[0]
    self.nonce = reader.readUInt64LEBN();
    // self.shortids_length = deser_compact_size(f)
    self.shortids_length = reader.readVarintNum();
    // for i in range(self.shortids_length):
    for (let i = 0; i < self.shortids_length; i++) {
    //     # shortids are defined to be 6 bytes in the spec, so append
    //     # two zero bytes and read it in as an 8-byte number
    //     self.shortids.append(struct.unpack("<Q", f.read(6) + b'\x00\x00')[0])
      self.shortids.push(reader.read(6));
    }
    // self.prefilled_txn = deser_vector(f, PrefilledTransaction)
    self.prefilled_txn = deserVector(reader, PrefilledTransaction.fromBufferReader);
    self.prefilled_txn_length = self.prefilled_txn.length;
    return self;
  }

  toBufferWriter(writer, withWitness = true) {
    this.header.toBufferWriter(writer);
    writer.writeUint64LEBN(this.nonce);
    writer.writeVarintNum(this.shortids_length);
    for (let x of this.shortids) {
      writer.write(x);
    }
    serVector(writer, this.prefilled_txn, (w, i) => { i.toBufferWriter(w, withWitness) })
  }

  static fromBuffer(buffer) {
    const reader = new BufferReader(buffer);
    return P2PHeaderAndShortIDs.fromBufferReader(reader);
  }

  toBuffer(withWitness = true) {
    const writer = new BufferWriter();
    this.toBufferWriter(writer, withWitness);
    return writer.toBuffer();
  }
}

module.exports = P2PHeaderAndShortIDs;
